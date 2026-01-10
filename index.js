/**
 * Inland Empire - SillyTavern Extension
 * Main entry point - brings together all modular components
 * 
 * A Disco Elysium-inspired internal skill voice system for roleplay
 */

// ═══════════════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════════════

// Data
import { SKILLS, ATTRIBUTES, ANCIENT_VOICES } from './data/skills.js';
import { STATUS_EFFECTS } from './data/statuses.js';
import { INTRUSIVE_THOUGHTS, OBJECT_VOICES } from './data/voices.js';
import { THEMES, THOUGHTS } from './data/thoughts.js';

// Systems
import {
    extensionSettings,
    activeStatuses,
    currentBuild,
    savedProfiles,
    themeCounters,
    thoughtCabinet,
    discoveryContext,
    loadState,
    saveState,
    toggleStatus,
    getAttributePoints,
    applyAttributeAllocation,
    getEffectiveSkillLevel,
    updateSettings,
    saveProfile,
    loadProfile,
    deleteProfile,
    initializeDefaultBuild
} from './systems/state.js';

import { rollSkillCheck } from './systems/dice.js';

import {
    initializeThemeCounters,
    trackThemesInMessage,
    checkThoughtDiscovery,
    startResearch,
    abandonResearch,
    advanceResearch,
    dismissThought,
    forgetThought,
    addCustomThought,
    incrementMessageCount,
    getResearchPenalties,
    getTopThemes,
    MAX_INTERNALIZED_THOUGHTS
} from './systems/cabinet.js';

import {
    analyzeContext,
    selectSpeakingSkills,
    generateVoices,
    processIntrusiveThoughts,
    getIntrusiveThought
} from './systems/generation.js';

// UI
import {
    createPsychePanel,
    createToggleFAB,
    togglePanel,
    switchTab
} from './ui/panel.js';

import {
    showToast,
    hideToast,
    showIntrusiveToast,
    showObjectToast,
    showDiscoveryToast,
    showInternalizedToast
} from './ui/toasts.js';

import {
    renderVoices,
    appendVoicesToChat,
    renderAttributesDisplay,
    renderBuildEditor,
    updatePointsRemaining,
    renderStatusGrid,
    renderActiveEffectsSummary,
    renderProfilesList,
    renderThoughtCabinet,
    renderThoughtModal
} from './ui/render.js';

// ═══════════════════════════════════════════════════════════════
// EXTENSION METADATA
// ═══════════════════════════════════════════════════════════════

const extensionName = 'inland-empire';
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// SillyTavern context reference
let stContext = null;

// Auto-generation tracking
let messagesSinceAutoGen = 0;
let isAutoGenerating = false;

// ═══════════════════════════════════════════════════════════════
// SILLYTAVERN INTEGRATION
// ═══════════════════════════════════════════════════════════════

function getContext() {
    if (stContext) return stContext;
    if (typeof SillyTavern !== 'undefined' && SillyTavern.getContext) {
        stContext = SillyTavern.getContext();
    }
    return stContext;
}

function getLastMessage() {
    const context = getContext();
    if (!context?.chat?.length) return null;
    return context.chat[context.chat.length - 1];
}

function getChatContainer() {
    return document.getElementById('chat');
}

// ═══════════════════════════════════════════════════════════════
// MAIN TRIGGER FUNCTION
// ═══════════════════════════════════════════════════════════════

async function triggerVoices(messageText = null) {
    if (!extensionSettings.enabled) {
        showToast('Extension is disabled', 'error', 3000);
        return;
    }

    const context = getContext();
    
    // Debug: Check if we can get context
    if (!context) {
        showToast('Could not get ST context', 'error', 5000);
        return;
    }

    const lastMsg = getLastMessage();
    const text = messageText || lastMsg?.mes || '';

    // Debug: Show what we're working with
    if (!text.trim()) {
        const chatLen = context?.chat?.length || 0;
        showToast(`No message found (chat has ${chatLen} messages)`, 'info', 5000);
        return;
    }

    showToast(`Analyzing: "${text.substring(0, 30)}..."`, 'info', 2000);
    const loadingToast = showToast('The voices stir...', 'loading');

    try {
        // Analyze context
        const analysisContext = analyzeContext(text);

        // Track themes
        trackThemesInMessage(text);
        incrementMessageCount();

        // Process intrusive thoughts and object voices
        const intrusiveData = await processIntrusiveThoughts(text);

        // Show intrusive thought toast
        if (intrusiveData.intrusive && !extensionSettings.intrusiveInChat) {
            showIntrusiveToast(intrusiveData.intrusive);
        }

        // Show object voice toasts
        for (const objVoice of intrusiveData.objects) {
            showObjectToast(objVoice);
        }

        // Select speaking skills
        const selectedSkills = selectSpeakingSkills(analysisContext, {
            minVoices: extensionSettings.voicesPerMessage?.min || 1,
            maxVoices: extensionSettings.voicesPerMessage?.max || 4
        });

        if (selectedSkills.length === 0) {
            hideToast(loadingToast);
            showToast('No skills selected (context too vague?)', 'info', 5000);
            return;
        }

        showToast(`${selectedSkills.length} skills speaking...`, 'info', 2000);

        // Generate voices
        const voiceResults = await generateVoices(selectedSkills, analysisContext, intrusiveData);
        
        showToast(`Generated ${voiceResults.length} voices`, 'info', 2000);

        // Advance research
        const completedThoughts = advanceResearch(text);
        for (const thoughtId of completedThoughts) {
            const thought = THOUGHTS[thoughtId];
            if (thought) {
                showInternalizedToast(thought, SKILLS);
            }
        }

        // Check for new thought discoveries
        const newThoughts = checkThoughtDiscovery();
        for (const thought of newThoughts) {
            showDiscoveryToast(thought, handleStartResearch, handleDismissThought);
        }

        // Check for auto-generation of custom thoughts
        messagesSinceAutoGen++;
        if (shouldAutoGenerateThought(newThoughts.length)) {
            autoGenerateThought(text);
        }

        // Combine results
        const allVoices = [];

        // Add intrusive thought if showing in chat
        if (intrusiveData.intrusive && extensionSettings.intrusiveInChat) {
            allVoices.push(intrusiveData.intrusive);
        }

        // Add object voices
        allVoices.push(...intrusiveData.objects);

        // Add main voices (filter failed checks if setting disabled)
        const filteredVoices = extensionSettings.showFailedChecks ?
            voiceResults :
            voiceResults.filter(v => !v.checkResult || v.checkResult.success || v.isAncient);

        allVoices.push(...filteredVoices);

        // Render to panel
        const voicesContainer = document.getElementById('ie-voices-output');
        renderVoices(allVoices, voicesContainer);

        // Append to chat if enabled
        if (extensionSettings.showInChat !== false) {
            appendVoicesToChat(allVoices, getChatContainer());
        }

        hideToast(loadingToast);

        // Save state
        saveState(context);

    } catch (error) {
        console.error('[Inland Empire] Voice generation failed:', error);
        hideToast(loadingToast);
        showToast(`Error: ${error.message}`, 'error', 8000); // 8 seconds to read error
    }
}

// ═══════════════════════════════════════════════════════════════
// THOUGHT CABINET HANDLERS
// ═══════════════════════════════════════════════════════════════

function handleStartResearch(thoughtId) {
    const result = startResearch(thoughtId, getContext());
    if (result === true) {
        showToast('Research begun...', 'info');
        refreshCabinetTab();
    } else if (result?.error === 'cap_reached') {
        showToast('Cabinet full! Forget a thought first.', 'error');
    } else {
        showToast('No available research slots', 'error');
    }
}

function handleDismissThought(thoughtId) {
    dismissThought(thoughtId, getContext());
    refreshCabinetTab();
}

function handleAbandonResearch(thoughtId) {
    abandonResearch(thoughtId, getContext());
    refreshCabinetTab();
}

function handleForgetThought(thoughtId) {
    if (confirm('Forget this thought? Its bonuses will be removed.')) {
        forgetThought(thoughtId, getContext());
        refreshAttributesDisplay();
        refreshCabinetTab();
        showToast('Thought forgotten...', 'info');
    }
}

// ═══════════════════════════════════════════════════════════════
// AUTO-GENERATION LOGIC
// ═══════════════════════════════════════════════════════════════

function shouldAutoGenerateThought(builtInDiscoveredCount) {
    // Check if auto-generation is enabled
    if (!extensionSettings.autoGenerateThoughts) return false;
    
    // Don't auto-gen if we're already generating
    if (isAutoGenerating) return false;
    
    // Check cooldown
    const cooldown = extensionSettings.autoGenCooldown || 5;
    if (messagesSinceAutoGen < cooldown) return false;
    
    // If a built-in thought was just discovered, don't also auto-gen
    if (builtInDiscoveredCount > 0) return false;
    
    // Check theme threshold
    const topThemes = getTopThemes(1);
    const threshold = extensionSettings.autoGenThreshold || 10;
    if (topThemes.length === 0 || topThemes[0].count < threshold) return false;
    
    // Check if discovered thoughts are piling up (don't flood)
    if (thoughtCabinet.discovered.length >= 5) return false;
    
    return true;
}

async function autoGenerateThought(recentMessageText) {
    isAutoGenerating = true;
    messagesSinceAutoGen = 0;
    
    const context = getContext();
    const perspective = extensionSettings.autoGenPerspective || 'observer';
    const playerContext = extensionSettings.autoGenPlayerContext || '';
    
    // Get recent chat context
    const recentMessages = context?.chat?.slice(-5) || [];
    const contextText = recentMessages.map(m => m.mes).join('\n');
    
    // Get top themes for the prompt
    const topThemes = getTopThemes(3);
    const themeHint = topThemes.map(t => `${t.name}: ${t.count}`).join(', ');
    
    console.log('[Inland Empire] Auto-generating thought. Themes:', themeHint);

    try {
        const skillList = Object.entries(SKILLS)
            .map(([id, s]) => `${id}: ${s.name}`)
            .join(', ');

        // Build player identity string
        const playerIdentity = playerContext 
            ? `The player character is: ${playerContext}.`
            : 'The player character is an outside observer.';

        // Perspective-specific instructions
        const perspectiveInstructions = perspective === 'observer'
            ? `CRITICAL PERSPECTIVE - OBSERVER MODE:
${playerIdentity}

IMPORTANT: The thought belongs to the PLAYER CHARACTER, NOT any NPC in the scene.
- If there's a killer/villain/antagonist in the scene, the player is NOT that character
- The thought is about the player's REACTION to witnessing this NPC's behavior
- "Why does part of you understand them?" NOT "Why do you do this?"
- The player observes, questions, wrestles with what they've seen
- Never write from the perpetrator's POV - write from the witness's POV`
            : `CRITICAL PERSPECTIVE - PARTICIPANT MODE:
${playerIdentity}

- The thought emerges FROM the mindset shown in the scene
- The player IS the character having these thoughts naturally
- No external judgment - this is how they genuinely think`;

        const systemPrompt = `You are a Disco Elysium thought generator. Create a single thought for the Thought Cabinet system.

Available skills for bonuses: ${skillList}

${perspectiveInstructions}

The dominant themes in this conversation are: ${themeHint}
Generate a thought that reflects these themes.

Output ONLY valid JSON with this exact structure:
{
  "name": "Evocative 2-4 word name",
  "icon": "single emoji",
  "category": "philosophy|identity|obsession|survival|mental|social|emotion",
  "researchTime": 8,
  "researchBonus": {
    "skill_id": {"value": -1, "flavor": "Short reason for penalty"}
  },
  "internalizedBonus": {
    "skill_id": {"value": 2, "flavor": "Short thematic label"}
  },
  "problemText": "3-4 paragraphs of stream-of-consciousness questioning.",
  "solutionText": "2-3 paragraphs of resolution."
}

TONE: Match Disco Elysium's darkly humorous, philosophical tone. Use second person.`;

        const userPrompt = `Generate a thought based on this scene:\n${contextText}`;

        const response = await fetch(extensionSettings.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${extensionSettings.apiKey}`
            },
            body: JSON.stringify({
                model: extensionSettings.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 1500,
                temperature: 0.9
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        // Parse JSON from response
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) jsonStr = jsonMatch[1];
        
        const thought = JSON.parse(jsonStr.trim());
        
        if (!thought.name || !thought.icon || !thought.problemText) {
            throw new Error('Invalid thought format');
        }

        if (!thought.category) {
            thought.category = 'philosophy';
        }

        // Add the custom thought
        addCustomThought(thought, context);
        
        // Show discovery toast
        showDiscoveryToast(thought, handleStartResearch, handleDismissThought);
        
        console.log('[Inland Empire] Auto-generated thought:', thought.name);
        refreshCabinetTab();

    } catch (error) {
        console.error('[Inland Empire] Auto-generation failed:', error);
    } finally {
        isAutoGenerating = false;
    }
}

async function handleGenerateThought(prompt, fromContext, perspective = 'observer', playerContext = '') {
    const context = getContext();
    
    // Get context from chat if requested
    let contextText = '';
    if (fromContext) {
        const recentMessages = context?.chat?.slice(-5) || [];
        contextText = recentMessages.map(m => m.mes).join('\n');
    }
    
    if (!prompt && !contextText) {
        showToast('Enter a concept or check "From chat"', 'error');
        return;
    }

    const loadingToast = showToast('Generating thought...', 'loading');

    try {
        const skillList = Object.entries(SKILLS)
            .map(([id, s]) => `${id}: ${s.name}`)
            .join(', ');

        // Build player identity string
        const playerIdentity = playerContext 
            ? `The player character is: ${playerContext}.`
            : 'The player character is an outside observer.';

        // Perspective-specific instructions
        const perspectiveInstructions = perspective === 'observer'
            ? `CRITICAL PERSPECTIVE - OBSERVER MODE:
${playerIdentity}

IMPORTANT: The thought belongs to the PLAYER CHARACTER, NOT any NPC in the scene.
- If there's a killer/villain/antagonist in the scene, the player is NOT that character
- The thought is about the player's REACTION to witnessing this NPC's behavior
- "Why does part of you understand them?" NOT "Why do you do this?"
- "What does it mean that you can see their logic?" NOT "The hunt is boring"
- The player observes, questions, wrestles with what they've seen
- They might be disturbed, fascinated, horrified, or darkly intrigued - but they are OUTSIDE looking IN
- Never write from the perpetrator's POV - write from the witness's POV
- Example: Instead of "You feel the thrill of the hunt" write "You watched them hunt. And something in you understood the thrill. That's what disturbs you."`
            : `CRITICAL PERSPECTIVE - PARTICIPANT MODE:
${playerIdentity}

- The thought emerges FROM the mindset shown in the scene
- The player IS the character having these thoughts naturally
- If they're a killer, the thought is about their philosophy of killing
- No external judgment or wrestling - this is how they genuinely think
- Second person "you" is someone fully inhabiting this headspace`;

        const systemPrompt = `You are a Disco Elysium thought generator. Create a single thought for the Thought Cabinet system.

Available skills for bonuses: ${skillList}

${perspectiveInstructions}

Output ONLY valid JSON with this exact structure:
{
  "name": "Evocative 2-4 word name",
  "icon": "single emoji",
  "category": "philosophy|identity|obsession|survival|mental|social|emotion",
  "researchTime": 8,
  "researchBonus": {
    "skill_id": {"value": -1, "flavor": "Short reason for penalty"}
  },
  "internalizedBonus": {
    "skill_id": {"value": 2, "flavor": "Short thematic label"}
  },
  "problemText": "3-4 paragraphs of stream-of-consciousness questioning. Rambling, uncertain, philosophical. Written in second person. This is wrestling with the concept.",
  "solutionText": "2-3 paragraphs of resolution. The conclusion reached. More grounded but still poetic. What is realized after mulling it over."
}

TONE REQUIREMENTS:
- Problem text should be LONG and RAMBLING - stream of consciousness, full of questions, philosophical tangents
- Use paragraph breaks (\\n\\n) between thoughts
- Names should be evocative and slightly absurd like "Volumetric Shit Compressor" or "Finger on the Eject Button"
- Solution text is the ANSWER - more conclusive, sometimes bittersweet, often with dark humor
- Match Disco Elysium's darkly humorous, deeply philosophical, self-aware tone
- Second person throughout ("You", "Your")
- Research bonuses are penalties while researching (-1 to -2)
- Internalized bonuses are rewards (+1 to +3) with short flavor text explaining the bonus
- Research time 6-15 (higher = more profound/complex thoughts)`;

        const userPrompt = prompt 
            ? `Create a thought about: ${prompt}${contextText ? `\n\nRecent scene context:\n${contextText}` : ''}`
            : `Create a thought based on this scene:\n${contextText}`;

        const response = await fetch(extensionSettings.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${extensionSettings.apiKey}`
            },
            body: JSON.stringify({
                model: extensionSettings.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: 1500,
                temperature: 0.9
            })
        });

        hideToast(loadingToast);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        // Parse JSON from response (handle markdown code blocks)
        let jsonStr = content;
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) jsonStr = jsonMatch[1];
        
        const thought = JSON.parse(jsonStr.trim());
        
        // Validate required fields
        if (!thought.name || !thought.icon || !thought.problemText) {
            throw new Error('Invalid thought format - missing required fields');
        }

        // Ensure category exists
        if (!thought.category) {
            thought.category = 'philosophy';
        }

        // Add the custom thought
        const added = addCustomThought(thought, context);
        
        // Clear the input
        const promptInput = document.getElementById('ie-thought-prompt');
        if (promptInput) promptInput.value = '';

        showToast(`Discovered: ${thought.name}`, 'success');
        refreshCabinetTab();

    } catch (error) {
        hideToast(loadingToast);
        console.error('[Inland Empire] Thought generation failed:', error);
        showToast(`Failed: ${error.message}`, 'error', 5000);
    }
}

function handleExpandThought(thoughtId) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'ie-thought-modal-overlay';
    document.body.appendChild(overlay);

    // Render the modal
    try {
        const closeBtn = renderThoughtModal(thoughtId, overlay);
        
        // If no close button returned, something went wrong
        if (!closeBtn) {
            overlay.remove();
            showToast('Could not load thought details', 'error');
            return;
        }

        // Close handlers
        const closeModal = () => {
            overlay.classList.add('ie-modal-closing');
            setTimeout(() => overlay.remove(), 200);
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        // ESC key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    } catch (error) {
        console.error('[Inland Empire] Modal error:', error);
        overlay.remove();
        showToast('Error loading thought', 'error');
    }
}

function refreshCabinetTab() {
    const container = document.getElementById('ie-cabinet-content');
    if (container) {
        renderThoughtCabinet(container, {
            onResearch: handleStartResearch,
            onDismiss: handleDismissThought,
            onAbandon: handleAbandonResearch,
            onForget: handleForgetThought,
            onGenerate: handleGenerateThought,
            onExpand: handleExpandThought
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// STATUS HANDLERS
// ═══════════════════════════════════════════════════════════════

function handleStatusToggle(statusId) {
    toggleStatus(statusId, getContext());
    refreshStatusTab();
    refreshAttributesDisplay();
}

function refreshStatusTab() {
    const grid = document.getElementById('ie-status-grid');
    const summary = document.getElementById('ie-active-effects-summary');
    renderStatusGrid(grid, handleStatusToggle);
    renderActiveEffectsSummary(summary);
}

function refreshAttributesDisplay() {
    const container = document.getElementById('ie-attributes-display');
    renderAttributesDisplay(container);
}

// ═══════════════════════════════════════════════════════════════
// BUILD HANDLERS
// ═══════════════════════════════════════════════════════════════

let tempBuildPoints = null;

function initBuildEditor() {
    tempBuildPoints = { ...getAttributePoints() };
    const container = document.getElementById('ie-attributes-editor');
    renderBuildEditor(container, handlePointChange);
    updateBuildPointsDisplay();
}

function handlePointChange(attrId, delta) {
    if (!tempBuildPoints) return;

    const current = tempBuildPoints[attrId] || 1;
    const newValue = current + delta;

    if (newValue < 1 || newValue > 6) return;

    const total = Object.values(tempBuildPoints).reduce((a, b) => a + b, 0) + delta;
    if (total > 12) return;

    tempBuildPoints[attrId] = newValue;

    // Update display
    const valueEl = document.getElementById(`ie-attr-${attrId}`);
    if (valueEl) valueEl.textContent = newValue;

    updateBuildPointsDisplay();
    updateBuildButtons();
}

function updateBuildPointsDisplay() {
    if (!tempBuildPoints) return;
    const total = Object.values(tempBuildPoints).reduce((a, b) => a + b, 0);
    const remaining = 12 - total;
    const container = document.getElementById('ie-points-remaining');
    updatePointsRemaining(container, remaining);
}

function updateBuildButtons() {
    if (!tempBuildPoints) return;
    const total = Object.values(tempBuildPoints).reduce((a, b) => a + b, 0);

    document.querySelectorAll('.ie-attr-minus').forEach(btn => {
        const attr = btn.dataset.attr;
        btn.disabled = tempBuildPoints[attr] <= 1;
    });

    document.querySelectorAll('.ie-attr-plus').forEach(btn => {
        const attr = btn.dataset.attr;
        btn.disabled = tempBuildPoints[attr] >= 6 || total >= 12;
    });
}

function applyBuild() {
    if (!tempBuildPoints) return;

    const total = Object.values(tempBuildPoints).reduce((a, b) => a + b, 0);
    if (total !== 12) {
        showToast('Must allocate exactly 12 points', 'error');
        return;
    }

    try {
        applyAttributeAllocation(tempBuildPoints);
        saveState(getContext());
        refreshAttributesDisplay();
        showToast('Build applied!', 'success');
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// PROFILE HANDLERS
// ═══════════════════════════════════════════════════════════════

function handleSaveProfile() {
    const nameInput = document.getElementById('ie-new-profile-name');
    const name = nameInput?.value?.trim();

    if (!name) {
        showToast('Enter a profile name', 'error');
        return;
    }

    saveProfile(name, getContext());
    nameInput.value = '';
    refreshProfilesList();
    showToast('Profile saved!', 'success');
}

function handleLoadProfile(profileId) {
    const success = loadProfile(profileId, getContext());
    if (success) {
        refreshAttributesDisplay();
        refreshStatusTab();
        refreshCabinetTab();
        refreshSettingsUI();
        showToast('Profile loaded!', 'success');
    }
}

function handleDeleteProfile(profileId) {
    if (confirm('Delete this profile?')) {
        deleteProfile(profileId, getContext());
        refreshProfilesList();
        showToast('Profile deleted', 'info');
    }
}

function refreshProfilesList() {
    const container = document.getElementById('ie-profiles-list');
    renderProfilesList(container, handleLoadProfile, handleDeleteProfile);
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS HANDLERS
// ═══════════════════════════════════════════════════════════════

function loadSettingsToUI() {
    const els = {
        'ie-api-endpoint': extensionSettings.apiEndpoint,
        'ie-api-key': extensionSettings.apiKey,
        'ie-model': extensionSettings.model,
        'ie-temperature': extensionSettings.temperature,
        'ie-max-tokens': extensionSettings.maxTokens,
        'ie-min-voices': extensionSettings.voicesPerMessage?.min || 1,
        'ie-max-voices': extensionSettings.voicesPerMessage?.max || 4,
        'ie-trigger-delay': extensionSettings.triggerDelay,
        'ie-pov-style': extensionSettings.povStyle,
        'ie-character-name': extensionSettings.characterName,
        'ie-character-pronouns': extensionSettings.characterPronouns,
        'ie-character-context': extensionSettings.characterContext,
        'ie-intrusive-chance': (extensionSettings.intrusiveChance || 0.15) * 100,
        'ie-object-chance': (extensionSettings.objectVoiceChance || 0.4) * 100,
        'ie-auto-gen-threshold': extensionSettings.autoGenThreshold || 10,
        'ie-auto-gen-cooldown': extensionSettings.autoGenCooldown || 5,
        'ie-auto-gen-perspective': extensionSettings.autoGenPerspective || 'observer',
        'ie-auto-gen-player-context': extensionSettings.autoGenPlayerContext || ''
    };

    for (const [id, value] of Object.entries(els)) {
        const el = document.getElementById(id);
        if (el) el.value = value || '';
    }

    // Checkboxes
    const checks = {
        'ie-show-dice-rolls': extensionSettings.showDiceRolls,
        'ie-show-failed-checks': extensionSettings.showFailedChecks,
        'ie-auto-trigger': extensionSettings.autoTrigger,
        'ie-auto-detect-status': extensionSettings.autoDetectStatus,
        'ie-intrusive-enabled': extensionSettings.intrusiveEnabled,
        'ie-intrusive-in-chat': extensionSettings.intrusiveInChat,
        'ie-object-voices-enabled': extensionSettings.objectVoicesEnabled,
        'ie-thought-discovery-enabled': extensionSettings.thoughtDiscoveryEnabled,
        'ie-auto-discover-thoughts': extensionSettings.autoDiscoverThoughts,
        'ie-auto-generate-thoughts': extensionSettings.autoGenerateThoughts,
        'ie-show-in-chat': extensionSettings.showInChat !== false
    };

    for (const [id, value] of Object.entries(checks)) {
        const el = document.getElementById(id);
        if (el) el.checked = value !== false;
    }

    // Show/hide auto-gen options
    const autoGenOptions = document.querySelectorAll('.ie-auto-gen-options');
    autoGenOptions.forEach(el => el.classList.toggle('ie-visible', extensionSettings.autoGenerateThoughts));

    updatePOVOptions();
}

function refreshSettingsUI() {
    loadSettingsToUI();
}

function saveSettingsFromUI() {
    updateSettings({
        // Note: 'enabled' is managed by the extension menu toggle, not saved here
        apiEndpoint: document.getElementById('ie-api-endpoint')?.value || '',
        apiKey: document.getElementById('ie-api-key')?.value || '',
        model: document.getElementById('ie-model')?.value || 'glm-4-plus',
        temperature: parseFloat(document.getElementById('ie-temperature')?.value) || 0.9,
        maxTokens: parseInt(document.getElementById('ie-max-tokens')?.value) || 300,
        voicesPerMessage: {
            min: parseInt(document.getElementById('ie-min-voices')?.value) || 1,
            max: parseInt(document.getElementById('ie-max-voices')?.value) || 4
        },
        triggerDelay: parseInt(document.getElementById('ie-trigger-delay')?.value) || 1000,
        povStyle: document.getElementById('ie-pov-style')?.value || 'second',
        characterName: document.getElementById('ie-character-name')?.value || '',
        characterPronouns: document.getElementById('ie-character-pronouns')?.value || 'they',
        characterContext: document.getElementById('ie-character-context')?.value || '',
        showDiceRolls: document.getElementById('ie-show-dice-rolls')?.checked !== false,
        showFailedChecks: document.getElementById('ie-show-failed-checks')?.checked !== false,
        autoTrigger: document.getElementById('ie-auto-trigger')?.checked || false,
        autoDetectStatus: document.getElementById('ie-auto-detect-status')?.checked || false,
        intrusiveEnabled: document.getElementById('ie-intrusive-enabled')?.checked !== false,
        intrusiveInChat: document.getElementById('ie-intrusive-in-chat')?.checked !== false,
        intrusiveChance: (parseInt(document.getElementById('ie-intrusive-chance')?.value) || 15) / 100,
        objectVoicesEnabled: document.getElementById('ie-object-voices-enabled')?.checked !== false,
        objectVoiceChance: (parseInt(document.getElementById('ie-object-chance')?.value) || 40) / 100,
        thoughtDiscoveryEnabled: document.getElementById('ie-thought-discovery-enabled')?.checked !== false,
        autoDiscoverThoughts: document.getElementById('ie-auto-discover-thoughts')?.checked !== false,
        autoGenerateThoughts: document.getElementById('ie-auto-generate-thoughts')?.checked || false,
        autoGenThreshold: parseInt(document.getElementById('ie-auto-gen-threshold')?.value) || 10,
        autoGenCooldown: parseInt(document.getElementById('ie-auto-gen-cooldown')?.value) || 5,
        autoGenPerspective: document.getElementById('ie-auto-gen-perspective')?.value || 'observer',
        autoGenPlayerContext: document.getElementById('ie-auto-gen-player-context')?.value || '',
        showInChat: document.getElementById('ie-show-in-chat')?.checked !== false
    });

    saveState(getContext());
    showToast('Settings saved!', 'success');
}

async function testAPIConnection() {
    // Read current values from UI (not saved settings)
    const endpoint = document.getElementById('ie-api-endpoint')?.value?.trim();
    const apiKey = document.getElementById('ie-api-key')?.value?.trim();
    const model = document.getElementById('ie-model')?.value?.trim() || 'glm-4-plus';

    if (!endpoint) {
        showToast('Enter an API endpoint first', 'error', 5000);
        return;
    }
    if (!apiKey) {
        showToast('Enter an API key first', 'error', 5000);
        return;
    }

    const loadingToast = showToast('Testing connection...', 'loading');

    try {
        const cleanEndpoint = endpoint.replace(/\/+$/, '');
        
        const response = await fetch(cleanEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'user', content: 'Say "Connection successful!" and nothing else.' }
                ],
                max_tokens: 20,
                temperature: 0.1
            })
        });

        hideToast(loadingToast);

        if (!response.ok) {
            let errorText = '';
            try {
                errorText = await response.text();
                errorText = errorText.substring(0, 100);
            } catch (e) {}
            showToast(`API Error ${response.status}: ${errorText || response.statusText}`, 'error', 8000);
            return;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || 
                       data.choices?.[0]?.text || 
                       data.content || 
                       'No response content';
        
        showToast(`✓ API Works! Response: "${content.substring(0, 50)}"`, 'success', 5000);

    } catch (err) {
        hideToast(loadingToast);
        showToast(`Network error: ${err.message}`, 'error', 8000);
    }
}

function updatePOVOptions() {
    const pov = document.getElementById('ie-pov-style')?.value;
    const thirdPersonOptions = document.querySelectorAll('.ie-third-person-options');
    thirdPersonOptions.forEach(el => {
        el.style.display = pov === 'third' ? 'block' : 'none';
    });
}

function resetFABPosition() {
    const fab = document.getElementById('inland-empire-fab');
    if (fab) {
        fab.style.top = '140px';
        fab.style.left = '10px';
        extensionSettings.fabPositionTop = 140;
        extensionSettings.fabPositionLeft = 10;
        saveState(getContext());
        showToast('Icon position reset', 'info');
    }
}

// ═══════════════════════════════════════════════════════════════
// EVENT BINDING
// ═══════════════════════════════════════════════════════════════

function bindEvents() {
    // FAB click
    const fab = document.getElementById('inland-empire-fab');
    fab?.addEventListener('click', (e) => {
        if (fab.dataset.justDragged === 'true') {
            fab.dataset.justDragged = 'false';
            return;
        }
        togglePanel();
    });

    // Close button
    document.querySelector('.ie-btn-close-panel')?.addEventListener('click', togglePanel);

    // Tab switching
    document.querySelectorAll('.ie-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab, {
                onProfiles: () => {
                    refreshProfilesList();
                    initBuildEditor();
                },
                onSettings: loadSettingsToUI,
                onStatus: refreshStatusTab,
                onCabinet: refreshCabinetTab
            });
        });
    });

    // Manual trigger
    document.getElementById('ie-manual-trigger')?.addEventListener('click', () => triggerVoices());

    // Clear voices
    document.querySelector('.ie-btn-clear-voices')?.addEventListener('click', () => {
        const container = document.getElementById('ie-voices-output');
        if (container) {
            container.innerHTML = `
                <div class="ie-voices-empty">
                    <i class="fa-solid fa-comment-slash"></i>
                    <span>Waiting for something to happen...</span>
                </div>
            `;
        }
    });

    // Save settings
    document.querySelector('.ie-btn-save-settings')?.addEventListener('click', saveSettingsFromUI);

    // Test API button
    document.getElementById('ie-test-api-btn')?.addEventListener('click', testAPIConnection);

    // Reset FAB
    document.querySelector('.ie-btn-reset-fab')?.addEventListener('click', resetFABPosition);

    // POV change
    document.getElementById('ie-pov-style')?.addEventListener('change', updatePOVOptions);

    // Auto-gen toggle
    document.getElementById('ie-auto-generate-thoughts')?.addEventListener('change', (e) => {
        const autoGenOptions = document.querySelectorAll('.ie-auto-gen-options');
        autoGenOptions.forEach(el => el.classList.toggle('ie-visible', e.target.checked));
    });

    // Apply build
    document.querySelector('.ie-btn-apply-build')?.addEventListener('click', applyBuild);

    // Save profile
    document.getElementById('ie-save-profile-btn')?.addEventListener('click', handleSaveProfile);
}

// ═══════════════════════════════════════════════════════════════
// AUTO-TRIGGER HOOK
// ═══════════════════════════════════════════════════════════════

function setupAutoTrigger() {
    const context = getContext();
    if (!context?.eventSource) return;

    context.eventSource.on('message_received', (messageId) => {
        if (!extensionSettings.enabled || !extensionSettings.autoTrigger) return;

        setTimeout(() => {
            const msg = getLastMessage();
            if (msg && !msg.is_user) {
                triggerVoices(msg.mes);
            }
        }, extensionSettings.triggerDelay || 1000);
    });
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

async function init() {
    console.log('[Inland Empire] Initializing...');

    // Load state
    loadState(getContext());
    initializeThemeCounters();

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${extensionFolderPath}/styles.css`;
    document.head.appendChild(link);

    // Create extension settings in ST's extension panel
    const extensionSettingsContainer = document.getElementById('extensions_settings');
    if (extensionSettingsContainer) {
        const settingsHtml = `
            <div class="inline-drawer" id="ie-extension-settings">
                <div class="inline-drawer-toggle inline-drawer-header">
                    <b>🧠 Inland Empire</b>
                    <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                </div>
                <div class="inline-drawer-content">
                    <div class="ie-ext-setting">
                        <label class="checkbox_label">
                            <input type="checkbox" id="ie-ext-enabled" ${extensionSettings.enabled ? 'checked' : ''} />
                            <span>Enable Inland Empire</span>
                        </label>
                        <small>When disabled, voices won't trigger and the FAB will be dimmed.</small>
                    </div>
                    <hr>
                    <div class="ie-ext-info">
                        <small>Click the 🧠 button to open the Psyche panel.</small>
                    </div>
                </div>
            </div>
        `;
        extensionSettingsContainer.insertAdjacentHTML('beforeend', settingsHtml);
        
        // Bind the enable toggle
        document.getElementById('ie-ext-enabled')?.addEventListener('change', (e) => {
            extensionSettings.enabled = e.target.checked;
            saveState(getContext());
            updateFABState();
            // Sync with the settings panel checkbox too
            const settingsCheckbox = document.getElementById('ie-enabled');
            if (settingsCheckbox) settingsCheckbox.checked = e.target.checked;
            showToast(e.target.checked ? 'Inland Empire enabled' : 'Inland Empire disabled', 'info');
        });
    }

    // Create UI
    const panel = createPsychePanel();
    const fab = createToggleFAB(getContext);

    document.body.appendChild(panel);
    document.body.appendChild(fab);
    
    // Set initial FAB state
    updateFABState();

    // Initial renders
    refreshAttributesDisplay();
    refreshStatusTab();
    refreshCabinetTab();

    // Bind events
    bindEvents();

    // Setup auto-trigger
    setupAutoTrigger();

    console.log('[Inland Empire] Ready!');
}

function updateFABState() {
    const fab = document.getElementById('inland-empire-fab');
    if (fab) {
        if (extensionSettings.enabled) {
            fab.classList.remove('ie-fab-disabled');
            fab.title = 'Open Psyche Panel';
        } else {
            fab.classList.add('ie-fab-disabled');
            fab.title = 'Inland Empire (Disabled)';
        }
    }
}

// ═══════════════════════════════════════════════════════════════
// JQUERY READY HOOK
// ═══════════════════════════════════════════════════════════════

jQuery(async () => {
    try {
        await init();
    } catch (error) {
        console.error('[Inland Empire] Failed to initialize:', error);
    }
});

// Export for potential external use
export {
    triggerVoices,
    togglePanel,
    extensionSettings
};
