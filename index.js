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
    incrementMessageCount,
    getResearchPenalties
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
    renderThoughtCabinet
} from './ui/render.js';

// ═══════════════════════════════════════════════════════════════
// EXTENSION METADATA
// ═══════════════════════════════════════════════════════════════

const extensionName = 'inland-empire';
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// SillyTavern context reference
let stContext = null;

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

        // Optionally append to chat
        // appendVoicesToChat(allVoices, getChatContainer());

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
    const success = startResearch(thoughtId, getContext());
    if (success) {
        showToast('Research begun...', 'info');
        refreshCabinetTab();
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

function refreshCabinetTab() {
    const container = document.getElementById('ie-cabinet-content');
    if (container) {
        renderThoughtCabinet(container, {
            onResearch: handleStartResearch,
            onDismiss: handleDismissThought,
            onAbandon: handleAbandonResearch
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
        'ie-object-chance': (extensionSettings.objectVoiceChance || 0.4) * 100
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
        'ie-auto-discover-thoughts': extensionSettings.autoDiscoverThoughts
    };

    for (const [id, value] of Object.entries(checks)) {
        const el = document.getElementById(id);
        if (el) el.checked = value !== false;
    }

    updatePOVOptions();
}

function refreshSettingsUI() {
    loadSettingsToUI();
}

function saveSettingsFromUI() {
    updateSettings({
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
        autoDiscoverThoughts: document.getElementById('ie-auto-discover-thoughts')?.checked !== false
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

    // Create UI
    const panel = createPsychePanel();
    const fab = createToggleFAB(getContext);

    document.body.appendChild(panel);
    document.body.appendChild(fab);

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
