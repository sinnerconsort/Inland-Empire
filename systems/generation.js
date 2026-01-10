/**
 * Inland Empire - Voice Generation System
 * Context analysis, voice selection, API calls, and prompt building
 */

import { SKILLS, ANCIENT_VOICES } from '../data/skills.js';
import { INTRUSIVE_THOUGHTS, OBJECT_VOICES } from '../data/voices.js';
import {
    extensionSettings,
    activeStatuses,
    getEffectiveSkillLevel,
    getSkillLevel,
    getActiveAncientVoices,
    getBoostedIntrusiveSkills,
    discoveryContext
} from './state.js';
import { rollSkillCheck, determineCheckDifficulty } from './dice.js';
import { getResearchPenalties, hasSpecialEffect, recordObjectSeen } from './cabinet.js';

// Track recent intrusive thoughts to avoid repetition
let recentIntrusiveThoughts = [];
let lastObjectVoice = null;

// ═══════════════════════════════════════════════════════════════
// CONTEXT ANALYSIS
// ═══════════════════════════════════════════════════════════════

export function analyzeContext(message) {
    const emotionalIndicators = [
        /!{2,}/, /\?{2,}/,
        /scream|shout|cry|sob|laugh/i,
        /furious|terrified|ecstatic/i
    ];
    const dangerIndicators = [
        /blood|wound|injury|hurt|pain/i,
        /gun|knife|weapon|attack|fight/i,
        /danger|threat|kill|die|death/i
    ];
    const socialIndicators = [
        /lie|lying|truth|honest|trust/i,
        /convince|persuade|manipulate/i,
        /feel|emotion|sad|happy|angry/i
    ];
    const mysteryIndicators = [
        /clue|evidence|investigate|discover/i,
        /secret|hidden|mystery|strange/i
    ];
    const physicalIndicators = [
        /room|building|street|place/i,
        /cold|hot|wind|rain/i,
        /machine|device|lock/i
    ];

    return {
        message,
        emotionalIntensity: emotionalIndicators.filter(r => r.test(message)).length / emotionalIndicators.length,
        dangerLevel: dangerIndicators.filter(r => r.test(message)).length / dangerIndicators.length,
        socialComplexity: socialIndicators.filter(r => r.test(message)).length / socialIndicators.length,
        mysteryLevel: mysteryIndicators.filter(r => r.test(message)).length / mysteryIndicators.length,
        physicalPresence: physicalIndicators.filter(r => r.test(message)).length / physicalIndicators.length
    };
}

// ═══════════════════════════════════════════════════════════════
// SKILL RELEVANCE CALCULATION
// ═══════════════════════════════════════════════════════════════

export function calculateSkillRelevance(skillId, context) {
    const skill = SKILLS[skillId];
    if (!skill) return { skillId, score: 0, reasons: [] };

    const researchPenalties = getResearchPenalties();
    const statusModifier = extensionSettings.autoDetectStatus ? 
        getSkillModifier(skillId, researchPenalties) : 0;

    let score = 0;

    // Keyword matching
    const keywordMatches = skill.triggerConditions.filter(kw =>
        context.message.toLowerCase().includes(kw.toLowerCase())
    );
    if (keywordMatches.length > 0) {
        score += Math.min(keywordMatches.length * 0.2, 0.6);
    }

    // Attribute bonuses based on context
    const attr = skill.attribute;
    if (attr === 'PSYCHE') score += context.emotionalIntensity * 0.4;
    if (attr === 'PHYSIQUE') score += context.dangerLevel * 0.5;
    if (attr === 'INTELLECT') score += context.mysteryLevel * 0.4;
    if (attr === 'MOTORICS') score += context.physicalPresence * 0.3;

    // Status boost
    if (statusModifier > 0) score += statusModifier * 0.25;

    // Skill level influence
    score += getEffectiveSkillLevel(skillId, researchPenalties) * 0.05;

    // Random variance
    score += (Math.random() - 0.5) * 0.2;

    return {
        skillId,
        skillName: skill.name,
        score: Math.max(0, Math.min(1, score)),
        skillLevel: getSkillLevel(skillId),
        attribute: attr
    };
}

function getSkillModifier(skillId, researchPenalties) {
    // Import from state would create circular dependency, so inline simple version
    let modifier = 0;
    if (researchPenalties[skillId]) {
        modifier += researchPenalties[skillId];
    }
    return modifier;
}

// ═══════════════════════════════════════════════════════════════
// VOICE SELECTION
// ═══════════════════════════════════════════════════════════════

export function selectSpeakingSkills(context, options = {}) {
    const { minVoices = 1, maxVoices = 4 } = options;
    const researchPenalties = getResearchPenalties();

    // Check for ancient voices first
    const ancientVoicesToSpeak = [];
    for (const ancientId of getActiveAncientVoices()) {
        const ancient = ANCIENT_VOICES[ancientId];
        if (ancient) {
            const keywordMatch = ancient.triggerConditions.some(kw =>
                context.message.toLowerCase().includes(kw.toLowerCase())
            );
            if (Math.random() < (keywordMatch ? 0.8 : 0.4)) {
                ancientVoicesToSpeak.push({
                    skillId: ancient.id,
                    skillName: ancient.name,
                    score: 1.0,
                    skillLevel: 6,
                    attribute: 'PRIMAL',
                    isAncient: true
                });
                discoveryContext.ancientVoiceTriggered = true;
            }
        }
    }

    // Calculate relevance for all skills
    const allRelevance = Object.keys(SKILLS)
        .map(id => calculateSkillRelevance(id, context))
        .filter(r => r.score >= 0.3)
        .sort((a, b) => b.score - a.score);

    // Determine number of voices based on intensity
    const intensity = Math.max(
        context.emotionalIntensity,
        context.dangerLevel,
        context.socialComplexity
    );
    const targetVoices = Math.round(minVoices + (maxVoices - minVoices) * intensity);

    // Select skills
    const selected = [...ancientVoicesToSpeak];
    for (const relevance of allRelevance) {
        if (selected.length >= targetVoices + ancientVoicesToSpeak.length) break;
        if (Math.random() < relevance.score * 0.8 + 0.2) {
            selected.push(relevance);
        }
    }

    // Ensure minimum voices
    while (selected.filter(s => !s.isAncient).length < minVoices && allRelevance.length > 0) {
        const next = allRelevance.find(r => !selected.find(s => s.skillId === r.skillId));
        if (next) selected.push(next);
        else break;
    }

    return selected;
}

// ═══════════════════════════════════════════════════════════════
// INTRUSIVE THOUGHTS
// ═══════════════════════════════════════════════════════════════

export function getIntrusiveThought(messageText = '') {
    if (!extensionSettings.intrusiveEnabled) return null;

    const boostedSkills = getBoostedIntrusiveSkills();
    const allSkillIds = Object.keys(INTRUSIVE_THOUGHTS);

    // Weight skills by level and boosts
    const weightedSkills = allSkillIds.map(skillId => {
        let weight = getEffectiveSkillLevel(skillId);
        if (boostedSkills.has(skillId)) weight += 3;

        const skill = SKILLS[skillId];
        if (skill && messageText) {
            const matches = skill.triggerConditions.filter(kw =>
                messageText.toLowerCase().includes(kw.toLowerCase())
            );
            weight += matches.length * 2;
        }

        return { skillId, weight };
    }).filter(s => s.weight > 0);

    // Select skill by weight
    const totalWeight = weightedSkills.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedSkill = null;

    for (const { skillId, weight } of weightedSkills) {
        random -= weight;
        if (random <= 0) {
            selectedSkill = skillId;
            break;
        }
    }

    if (!selectedSkill) {
        selectedSkill = allSkillIds[Math.floor(Math.random() * allSkillIds.length)];
    }

    // Get thought
    const thoughts = INTRUSIVE_THOUGHTS[selectedSkill];
    if (!thoughts || thoughts.length === 0) return null;

    let availableThoughts = thoughts.filter(t => !recentIntrusiveThoughts.includes(t));
    if (availableThoughts.length === 0) {
        recentIntrusiveThoughts = [];
        availableThoughts = thoughts;
    }

    const thought = availableThoughts[Math.floor(Math.random() * availableThoughts.length)];
    recentIntrusiveThoughts.push(thought);
    if (recentIntrusiveThoughts.length > 20) recentIntrusiveThoughts.shift();

    const skill = SKILLS[selectedSkill];
    return {
        skillId: selectedSkill,
        skillName: skill.name,
        signature: skill.signature,
        color: skill.color,
        content: thought,
        isIntrusive: true
    };
}

// ═══════════════════════════════════════════════════════════════
// OBJECT VOICES
// ═══════════════════════════════════════════════════════════════

export function detectObjects(text) {
    if (!extensionSettings.objectVoicesEnabled) return [];

    // Check for anti-object thought effect
    if (hasSpecialEffect('objectVoiceReduction') && Math.random() < 0.85) {
        return [];
    }

    const detected = [];
    for (const [objectId, obj] of Object.entries(OBJECT_VOICES)) {
        for (const pattern of obj.patterns) {
            if (pattern.test(text)) {
                detected.push({ id: objectId, ...obj });
                break;
            }
        }
    }

    return detected;
}

export function getObjectVoice(objectId) {
    const obj = OBJECT_VOICES[objectId];
    if (!obj) return null;

    // Avoid repeating same object
    if (lastObjectVoice === objectId && Math.random() > 0.3) return null;

    lastObjectVoice = objectId;
    recordObjectSeen(objectId);

    const line = obj.lines[Math.floor(Math.random() * obj.lines.length)];

    return {
        objectId,
        name: obj.name,
        icon: obj.icon,
        color: obj.color,
        content: line,
        affinitySkill: obj.affinitySkill,
        isObject: true
    };
}

export async function processIntrusiveThoughts(messageText) {
    const results = { intrusive: null, objects: [] };

    // Intrusive thought chance
    let intrusiveChance = extensionSettings.intrusiveChance || 0.15;
    if (activeStatuses.size > 0) {
        intrusiveChance += activeStatuses.size * 0.05;
    }

    if (Math.random() < intrusiveChance) {
        results.intrusive = getIntrusiveThought(messageText);
    }

    // Object voices
    const detectedObjects = detectObjects(messageText);
    for (const obj of detectedObjects) {
        if (Math.random() < (extensionSettings.objectVoiceChance || 0.4)) {
            const voice = getObjectVoice(obj.id);
            if (voice) results.objects.push(voice);
        }
    }

    return results;
}

// ═══════════════════════════════════════════════════════════════
// PROMPT BUILDING
// ═══════════════════════════════════════════════════════════════

export function buildChorusPrompt(voiceData, context, intrusiveData = null) {
    const povStyle = extensionSettings.povStyle || 'second';
    const charName = extensionSettings.characterName || '';
    const pronouns = extensionSettings.characterPronouns || 'they';
    const characterContext = extensionSettings.characterContext || '';

    // POV instruction
    let povInstruction;
    if (povStyle === 'third') {
        povInstruction = `Write in THIRD PERSON about ${charName || 'the character'}. Use "${charName || pronouns}" - NEVER "you".`;
    } else if (povStyle === 'first') {
        povInstruction = `Write in FIRST PERSON. Use "I/me/my" - NEVER "you".`;
    } else {
        povInstruction = `Write in SECOND PERSON. Address the character as "you".`;
    }

    // Context section
    let contextSection = characterContext.trim() ?
        `\nCHARACTER CONTEXT:\n${characterContext}\n` : '';

    // Status context
    let statusContext = '';
    if (activeStatuses.size > 0) {
        const statusNames = [...activeStatuses]
            .map(id => {
                // We'd need STATUS_EFFECTS here but avoid circular import
                return id.replace(/_/g, ' ');
            })
            .filter(Boolean)
            .join(', ');
        statusContext = `\nCurrent state: ${statusNames}.`;
    }

    // Intrusive context
    let intrusiveContext = '';
    if (intrusiveData) {
        if (intrusiveData.intrusive) {
            intrusiveContext += `\nINTRUSIVE THOUGHT (${intrusiveData.intrusive.signature}): "${intrusiveData.intrusive.content}"\nOther voices may react to this.`;
        }
        if (intrusiveData.objects?.length > 0) {
            intrusiveContext += `\nOBJECTS SPEAKING:\n${intrusiveData.objects.map(o => `${o.name}: "${o.content}"`).join('\n')}`;
        }
    }

    // Voice descriptions
    const voiceDescriptions = voiceData.map(v => {
        let checkInfo = '';
        if (v.checkResult) {
            if (v.checkResult.isBoxcars) checkInfo = ' [CRITICAL SUCCESS]';
            else if (v.checkResult.isSnakeEyes) checkInfo = ' [CRITICAL FAILURE]';
            else if (v.checkResult.success) checkInfo = ' [Success]';
            else checkInfo = ' [Failed]';
        } else if (v.isAncient) {
            checkInfo = ' [PRIMAL]';
        } else {
            checkInfo = ' [Passive]';
        }

        return `${v.skill.signature}${checkInfo}: ${v.skill.personality}`;
    }).join('\n\n');

    const systemPrompt = `You generate internal mental voices for a roleplayer, inspired by Disco Elysium.

THE VOICES SPEAKING:
${voiceDescriptions}

RULES:
1. ${povInstruction}
2. Voices REACT to each other - argue, agree, interrupt, give nicknames
3. Format EXACTLY as: SKILL_NAME - dialogue
4. Keep each line 1-2 sentences MAX
5. Failed checks = uncertain/wrong/bad advice. Critical success = profound insight. Critical failure = hilariously wrong
6. Ancient/Primal voices speak in fragments, poetically
7. Total: 4-12 voice lines
${contextSection}${statusContext}${intrusiveContext}

Output ONLY voice dialogue. No narration or explanation.`;

    return {
        system: systemPrompt,
        user: `Scene: "${context.message.substring(0, 800)}"\n\nGenerate the internal chorus.`
    };
}

// ═══════════════════════════════════════════════════════════════
// API CALLS
// ═══════════════════════════════════════════════════════════════

export async function callAPI(systemPrompt, userPrompt) {
    let { apiEndpoint, apiKey, model, maxTokens, temperature } = extensionSettings;

    if (!apiEndpoint || !apiKey) {
        throw new Error('API not configured');
    }

    // Ensure endpoint has /chat/completions
    if (!apiEndpoint.includes('/chat/completions')) {
        apiEndpoint = apiEndpoint.replace(/\/+$/, '') + '/chat/completions';
    }

    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model || 'glm-4-plus',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: maxTokens || 300,
            temperature: temperature || 0.9
        })
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ||
           data.choices?.[0]?.text ||
           data.content || '';
}

// ═══════════════════════════════════════════════════════════════
// RESPONSE PARSING
// ═══════════════════════════════════════════════════════════════

export function parseChorusResponse(response, voiceData) {
    const lines = response.trim().split('\n').filter(line => line.trim());
    const results = [];

    // Build skill map for matching
    const skillMap = {};
    voiceData.forEach(v => {
        skillMap[v.skill.signature.toUpperCase()] = v;
        skillMap[v.skill.name.toUpperCase()] = v;
    });

    for (const line of lines) {
        const match = line.match(/^([A-Z][A-Z\s\/]+)\s*[-:–—]\s*(.+)$/i);
        if (match) {
            const voiceInfo = skillMap[match[1].trim().toUpperCase()];
            if (voiceInfo) {
                results.push({
                    skillId: voiceInfo.skillId,
                    skillName: voiceInfo.skill.name,
                    signature: voiceInfo.skill.signature,
                    color: voiceInfo.skill.color,
                    content: match[2].trim(),
                    checkResult: voiceInfo.checkResult,
                    isAncient: voiceInfo.isAncient,
                    success: true
                });
            }
        }
    }

    // Fallback if no lines parsed
    if (results.length === 0 && voiceData.length > 0 && response.trim()) {
        const v = voiceData[0];
        results.push({
            skillId: v.skillId,
            skillName: v.skill.name,
            signature: v.skill.signature,
            color: v.skill.color,
            content: response.trim().substring(0, 200),
            checkResult: v.checkResult,
            isAncient: v.isAncient,
            success: true
        });
    }

    return results;
}

// ═══════════════════════════════════════════════════════════════
// MAIN GENERATION FUNCTION
// ═══════════════════════════════════════════════════════════════

export async function generateVoices(selectedSkills, context, intrusiveData = null) {
    const researchPenalties = getResearchPenalties();

    // Prepare voice data with checks
    const voiceData = selectedSkills.map(selected => {
        let checkResult = null;

        if (!selected.isAncient) {
            const checkDecision = determineCheckDifficulty(selected, context);
            if (checkDecision.shouldCheck) {
                const effectiveLevel = getEffectiveSkillLevel(selected.skillId, researchPenalties);
                checkResult = rollSkillCheck(effectiveLevel, checkDecision.difficulty);

                // Record criticals for thought discovery
                if (checkResult.isBoxcars) {
                    discoveryContext.criticalSuccesses[selected.skillId] = true;
                }
                if (checkResult.isSnakeEyes) {
                    discoveryContext.criticalFailures[selected.skillId] = true;
                }
            }
        }

        const skill = selected.isAncient ?
            ANCIENT_VOICES[selected.skillId] :
            SKILLS[selected.skillId];

        return {
            ...selected,
            skill,
            checkResult,
            effectiveLevel: selected.isAncient ? 6 : getEffectiveSkillLevel(selected.skillId, researchPenalties)
        };
    });

    // Build and send prompt
    const chorusPrompt = buildChorusPrompt(voiceData, context, intrusiveData);

    try {
        const response = await callAPI(chorusPrompt.system, chorusPrompt.user);
        return parseChorusResponse(response, voiceData);
    } catch (error) {
        console.error('[Inland Empire] Chorus generation failed:', error);

        // Return fallback
        return voiceData.map(v => ({
            skillId: v.skillId,
            skillName: v.skill.name,
            signature: v.skill.signature,
            color: v.skill.color,
            content: '*static*',
            checkResult: v.checkResult,
            isAncient: v.isAncient,
            success: false
        }));
    }
}
