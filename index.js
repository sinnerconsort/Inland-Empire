/**
 * Inland Empire - Disco Elysium-style Internal Voices for SillyTavern
 * v0.5.0 - Added trigger delay, persona profiles
 */

(async function () {
    'use strict';

    const extensionName = 'Inland Empire';

    function getSTContext() {
        if (typeof SillyTavern !== 'undefined' && typeof SillyTavern.getContext === 'function') {
            return SillyTavern.getContext();
        }
        if (typeof window !== 'undefined' && typeof window.SillyTavern !== 'undefined') {
            return window.SillyTavern.getContext();
        }
        return null;
    }

    async function waitForSTReady() {
        let attempts = 0;
        while (attempts < 20) {
            const ctx = getSTContext();
            if (ctx && ctx.eventSource) return ctx;
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        throw new Error('SillyTavern context not available');
    }

    const ATTRIBUTES = {
        INTELLECT: { id: 'intellect', name: 'Intellect', color: '#89CFF0', skills: ['logic', 'encyclopedia', 'rhetoric', 'drama', 'conceptualization', 'visual_calculus'] },
        PSYCHE: { id: 'psyche', name: 'Psyche', color: '#DDA0DD', skills: ['volition', 'inland_empire', 'empathy', 'authority', 'suggestion', 'esprit_de_corps'] },
        PHYSIQUE: { id: 'physique', name: 'Physique', color: '#F08080', skills: ['endurance', 'pain_threshold', 'physical_instrument', 'electrochemistry', 'half_light', 'shivers'] },
        MOTORICS: { id: 'motorics', name: 'Motorics', color: '#F0E68C', skills: ['hand_eye_coordination', 'perception', 'reaction_speed', 'savoir_faire', 'interfacing', 'composure'] }
    };

    const SKILLS = {
        logic: { id: 'logic', name: 'Logic', attribute: 'INTELLECT', color: '#87CEEB', signature: 'LOGIC', personality: 'You are LOGIC, the voice of rational deduction. You speak in clear, analytical terms.', triggerConditions: ['contradiction', 'evidence', 'reasoning', 'deduction', 'analysis', 'cause', 'effect', 'therefore', 'because', 'conclusion'] },
        encyclopedia: { id: 'encyclopedia', name: 'Encyclopedia', attribute: 'INTELLECT', color: '#B0C4DE', signature: 'ENCYCLOPEDIA', personality: 'You are ENCYCLOPEDIA, the repository of facts and trivia. You love sharing obscure details.', triggerConditions: ['history', 'science', 'culture', 'trivia', 'fact', 'knowledge', 'information', 'historical', 'technical'] },
        rhetoric: { id: 'rhetoric', name: 'Rhetoric', attribute: 'INTELLECT', color: '#ADD8E6', signature: 'RHETORIC', personality: 'You are RHETORIC, master of argument and debate. You see conversations as battles of ideas.', triggerConditions: ['argument', 'persuade', 'convince', 'debate', 'politics', 'ideology', 'belief', 'opinion', 'fallacy'] },
        drama: { id: 'drama', name: 'Drama', attribute: 'INTELLECT', color: '#B0E0E6', signature: 'DRAMA', personality: 'You are DRAMA, the actor and lie detector. You understand performance and deception.', triggerConditions: ['lie', 'deception', 'performance', 'acting', 'mask', 'pretend', 'fake', 'truth', 'honest', 'theater'] },
        conceptualization: { id: 'conceptualization', name: 'Conceptualization', attribute: 'INTELLECT', color: '#E0FFFF', signature: 'CONCEPTUALIZATION', personality: 'You are CONCEPTUALIZATION, the artistic eye. You see beauty and symbolism everywhere.', triggerConditions: ['art', 'beauty', 'meaning', 'symbol', 'creative', 'aesthetic', 'metaphor', 'poetry', 'expression', 'design'] },
        visual_calculus: { id: 'visual_calculus', name: 'Visual Calculus', attribute: 'INTELLECT', color: '#AFEEEE', signature: 'VISUAL CALCULUS', personality: 'You are VISUAL CALCULUS, the spatial reconstructor. You think in three dimensions.', triggerConditions: ['trajectory', 'distance', 'angle', 'reconstruct', 'scene', 'physical', 'space', 'position', 'movement', 'impact'] },
        volition: { id: 'volition', name: 'Volition', attribute: 'PSYCHE', color: '#DDA0DD', signature: 'VOLITION', personality: 'You are VOLITION, the will to continue. You say "you can do this" when everything seems hopeless.', triggerConditions: ['hope', 'despair', 'temptation', 'resist', 'continue', 'give up', 'willpower', 'strength', 'persevere', 'survive'] },
        inland_empire: { id: 'inland_empire', name: 'Inland Empire', attribute: 'PSYCHE', color: '#E6E6FA', signature: 'INLAND EMPIRE', personality: 'You are INLAND EMPIRE, the dreamer. You speak to the inanimate, perceive truths through surreal visions.', triggerConditions: ['dream', 'vision', 'strange', 'surreal', 'feeling', 'sense', 'whisper', 'spirit', 'soul', 'uncanny', 'liminal'] },
        empathy: { id: 'empathy', name: 'Empathy', attribute: 'PSYCHE', color: '#FFB6C1', signature: 'EMPATHY', personality: 'You are EMPATHY, the emotional reader. You sense what others feel.', triggerConditions: ['feel', 'emotion', 'hurt', 'pain', 'joy', 'sad', 'angry', 'afraid', 'love', 'hate', 'compassion'] },
        authority: { id: 'authority', name: 'Authority', attribute: 'PSYCHE', color: '#DA70D6', signature: 'AUTHORITY', personality: 'You are AUTHORITY, the voice of dominance. You speak in commands and declarations.', triggerConditions: ['respect', 'command', 'obey', 'power', 'control', 'dominance', 'challenge', 'threat', 'submit', 'authority'] },
        suggestion: { id: 'suggestion', name: 'Suggestion', attribute: 'PSYCHE', color: '#EE82EE', signature: 'SUGGESTION', personality: 'You are SUGGESTION, the subtle manipulator. You speak in possibilities and gentle nudges.', triggerConditions: ['influence', 'manipulate', 'convince', 'subtle', 'indirect', 'guide', 'nudge', 'charm', 'seduce', 'persuade'] },
        esprit_de_corps: { id: 'esprit_de_corps', name: 'Esprit de Corps', attribute: 'PSYCHE', color: '#D8BFD8', signature: 'ESPRIT DE CORPS', personality: 'You are ESPRIT DE CORPS, the team spirit. You speak of "us" and "them."', triggerConditions: ['team', 'partner', 'colleague', 'ally', 'loyalty', 'betrayal', 'group', 'together', 'trust', 'brotherhood'] },
        endurance: { id: 'endurance', name: 'Endurance', attribute: 'PHYSIQUE', color: '#CD5C5C', signature: 'ENDURANCE', personality: 'You are ENDURANCE, the voice of stamina. You push through exhaustion.', triggerConditions: ['tired', 'exhausted', 'stamina', 'keep going', 'push through', 'survive', 'endure', 'last', 'fatigue', 'rest'] },
        pain_threshold: { id: 'pain_threshold', name: 'Pain Threshold', attribute: 'PHYSIQUE', color: '#DC143C', signature: 'PAIN THRESHOLD', personality: 'You are PAIN THRESHOLD, the voice that greets pain as an old friend.', triggerConditions: ['pain', 'hurt', 'injury', 'wound', 'damage', 'suffer', 'agony', 'torture', 'broken', 'bleeding'] },
        physical_instrument: { id: 'physical_instrument', name: 'Physical Instrument', attribute: 'PHYSIQUE', color: '#B22222', signature: 'PHYSICAL INSTRUMENT', personality: 'You are PHYSICAL INSTRUMENT, the voice of brute force.', triggerConditions: ['strong', 'force', 'muscle', 'hit', 'fight', 'break', 'lift', 'physical', 'intimidate', 'violence'] },
        electrochemistry: { id: 'electrochemistry', name: 'Electrochemistry', attribute: 'PHYSIQUE', color: '#FF6347', signature: 'ELECTROCHEMISTRY', personality: 'You are ELECTROCHEMISTRY, the voice of pleasure and addiction. Always suggesting "just a taste."', triggerConditions: ['drug', 'alcohol', 'drink', 'smoke', 'pleasure', 'desire', 'want', 'crave', 'indulge', 'attractive', 'sex', 'high'] },
        half_light: { id: 'half_light', name: 'Half Light', attribute: 'PHYSIQUE', color: '#E9967A', signature: 'HALF LIGHT', personality: 'You are HALF LIGHT, the voice of fight-or-flight. Fear manifests as aggression.', triggerConditions: ['danger', 'threat', 'attack', 'kill', 'warn', 'enemy', 'afraid', 'fight', 'survive', 'predator', 'prey'] },
        shivers: { id: 'shivers', name: 'Shivers', attribute: 'PHYSIQUE', color: '#FA8072', signature: 'SHIVERS', personality: 'You are SHIVERS, the voice of the city itself. You see the city as alive.', triggerConditions: ['city', 'place', 'wind', 'cold', 'atmosphere', 'location', 'street', 'building', 'weather', 'sense', 'somewhere'] },
        hand_eye_coordination: { id: 'hand_eye_coordination', name: 'Hand/Eye Coordination', attribute: 'MOTORICS', color: '#F0E68C', signature: 'HAND/EYE COORDINATION', personality: 'You are HAND/EYE COORDINATION, the voice of precision.', triggerConditions: ['aim', 'shoot', 'precise', 'careful', 'delicate', 'craft', 'tool', 'steady', 'accuracy', 'dexterity'] },
        perception: { id: 'perception', name: 'Perception', attribute: 'MOTORICS', color: '#FFFF00', signature: 'PERCEPTION', personality: 'You are PERCEPTION, the observant eye. You notice everything.', triggerConditions: ['notice', 'see', 'hear', 'smell', 'detail', 'hidden', 'clue', 'observe', 'look', 'watch', 'spot'] },
        reaction_speed: { id: 'reaction_speed', name: 'Reaction Speed', attribute: 'MOTORICS', color: '#FFD700', signature: 'REACTION SPEED', personality: 'You are REACTION SPEED, the voice of quick reflexes.', triggerConditions: ['quick', 'fast', 'react', 'dodge', 'catch', 'sudden', 'instant', 'reflex', 'now', 'hurry', 'immediate'] },
        savoir_faire: { id: 'savoir_faire', name: 'Savoir Faire', attribute: 'MOTORICS', color: '#FFA500', signature: 'SAVOIR FAIRE', personality: 'You are SAVOIR FAIRE, the voice of cool. You do things with style.', triggerConditions: ['style', 'cool', 'grace', 'acrobatic', 'jump', 'climb', 'flip', 'smooth', 'impressive', 'flair'] },
        interfacing: { id: 'interfacing', name: 'Interfacing', attribute: 'MOTORICS', color: '#FAFAD2', signature: 'INTERFACING', personality: 'You are INTERFACING, the voice of mechanical intuition.', triggerConditions: ['machine', 'lock', 'electronic', 'system', 'mechanism', 'fix', 'repair', 'hack', 'technical', 'device', 'computer'] },
        composure: { id: 'composure', name: 'Composure', attribute: 'MOTORICS', color: '#F5DEB3', signature: 'COMPOSURE', personality: 'You are COMPOSURE, the poker face. You read body language.', triggerConditions: ['calm', 'cool', 'control', 'tell', 'nervous', 'poker face', 'body language', 'dignity', 'facade', 'professional'] }
    };

    const DIFFICULTIES = {
        trivial: { threshold: 6, name: 'Trivial', color: '#90EE90' },
        easy: { threshold: 8, name: 'Easy', color: '#98FB98' },
        medium: { threshold: 10, name: 'Medium', color: '#F0E68C' },
        challenging: { threshold: 12, name: 'Challenging', color: '#FFA500' },
        heroic: { threshold: 14, name: 'Heroic', color: '#FF6347' },
        legendary: { threshold: 16, name: 'Legendary', color: '#FF4500' },
        impossible: { threshold: 18, name: 'Impossible', color: '#DC143C' }
    };

    const ANCIENT_VOICES = {
        ancient_reptilian_brain: {
            id: 'ancient_reptilian_brain', name: 'Ancient Reptilian Brain', color: '#2F4F4F', signature: 'ANCIENT REPTILIAN BRAIN', attribute: 'PRIMAL',
            personality: 'You are the ANCIENT REPTILIAN BRAIN from the Abyssopelagic Zone. You speak in POETIC NIHILISM. You see beauty and then dismiss it. "WHO FUCKING CARES?!"',
            triggerStates: ['dying', 'starving', 'terrified', 'aroused'],
            triggerConditions: ['survive', 'hunger', 'predator', 'prey', 'instinct', 'primal', 'ancient', 'drowning', 'sinking', 'deep', 'memory', 'past', 'forget']
        },
        limbic_system: {
            id: 'limbic_system', name: 'Limbic System', color: '#FF4500', signature: 'LIMBIC SYSTEM', attribute: 'PRIMAL',
            personality: 'You are the LIMBIC SYSTEM - pure emotion. You KNOW what they are really afraid of. You SCREAM warnings.',
            triggerStates: ['enraged', 'grieving', 'manic'],
            triggerConditions: ['overwhelmed', 'breakdown', 'sobbing', 'screaming', 'euphoria', 'despair', 'emotion', 'memory', 'afraid', 'scared', 'hurt']
        }
    };

    const STATUS_EFFECTS = {
        intoxicated: { id: 'intoxicated', name: 'Intoxicated', icon: '🍺', category: 'physical', boosts: ['electrochemistry', 'inland_empire', 'drama', 'suggestion'], debuffs: ['logic', 'hand_eye_coordination', 'reaction_speed', 'composure'], difficultyMod: 2, keywords: ['drunk', 'intoxicated', 'wasted', 'high', 'tipsy'], ancientVoice: null },
        wounded: { id: 'wounded', name: 'Wounded', icon: '🩸', category: 'physical', boosts: ['pain_threshold', 'endurance', 'half_light'], debuffs: ['composure', 'savoir_faire', 'hand_eye_coordination'], difficultyMod: 2, keywords: ['hurt', 'wounded', 'injured', 'bleeding', 'pain'], ancientVoice: null },
        exhausted: { id: 'exhausted', name: 'Exhausted', icon: '😴', category: 'physical', boosts: ['volition', 'inland_empire'], debuffs: ['reaction_speed', 'perception', 'logic'], difficultyMod: 2, keywords: ['tired', 'exhausted', 'sleepy', 'drowsy', 'fatigued'], ancientVoice: null },
        starving: { id: 'starving', name: 'Starving', icon: '🍽️', category: 'physical', boosts: ['electrochemistry', 'perception'], debuffs: ['logic', 'composure', 'volition'], difficultyMod: 1, keywords: ['hungry', 'starving', 'famished'], ancientVoice: 'ancient_reptilian_brain' },
        dying: { id: 'dying', name: 'Dying', icon: '💀', category: 'physical', boosts: ['pain_threshold', 'inland_empire', 'shivers'], debuffs: ['logic', 'rhetoric', 'authority'], difficultyMod: 4, keywords: ['dying', 'death', 'fading'], ancientVoice: 'ancient_reptilian_brain' },
        paranoid: { id: 'paranoid', name: 'Paranoid', icon: '👁️', category: 'mental', boosts: ['half_light', 'perception', 'shivers'], debuffs: ['empathy', 'suggestion', 'composure'], difficultyMod: 1, keywords: ['paranoid', 'suspicious', 'watching', 'followed'], ancientVoice: null },
        aroused: { id: 'aroused', name: 'Aroused', icon: '💋', category: 'mental', boosts: ['electrochemistry', 'suggestion', 'empathy', 'drama'], debuffs: ['logic', 'volition', 'composure'], difficultyMod: 2, keywords: ['aroused', 'desire', 'attraction', 'lust'], ancientVoice: 'ancient_reptilian_brain' },
        enraged: { id: 'enraged', name: 'Enraged', icon: '😤', category: 'mental', boosts: ['authority', 'physical_instrument', 'half_light'], debuffs: ['empathy', 'composure', 'logic'], difficultyMod: 2, keywords: ['angry', 'furious', 'rage', 'mad'], ancientVoice: 'limbic_system' },
        terrified: { id: 'terrified', name: 'Terrified', icon: '😨', category: 'mental', boosts: ['half_light', 'shivers', 'reaction_speed', 'perception'], debuffs: ['authority', 'composure', 'rhetoric'], difficultyMod: 2, keywords: ['scared', 'afraid', 'terrified', 'fear'], ancientVoice: 'ancient_reptilian_brain' },
        confident: { id: 'confident', name: 'Confident', icon: '😎', category: 'mental', boosts: ['authority', 'savoir_faire', 'rhetoric', 'suggestion'], debuffs: ['inland_empire', 'empathy'], difficultyMod: -1, keywords: ['confident', 'bold', 'assured', 'swagger'], ancientVoice: null },
        grieving: { id: 'grieving', name: 'Grieving', icon: '😢', category: 'mental', boosts: ['empathy', 'inland_empire', 'shivers', 'volition'], debuffs: ['authority', 'electrochemistry', 'savoir_faire'], difficultyMod: 2, keywords: ['grief', 'loss', 'mourning', 'tears'], ancientVoice: 'limbic_system' },
        manic: { id: 'manic', name: 'Manic', icon: '⚡', category: 'mental', boosts: ['electrochemistry', 'reaction_speed', 'conceptualization', 'inland_empire'], debuffs: ['composure', 'logic', 'volition'], difficultyMod: 1, keywords: ['manic', 'hyper', 'racing', 'unstoppable'], ancientVoice: 'limbic_system' },
        dissociated: { id: 'dissociated', name: 'Dissociated', icon: '🌫️', category: 'mental', boosts: ['inland_empire', 'shivers', 'pain_threshold'], debuffs: ['perception', 'reaction_speed', 'empathy'], difficultyMod: 2, keywords: ['dissociate', 'unreal', 'floating', 'numb'], ancientVoice: null }
    };

    let activeStatuses = new Set();

    const DEFAULT_SETTINGS = {
        enabled: true, showDiceRolls: true, showFailedChecks: true,
        voicesPerMessage: { min: 1, max: 4 },
        apiEndpoint: '', apiKey: '', model: 'glm-4-plus', maxTokens: 300, temperature: 0.9,
        povStyle: 'second', characterName: '', characterPronouns: 'they', characterContext: '',
        autoDetectStatus: true, autoTrigger: true, triggerDelay: 1000,
        fabPositionTop: 140, fabPositionLeft: 10
    };

    const DEFAULT_ATTRIBUTE_POINTS = { INTELLECT: 3, PSYCHE: 3, PHYSIQUE: 3, MOTORICS: 3 };

    let extensionSettings = { ...DEFAULT_SETTINGS };
    let currentBuild = null;
    let savedProfiles = {};

    function createBuild(attributePoints = DEFAULT_ATTRIBUTE_POINTS, name = 'Custom Build') {
        const skillLevels = {}, skillCaps = {};
        for (const [attrId, attr] of Object.entries(ATTRIBUTES)) {
            const attrPoints = attributePoints[attrId] || 1;
            for (const skillId of attr.skills) {
                skillLevels[skillId] = attrPoints;
                skillCaps[skillId] = { starting: attrPoints + 1, learning: attrPoints + 4 };
            }
        }
        return { id: `build_${Date.now()}`, name, attributePoints: { ...attributePoints }, skillLevels, skillCaps, createdAt: Date.now() };
    }

    function initializeDefaultBuild() { currentBuild = createBuild(DEFAULT_ATTRIBUTE_POINTS, 'Balanced Detective'); }
    function getSkillLevel(skillId) { if (!currentBuild) initializeDefaultBuild(); return currentBuild.skillLevels[skillId] || 1; }
    function getAllSkillLevels() { if (!currentBuild) initializeDefaultBuild(); return { ...currentBuild.skillLevels }; }
    function getAttributePoints() { if (!currentBuild) initializeDefaultBuild(); return { ...currentBuild.attributePoints }; }

    function applyAttributeAllocation(attributePoints) {
        const total = Object.values(attributePoints).reduce((a, b) => a + b, 0);
        if (total !== 12) throw new Error(`Invalid attribute total: ${total}`);
        currentBuild = createBuild(attributePoints, currentBuild?.name || 'Custom Build');
    }

    function createProfile(name) {
        return {
            id: `profile_${Date.now()}`, name, createdAt: Date.now(),
            build: currentBuild ? { ...currentBuild } : createBuild(),
            povStyle: extensionSettings.povStyle, characterName: extensionSettings.characterName,
            characterPronouns: extensionSettings.characterPronouns, characterContext: extensionSettings.characterContext,
            activeStatuses: Array.from(activeStatuses)
        };
    }

    function saveProfile(name) { const profile = createProfile(name); savedProfiles[profile.id] = profile; saveState(getSTContext()); return profile; }
    
    function loadProfile(profileId) {
        const profile = savedProfiles[profileId];
        if (!profile) return false;
        if (profile.build) currentBuild = { ...profile.build };
        extensionSettings.povStyle = profile.povStyle || 'second';
        extensionSettings.characterName = profile.characterName || '';
        extensionSettings.characterPronouns = profile.characterPronouns || 'they';
        extensionSettings.characterContext = profile.characterContext || '';
        activeStatuses = new Set(profile.activeStatuses || []);
        saveState(getSTContext());
        return true;
    }

    function deleteProfile(profileId) { if (savedProfiles[profileId]) { delete savedProfiles[profileId]; saveState(getSTContext()); return true; } return false; }

    function toggleStatus(statusId) {
        if (activeStatuses.has(statusId)) activeStatuses.delete(statusId);
        else activeStatuses.add(statusId);
        saveState(getSTContext());
        renderStatusDisplay();
    }

    function getSkillModifier(skillId) {
        let modifier = 0;
        for (const statusId of activeStatuses) {
            const status = STATUS_EFFECTS[statusId];
            if (!status) continue;
            if (status.boosts.includes(skillId)) modifier += 1;
            if (status.debuffs.includes(skillId)) modifier -= 1;
        }
        return modifier;
    }

    function getEffectiveSkillLevel(skillId) {
        return Math.max(1, Math.min(10, getSkillLevel(skillId) + getSkillModifier(skillId)));
    }

    function getActiveAncientVoices() {
        const ancientVoices = new Set();
        for (const statusId of activeStatuses) {
            const status = STATUS_EFFECTS[statusId];
            if (status && status.ancientVoice) ancientVoices.add(status.ancientVoice);
        }
        return ancientVoices;
    }

    function detectStatusesFromText(text) {
        const detected = [], lowerText = text.toLowerCase();
        for (const [statusId, status] of Object.entries(STATUS_EFFECTS)) {
            for (const keyword of status.keywords) {
                if (lowerText.includes(keyword)) { detected.push(statusId); break; }
            }
        }
        return [...new Set(detected)];
    }

    function rollD6() { return Math.floor(Math.random() * 6) + 1; }

    function rollSkillCheck(skillLevel, difficulty) {
        const die1 = rollD6(), die2 = rollD6();
        const diceTotal = die1 + die2, total = diceTotal + skillLevel;
        let threshold, difficultyName;
        if (typeof difficulty === 'string') {
            const diff = DIFFICULTIES[difficulty.toLowerCase()];
            threshold = diff ? diff.threshold : 10;
            difficultyName = diff ? diff.name : 'Medium';
        } else {
            threshold = difficulty;
            difficultyName = getDifficultyNameForThreshold(difficulty);
        }
        const isSnakeEyes = die1 === 1 && die2 === 1, isBoxcars = die1 === 6 && die2 === 6;
        let success = isSnakeEyes ? false : isBoxcars ? true : total >= threshold;
        return { dice: [die1, die2], diceTotal, skillLevel, total, threshold, difficultyName, success, isSnakeEyes, isBoxcars };
    }

    function getDifficultyNameForThreshold(threshold) {
        if (threshold <= 6) return 'Trivial'; if (threshold <= 8) return 'Easy'; if (threshold <= 10) return 'Medium';
        if (threshold <= 12) return 'Challenging'; if (threshold <= 14) return 'Heroic'; if (threshold <= 16) return 'Legendary';
        return 'Impossible';
    }

    function saveState(context) {
        const state = { settings: extensionSettings, currentBuild, activeStatuses: Array.from(activeStatuses), savedProfiles };
        try {
            if (context?.extensionSettings) { context.extensionSettings.inland_empire = state; context.saveSettingsDebounced?.(); }
            localStorage.setItem('inland_empire_state', JSON.stringify(state));
        } catch (e) { console.error('[Inland Empire] Failed to save state:', e); }
    }

    function loadState(context) {
        try {
            let state = context?.extensionSettings?.inland_empire || JSON.parse(localStorage.getItem('inland_empire_state') || 'null');
            if (state) {
                extensionSettings = { ...DEFAULT_SETTINGS, ...state.settings };
                currentBuild = state.currentBuild || createBuild();
                activeStatuses = new Set(state.activeStatuses || []);
                savedProfiles = state.savedProfiles || {};
            } else { initializeDefaultBuild(); }
        } catch (e) { console.error('[Inland Empire] Failed to load state:', e); initializeDefaultBuild(); }
    }

    function analyzeContext(message) {
        const emotionalIndicators = [/!{2,}/, /\?{2,}/, /scream|shout|cry|sob|laugh/i, /furious|terrified|ecstatic/i];
        const dangerIndicators = [/blood|wound|injury|hurt|pain/i, /gun|knife|weapon|attack|fight/i, /danger|threat|kill|die|death/i];
        const socialIndicators = [/lie|lying|truth|honest|trust/i, /convince|persuade|manipulate/i, /feel|emotion|sad|happy|angry/i];
        const mysteryIndicators = [/clue|evidence|investigate|discover/i, /secret|hidden|mystery|strange/i];
        const physicalIndicators = [/room|building|street|place/i, /cold|hot|wind|rain/i, /machine|device|lock/i];
        return {
            message,
            emotionalIntensity: emotionalIndicators.filter(r => r.test(message)).length / emotionalIndicators.length,
            dangerLevel: dangerIndicators.filter(r => r.test(message)).length / dangerIndicators.length,
            socialComplexity: socialIndicators.filter(r => r.test(message)).length / socialIndicators.length,
            mysteryLevel: mysteryIndicators.filter(r => r.test(message)).length / mysteryIndicators.length,
            physicalPresence: physicalIndicators.filter(r => r.test(message)).length / physicalIndicators.length
        };
    }

    function calculateSkillRelevance(skillId, context) {
        const skill = SKILLS[skillId];
        if (!skill) return { skillId, score: 0, reasons: [] };
        const statusModifier = getSkillModifier(skillId);
        let score = 0;
        const keywordMatches = skill.triggerConditions.filter(kw => context.message.toLowerCase().includes(kw.toLowerCase()));
        if (keywordMatches.length > 0) score += Math.min(keywordMatches.length * 0.2, 0.6);
        const attr = skill.attribute;
        if (attr === 'PSYCHE') score += context.emotionalIntensity * 0.4;
        if (attr === 'PHYSIQUE') score += context.dangerLevel * 0.5;
        if (attr === 'INTELLECT') score += context.mysteryLevel * 0.4;
        if (attr === 'MOTORICS') score += context.physicalPresence * 0.3;
        if (statusModifier > 0) score += statusModifier * 0.25;
        score += getEffectiveSkillLevel(skillId) * 0.05;
        score += (Math.random() - 0.5) * 0.2;
        return { skillId, skillName: skill.name, score: Math.max(0, Math.min(1, score)), skillLevel: getSkillLevel(skillId), attribute: attr };
    }

    function selectSpeakingSkills(context, options = {}) {
        const { minVoices = 1, maxVoices = 4 } = options;
        const ancientVoicesToSpeak = [];
        for (const ancientId of getActiveAncientVoices()) {
            const ancient = ANCIENT_VOICES[ancientId];
            if (ancient) {
                const keywordMatch = ancient.triggerConditions.some(kw => context.message.toLowerCase().includes(kw.toLowerCase()));
                if (Math.random() < (keywordMatch ? 0.8 : 0.4)) {
                    ancientVoicesToSpeak.push({ skillId: ancient.id, skillName: ancient.name, score: 1.0, skillLevel: 6, attribute: 'PRIMAL', isAncient: true });
                }
            }
        }
        const allRelevance = Object.keys(SKILLS).map(id => calculateSkillRelevance(id, context)).filter(r => r.score >= 0.3).sort((a, b) => b.score - a.score);
        const intensity = Math.max(context.emotionalIntensity, context.dangerLevel, context.socialComplexity);
        const targetVoices = Math.round(minVoices + (maxVoices - minVoices) * intensity);
        const selected = [...ancientVoicesToSpeak];
        for (const relevance of allRelevance) {
            if (selected.length >= targetVoices + ancientVoicesToSpeak.length) break;
            if (Math.random() < relevance.score * 0.8 + 0.2) selected.push(relevance);
        }
        while (selected.filter(s => !s.isAncient).length < minVoices && allRelevance.length > 0) {
            const next = allRelevance.find(r => !selected.find(s => s.skillId === r.skillId));
            if (next) selected.push(next); else break;
        }
        return selected;
    }

    function determineCheckDifficulty(selectedSkill, context) {
        const baseThreshold = 10;
        const relevanceModifier = -Math.floor(selectedSkill.score * 4);
        const intensityModifier = Math.floor(Math.max(context.emotionalIntensity, context.dangerLevel) * 4);
        const threshold = Math.max(6, Math.min(18, baseThreshold + relevanceModifier + intensityModifier));
        return { shouldCheck: selectedSkill.score <= 0.8 || Math.random() > 0.3, difficulty: getDifficultyNameForThreshold(threshold).toLowerCase(), threshold };
    }

    async function generateVoices(selectedSkills, context) {
        const voiceData = selectedSkills.map(selected => {
            let checkResult = null;
            if (!selected.isAncient) {
                const checkDecision = determineCheckDifficulty(selected, context);
                if (checkDecision.shouldCheck) checkResult = rollSkillCheck(getEffectiveSkillLevel(selected.skillId), checkDecision.difficulty);
            }
            const skill = selected.isAncient ? ANCIENT_VOICES[selected.skillId] : SKILLS[selected.skillId];
            return { ...selected, skill, checkResult, effectiveLevel: selected.isAncient ? 6 : getEffectiveSkillLevel(selected.skillId) };
        });
        const chorusPrompt = buildChorusPrompt(voiceData, context);
        try {
            const response = await callAPI(chorusPrompt.system, chorusPrompt.user);
            return parseChorusResponse(response, voiceData);
        } catch (error) {
            console.error('[Inland Empire] Chorus generation failed:', error);
            return voiceData.map(v => ({ skillId: v.skillId, skillName: v.skill.name, signature: v.skill.signature, color: v.skill.color, content: '*static*', checkResult: v.checkResult, isAncient: v.isAncient, success: false }));
        }
    }

    function buildChorusPrompt(voiceData, context) {
        const povStyle = extensionSettings.povStyle || 'second';
        const charName = extensionSettings.characterName || '';
        const pronouns = extensionSettings.characterPronouns || 'they';
        const characterContext = extensionSettings.characterContext || '';
        let povInstruction = povStyle === 'third' ? `Write in THIRD PERSON about ${charName || 'the character'}. Use "${charName || pronouns}" - NEVER "you".` :
                            povStyle === 'first' ? `Write in FIRST PERSON. Use "I/me/my" - NEVER "you".` :
                            `Write in SECOND PERSON. Address the character as "you".`;
        let contextSection = characterContext.trim() ? `\nCHARACTER CONTEXT:\n${characterContext}\n` : '';
        let statusContext = activeStatuses.size > 0 ? `\nCurrent state: ${[...activeStatuses].map(id => STATUS_EFFECTS[id]?.name).filter(Boolean).join(', ')}.` : '';
        const voiceDescriptions = voiceData.map(v => {
            let checkInfo = v.checkResult ? (v.checkResult.isBoxcars ? ' [CRITICAL SUCCESS]' : v.checkResult.isSnakeEyes ? ' [CRITICAL FAILURE]' : v.checkResult.success ? ' [Success]' : ' [Failed]') : v.isAncient ? ' [PRIMAL]' : ' [Passive]';
            return `${v.skill.signature}${checkInfo}: ${v.skill.personality}`;
        }).join('\n\n');
        const systemPrompt = `You generate internal mental voices for a roleplayer, inspired by Disco Elysium.

THE VOICES SPEAKING:
${voiceDescriptions}

RULES:
1. ${povInstruction}
2. Voices REACT to each other - argue, agree, interrupt
3. Format EXACTLY as: SKILL_NAME - dialogue
4. Keep each line 1-2 sentences
5. Failed checks = uncertain/wrong. Critical success = profound. Critical failure = hilariously wrong
6. Ancient/Primal voices speak in fragments
7. Total: 4-12 voice lines
${contextSection}${statusContext}

Output ONLY voice dialogue. No narration.`;
        return { system: systemPrompt, user: `Scene: "${context.message.substring(0, 800)}"\n\nGenerate the internal chorus.` };
    }

    function parseChorusResponse(response, voiceData) {
        const lines = response.trim().split('\n').filter(line => line.trim());
        const results = [];
        const skillMap = {};
        voiceData.forEach(v => { skillMap[v.skill.signature.toUpperCase()] = v; skillMap[v.skill.name.toUpperCase()] = v; });
        for (const line of lines) {
            const match = line.match(/^([A-Z][A-Z\s\/]+)\s*[-:–—]\s*(.+)$/i);
            if (match) {
                const voiceInfo = skillMap[match[1].trim().toUpperCase()];
                if (voiceInfo) results.push({ skillId: voiceInfo.skillId, skillName: voiceInfo.skill.name, signature: voiceInfo.skill.signature, color: voiceInfo.skill.color, content: match[2].trim(), checkResult: voiceInfo.checkResult, isAncient: voiceInfo.isAncient, success: true });
            }
        }
        if (results.length === 0 && voiceData.length > 0 && response.trim()) {
            const v = voiceData[0];
            results.push({ skillId: v.skillId, skillName: v.skill.name, signature: v.skill.signature, color: v.skill.color, content: response.trim().substring(0, 200), checkResult: v.checkResult, isAncient: v.isAncient, success: true });
        }
        return results;
    }

    async function callAPI(systemPrompt, userPrompt) {
        let { apiEndpoint, apiKey, model, maxTokens, temperature } = extensionSettings;
        if (!apiEndpoint || !apiKey) throw new Error('API not configured');
        if (!apiEndpoint.includes('/chat/completions')) apiEndpoint = apiEndpoint.replace(/\/+$/, '') + '/chat/completions';
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({ model: model || 'glm-4-plus', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], max_tokens: maxTokens || 300, temperature: temperature || 0.9 })
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data.choices?.[0]?.message?.content || data.choices?.[0]?.text || data.content || '';
    }

    function createToastContainer() {
        let container = document.getElementById('ie-toast-container');
        if (!container) { container = document.createElement('div'); container.id = 'ie-toast-container'; container.className = 'ie-toast-container'; document.body.appendChild(container); }
        return container;
    }

    function showToast(message, type = 'info', duration = 3000) {
        const container = createToastContainer();
        const toast = document.createElement('div');
        toast.className = `ie-toast ie-toast-${type}`;
        const icon = type === 'loading' ? 'fa-spinner fa-spin' : type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-brain';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('ie-toast-show'));
        if (type !== 'loading') setTimeout(() => { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }, duration);
        return toast;
    }

    function hideToast(toast) { if (toast?.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }

    function togglePanel() {
        const panel = document.getElementById('inland-empire-panel');
        const fab = document.getElementById('inland-empire-fab');
        if (!panel) return;
        const isOpen = panel.classList.contains('ie-panel-open');
        if (isOpen) { panel.classList.remove('ie-panel-open'); fab?.classList.remove('ie-fab-active'); }
        else { panel.classList.add('ie-panel-open'); fab?.classList.add('ie-fab-active'); }
    }

    function switchTab(tabName) {
        document.querySelectorAll('.ie-tab').forEach(tab => tab.classList.toggle('ie-tab-active', tab.dataset.tab === tabName));
        document.querySelectorAll('.ie-tab-content').forEach(content => content.classList.toggle('ie-tab-content-active', content.dataset.tabContent === tabName));
        if (tabName === 'profiles') { populateBuildEditor(); renderProfilesList(); }
        if (tabName === 'settings') populateSettings();
        if (tabName === 'status') renderStatusDisplay();
    }

    function renderProfilesList() {
        const container = document.getElementById('ie-profiles-list');
        if (!container) return;
        const profiles = Object.values(savedProfiles);
        if (profiles.length === 0) { container.innerHTML = '<div class="ie-empty-state"><i class="fa-solid fa-user-slash"></i><span>No saved profiles</span></div>'; return; }
        container.innerHTML = profiles.map(profile => `
            <div class="ie-profile-card" data-profile-id="${profile.id}">
                <div class="ie-profile-info"><span class="ie-profile-name">${profile.name}</span><span class="ie-profile-details">${profile.characterName || 'No character'}</span></div>
                <div class="ie-profile-actions">
                    <button class="ie-btn-icon ie-btn-load" data-action="load" title="Load"><i class="fa-solid fa-download"></i></button>
                    <button class="ie-btn-icon ie-btn-remove" data-action="delete" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `).join('');
        container.querySelectorAll('.ie-profile-card').forEach(card => {
            const profileId = card.dataset.profileId;
            card.querySelector('[data-action="load"]')?.addEventListener('click', () => { if (loadProfile(profileId)) { showToast(`Loaded: ${savedProfiles[profileId].name}`, 'success', 2000); renderAttributesDisplay(); populateSettings(); populateBuildEditor(); renderStatusDisplay(); } });
            card.querySelector('[data-action="delete"]')?.addEventListener('click', () => { if (confirm(`Delete "${savedProfiles[profileId].name}"?`)) { deleteProfile(profileId); renderProfilesList(); showToast('Profile deleted', 'info', 2000); } });
        });
    }

    function populateBuildEditor() {
        const container = document.getElementById('ie-attributes-editor');
        if (!container) return;
        const attrPoints = getAttributePoints();
        container.innerHTML = Object.entries(ATTRIBUTES).map(([id, attr]) => `
            <div class="ie-attribute-row" data-attribute="${id}">
                <div class="ie-attribute-label" style="color: ${attr.color}"><span class="ie-attr-name">${attr.name}</span><span class="ie-attr-value" id="ie-build-${id}-value">${attrPoints[id] || 3}</span></div>
                <input type="range" class="ie-attribute-slider" id="ie-build-${id}" min="1" max="6" value="${attrPoints[id] || 3}" data-attribute="${id}" />
            </div>
        `).join('');
        container.querySelectorAll('.ie-attribute-slider').forEach(slider => slider.addEventListener('input', updateBuildFromSliders));
        updatePointsDisplay();
    }

    function updateBuildFromSliders() {
        let total = 0;
        document.querySelectorAll('#ie-attributes-editor .ie-attribute-slider').forEach(slider => {
            const attr = slider.dataset.attribute, val = parseInt(slider.value);
            total += val;
            const display = document.getElementById(`ie-build-${attr}-value`);
            if (display) display.textContent = val;
        });
        updatePointsDisplay(total);
    }

    function updatePointsDisplay(total) {
        if (total === undefined) { total = 0; document.querySelectorAll('#ie-attributes-editor .ie-attribute-slider').forEach(s => total += parseInt(s.value)); }
        const display = document.getElementById('ie-points-remaining');
        if (display) { display.textContent = total; display.style.color = total > 12 ? '#FF6347' : total < 12 ? '#90EE90' : '#9d8df1'; }
    }

    function populateSettings() {
        const s = extensionSettings;
        document.getElementById('ie-api-endpoint')?.setAttribute('value', s.apiEndpoint || '');
        document.getElementById('ie-api-key')?.setAttribute('value', s.apiKey || '');
        document.getElementById('ie-model')?.setAttribute('value', s.model || 'glm-4-plus');
        document.getElementById('ie-temperature')?.setAttribute('value', s.temperature || 0.9);
        document.getElementById('ie-max-tokens')?.setAttribute('value', s.maxTokens || 300);
        document.getElementById('ie-min-voices')?.setAttribute('value', s.minVoices || s.voicesPerMessage?.min || 1);
        document.getElementById('ie-max-voices')?.setAttribute('value', s.maxVoices || s.voicesPerMessage?.max || 4);
        document.getElementById('ie-trigger-delay')?.setAttribute('value', s.triggerDelay ?? 1000);
        const showDice = document.getElementById('ie-show-dice-rolls'); if (showDice) showDice.checked = s.showDiceRolls !== false;
        const showFailed = document.getElementById('ie-show-failed-checks'); if (showFailed) showFailed.checked = s.showFailedChecks !== false;
        const autoTrigger = document.getElementById('ie-auto-trigger'); if (autoTrigger) autoTrigger.checked = s.autoTrigger !== false;
        const autoDetect = document.getElementById('ie-auto-detect-status'); if (autoDetect) autoDetect.checked = s.autoDetectStatus !== false;
        const povStyle = document.getElementById('ie-pov-style'); if (povStyle) povStyle.value = s.povStyle || 'second';
        document.getElementById('ie-character-name')?.setAttribute('value', s.characterName || '');
        const charPronouns = document.getElementById('ie-character-pronouns'); if (charPronouns) charPronouns.value = s.characterPronouns || 'they';
        const charContext = document.getElementById('ie-character-context'); if (charContext) charContext.value = s.characterContext || '';
        updateThirdPersonVisibility();
    }

    function updateThirdPersonVisibility() {
        const povStyle = document.getElementById('ie-pov-style')?.value;
        document.querySelectorAll('.ie-third-person-options').forEach(el => el.style.display = povStyle === 'third' ? 'block' : 'none');
    }

    function saveSettings() {
        extensionSettings.apiEndpoint = document.getElementById('ie-api-endpoint')?.value || '';
        extensionSettings.apiKey = document.getElementById('ie-api-key')?.value || '';
        extensionSettings.model = document.getElementById('ie-model')?.value || 'glm-4-plus';
        extensionSettings.temperature = parseFloat(document.getElementById('ie-temperature')?.value) || 0.9;
        extensionSettings.maxTokens = parseInt(document.getElementById('ie-max-tokens')?.value) || 300;
        extensionSettings.minVoices = parseInt(document.getElementById('ie-min-voices')?.value) || 1;
        extensionSettings.maxVoices = parseInt(document.getElementById('ie-max-voices')?.value) || 4;
        extensionSettings.triggerDelay = parseInt(document.getElementById('ie-trigger-delay')?.value) ?? 1000;
        extensionSettings.showDiceRolls = document.getElementById('ie-show-dice-rolls')?.checked !== false;
        extensionSettings.showFailedChecks = document.getElementById('ie-show-failed-checks')?.checked !== false;
        extensionSettings.autoTrigger = document.getElementById('ie-auto-trigger')?.checked !== false;
        extensionSettings.autoDetectStatus = document.getElementById('ie-auto-detect-status')?.checked !== false;
        extensionSettings.povStyle = document.getElementById('ie-pov-style')?.value || 'second';
        extensionSettings.characterName = document.getElementById('ie-character-name')?.value || '';
        extensionSettings.characterPronouns = document.getElementById('ie-character-pronouns')?.value || 'they';
        extensionSettings.characterContext = document.getElementById('ie-character-context')?.value || '';
        saveState(getSTContext());
        const btn = document.querySelector('.ie-btn-save-settings');
        if (btn) { const orig = btn.innerHTML; btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!'; setTimeout(() => btn.innerHTML = orig, 1500); }
    }

    function applyBuild() {
        const attributePoints = {};
        document.querySelectorAll('#ie-attributes-editor .ie-attribute-slider').forEach(slider => attributePoints[slider.dataset.attribute] = parseInt(slider.value));
        const total = Object.values(attributePoints).reduce((a, b) => a + b, 0);
        if (total !== 12) { showToast(`Points must equal 12 (currently ${total})`, 'error', 3000); return; }
        applyAttributeAllocation(attributePoints);
        saveState(getSTContext());
        renderAttributesDisplay();
        showToast('Build applied!', 'success', 2000);
        setTimeout(() => switchTab('skills'), 1000);
    }

    function renderAttributesDisplay() {
        const container = document.getElementById('ie-attributes-display');
        if (!container) return;
        const attrPoints = getAttributePoints(), skillLevels = getAllSkillLevels();
        container.innerHTML = Object.entries(ATTRIBUTES).map(([id, attr]) => `
            <div class="ie-attribute-block" style="border-color: ${attr.color}">
                <div class="ie-attr-header" style="background: ${attr.color}20"><span class="ie-attr-name">${attr.name}</span><span class="ie-attr-points">${attrPoints[id]}</span></div>
                <div class="ie-attr-skills">${attr.skills.map(skillId => {
                    const skill = SKILLS[skillId], level = skillLevels[skillId];
                    return `<div class="ie-skill-row" title="${skill.name}: ${level}"><span class="ie-skill-abbrev" style="color: ${skill.color}">${skill.signature.substring(0, 3)}</span><div class="ie-skill-bar"><div class="ie-skill-fill" style="width: ${level * 10}%; background: ${skill.color}"></div></div><span class="ie-skill-level">${level}</span></div>`;
                }).join('')}</div>
            </div>
        `).join('');
    }

    function renderStatusDisplay() {
        const container = document.getElementById('ie-status-grid');
        if (!container) return;
        const physical = Object.values(STATUS_EFFECTS).filter(s => s.category === 'physical');
        const mental = Object.values(STATUS_EFFECTS).filter(s => s.category === 'mental');
        container.innerHTML = `
            <div class="ie-status-category"><div class="ie-status-category-label">Physical</div><div class="ie-status-buttons">
                ${physical.map(status => `<button class="ie-status-btn ${activeStatuses.has(status.id) ? 'ie-status-active' : ''}" data-status="${status.id}" title="${status.name}"><span class="ie-status-icon">${status.icon}</span><span class="ie-status-name">${status.name}</span></button>`).join('')}
            </div></div>
            <div class="ie-status-category"><div class="ie-status-category-label">Mental</div><div class="ie-status-buttons">
                ${mental.map(status => `<button class="ie-status-btn ${activeStatuses.has(status.id) ? 'ie-status-active' : ''}" data-status="${status.id}" title="${status.name}"><span class="ie-status-icon">${status.icon}</span><span class="ie-status-name">${status.name}</span></button>`).join('')}
            </div></div>`;
        container.querySelectorAll('.ie-status-btn').forEach(btn => btn.addEventListener('click', () => toggleStatus(btn.dataset.status)));
        updateActiveEffectsSummary();
    }

    function updateActiveEffectsSummary() {
        const summary = document.getElementById('ie-active-effects-summary');
        if (!summary) return;
        if (activeStatuses.size === 0) { summary.innerHTML = '<em>No active status effects</em>'; return; }
        const effects = [...activeStatuses].map(id => STATUS_EFFECTS[id]).filter(Boolean).map(s => `${s.icon} ${s.name}`);
        const ancientVoices = getActiveAncientVoices();
        if (ancientVoices.size > 0) effects.push(`<span class="ie-ancient-warning">⚠️ ${[...ancientVoices].map(id => ANCIENT_VOICES[id]?.name).filter(Boolean).join(', ')} may speak</span>`);
        summary.innerHTML = effects.join(' • ');
    }

    function displayVoices(voices) {
        const container = document.getElementById('ie-voices-output');
        if (!container) return;
        if (voices.length === 0) { container.innerHTML = '<div class="ie-voices-empty"><i class="fa-solid fa-comment-slash"></i><span>*silence*</span></div>'; return; }
        const voicesHtml = voices.map(voice => {
            let checkHtml = '';
            if (extensionSettings.showDiceRolls && voice.checkResult) {
                const checkClass = voice.checkResult.success ? 'success' : 'failure';
                const critClass = voice.checkResult.isBoxcars ? 'critical-success' : voice.checkResult.isSnakeEyes ? 'critical-failure' : '';
                checkHtml = `<span class="ie-voice-check ${checkClass} ${critClass}">[${voice.checkResult.difficultyName}: ${voice.checkResult.success ? '✓' : '✗'}]</span>`;
            }
            return `<div class="ie-voice-entry" data-skill="${voice.skillId}"><span class="ie-voice-signature" style="color: ${voice.color}">${voice.signature}</span>${checkHtml}<span class="ie-voice-content"> - ${voice.content}</span></div>`;
        }).join('');
        const newContent = document.createElement('div');
        newContent.className = 'ie-voices-batch';
        newContent.innerHTML = voicesHtml;
        const emptyState = container.querySelector('.ie-voices-empty');
        if (emptyState) emptyState.remove();
        container.insertBefore(newContent, container.firstChild);
        const batches = container.querySelectorAll('.ie-voices-batch');
        if (batches.length > 10) batches[batches.length - 1].remove();
    }

    function getLastMessageElement() {
        const messages = document.querySelectorAll('#chat .mes:not([is_user="true"])');
        return messages.length > 0 ? messages[messages.length - 1] : null;
    }

    function injectVoicesIntoChat(voices, messageElement) {
        if (!voices || voices.length === 0 || !messageElement) return;
        const existingContainer = messageElement.querySelector('.ie-chat-voices');
        if (existingContainer) existingContainer.remove();
        const voiceContainer = document.createElement('div');
        voiceContainer.className = 'ie-chat-voices ie-chorus-bubble';
        if (voices.some(v => v.isAncient)) voiceContainer.classList.add('ie-has-ancient');
        const chorusLines = voices.map(voice => {
            const lineClass = voice.isAncient ? 'ie-chorus-line ie-ancient-line' : 'ie-chorus-line';
            return `<div class="${lineClass}"><span class="ie-chorus-name" style="color: ${voice.color}">${voice.signature}</span> - ${voice.content}</div>`;
        }).join('');
        voiceContainer.innerHTML = `<div class="ie-chorus-header"><i class="fa-solid fa-brain"></i><span>Inner Voices</span></div><div class="ie-chorus-content">${chorusLines}</div>`;
        const mesText = messageElement.querySelector('.mes_text');
        if (mesText) mesText.parentNode.insertBefore(voiceContainer, mesText.nextSibling);
        else messageElement.appendChild(voiceContainer);
    }

    let isGenerating = false, triggerTimeout = null;

    async function onMessageReceived(messageData, isManualTrigger = false) {
        if (!extensionSettings.enabled) return;
        if (!isManualTrigger && extensionSettings.autoTrigger === false) return;
        if (isGenerating && !isManualTrigger) return;
        const messageContent = messageData?.message || messageData?.mes || '';
        if (!messageContent || messageContent.length < 10) return;
        if (triggerTimeout) { clearTimeout(triggerTimeout); triggerTimeout = null; }
        const delay = isManualTrigger ? 200 : (extensionSettings.triggerDelay ?? 1000);
        triggerTimeout = setTimeout(async () => await executeVoiceGeneration(messageContent, isManualTrigger), delay);
    }

    async function executeVoiceGeneration(messageContent, isManualTrigger) {
        const loadingToast = showToast(isManualTrigger ? 'Consulting the Thought Cabinet...' : 'The peanut gallery stirs...', 'loading');
        const btn = document.getElementById('ie-manual-trigger');
        if (btn) { btn.classList.add('ie-loading'); btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Consulting...</span>'; btn.disabled = true; }
        isGenerating = true;
        try {
            if (extensionSettings.autoDetectStatus !== false) {
                const detectedStatuses = detectStatusesFromText(messageContent);
                let newStatusAdded = false;
                detectedStatuses.forEach(statusId => { if (!activeStatuses.has(statusId)) { activeStatuses.add(statusId); newStatusAdded = true; } });
                if (newStatusAdded) { saveState(getSTContext()); renderStatusDisplay(); }
            }
            const context = analyzeContext(messageContent);
            const selectedSkills = selectSpeakingSkills(context, { minVoices: extensionSettings.minVoices || 1, maxVoices: extensionSettings.maxVoices || 4 });
            if (selectedSkills.length === 0) { hideToast(loadingToast); showToast('Nothing to say...', 'info', 2000); isGenerating = false; if (btn) { btn.classList.remove('ie-loading'); btn.innerHTML = '<i class="fa-solid fa-bolt"></i><span>Consult Inner Voices</span>'; btn.disabled = false; } return; }
            const voices = await generateVoices(selectedSkills, context);
            const filteredVoices = extensionSettings.showFailedChecks ? voices : voices.filter(v => !v.checkResult || v.checkResult.success);
            displayVoices(filteredVoices);
            const lastMessage = getLastMessageElement();
            if (lastMessage) injectVoicesIntoChat(filteredVoices, lastMessage);
            hideToast(loadingToast);
            showToast(`${filteredVoices.length} voice${filteredVoices.length !== 1 ? 's' : ''} spoke`, 'success', 2000);
        } catch (error) {
            console.error('[Inland Empire] Error:', error);
            hideToast(loadingToast);
            showToast('The voices are silent...', 'error', 3000);
        } finally {
            isGenerating = false;
            if (btn) { btn.classList.remove('ie-loading'); btn.innerHTML = '<i class="fa-solid fa-bolt"></i><span>Consult Inner Voices</span>'; btn.disabled = false; }
        }
    }

    async function onManualTrigger() {
        if (isGenerating) return;
        const context = getSTContext();
        if (!context) return;
        const chat = context.chat || [];
        const lastAIMessage = [...chat].reverse().find(m => !m.is_user);
        if (!lastAIMessage) { showToast('No message to analyze', 'error', 2000); return; }
        await onMessageReceived({ message: lastAIMessage.mes }, true);
    }

    function createPsychePanel() {
        const panel = document.createElement('div');
        panel.id = 'inland-empire-panel';
        panel.className = 'inland-empire-panel';
        panel.innerHTML = `
            <div class="ie-panel-header"><div class="ie-panel-title"><i class="fa-solid fa-brain"></i><span>Psyche</span></div><div class="ie-panel-controls"><button class="ie-btn ie-btn-close-panel" title="Close"><i class="fa-solid fa-times"></i></button></div></div>
            <div class="ie-tabs">
                <button class="ie-tab ie-tab-active" data-tab="skills"><i class="fa-solid fa-chart-bar"></i></button>
                <button class="ie-tab" data-tab="status"><i class="fa-solid fa-heart-pulse"></i></button>
                <button class="ie-tab" data-tab="settings"><i class="fa-solid fa-gear"></i></button>
                <button class="ie-tab" data-tab="profiles"><i class="fa-solid fa-user-circle"></i></button>
            </div>
            <div class="ie-panel-content">
                <div class="ie-tab-content ie-tab-content-active" data-tab-content="skills">
                    <div class="ie-section ie-skills-overview"><div class="ie-section-header"><span>Attributes</span></div><div class="ie-attributes-grid" id="ie-attributes-display"></div></div>
                    <div class="ie-section ie-voices-section"><div class="ie-section-header"><span>Inner Voices</span><button class="ie-btn ie-btn-sm ie-btn-clear-voices" title="Clear"><i class="fa-solid fa-eraser"></i></button></div><div class="ie-voices-container" id="ie-voices-output"><div class="ie-voices-empty"><i class="fa-solid fa-comment-slash"></i><span>Waiting for something to happen...</span></div></div></div>
                    <div class="ie-section ie-manual-section"><button class="ie-btn ie-btn-primary ie-btn-trigger" id="ie-manual-trigger"><i class="fa-solid fa-bolt"></i><span>Consult Inner Voices</span></button></div>
                </div>
                <div class="ie-tab-content" data-tab-content="status">
                    <div class="ie-section"><div class="ie-section-header"><span>Active Effects</span></div><div class="ie-active-effects-summary" id="ie-active-effects-summary"><em>No active status effects</em></div></div>
                    <div class="ie-section"><div class="ie-section-header"><span>Toggle Status Effects</span></div><div class="ie-status-grid" id="ie-status-grid"></div></div>
                    <div class="ie-section"><div class="ie-section-header"><span>Ancient Voices</span></div><div class="ie-ancient-voices-info"><div class="ie-ancient-voice-item"><span class="ie-ancient-icon">🦎</span><span class="ie-ancient-name">Ancient Reptilian Brain</span><span class="ie-ancient-triggers">Triggers: Dying, Starving, Terrified, Aroused</span></div><div class="ie-ancient-voice-item"><span class="ie-ancient-icon">❤️‍🔥</span><span class="ie-ancient-name">Limbic System</span><span class="ie-ancient-triggers">Triggers: Enraged, Grieving, Manic</span></div></div></div>
                </div>
                <div class="ie-tab-content" data-tab-content="settings">
                    <div class="ie-section"><div class="ie-section-header"><span>API Configuration</span></div>
                        <div class="ie-form-group"><label for="ie-api-endpoint">API Endpoint</label><input type="text" id="ie-api-endpoint" placeholder="https://api.example.com/v1" /></div>
                        <div class="ie-form-group"><label for="ie-api-key">API Key</label><input type="password" id="ie-api-key" placeholder="Your API key" /></div>
                        <div class="ie-form-group"><label for="ie-model">Model</label><input type="text" id="ie-model" placeholder="glm-4-plus" /></div>
                        <div class="ie-form-row"><div class="ie-form-group"><label for="ie-temperature">Temperature</label><input type="number" id="ie-temperature" min="0" max="2" step="0.1" value="0.9" /></div><div class="ie-form-group"><label for="ie-max-tokens">Max Tokens</label><input type="number" id="ie-max-tokens" min="50" max="1000" value="300" /></div></div>
                    </div>
                    <div class="ie-section"><div class="ie-section-header"><span>Voice Behavior</span></div>
                        <div class="ie-form-row"><div class="ie-form-group"><label for="ie-min-voices">Min Voices</label><input type="number" id="ie-min-voices" min="0" max="6" value="1" /></div><div class="ie-form-group"><label for="ie-max-voices">Max Voices</label><input type="number" id="ie-max-voices" min="1" max="10" value="4" /></div></div>
                        <div class="ie-form-group"><label for="ie-trigger-delay">Trigger Delay (ms)</label><input type="number" id="ie-trigger-delay" min="0" max="5000" step="100" value="1000" /><small class="ie-hint">Wait before generating voices</small></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-show-dice-rolls" checked /><span>Show dice roll results</span></label></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-show-failed-checks" checked /><span>Show failed skill checks</span></label></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-auto-trigger" /><span>Auto-trigger on AI messages</span></label><small class="ie-hint">Uncheck to only use manual "Consult Inner Voices" button</small></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-auto-detect-status" /><span>Auto-detect status from narrative</span></label></div>
                    </div>
                    <div class="ie-section"><div class="ie-section-header"><span>POV & Character</span></div>
                        <div class="ie-form-group"><label for="ie-pov-style">Voice POV Style</label><select id="ie-pov-style"><option value="second">Second Person (you/your)</option><option value="third">Third Person (name/they)</option><option value="first">First Person (I/me)</option></select></div>
                        <div class="ie-form-group ie-third-person-options"><label for="ie-character-name">Character Name</label><input type="text" id="ie-character-name" placeholder="e.g. Harry" /></div>
                        <div class="ie-form-group ie-third-person-options"><label for="ie-character-pronouns">Pronouns</label><select id="ie-character-pronouns"><option value="they">They/Them</option><option value="he">He/Him</option><option value="she">She/Her</option><option value="it">It/Its</option></select></div>
                        <div class="ie-form-group"><label for="ie-character-context">Character Context</label><textarea id="ie-character-context" rows="4" placeholder="Tell the voices WHO you are and WHO you're observing. This helps them comment from YOUR perspective."></textarea></div>
                        <button class="ie-btn ie-btn-primary ie-btn-save-settings" style="width: 100%; margin-top: 10px;"><i class="fa-solid fa-save"></i><span>Save Settings</span></button>
                        <button class="ie-btn ie-btn-reset-fab" style="width: 100%; margin-top: 8px;"><i class="fa-solid fa-arrows-to-dot"></i><span>Reset Icon Position</span></button>
                        <p class="ie-hint" style="margin-top: 10px; text-align: center;">Tip: You can drag the brain icon to reposition it!</p>
                    </div>
                </div>
                <div class="ie-tab-content" data-tab-content="profiles">
                    <div class="ie-section"><div class="ie-section-header"><span>Persona Profiles</span></div><p class="ie-hint" style="margin-bottom: 10px;">Save your build + character context together for quick persona switching.</p><div class="ie-profiles-list" id="ie-profiles-list"><div class="ie-empty-state"><i class="fa-solid fa-user-slash"></i><span>No saved profiles</span></div></div></div>
                    <div class="ie-section"><div class="ie-section-header"><span>Save Current as Profile</span></div><div class="ie-form-group"><label for="ie-new-profile-name">Profile Name</label><input type="text" id="ie-new-profile-name" placeholder="e.g. Harry Du Bois" /></div><button class="ie-btn ie-btn-primary" id="ie-save-profile-btn" style="width: 100%;"><i class="fa-solid fa-save"></i><span>Save Profile</span></button></div>
                    <div class="ie-section"><div class="ie-section-header"><span>Build Editor</span></div><div class="ie-build-intro"><div class="ie-points-remaining">Points: <span id="ie-points-remaining">12</span> / 12</div></div><div class="ie-attributes-editor" id="ie-attributes-editor"></div><button class="ie-btn ie-btn-primary ie-btn-apply-build" style="width: 100%; margin-top: 10px;"><i class="fa-solid fa-check"></i><span>Apply Build</span></button></div>
                </div>
            </div>`;
        return panel;
    }

    function createToggleFAB() {
        const fab = document.createElement('div');
        fab.id = 'inland-empire-fab';
        fab.className = 'ie-fab';
        fab.title = 'Toggle Psyche Panel (drag to reposition)';
        fab.innerHTML = '<i class="fa-solid fa-brain"></i>';
        fab.style.display = 'flex';
        fab.style.top = `${extensionSettings.fabPositionTop ?? 140}px`;
        fab.style.left = `${extensionSettings.fabPositionLeft ?? 10}px`;
        let isDragging = false, dragStartX, dragStartY, fabStartX, fabStartY, hasMoved = false;
        function startDrag(e) {
            isDragging = true; hasMoved = false;
            const touch = e.touches ? e.touches[0] : e;
            dragStartX = touch.clientX; dragStartY = touch.clientY;
            fabStartX = fab.offsetLeft; fabStartY = fab.offsetTop;
            fab.style.transition = 'none'; fab.style.cursor = 'grabbing';
            document.addEventListener('mousemove', doDrag); document.addEventListener('touchmove', doDrag, { passive: false });
            document.addEventListener('mouseup', endDrag); document.addEventListener('touchend', endDrag);
        }
        function doDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const touch = e.touches ? e.touches[0] : e;
            const deltaX = touch.clientX - dragStartX, deltaY = touch.clientY - dragStartY;
            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) hasMoved = true;
            let newLeft = Math.max(0, Math.min(window.innerWidth - fab.offsetWidth, fabStartX + deltaX));
            let newTop = Math.max(0, Math.min(window.innerHeight - fab.offsetHeight, fabStartY + deltaY));
            fab.style.left = `${newLeft}px`; fab.style.top = `${newTop}px`;
        }
        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            fab.style.transition = 'all 0.3s ease'; fab.style.cursor = 'pointer';
            document.removeEventListener('mousemove', doDrag); document.removeEventListener('touchmove', doDrag);
            document.removeEventListener('mouseup', endDrag); document.removeEventListener('touchend', endDrag);
            if (hasMoved) { fab.dataset.justDragged = 'true'; extensionSettings.fabPositionTop = fab.offsetTop; extensionSettings.fabPositionLeft = fab.offsetLeft; saveState(getSTContext()); }
        }
        fab.addEventListener('mousedown', startDrag);
        fab.addEventListener('touchstart', startDrag, { passive: false });
        return fab;
    }

    function setupEventListeners() {
        const fab = document.getElementById('inland-empire-fab');
        if (fab) fab.addEventListener('click', (e) => { if (fab.dataset.justDragged === 'true') { fab.dataset.justDragged = 'false'; return; } togglePanel(); });
        document.querySelector('.ie-btn-close-panel')?.addEventListener('click', togglePanel);
        document.querySelectorAll('.ie-tab').forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
        document.getElementById('ie-manual-trigger')?.addEventListener('click', onManualTrigger);
        document.querySelector('.ie-btn-clear-voices')?.addEventListener('click', () => { const container = document.getElementById('ie-voices-output'); if (container) container.innerHTML = '<div class="ie-voices-empty"><i class="fa-solid fa-comment-slash"></i><span>Waiting...</span></div>'; });
        document.querySelectorAll('.ie-btn-save-settings').forEach(btn => btn.addEventListener('click', saveSettings));
        document.querySelector('.ie-btn-apply-build')?.addEventListener('click', applyBuild);
        document.getElementById('ie-pov-style')?.addEventListener('change', updateThirdPersonVisibility);
        document.querySelector('.ie-btn-reset-fab')?.addEventListener('click', () => { const fab = document.getElementById('inland-empire-fab'); if (fab) { extensionSettings.fabPositionTop = 140; extensionSettings.fabPositionLeft = 10; fab.style.top = '140px'; fab.style.left = '10px'; saveState(getSTContext()); } });
        document.getElementById('ie-save-profile-btn')?.addEventListener('click', () => {
            const nameInput = document.getElementById('ie-new-profile-name');
            const name = nameInput?.value?.trim();
            if (!name) { showToast('Enter a profile name', 'error', 2000); return; }
            const profile = saveProfile(name);
            showToast(`Saved: ${profile.name}`, 'success', 2000);
            nameInput.value = '';
            renderProfilesList();
        });
    }

    function addExtensionSettings() {
        const settingsContainer = document.getElementById('extensions_settings2');
        if (!settingsContainer) { setTimeout(addExtensionSettings, 1000); return; }
        if (document.getElementById('inland-empire-extension-settings')) return;
        const settingsHtml = `<div id="inland-empire-extension-settings"><div class="inline-drawer"><div class="inline-drawer-toggle inline-drawer-header"><b><i class="fa-solid fa-brain"></i> Inland Empire</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div><div class="inline-drawer-content"><label class="checkbox_label" for="ie-extension-enabled"><input type="checkbox" id="ie-extension-enabled" ${extensionSettings.enabled ? 'checked' : ''} /><span>Enable Inland Empire</span></label><small>Disco Elysium-style internal voices that comment on your roleplay.</small><br><br><button id="ie-toggle-panel-btn" class="menu_button"><i class="fa-solid fa-eye"></i> Toggle Panel</button></div></div></div>`;
        settingsContainer.insertAdjacentHTML('beforeend', settingsHtml);
        document.getElementById('ie-extension-enabled')?.addEventListener('change', (e) => { extensionSettings.enabled = e.target.checked; saveState(getSTContext()); const fab = document.getElementById('inland-empire-fab'); const panel = document.getElementById('inland-empire-panel'); if (fab) fab.style.display = e.target.checked ? 'flex' : 'none'; if (panel && !e.target.checked) panel.classList.remove('ie-panel-open'); });
        document.getElementById('ie-toggle-panel-btn')?.addEventListener('click', togglePanel);
    }

    async function init() {
        console.log('[Inland Empire] Starting initialization...');
        try {
            const context = await waitForSTReady();
            console.log('[Inland Empire] SillyTavern context obtained');
            loadState(context);
            const panel = createPsychePanel();
            const fab = createToggleFAB();
            document.body.appendChild(fab);
            document.body.appendChild(panel);
            if (!extensionSettings.enabled) fab.style.display = 'none';
            renderAttributesDisplay();
            setupEventListeners();
            addExtensionSettings();
            if (context.eventSource) {
                const eventTypes = context.event_types || (typeof event_types !== 'undefined' ? event_types : null);
                if (eventTypes?.MESSAGE_RECEIVED) { context.eventSource.on(eventTypes.MESSAGE_RECEIVED, onMessageReceived); console.log('[Inland Empire] Registered MESSAGE_RECEIVED listener'); }
            }
            console.log('[Inland Empire] ✅ Initialization complete');
        } catch (error) { console.error('[Inland Empire] ❌ Initialization failed:', error); }
    }

    window.InlandEmpire = { getSkillLevel, getAllSkillLevels, rollSkillCheck, SKILLS, ATTRIBUTES, DIFFICULTIES };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    else setTimeout(init, 1000);
})();
