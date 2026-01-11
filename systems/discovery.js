/**
 * Inland Empire - Discovery System
 * Environmental awareness, investigation, and discovery modal
 * 
 * Consolidates: Object Voices, Intrusive Thoughts, Scene Investigation
 */

import { SKILLS } from '../data/skills.js';
import { extensionSettings, getEffectiveSkillLevel } from './state.js';
import { callAPI } from './generation.js';
import { getResearchPenalties } from './cabinet.js';

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════

// Pending discoveries waiting to be viewed
let pendingDiscoveries = [];

// Last scene context for investigation
let lastSceneContext = '';

// Is investigation in progress?
let isInvestigating = false;

// ═══════════════════════════════════════════════════════════════
// DISCOVERY MANAGEMENT
// ═══════════════════════════════════════════════════════════════

export function addDiscovery(discovery) {
    pendingDiscoveries.push({
        ...discovery,
        id: `discovery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now()
    });
    updateBadge();
    pulseThoughtBubble();
}

export function removeDiscovery(discoveryId) {
    pendingDiscoveries = pendingDiscoveries.filter(d => d.id !== discoveryId);
    updateBadge();
    renderDiscoveryList();
}

export function clearAllDiscoveries() {
    pendingDiscoveries = [];
    updateBadge();
    renderDiscoveryList();
}

export function getDiscoveries() {
    return [...pendingDiscoveries];
}

export function getDiscoveryCount() {
    return pendingDiscoveries.length;
}

// ═══════════════════════════════════════════════════════════════
// SCENE CONTEXT
// ═══════════════════════════════════════════════════════════════

export function updateSceneContext(text) {
    lastSceneContext = text;
}

export function getSceneContext() {
    return lastSceneContext;
}

// ═══════════════════════════════════════════════════════════════
// INVESTIGATION
// ═══════════════════════════════════════════════════════════════

export async function investigateSurroundings() {
    if (isInvestigating) return;
    if (!lastSceneContext) {
        console.warn('[Discovery] No scene context to investigate');
        return [];
    }

    isInvestigating = true;
    setInvestigateButtonLoading(true);

    try {
        const observations = await generateObservations(lastSceneContext);
        
        // Add each observation as a discovery
        for (const obs of observations) {
            addDiscovery({
                type: 'observation',
                skillId: obs.skillId,
                skillName: obs.skillName,
                signature: obs.signature,
                color: obs.color,
                content: obs.content,
                icon: getSkillIcon(obs.skillId)
            });
        }

        return observations;
    } catch (error) {
        console.error('[Discovery] Investigation failed:', error);
        return [];
    } finally {
        isInvestigating = false;
        setInvestigateButtonLoading(false);
    }
}

async function generateObservations(sceneText) {
    const researchPenalties = getResearchPenalties();
    
    // Select skills most likely to notice things
    const observationSkills = [
        'perception',      // What you SEE
        'inlandEmpire',    // What you SENSE
        'shivers',         // What the CITY tells you
        'espritDeCorps',   // What other COPS would notice
        'composure',       // Body language
        'visualCalculus',  // Spatial details
        'encyclopedia',    // What you KNOW about objects
        'drama',           // Deception/staging
        'halfLight',       // Danger sense
        'electrochemistry' // Substances
    ];

    // Weight by skill level and pick 3-5
    const weighted = observationSkills
        .map(skillId => ({
            skillId,
            skill: SKILLS[skillId],
            level: getEffectiveSkillLevel(skillId, researchPenalties)
        }))
        .filter(s => s.skill && s.level > 0)
        .sort((a, b) => b.level - a.level);

    // Pick top skills with some randomness
    const selectedSkills = [];
    const numSkills = Math.min(3 + Math.floor(Math.random() * 3), weighted.length);
    
    for (let i = 0; i < numSkills && weighted.length > 0; i++) {
        // Higher skills more likely but not guaranteed
        const idx = Math.floor(Math.pow(Math.random(), 2) * Math.min(6, weighted.length));
        selectedSkills.push(weighted.splice(idx, 1)[0]);
    }

    if (selectedSkills.length === 0) {
        return [];
    }

    // Build prompt
    const skillDescriptions = selectedSkills.map(s => 
        `${s.skill.signature} (Level ${s.level}): ${s.skill.personality}`
    ).join('\n');

    const systemPrompt = `You are generating environmental observations for a Disco Elysium-style investigation.

OBSERVING SKILLS:
${skillDescriptions}

RULES:
1. Each skill notices something DIFFERENT based on their personality
2. Observations should be 1-2 sentences, evocative and specific
3. Format EXACTLY as: SKILL_SIGNATURE - observation
4. Be specific to the scene - what would THIS skill notice HERE?
5. Include sensory details, emotional residue, hidden meanings
6. PERCEPTION sees physical details
7. INLAND EMPIRE senses emotional/psychic impressions
8. SHIVERS feels the city/place itself speaking
9. ESPRIT DE CORPS notices cop-relevant details
10. Other skills notice things relevant to their domain

Generate ${selectedSkills.length} observations, one per skill.`;

    const userPrompt = `Scene to investigate:
"${sceneText.substring(0, 1000)}"

What does each skill notice? Be specific and evocative.`;

    try {
        const response = await callAPI(systemPrompt, userPrompt);
        return parseObservations(response, selectedSkills);
    } catch (error) {
        console.error('[Discovery] API call failed:', error);
        return [];
    }
}

function parseObservations(response, selectedSkills) {
    const lines = response.trim().split('\n').filter(line => line.trim());
    const observations = [];

    // Build skill map
    const skillMap = {};
    selectedSkills.forEach(s => {
        skillMap[s.skill.signature.toUpperCase()] = s;
        skillMap[s.skill.name.toUpperCase()] = s;
    });

    for (const line of lines) {
        const match = line.match(/^([A-Z][A-Z\s\/]+)\s*[-:–—]\s*(.+)$/i);
        if (match) {
            const skillInfo = skillMap[match[1].trim().toUpperCase()];
            if (skillInfo) {
                observations.push({
                    skillId: skillInfo.skillId,
                    skillName: skillInfo.skill.name,
                    signature: skillInfo.skill.signature,
                    color: skillInfo.skill.color,
                    content: match[2].trim()
                });
            }
        }
    }

    return observations;
}

function getSkillIcon(skillId) {
    const iconMap = {
        perception: '👁️',
        inlandEmpire: '🔮',
        shivers: '❄️',
        espritDeCorps: '👮',
        composure: '😐',
        visualCalculus: '📐',
        encyclopedia: '📚',
        drama: '🎭',
        halfLight: '⚡',
        electrochemistry: '💊',
        logic: '🧩',
        rhetoric: '💬',
        empathy: '💜',
        authority: '👊',
        suggestion: '🎯',
        volition: '💪',
        endurance: '🏋️',
        painThreshold: '🩸',
        physicalInstrument: '💪',
        interfacing: '🔧',
        savoirFaire: '🎪',
        reactionSpeed: '⚡',
        handEyeCoordination: '🎯',
        conceptualization: '🎨'
    };
    return iconMap[skillId] || '💭';
}

// ═══════════════════════════════════════════════════════════════
// UI CREATION
// ═══════════════════════════════════════════════════════════════

export function createThoughtBubbleFAB() {
    const fab = document.createElement('div');
    fab.id = 'ie-thought-fab';
    fab.className = 'ie-thought-fab';
    fab.title = 'Environmental Awareness';
    fab.innerHTML = `
        <span style="font-size: 22px;">💭</span>
        <div class="ie-thought-fab-badge" data-count="0"></div>
    `;

    // Position below the brain FAB
    fab.style.top = `${(extensionSettings.fabPositionTop ?? 140) + 60}px`;
    fab.style.left = `${extensionSettings.fabPositionLeft ?? 10}px`;

    fab.addEventListener('click', toggleDiscoveryModal);

    return fab;
}

export function createDiscoveryModal() {
    const overlay = document.createElement('div');
    overlay.id = 'ie-discovery-overlay';
    overlay.className = 'ie-discovery-overlay';

    overlay.innerHTML = `
        <div class="ie-discovery-modal">
            <div class="ie-discovery-header">
                <div class="ie-discovery-title">
                    <span class="ie-discovery-title-icon">💭</span>
                    <span>Environmental Awareness</span>
                </div>
                <button class="ie-discovery-close" title="Close">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            
            <button class="ie-discovery-investigate" id="ie-investigate-btn">
                <i class="fa-solid fa-search"></i>
                <span>Investigate Surroundings</span>
            </button>
            
            <div class="ie-discovery-list" id="ie-discovery-list">
                <div class="ie-discovery-empty">
                    <i class="fa-solid fa-eye-slash"></i>
                    <span>Nothing has caught your attention... yet.</span>
                </div>
            </div>
            
            <button class="ie-discovery-clear" id="ie-discovery-clear" style="display: none;">
                Clear All
            </button>
        </div>
    `;

    // Event listeners
    overlay.querySelector('.ie-discovery-close').addEventListener('click', toggleDiscoveryModal);
    overlay.querySelector('#ie-investigate-btn').addEventListener('click', investigateSurroundings);
    overlay.querySelector('#ie-discovery-clear').addEventListener('click', clearAllDiscoveries);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) toggleDiscoveryModal();
    });

    return overlay;
}

// ═══════════════════════════════════════════════════════════════
// UI UPDATES
// ═══════════════════════════════════════════════════════════════

export function toggleDiscoveryModal() {
    const overlay = document.getElementById('ie-discovery-overlay');
    if (!overlay) return;

    const isOpen = overlay.classList.contains('ie-discovery-open');
    
    if (isOpen) {
        overlay.classList.remove('ie-discovery-open');
    } else {
        overlay.classList.add('ie-discovery-open');
        renderDiscoveryList();
    }
}

function updateBadge() {
    const badge = document.querySelector('.ie-thought-fab-badge');
    if (badge) {
        const count = pendingDiscoveries.length;
        badge.textContent = count > 9 ? '9+' : count;
        badge.dataset.count = count;
    }
}

function pulseThoughtBubble() {
    const fab = document.getElementById('ie-thought-fab');
    if (fab) {
        fab.classList.add('ie-thought-fab-pulse');
        setTimeout(() => fab.classList.remove('ie-thought-fab-pulse'), 3000);
    }
}

function setInvestigateButtonLoading(loading) {
    const btn = document.getElementById('ie-investigate-btn');
    if (!btn) return;

    if (loading) {
        btn.disabled = true;
        btn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Investigating...</span>
        `;
    } else {
        btn.disabled = false;
        btn.innerHTML = `
            <i class="fa-solid fa-search"></i>
            <span>Investigate Surroundings</span>
        `;
    }
}

export function renderDiscoveryList() {
    const container = document.getElementById('ie-discovery-list');
    const clearBtn = document.getElementById('ie-discovery-clear');
    if (!container) return;

    if (pendingDiscoveries.length === 0) {
        container.innerHTML = `
            <div class="ie-discovery-empty">
                <i class="fa-solid fa-eye-slash"></i>
                <span>Nothing has caught your attention... yet.</span>
            </div>
        `;
        if (clearBtn) clearBtn.style.display = 'none';
        return;
    }

    if (clearBtn) clearBtn.style.display = 'block';

    container.innerHTML = pendingDiscoveries.map(discovery => `
        <div class="ie-discovery-item" 
             data-id="${discovery.id}" 
             data-type="${discovery.type}"
             style="--item-color: ${discovery.color}">
            <div class="ie-discovery-item-header">
                <span class="ie-discovery-item-icon">${discovery.icon || '💭'}</span>
                <span class="ie-discovery-item-skill" style="color: ${discovery.color}">
                    ${discovery.signature || discovery.name || 'Unknown'}
                </span>
                <span class="ie-discovery-item-type">${getTypeLabel(discovery.type)}</span>
            </div>
            <div class="ie-discovery-item-content">"${discovery.content}"</div>
            <button class="ie-discovery-item-dismiss" data-id="${discovery.id}" title="Dismiss">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
    `).join('');

    // Bind dismiss buttons
    container.querySelectorAll('.ie-discovery-item-dismiss').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeDiscovery(btn.dataset.id);
        });
    });
}

function getTypeLabel(type) {
    const labels = {
        intrusive: 'Intrusive',
        object: 'Object',
        observation: 'Observed'
    };
    return labels[type] || 'Discovery';
}

// ═══════════════════════════════════════════════════════════════
// INTEGRATION HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Add an intrusive thought to discoveries
 */
export function addIntrusiveDiscovery(thought) {
    addDiscovery({
        type: 'intrusive',
        skillId: thought.skillId,
        skillName: thought.skillName,
        signature: thought.signature,
        color: thought.color,
        content: thought.content,
        icon: '🧠'
    });
}

/**
 * Add an object voice to discoveries
 */
export function addObjectDiscovery(objectVoice) {
    addDiscovery({
        type: 'object',
        skillId: objectVoice.objectId,
        name: objectVoice.name,
        signature: objectVoice.name,
        color: objectVoice.color,
        content: objectVoice.content,
        icon: objectVoice.icon
    });
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export {
    isInvestigating
};
