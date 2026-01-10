/**
 * Inland Empire - Thought Cabinet System
 * Theme tracking, thought discovery, research, and internalization
 */

import { THEMES, THOUGHTS } from '../data/thoughts.js';
import { SKILLS } from '../data/skills.js';
import {
    themeCounters,
    thoughtCabinet,
    discoveryContext,
    activeStatuses,
    currentBuild,
    extensionSettings,
    getEffectiveSkillLevel,
    saveState,
    setThemeCounters
} from './state.js';

// ═══════════════════════════════════════════════════════════════
// THEME TRACKING
// ═══════════════════════════════════════════════════════════════

export function initializeThemeCounters() {
    for (const themeId of Object.keys(THEMES)) {
        if (!(themeId in themeCounters)) {
            themeCounters[themeId] = 0;
        }
    }
}

export function trackThemesInMessage(text) {
    if (!text || !extensionSettings.thoughtDiscoveryEnabled) return;

    const lowerText = text.toLowerCase();

    for (const [themeId, theme] of Object.entries(THEMES)) {
        for (const keyword of theme.keywords) {
            if (lowerText.includes(keyword)) {
                themeCounters[themeId] = (themeCounters[themeId] || 0) + 1;
                break; // Only count once per theme per message
            }
        }
    }
}

export function getTopThemes(count = 5) {
    return Object.entries(themeCounters)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([id, count]) => ({ ...THEMES[id], count }));
}

export function resetThemeCounters() {
    for (const key of Object.keys(themeCounters)) {
        themeCounters[key] = 0;
    }
}

// ═══════════════════════════════════════════════════════════════
// THOUGHT DISCOVERY
// ═══════════════════════════════════════════════════════════════

export function meetsDiscoveryConditions(thought) {
    const cond = thought.discoveryConditions;
    if (!cond) return false;

    // Already discovered, researching, internalized, or dismissed
    if (thoughtCabinet.discovered.includes(thought.id) ||
        thoughtCabinet.researching[thought.id] ||
        thoughtCabinet.internalized.includes(thought.id) ||
        thoughtCabinet.dismissed.includes(thought.id)) {
        return false;
    }

    // Theme requirements
    if (cond.themes) {
        for (const [themeId, required] of Object.entries(cond.themes)) {
            if ((themeCounters[themeId] || 0) < required) return false;
        }
    }

    // Status requirement
    if (cond.status && !activeStatuses.has(cond.status)) return false;

    // Minimum skill requirement
    if (cond.minSkill) {
        for (const [skillId, min] of Object.entries(cond.minSkill)) {
            if (getEffectiveSkillLevel(skillId) < min) return false;
        }
    }

    // Critical success on specific skill
    if (cond.criticalSuccess && !discoveryContext.criticalSuccesses[cond.criticalSuccess]) {
        return false;
    }

    // Critical failure on specific skill
    if (cond.criticalFailure && !discoveryContext.criticalFailures[cond.criticalFailure]) {
        return false;
    }

    // Object count
    if (cond.objectCount && discoveryContext.objectsSeen.size < cond.objectCount) {
        return false;
    }

    // Message count
    if (cond.messageCount && discoveryContext.messageCount < cond.messageCount) {
        return false;
    }

    // Ancient voice triggered
    if (cond.ancientVoice && !discoveryContext.ancientVoiceTriggered) {
        return false;
    }

    // First discovery (only one thought has this)
    if (cond.firstDiscovery && discoveryContext.firstDiscoveryDone) {
        return false;
    }

    return true;
}

export function checkThoughtDiscovery() {
    if (!extensionSettings.thoughtDiscoveryEnabled || !extensionSettings.autoDiscoverThoughts) {
        return [];
    }

    const newlyDiscovered = [];

    for (const thought of Object.values(THOUGHTS)) {
        if (meetsDiscoveryConditions(thought)) {
            thoughtCabinet.discovered.push(thought.id);
            newlyDiscovered.push(thought);

            if (thought.discoveryConditions.firstDiscovery) {
                discoveryContext.firstDiscoveryDone = true;
            }
        }
    }

    return newlyDiscovered;
}

// ═══════════════════════════════════════════════════════════════
// RESEARCH MANAGEMENT
// ═══════════════════════════════════════════════════════════════

export function startResearch(thoughtId, context = null) {
    const thought = THOUGHTS[thoughtId];
    if (!thought) return false;

    const researchingCount = Object.keys(thoughtCabinet.researching).length;
    if (researchingCount >= thoughtCabinet.slots) return false;

    const idx = thoughtCabinet.discovered.indexOf(thoughtId);
    if (idx === -1) return false;

    thoughtCabinet.discovered.splice(idx, 1);
    thoughtCabinet.researching[thoughtId] = {
        progress: 0,
        started: Date.now()
    };

    if (context) saveState(context);
    return true;
}

export function abandonResearch(thoughtId, context = null) {
    if (!thoughtCabinet.researching[thoughtId]) return false;

    delete thoughtCabinet.researching[thoughtId];
    thoughtCabinet.discovered.push(thoughtId);

    if (context) saveState(context);
    return true;
}

export function advanceResearch(messageText = '') {
    const completed = [];

    for (const [thoughtId, research] of Object.entries(thoughtCabinet.researching)) {
        const thought = THOUGHTS[thoughtId];
        if (!thought) continue;

        let progressGain = 1;

        // Bonus for relevant keywords in message
        const themeId = thought.category;
        if (THEMES[themeId]) {
            const matches = THEMES[themeId].keywords.filter(kw =>
                messageText.toLowerCase().includes(kw)
            );
            progressGain += Math.min(matches.length, 2);
        }

        research.progress += progressGain;

        if (research.progress >= thought.researchTime) {
            completed.push(thoughtId);
        }
    }

    for (const thoughtId of completed) {
        internalizeThought(thoughtId);
    }

    return completed;
}

export function internalizeThought(thoughtId, context = null) {
    const thought = THOUGHTS[thoughtId];
    if (!thought || !thoughtCabinet.researching[thoughtId]) return null;

    delete thoughtCabinet.researching[thoughtId];
    thoughtCabinet.internalized.push(thoughtId);

    // Apply bonuses to current build
    if (thought.internalizedBonus && currentBuild) {
        for (const [skillId, bonus] of Object.entries(thought.internalizedBonus)) {
            currentBuild.skillLevels[skillId] = Math.min(
                10,
                (currentBuild.skillLevels[skillId] || 1) + bonus
            );
        }
    }

    // Apply cap modifiers
    if (thought.capModifier && currentBuild) {
        for (const [skillId, bonus] of Object.entries(thought.capModifier)) {
            if (!currentBuild.skillCaps[skillId]) {
                currentBuild.skillCaps[skillId] = { starting: 4, learning: 7 };
            }
            currentBuild.skillCaps[skillId].learning = Math.min(
                10,
                currentBuild.skillCaps[skillId].learning + bonus
            );
        }
    }

    if (context) saveState(context);
    return thought;
}

export function dismissThought(thoughtId, context = null) {
    const idx = thoughtCabinet.discovered.indexOf(thoughtId);
    if (idx === -1) return false;

    thoughtCabinet.discovered.splice(idx, 1);
    thoughtCabinet.dismissed.push(thoughtId);

    if (context) saveState(context);
    return true;
}

// ═══════════════════════════════════════════════════════════════
// RESEARCH PENALTIES
// ═══════════════════════════════════════════════════════════════

export function getResearchPenalties() {
    const penalties = {};

    for (const thoughtId of Object.keys(thoughtCabinet.researching)) {
        const thought = THOUGHTS[thoughtId];
        if (thought?.researchPenalty) {
            for (const [skillId, penalty] of Object.entries(thought.researchPenalty)) {
                penalties[skillId] = (penalties[skillId] || 0) + penalty;
            }
        }
    }

    return penalties;
}

// ═══════════════════════════════════════════════════════════════
// SPECIAL EFFECTS
// ═══════════════════════════════════════════════════════════════

export function hasSpecialEffect(effectName) {
    return thoughtCabinet.internalized.some(id =>
        THOUGHTS[id]?.specialEffect === effectName
    );
}

// ═══════════════════════════════════════════════════════════════
// DISCOVERY CONTEXT UPDATES
// ═══════════════════════════════════════════════════════════════

export function incrementMessageCount() {
    discoveryContext.messageCount++;
}

export function recordCriticalSuccess(skillId) {
    discoveryContext.criticalSuccesses[skillId] = true;
}

export function recordCriticalFailure(skillId) {
    discoveryContext.criticalFailures[skillId] = true;
}

export function recordObjectSeen(objectId) {
    discoveryContext.objectsSeen.add(objectId);
}

export function recordAncientVoiceTriggered() {
    discoveryContext.ancientVoiceTriggered = true;
}
