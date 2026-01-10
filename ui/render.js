/**
 * Inland Empire - Render Functions
 * All UI rendering for voices, attributes, status grid, and thought cabinet
 */

import { ATTRIBUTES, SKILLS } from '../data/skills.js';
import { STATUS_EFFECTS } from '../data/statuses.js';
import { THEMES, THOUGHTS } from '../data/thoughts.js';
import {
    activeStatuses,
    getAttributePoints,
    getSkillLevel,
    getEffectiveSkillLevel,
    extensionSettings,
    savedProfiles,
    thoughtCabinet,
    themeCounters
} from '../systems/state.js';
import { getResearchPenalties, getTopThemes } from '../systems/cabinet.js';

// ═══════════════════════════════════════════════════════════════
// VOICE RENDERING
// ═══════════════════════════════════════════════════════════════

export function renderVoices(voiceResults, container) {
    if (!container) return;

    if (!voiceResults || voiceResults.length === 0) {
        container.innerHTML = `
            <div class="ie-voices-empty">
                <i class="fa-solid fa-comment-slash"></i>
                <span>The voices are silent...</span>
            </div>
        `;
        return;
    }

    container.innerHTML = voiceResults.map(voice => {
        let checkBadge = '';
        if (voice.checkResult) {
            if (voice.checkResult.isBoxcars) {
                // Critical success - show dramatically
                checkBadge = `<span class="ie-check-badge ie-critical-success" title="Double Sixes!">⚡ CRITICAL</span>`;
            } else if (voice.checkResult.isSnakeEyes) {
                // Critical failure - show dramatically
                checkBadge = `<span class="ie-check-badge ie-critical-failure" title="Snake Eyes!">💀 FUMBLE</span>`;
            } else if (extensionSettings.showDiceRolls) {
                // Normal check - show difficulty name + pass/fail like the game
                const result = voice.checkResult.success ? 'Success' : 'Failure';
                const cls = voice.checkResult.success ? 'ie-success' : 'ie-failure';
                const diffName = voice.checkResult.difficultyName || 'Check';
                checkBadge = `<span class="ie-check-badge ${cls}" title="${voice.checkResult.total} vs ${voice.checkResult.threshold}">${diffName} [${result}]</span>`;
            }
        } else if (voice.isAncient) {
            checkBadge = `<span class="ie-check-badge ie-primal" title="Primal Voice">🦎</span>`;
        } else if (voice.isIntrusive) {
            checkBadge = `<span class="ie-check-badge ie-intrusive" title="Intrusive Thought">💭</span>`;
        } else if (voice.isObject) {
            checkBadge = `<span class="ie-check-badge ie-object" title="Object Voice">${voice.icon || '📦'}</span>`;
        }

        return `
            <div class="ie-voice-line" style="border-left-color: ${voice.color}">
                <div class="ie-voice-header">
                    <span class="ie-voice-signature" style="color: ${voice.color}">${voice.signature || voice.name}</span>
                    ${checkBadge}
                </div>
                <div class="ie-voice-content">${voice.content}</div>
            </div>
        `;
    }).join('');
}

export function appendVoicesToChat(voiceResults, chatContainer) {
    if (!voiceResults || voiceResults.length === 0 || !chatContainer) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'ie-chat-voices';

    wrapper.innerHTML = voiceResults.map(voice => {
        let checkInfo = '';
        if (voice.checkResult) {
            if (voice.checkResult.isBoxcars) checkInfo = ' [CRITICAL SUCCESS]';
            else if (voice.checkResult.isSnakeEyes) checkInfo = ' [CRITICAL FAILURE]';
            else if (voice.checkResult.success) checkInfo = ' [Success]';
            else checkInfo = ' [Failed]';
        }

        return `<div class="ie-chat-voice" style="color: ${voice.color}">
            <strong>${voice.signature || voice.name}${checkInfo}:</strong> ${voice.content}
        </div>`;
    }).join('');

    chatContainer.appendChild(wrapper);
}

// ═══════════════════════════════════════════════════════════════
// ATTRIBUTES DISPLAY
// ═══════════════════════════════════════════════════════════════

export function renderAttributesDisplay(container) {
    if (!container) return;

    const attrPoints = getAttributePoints();
    const researchPenalties = getResearchPenalties();

    container.innerHTML = Object.entries(ATTRIBUTES).map(([attrId, attr]) => {
        const points = attrPoints[attrId] || 1;

        const skillsHtml = attr.skills.map(skillId => {
            const skill = SKILLS[skillId];
            const base = getSkillLevel(skillId);
            const effective = getEffectiveSkillLevel(skillId, researchPenalties);
            const diff = effective - base;
            const diffStr = diff > 0 ? `<span class="ie-mod-plus">+${diff}</span>` :
                           diff < 0 ? `<span class="ie-mod-minus">${diff}</span>` : '';

            return `
                <div class="ie-skill-row" title="${skill.name}">
                    <span class="ie-skill-name">${skill.signature}</span>
                    <span class="ie-skill-level">${base}${diffStr}</span>
                </div>
            `;
        }).join('');

        return `
            <div class="ie-attribute-card" style="border-color: ${attr.color}">
                <div class="ie-attribute-header" style="background: ${attr.color}20">
                    <span class="ie-attribute-name">${attr.name}</span>
                    <span class="ie-attribute-points">${points}</span>
                </div>
                <div class="ie-attribute-skills">${skillsHtml}</div>
            </div>
        `;
    }).join('');
}

// ═══════════════════════════════════════════════════════════════
// BUILD EDITOR
// ═══════════════════════════════════════════════════════════════

export function renderBuildEditor(container, onPointChange) {
    if (!container) return;

    const attrPoints = getAttributePoints();

    container.innerHTML = Object.entries(ATTRIBUTES).map(([attrId, attr]) => {
        const points = attrPoints[attrId] || 1;

        return `
            <div class="ie-attr-editor-row">
                <span class="ie-attr-editor-name" style="color: ${attr.color}">${attr.name}</span>
                <div class="ie-attr-editor-controls">
                    <button class="ie-btn ie-btn-sm ie-attr-minus" data-attr="${attrId}" ${points <= 1 ? 'disabled' : ''}>−</button>
                    <span class="ie-attr-editor-value" id="ie-attr-${attrId}">${points}</span>
                    <button class="ie-btn ie-btn-sm ie-attr-plus" data-attr="${attrId}" ${points >= 6 ? 'disabled' : ''}>+</button>
                </div>
            </div>
        `;
    }).join('');

    // Attach listeners
    container.querySelectorAll('.ie-attr-minus, .ie-attr-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const attr = btn.dataset.attr;
            const delta = btn.classList.contains('ie-attr-plus') ? 1 : -1;
            if (onPointChange) onPointChange(attr, delta);
        });
    });
}

export function updatePointsRemaining(container, points) {
    if (container) {
        container.textContent = points;
        container.style.color = points === 0 ? '#4CAF50' : points < 0 ? '#f44336' : '#FFC107';
    }
}

// ═══════════════════════════════════════════════════════════════
// STATUS GRID
// ═══════════════════════════════════════════════════════════════

export function renderStatusGrid(container, onToggle) {
    if (!container) return;

    container.innerHTML = Object.entries(STATUS_EFFECTS).map(([statusId, status]) => {
        const isActive = activeStatuses.has(statusId);

        return `
            <div class="ie-status-card ${isActive ? 'ie-status-active' : ''}" 
                 data-status="${statusId}" 
                 title="${status.boosts.join(', ')} ↑ / ${status.debuffs.join(', ')} ↓">
                <span class="ie-status-icon">${status.icon}</span>
                <span class="ie-status-name">${status.name}</span>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.ie-status-card').forEach(card => {
        card.addEventListener('click', () => {
            const statusId = card.dataset.status;
            if (onToggle) onToggle(statusId);
        });
    });
}

export function renderActiveEffectsSummary(container) {
    if (!container) return;

    if (activeStatuses.size === 0) {
        container.innerHTML = '<em>No active status effects</em>';
        return;
    }

    const effects = [...activeStatuses].map(id => STATUS_EFFECTS[id]).filter(Boolean);

    const boosts = {};
    const debuffs = {};

    effects.forEach(status => {
        status.boosts.forEach(s => { boosts[s] = (boosts[s] || 0) + 1; });
        status.debuffs.forEach(s => { debuffs[s] = (debuffs[s] || 0) + 1; });
    });

    const boostHtml = Object.entries(boosts)
        .map(([s, c]) => `<span class="ie-effect-boost">+${c} ${SKILLS[s]?.signature || s}</span>`)
        .join(' ');

    const debuffHtml = Object.entries(debuffs)
        .map(([s, c]) => `<span class="ie-effect-debuff">-${c} ${SKILLS[s]?.signature || s}</span>`)
        .join(' ');

    container.innerHTML = `
        <div class="ie-effects-row">${boostHtml || '<em>No boosts</em>'}</div>
        <div class="ie-effects-row">${debuffHtml || '<em>No debuffs</em>'}</div>
    `;
}

// ═══════════════════════════════════════════════════════════════
// PROFILES LIST
// ═══════════════════════════════════════════════════════════════

export function renderProfilesList(container, onLoad, onDelete) {
    if (!container) return;

    const profiles = Object.values(savedProfiles);

    if (profiles.length === 0) {
        container.innerHTML = '<div class="ie-profiles-empty"><em>No saved profiles</em></div>';
        return;
    }

    container.innerHTML = profiles.map(profile => `
        <div class="ie-profile-card" data-profile="${profile.id}">
            <div class="ie-profile-info">
                <span class="ie-profile-name">${profile.name}</span>
                <span class="ie-profile-date">${new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="ie-profile-actions">
                <button class="ie-btn ie-btn-sm ie-btn-load-profile" data-profile="${profile.id}" title="Load">
                    <i class="fa-solid fa-upload"></i>
                </button>
                <button class="ie-btn ie-btn-sm ie-btn-delete-profile" data-profile="${profile.id}" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.ie-btn-load-profile').forEach(btn => {
        btn.addEventListener('click', () => {
            if (onLoad) onLoad(btn.dataset.profile);
        });
    });

    container.querySelectorAll('.ie-btn-delete-profile').forEach(btn => {
        btn.addEventListener('click', () => {
            if (onDelete) onDelete(btn.dataset.profile);
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// THOUGHT CABINET
// ═══════════════════════════════════════════════════════════════

export function renderThoughtCabinet(container, callbacks = {}) {
    if (!container) return;

    const topThemes = getTopThemes(5);
    const researchPenalties = getResearchPenalties();

    // Theme tracker
    const themesHtml = topThemes.length > 0 ?
        topThemes.map(t => `<span class="ie-theme-tag">${t.icon} ${t.name}: ${t.count}</span>`).join('') :
        '<em>No themes tracked yet</em>';

    // Discovered thoughts
    const discoveredHtml = thoughtCabinet.discovered.length > 0 ?
        thoughtCabinet.discovered.map(id => {
            const thought = THOUGHTS[id];
            if (!thought) return '';
            return `
                <div class="ie-thought-card ie-thought-discovered">
                    <div class="ie-thought-header">
                        <span class="ie-thought-icon">${thought.icon}</span>
                        <span class="ie-thought-name">${thought.name}</span>
                    </div>
                    <div class="ie-thought-desc">${thought.description}</div>
                    <div class="ie-thought-actions">
                        <button class="ie-btn ie-btn-sm ie-btn-research" data-thought="${id}">Research</button>
                        <button class="ie-btn ie-btn-sm ie-btn-dismiss-thought" data-thought="${id}">Dismiss</button>
                    </div>
                </div>
            `;
        }).join('') :
        '<div class="ie-thoughts-empty"><em>No thoughts discovered</em></div>';

    // Researching thoughts
    const researchingHtml = Object.entries(thoughtCabinet.researching).map(([id, research]) => {
        const thought = THOUGHTS[id];
        if (!thought) return '';
        const progress = Math.min(100, (research.progress / thought.researchTime) * 100);

        const penaltyText = thought.researchPenalty ?
            Object.entries(thought.researchPenalty)
                .map(([s, v]) => `${v} ${SKILLS[s]?.signature || s}`)
                .join(', ') : '';

        return `
            <div class="ie-thought-card ie-thought-researching">
                <div class="ie-thought-header">
                    <span class="ie-thought-icon">${thought.icon}</span>
                    <span class="ie-thought-name">${thought.name}</span>
                </div>
                <div class="ie-thought-progress">
                    <div class="ie-progress-bar" style="width: ${progress}%"></div>
                </div>
                <div class="ie-thought-meta">
                    ${penaltyText ? `<span class="ie-research-penalty">While researching: ${penaltyText}</span>` : ''}
                </div>
                <button class="ie-btn ie-btn-sm ie-btn-abandon" data-thought="${id}">Abandon</button>
            </div>
        `;
    }).join('') || '<div class="ie-thoughts-empty"><em>Not researching anything</em></div>';

    // Internalized thoughts
    const internalizedHtml = thoughtCabinet.internalized.length > 0 ?
        thoughtCabinet.internalized.map(id => {
            const thought = THOUGHTS[id];
            if (!thought) return '';

            const bonusText = thought.internalizedBonus ?
                Object.entries(thought.internalizedBonus)
                    .map(([s, v]) => `+${v} ${SKILLS[s]?.signature || s}`)
                    .join(' ') : '';

            return `
                <div class="ie-thought-card ie-thought-internalized">
                    <div class="ie-thought-header">
                        <span class="ie-thought-icon">${thought.icon}</span>
                        <span class="ie-thought-name">${thought.name}</span>
                    </div>
                    <div class="ie-thought-flavor">${thought.flavorText}</div>
                    ${bonusText ? `<div class="ie-thought-bonuses">${bonusText}</div>` : ''}
                </div>
            `;
        }).join('') :
        '<div class="ie-thoughts-empty"><em>No internalized thoughts</em></div>';

    // Slots info
    const slotsUsed = Object.keys(thoughtCabinet.researching).length;
    const slotsAvailable = thoughtCabinet.slots;

    container.innerHTML = `
        <div class="ie-section">
            <div class="ie-section-header"><span>Themes</span></div>
            <div class="ie-themes-tracker">${themesHtml}</div>
        </div>

        <div class="ie-section">
            <div class="ie-section-header">
                <span>Researching</span>
                <span class="ie-slots-info">${slotsUsed}/${slotsAvailable} slots</span>
            </div>
            <div class="ie-thoughts-researching">${researchingHtml}</div>
        </div>

        <div class="ie-section">
            <div class="ie-section-header"><span>Discovered</span></div>
            <div class="ie-thoughts-discovered">${discoveredHtml}</div>
        </div>

        <div class="ie-section">
            <div class="ie-section-header"><span>Internalized</span></div>
            <div class="ie-thoughts-internalized">${internalizedHtml}</div>
        </div>
    `;

    // Attach callbacks
    container.querySelectorAll('.ie-btn-research').forEach(btn => {
        btn.addEventListener('click', () => {
            if (callbacks.onResearch) callbacks.onResearch(btn.dataset.thought);
        });
    });

    container.querySelectorAll('.ie-btn-dismiss-thought').forEach(btn => {
        btn.addEventListener('click', () => {
            if (callbacks.onDismiss) callbacks.onDismiss(btn.dataset.thought);
        });
    });

    container.querySelectorAll('.ie-btn-abandon').forEach(btn => {
        btn.addEventListener('click', () => {
            if (callbacks.onAbandon) callbacks.onAbandon(btn.dataset.thought);
        });
    });
}

// ═══════════════════════════════════════════════════════════════
// SETTINGS SYNC
// ═══════════════════════════════════════════════════════════════

export function syncSettingsToUI() {
    const setValue = (id, value) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.type === 'checkbox') el.checked = value;
        else el.value = value;
    };

    setValue('ie-api-endpoint', extensionSettings.apiEndpoint);
    setValue('ie-api-key', extensionSettings.apiKey);
    setValue('ie-model', extensionSettings.model);
    setValue('ie-temperature', extensionSettings.temperature);
    setValue('ie-max-tokens', extensionSettings.maxTokens);
    setValue('ie-min-voices', extensionSettings.voicesPerMessage?.min || 1);
    setValue('ie-max-voices', extensionSettings.voicesPerMessage?.max || 4);
    setValue('ie-trigger-delay', extensionSettings.triggerDelay);
    setValue('ie-show-dice-rolls', extensionSettings.showDiceRolls);
    setValue('ie-show-failed-checks', extensionSettings.showFailedChecks);
    setValue('ie-auto-trigger', extensionSettings.autoTrigger);
    setValue('ie-auto-detect-status', extensionSettings.autoDetectStatus);
    setValue('ie-intrusive-enabled', extensionSettings.intrusiveEnabled);
    setValue('ie-intrusive-in-chat', extensionSettings.intrusiveInChat);
    setValue('ie-intrusive-chance', (extensionSettings.intrusiveChance || 0.15) * 100);
    setValue('ie-object-voices-enabled', extensionSettings.objectVoicesEnabled);
    setValue('ie-object-chance', (extensionSettings.objectVoiceChance || 0.4) * 100);
    setValue('ie-thought-discovery-enabled', extensionSettings.thoughtDiscoveryEnabled);
    setValue('ie-auto-discover-thoughts', extensionSettings.autoDiscoverThoughts);
    setValue('ie-pov-style', extensionSettings.povStyle);
    setValue('ie-character-name', extensionSettings.characterName);
    setValue('ie-character-pronouns', extensionSettings.characterPronouns);
    setValue('ie-character-context', extensionSettings.characterContext);

    // Show/hide third person options
    const thirdPersonOptions = document.querySelectorAll('.ie-third-person-options');
    const showThird = extensionSettings.povStyle === 'third';
    thirdPersonOptions.forEach(el => el.style.display = showThird ? 'block' : 'none');
}

export function syncUIToSettings() {
    const getValue = (id, defaultVal) => {
        const el = document.getElementById(id);
        if (!el) return defaultVal;
        if (el.type === 'checkbox') return el.checked;
        if (el.type === 'number') return parseFloat(el.value) || defaultVal;
        return el.value || defaultVal;
    };

    extensionSettings.apiEndpoint = getValue('ie-api-endpoint', '');
    extensionSettings.apiKey = getValue('ie-api-key', '');
    extensionSettings.model = getValue('ie-model', 'glm-4-plus');
    extensionSettings.temperature = getValue('ie-temperature', 0.9);
    extensionSettings.maxTokens = getValue('ie-max-tokens', 300);
    extensionSettings.voicesPerMessage = {
        min: getValue('ie-min-voices', 1),
        max: getValue('ie-max-voices', 4)
    };
    extensionSettings.triggerDelay = getValue('ie-trigger-delay', 1000);
    extensionSettings.showDiceRolls = getValue('ie-show-dice-rolls', true);
    extensionSettings.showFailedChecks = getValue('ie-show-failed-checks', true);
    extensionSettings.autoTrigger = getValue('ie-auto-trigger', false);
    extensionSettings.autoDetectStatus = getValue('ie-auto-detect-status', false);
    extensionSettings.intrusiveEnabled = getValue('ie-intrusive-enabled', true);
    extensionSettings.intrusiveInChat = getValue('ie-intrusive-in-chat', true);
    extensionSettings.intrusiveChance = getValue('ie-intrusive-chance', 15) / 100;
    extensionSettings.objectVoicesEnabled = getValue('ie-object-voices-enabled', true);
    extensionSettings.objectVoiceChance = getValue('ie-object-chance', 40) / 100;
    extensionSettings.thoughtDiscoveryEnabled = getValue('ie-thought-discovery-enabled', true);
    extensionSettings.autoDiscoverThoughts = getValue('ie-auto-discover-thoughts', true);
    extensionSettings.povStyle = getValue('ie-pov-style', 'second');
    extensionSettings.characterName = getValue('ie-character-name', '');
    extensionSettings.characterPronouns = getValue('ie-character-pronouns', 'they');
    extensionSettings.characterContext = getValue('ie-character-context', '');
}

export function clearVoices() {
    const container = document.getElementById('ie-voices-output');
    if (container) {
        container.innerHTML = `
            <div class="ie-voices-empty">
                <i class="fa-solid fa-comment-slash"></i>
                <span>Waiting for something to happen...</span>
            </div>
        `;
    }
}
