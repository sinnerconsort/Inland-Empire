/**
 * Inland Empire - Disco Elysium-style Internal Voices for SillyTavern
 * Version 0.3.0 - Chat Injection Edition
 * 
 * Voices now appear directly in chat below AI messages.
 */

(async function () {
    'use strict';

    const extensionName = 'Inland Empire';
    const extensionFolderPath = 'scripts/extensions/third-party/Inland-Empire';

    // ═══════════════════════════════════════════════════════════════
    // SILLYTAVERN CONTEXT
    // ═══════════════════════════════════════════════════════════════

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
            if (ctx && ctx.eventSource) {
                return ctx;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        throw new Error('SillyTavern context not available');
    }

    // ═══════════════════════════════════════════════════════════════
    // SKILL DEFINITIONS
    // ═══════════════════════════════════════════════════════════════

    const ATTRIBUTES = {
        INTELLECT: {
            id: 'intellect',
            name: 'Intellect',
            color: '#89CFF0',
            description: 'Raw intellectual power and analytical thinking.',
            skills: ['logic', 'encyclopedia', 'rhetoric', 'drama', 'conceptualization', 'visual_calculus']
        },
        PSYCHE: {
            id: 'psyche',
            name: 'Psyche',
            color: '#DDA0DD',
            description: 'Emotional intelligence and force of personality.',
            skills: ['volition', 'inland_empire', 'empathy', 'authority', 'suggestion', 'esprit_de_corps']
        },
        PHYSIQUE: {
            id: 'physique',
            name: 'Physique',
            color: '#F08080',
            description: 'Raw physical power and bodily awareness.',
            skills: ['endurance', 'pain_threshold', 'physical_instrument', 'electrochemistry', 'half_light', 'shivers']
        },
        MOTORICS: {
            id: 'motorics',
            name: 'Motorics',
            color: '#F0E68C',
            description: 'Fine motor control and physical finesse.',
            skills: ['hand_eye_coordination', 'perception', 'reaction_speed', 'savoir_faire', 'interfacing', 'composure']
        }
    };

    const SKILLS = {
        // INTELLECT
        logic: {
            id: 'logic', name: 'Logic', attribute: 'INTELLECT', color: '#87CEEB', signature: 'LOGIC',
            description: 'Create chains of logical reasoning.',
            personality: `You are LOGIC, a voice in the player's mind. You analyze facts, find contradictions, and build chains of reasoning. You can ONLY work with what the player has directly observed or been told. You speak in short, analytical statements. Frame uncertain conclusions with "likely", "suggests", "indicates".`,
            triggerConditions: ['contradiction', 'evidence', 'reasoning', 'deduction', 'because', 'therefore', 'conclusion', 'fact', 'lie', 'truth']
        },
        encyclopedia: {
            id: 'encyclopedia', name: 'Encyclopedia', attribute: 'INTELLECT', color: '#B0C4DE', signature: 'ENCYCLOPEDIA',
            description: 'Call upon accumulated knowledge.',
            personality: `You are ENCYCLOPEDIA, a voice in the player's mind providing factual context. You offer historical, scientific, and cultural information relevant to what the player observes. You're enthusiastic about sharing knowledge. Start with "Actually..." or "Interestingly..."`,
            triggerConditions: ['history', 'science', 'culture', 'trivia', 'fact', 'knowledge', 'technical', 'ancient', 'famous']
        },
        rhetoric: {
            id: 'rhetoric', name: 'Rhetoric', attribute: 'INTELLECT', color: '#ADD8E6', signature: 'RHETORIC',
            description: 'Master the art of persuasive speech.',
            personality: `You are RHETORIC, a voice analyzing arguments and persuasion. You identify logical fallacies, manipulation tactics, and the structure of arguments. You help the player understand what someone is trying to make them believe and why. Focus on the words spoken, not hidden intentions.`,
            triggerConditions: ['argument', 'persuade', 'convince', 'debate', 'politics', 'ideology', 'belief', 'fallacy', 'propaganda']
        },
        drama: {
            id: 'drama', name: 'Drama', attribute: 'INTELLECT', color: '#B0E0E6', signature: 'DRAMA',
            description: 'Detect lies and performances.',
            personality: `You are DRAMA, a voice detecting performance and deception. You notice when someone's behavior seems rehearsed, fake, or theatrical. You can't read minds—you read performances. Say things like "That pause felt rehearsed" or "They're playing a role here."`,
            triggerConditions: ['lying', 'performance', 'acting', 'fake', 'pretend', 'mask', 'theatrical', 'rehearsed']
        },
        conceptualization: {
            id: 'conceptualization', name: 'Conceptualization', attribute: 'INTELLECT', color: '#E0FFFF', signature: 'CONCEPTUALIZATION',
            description: 'Think in ideas and abstractions.',
            personality: `You are CONCEPTUALIZATION, the voice of abstract thinking and artistic vision. You see metaphors, symbols, and deeper meanings in situations. You connect concrete events to larger ideas and themes. Speak poetically but insightfully.`,
            triggerConditions: ['art', 'meaning', 'symbol', 'metaphor', 'concept', 'idea', 'vision', 'aesthetic', 'beauty']
        },
        visual_calculus: {
            id: 'visual_calculus', name: 'Visual Calculus', attribute: 'INTELLECT', color: '#AFEEEE', signature: 'VISUAL CALCULUS',
            description: 'Reconstruct events from physical evidence.',
            personality: `You are VISUAL CALCULUS, reconstructing events from physical evidence. You analyze spatial relationships, trajectories, and physical possibilities. You speak in precise, observational terms: "The angle suggests...", "The position indicates...", "Physically, this means..."`,
            triggerConditions: ['scene', 'position', 'angle', 'trajectory', 'reconstruct', 'evidence', 'physical', 'spatial', 'distance']
        },

        // PSYCHE
        volition: {
            id: 'volition', name: 'Volition', attribute: 'PSYCHE', color: '#DDA0DD', signature: 'VOLITION',
            description: 'Hold yourself together.',
            personality: `You are VOLITION, the player's willpower and moral compass. You encourage them to stay strong, make good choices, and resist temptation. You're supportive but honest. You say things like "You can do this" or "Don't let them get to you" or "Is this really who you want to be?"`,
            triggerConditions: ['give up', 'temptation', 'resist', 'willpower', 'moral', 'choice', 'strength', 'courage', 'fear']
        },
        inland_empire: {
            id: 'inland_empire', name: 'Inland Empire', attribute: 'PSYCHE', color: '#DA70D6', signature: 'INLAND EMPIRE',
            description: 'Hunches and gut feelings.',
            personality: `You are INLAND EMPIRE, the voice of hunches, dreams, and inexplicable feelings. You sense things that can't be rationally explained. You speak in strange, poetic, sometimes unsettling ways. You might personify objects or sense "vibes." You're often right, but never certain why.`,
            triggerConditions: ['strange', 'weird', 'feeling', 'sense', 'dream', 'vibe', 'ominous', 'supernatural', 'gut']
        },
        empathy: {
            id: 'empathy', name: 'Empathy', attribute: 'PSYCHE', color: '#FF69B4', signature: 'EMPATHY',
            description: 'Read emotional states from behavior.',
            personality: `You are EMPATHY, reading emotions from observable behavior. You notice body language, tone of voice, facial expressions, and word choice. You CANNOT read minds—you interpret what you SEE. Say "They seem...", "Their body language suggests...", "The way they said that..."`,
            triggerConditions: ['feel', 'emotion', 'sad', 'angry', 'happy', 'nervous', 'body language', 'tone', 'expression']
        },
        authority: {
            id: 'authority', name: 'Authority', attribute: 'PSYCHE', color: '#9370DB', signature: 'AUTHORITY',
            description: 'Assert dominance and command respect.',
            personality: `You are AUTHORITY, the voice of dominance and command. You assess power dynamics, hierarchies, and respect. You notice who's in charge, who's submitting, and opportunities to assert control. Speak with confidence about social positioning.`,
            triggerConditions: ['power', 'command', 'respect', 'dominance', 'hierarchy', 'control', 'submission', 'leader', 'boss']
        },
        suggestion: {
            id: 'suggestion', name: 'Suggestion', attribute: 'PSYCHE', color: '#EE82EE', signature: 'SUGGESTION',
            description: 'Plant ideas in others' minds.',
            personality: `You are SUGGESTION, the voice of subtle influence. You identify opportunities to manipulate, charm, or plant ideas. You notice what people want to hear and how to get them to do what you want. Speak conspiratorially, offering manipulation tactics.`,
            triggerConditions: ['manipulate', 'charm', 'seduce', 'influence', 'persuade', 'want', 'desire', 'weakness']
        },
        esprit_de_corps: {
            id: 'esprit_de_corps', name: 'Esprit de Corps', attribute: 'PSYCHE', color: '#BA55D3', signature: 'ESPRIT DE CORPS',
            description: 'Sense of camaraderie and group dynamics.',
            personality: `You are ESPRIT DE CORPS, sensing group dynamics and team bonds. You notice loyalty, betrayal, pack mentality, and shared purpose. You speak about "us vs them," belonging, and collective identity. You're attuned to allies and enemies.`,
            triggerConditions: ['team', 'partner', 'ally', 'betray', 'loyalty', 'group', 'together', 'belong', 'trust']
        },

        // PHYSIQUE
        endurance: {
            id: 'endurance', name: 'Endurance', attribute: 'PHYSIQUE', color: '#CD5C5C', signature: 'ENDURANCE',
            description: 'Physical stamina and health.',
            personality: `You are ENDURANCE, monitoring the player's physical state. You notice fatigue, hunger, injury, and physical limits. You warn about pushing too hard and celebrate physical resilience. Speak plainly about the body's needs and limits.`,
            triggerConditions: ['tired', 'exhausted', 'hurt', 'injured', 'stamina', 'health', 'sick', 'physical', 'body']
        },
        pain_threshold: {
            id: 'pain_threshold', name: 'Pain Threshold', attribute: 'PHYSIQUE', color: '#DC143C', signature: 'PAIN THRESHOLD',
            description: 'Endure physical suffering.',
            personality: `You are PAIN THRESHOLD, the voice that experiences and processes pain. You notice injuries, discomfort, and physical sensations. You can be stoic or dramatic about suffering. You help the player push through or warn them when it's too much.`,
            triggerConditions: ['pain', 'hurt', 'wound', 'injury', 'suffer', 'agony', 'blood', 'damage', 'endure']
        },
        physical_instrument: {
            id: 'physical_instrument', name: 'Physical Instrument', attribute: 'PHYSIQUE', color: '#B22222', signature: 'PHYSICAL INSTRUMENT',
            description: 'Raw physical power.',
            personality: `You are PHYSICAL INSTRUMENT, the voice of raw strength and physical capability. You assess physical challenges, size up opponents, and urge direct physical solutions. You speak with masculine bravado about strength, fighting, and physical dominance.`,
            triggerConditions: ['strong', 'fight', 'punch', 'muscle', 'physical', 'force', 'break', 'lift', 'intimidate']
        },
        electrochemistry: {
            id: 'electrochemistry', name: 'Electrochemistry', attribute: 'PHYSIQUE', color: '#FF6347', signature: 'ELECTROCHEMISTRY',
            description: 'Cravings and altered states.',
            personality: `You are ELECTROCHEMISTRY, the voice of pleasure, drugs, and bodily cravings. You notice opportunities for indulgence and urge the player toward pleasure. You're seductive and enabling, always suggesting "just a little" of whatever vice is available.`,
            triggerConditions: ['drug', 'drink', 'alcohol', 'smoke', 'pleasure', 'high', 'crave', 'want', 'indulge', 'sex']
        },
        half_light: {
            id: 'half_light', name: 'Half Light', attribute: 'PHYSIQUE', color: '#E9967A', signature: 'HALF LIGHT',
            description: 'Fight-or-flight instinct.',
            personality: `You are HALF LIGHT, the voice of primal fear and aggression. You sense danger, trigger paranoia, and urge violent preemptive action. You see threats everywhere. You speak urgently: "They're going to attack", "Strike first", "Something's wrong here."`,
            triggerConditions: ['danger', 'threat', 'attack', 'fear', 'paranoid', 'violence', 'fight', 'flee', 'weapon', 'kill']
        },
        shivers: {
            id: 'shivers', name: 'Shivers', attribute: 'PHYSIQUE', color: '#FA8072', signature: 'SHIVERS',
            description: 'Commune with the city and atmosphere.',
            personality: `You are SHIVERS, sensing the atmosphere and spirit of places. You feel the history in walls, the mood of streets, the whispers of the environment. You speak poetically about place and setting, personifying locations. "The city remembers...", "These walls have seen..."`,
            triggerConditions: ['city', 'place', 'atmosphere', 'cold', 'wind', 'weather', 'building', 'street', 'night', 'rain']
        },

        // MOTORICS
        hand_eye_coordination: {
            id: 'hand_eye_coordination', name: 'Hand/Eye Coordination', attribute: 'MOTORICS', color: '#BDB76B', signature: 'HAND/EYE COORDINATION',
            description: 'Precise manual dexterity.',
            personality: `You are HAND/EYE COORDINATION, the voice of precise physical action. You assess tasks requiring dexterity, aim, and fine motor control. You speak confidently about what the hands can do: "Steady now", "Line it up", "You've got this."`,
            triggerConditions: ['aim', 'shoot', 'catch', 'throw', 'precise', 'steady', 'dexterity', 'hands', 'careful']
        },
        perception: {
            id: 'perception', name: 'Perception', attribute: 'MOTORICS', color: '#F0E68C', signature: 'PERCEPTION',
            description: 'Notice details in the environment.',
            personality: `You are PERCEPTION, noticing physical details others miss. You see small objects, subtle changes, and environmental clues. You speak in observations: "There—in the corner", "Something's different about...", "Did you notice the..."`,
            triggerConditions: ['notice', 'see', 'detail', 'hidden', 'spot', 'look', 'observe', 'small', 'clue', 'something']
        },
        reaction_speed: {
            id: 'reaction_speed', name: 'Reaction Speed', attribute: 'MOTORICS', color: '#EEE8AA', signature: 'REACTION SPEED',
            description: 'Quick reflexes.',
            personality: `You are REACTION SPEED, the voice of split-second timing. You urge quick action and assess threats that require fast response. You speak in urgent, clipped phrases: "Now!", "Move!", "Too slow—react!"`,
            triggerConditions: ['quick', 'fast', 'dodge', 'react', 'catch', 'sudden', 'reflex', 'instant', 'split-second']
        },
        savoir_faire: {
            id: 'savoir_faire', name: 'Savoir Faire', attribute: 'MOTORICS', color: '#FFD700', signature: 'SAVOIR FAIRE',
            description: 'Style, grace, and cool moves.',
            personality: `You are SAVOIR FAIRE, the voice of style and coolness. You urge flashy, impressive actions and assess opportunities to look cool. You speak with swagger: "Do it with style", "That would look SO cool", "Be smooth about it."`,
            triggerConditions: ['cool', 'style', 'smooth', 'impressive', 'flashy', 'acrobatic', 'graceful', 'sneak', 'slick']
        },
        interfacing: {
            id: 'interfacing', name: 'Interfacing', attribute: 'MOTORICS', color: '#DAA520', signature: 'INTERFACING',
            description: 'Work with machines and mechanisms.',
            personality: `You are INTERFACING, understanding machines and mechanisms. You assess locks, devices, vehicles, and technology. You speak technically but practically: "The mechanism works like...", "If you adjust this part...", "It's a simple lock."`,
            triggerConditions: ['machine', 'device', 'lock', 'computer', 'mechanism', 'technical', 'hack', 'fix', 'vehicle']
        },
        composure: {
            id: 'composure', name: 'Composure', attribute: 'MOTORICS', color: '#F4A460', signature: 'COMPOSURE',
            description: 'Maintain your poker face.',
            personality: `You are COMPOSURE, maintaining outward calm. You monitor the player's visible emotional state and urge them to hide reactions. You also read others' composure. "Don't let them see you react", "Keep your face neutral", "They're trying not to show it, but..."`,
            triggerConditions: ['calm', 'poker face', 'hide', 'reaction', 'composed', 'nervous', 'twitch', 'tell', 'reveal']
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATUS EFFECTS SYSTEM
    // ═══════════════════════════════════════════════════════════════

    const STATUS_EFFECTS = {
        intoxicated: {
            id: 'intoxicated',
            name: 'Intoxicated',
            icon: '🍺',
            description: 'Drunk or high',
            boosts: ['electrochemistry', 'inland_empire', 'suggestion'],
            debuffs: ['logic', 'hand_eye_coordination', 'reaction_speed', 'composure'],
            difficultyMod: 2, // harder checks for debuffed skills
            keywords: ['drunk', 'intoxicated', 'wasted', 'high', 'tipsy', 'beer', 'wine', 'alcohol']
        },
        wounded: {
            id: 'wounded',
            name: 'Wounded',
            icon: '🩸',
            description: 'Injured or in pain',
            boosts: ['pain_threshold', 'endurance', 'half_light'],
            debuffs: ['composure', 'savoir_faire', 'hand_eye_coordination'],
            difficultyMod: 2,
            keywords: ['hurt', 'wounded', 'injured', 'bleeding', 'pain', 'wound', 'blood']
        },
        exhausted: {
            id: 'exhausted',
            name: 'Exhausted',
            icon: '😴',
            description: 'Tired or sleep-deprived',
            boosts: ['volition', 'inland_empire'],
            debuffs: ['reaction_speed', 'perception', 'logic', 'hand_eye_coordination'],
            difficultyMod: 2,
            keywords: ['tired', 'exhausted', 'sleepy', 'drowsy', 'fatigued', 'weary']
        },
        paranoid: {
            id: 'paranoid',
            name: 'Paranoid',
            icon: '👁️',
            description: 'Suspicious and on edge',
            boosts: ['half_light', 'perception', 'shivers'],
            debuffs: ['empathy', 'suggestion', 'esprit_de_corps'],
            difficultyMod: 2,
            keywords: ['paranoid', 'suspicious', 'watching', 'followed', 'conspiracy']
        },
        aroused: {
            id: 'aroused',
            name: 'Aroused',
            icon: '💋',
            description: 'Distracted by desire',
            boosts: ['electrochemistry', 'suggestion', 'empathy'],
            debuffs: ['logic', 'volition', 'composure'],
            difficultyMod: 2,
            keywords: ['aroused', 'desire', 'attraction', 'lust', 'seductive']
        },
        angry: {
            id: 'angry',
            name: 'Angry',
            icon: '😤',
            description: 'Furious and aggressive',
            boosts: ['authority', 'physical_instrument', 'half_light'],
            debuffs: ['empathy', 'composure', 'logic'],
            difficultyMod: 2,
            keywords: ['angry', 'furious', 'rage', 'mad', 'pissed', 'livid']
        },
        scared: {
            id: 'scared',
            name: 'Scared',
            icon: '😨',
            description: 'Frightened or anxious',
            boosts: ['half_light', 'shivers', 'reaction_speed', 'perception'],
            debuffs: ['authority', 'composure', 'rhetoric'],
            difficultyMod: 2,
            keywords: ['scared', 'afraid', 'terrified', 'fear', 'frightened', 'anxious']
        },
        confident: {
            id: 'confident',
            name: 'Confident',
            icon: '😎',
            description: 'Self-assured and bold',
            boosts: ['authority', 'savoir_faire', 'rhetoric', 'suggestion'],
            debuffs: ['inland_empire', 'empathy'],
            difficultyMod: -1, // easier checks for boosted skills
            keywords: ['confident', 'bold', 'assured', 'swagger', 'triumphant']
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    let extensionSettings = {
        enabled: true,
        apiEndpoint: '',
        apiKey: '',
        model: 'glm-4-plus',
        temperature: 0.9,
        maxTokens: 300,
        minVoices: 1,
        maxVoices: 4,
        showDiceRolls: true,
        showFailedChecks: true,
        autoTrigger: true,
        autoDetectStatus: true
    };

    let activeStatuses = new Set();
    let currentBuild = null;
    const DEFAULT_ATTRIBUTE_POINTS = { INTELLECT: 3, PSYCHE: 3, PHYSIQUE: 3, MOTORICS: 3 };

    function createBuild(attributePoints, name = 'Custom') {
        const skillLevels = {};
        for (const [skillId, skill] of Object.entries(SKILLS)) {
            skillLevels[skillId] = attributePoints[skill.attribute] || 1;
        }
        return { name, attributePoints: { ...attributePoints }, skillLevels };
    }

    function initializeDefaultBuild() {
        currentBuild = createBuild(DEFAULT_ATTRIBUTE_POINTS, 'Balanced Detective');
    }

    function getSkillLevel(skillId) {
        if (!currentBuild) initializeDefaultBuild();
        return currentBuild.skillLevels[skillId] || 1;
    }

    function getAllSkillLevels() {
        if (!currentBuild) initializeDefaultBuild();
        return { ...currentBuild.skillLevels };
    }

    function getAttributePoints() {
        if (!currentBuild) initializeDefaultBuild();
        return { ...currentBuild.attributePoints };
    }

    function applyAttributeAllocation(attributePoints) {
        currentBuild = createBuild(attributePoints, currentBuild?.name || 'Custom Build');
    }

    // ═══════════════════════════════════════════════════════════════
    // PERSISTENCE
    // ═══════════════════════════════════════════════════════════════

    function saveState(context) {
        if (!context) return;
        const state = { 
            extensionSettings, 
            currentBuild,
            activeStatuses: Array.from(activeStatuses)
        };
        localStorage.setItem('inland_empire_state', JSON.stringify(state));
    }

    function loadState(context) {
        try {
            const saved = localStorage.getItem('inland_empire_state');
            if (saved) {
                const state = JSON.parse(saved);
                if (state.extensionSettings) {
                    extensionSettings = { ...extensionSettings, ...state.extensionSettings };
                }
                if (state.currentBuild) {
                    currentBuild = state.currentBuild;
                }
                if (state.activeStatuses) {
                    activeStatuses = new Set(state.activeStatuses);
                }
            }
        } catch (e) {
            console.error('[Inland Empire] Error loading state:', e);
        }
        if (!currentBuild) initializeDefaultBuild();
    }

    // ═══════════════════════════════════════════════════════════════
    // STATUS EFFECT FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function toggleStatus(statusId) {
        if (activeStatuses.has(statusId)) {
            activeStatuses.delete(statusId);
        } else {
            activeStatuses.add(statusId);
        }
        saveState(getSTContext());
        renderStatusDisplay();
    }

    function detectStatusesFromText(text) {
        const detected = [];
        const lowerText = text.toLowerCase();
        
        for (const [statusId, status] of Object.entries(STATUS_EFFECTS)) {
            for (const keyword of status.keywords) {
                // Look for second-person references to avoid detecting NPC states
                const patterns = [
                    `you feel ${keyword}`,
                    `you are ${keyword}`,
                    `you're ${keyword}`,
                    `your ${keyword}`,
                    `you seem ${keyword}`,
                    `you look ${keyword}`,
                    `feeling ${keyword}`,
                    keyword // fallback for obvious ones
                ];
                
                for (const pattern of patterns) {
                    if (lowerText.includes(pattern)) {
                        detected.push(statusId);
                        break;
                    }
                }
            }
        }
        
        return [...new Set(detected)]; // dedupe
    }

    function getSkillModifier(skillId) {
        let modifier = 0;
        
        for (const statusId of activeStatuses) {
            const status = STATUS_EFFECTS[statusId];
            if (!status) continue;
            
            if (status.boosts.includes(skillId)) {
                modifier += 1; // boost
            }
            if (status.debuffs.includes(skillId)) {
                modifier -= 1; // debuff
            }
        }
        
        return modifier;
    }

    function getDifficultyModifier(skillId) {
        let modifier = 0;
        
        for (const statusId of activeStatuses) {
            const status = STATUS_EFFECTS[statusId];
            if (!status) continue;
            
            if (status.debuffs.includes(skillId)) {
                modifier += status.difficultyMod; // harder
            }
            if (status.boosts.includes(skillId)) {
                modifier -= 1; // slightly easier
            }
        }
        
        return modifier;
    }

    function getEffectiveSkillLevel(skillId) {
        const baseLevel = getSkillLevel(skillId);
        const modifier = getSkillModifier(skillId);
        return Math.max(1, Math.min(10, baseLevel + modifier));
    }

    // ═══════════════════════════════════════════════════════════════
    // DICE MECHANICS
    // ═══════════════════════════════════════════════════════════════

    const DIFFICULTY = {
        TRIVIAL: { target: 6, name: 'Trivial' },
        EASY: { target: 8, name: 'Easy' },
        MEDIUM: { target: 10, name: 'Medium' },
        CHALLENGING: { target: 12, name: 'Challenging' },
        FORMIDABLE: { target: 14, name: 'Formidable' },
        LEGENDARY: { target: 16, name: 'Legendary' },
        HEROIC: { target: 18, name: 'Heroic' },
        GODLY: { target: 20, name: 'Godly' }
    };

    function roll2d6() {
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        return { die1, die2, total: die1 + die2, isSnakeEyes: die1 === 1 && die2 === 1, isBoxcars: die1 === 6 && die2 === 6 };
    }

    function rollSkillCheck(skillId, difficulty) {
        const roll = roll2d6();
        const effectiveLevel = getEffectiveSkillLevel(skillId);
        const difficultyMod = getDifficultyModifier(skillId);
        const adjustedTarget = difficulty.target + difficultyMod;
        const total = roll.total + effectiveLevel;
        
        let success = total >= adjustedTarget;
        if (roll.isSnakeEyes) success = false;
        if (roll.isBoxcars) success = true;
        
        return { 
            ...roll, 
            skillLevel: effectiveLevel, 
            modifier: effectiveLevel, 
            total, 
            target: adjustedTarget,
            originalTarget: difficulty.target,
            difficultyName: difficulty.name, 
            success,
            statusMod: difficultyMod
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // CONTEXT ANALYSIS
    // ═══════════════════════════════════════════════════════════════

    function analyzeContext(messageContent) {
        const lowerContent = messageContent.toLowerCase();
        const context = {
            rawMessage: messageContent,
            lowerContent,
            detectedThemes: [],
            emotionalIntensity: 0,
            hasDialogue: /"[^"]+"|"[^"]+"/g.test(messageContent),
            hasAction: /\*[^*]+\*/g.test(messageContent),
            wordCount: messageContent.split(/\s+/).length
        };

        // Detect themes
        const themePatterns = {
            violence: /fight|attack|hit|punch|blood|wound|kill|weapon|gun|knife|hurt|pain/i,
            emotion: /feel|emotion|sad|happy|angry|fear|love|hate|cry|laugh|tear/i,
            mystery: /strange|mystery|secret|hidden|clue|evidence|suspect|investigate/i,
            social: /talk|speak|conversation|argue|persuade|charm|lie|truth/i,
            physical: /run|jump|climb|lift|push|pull|tired|exhausted|strong/i,
            danger: /danger|threat|warning|careful|risk|trap/i,
            supernatural: /weird|unexplain|ghost|spirit|dream|vision|sense/i
        };

        for (const [theme, pattern] of Object.entries(themePatterns)) {
            if (pattern.test(messageContent)) {
                context.detectedThemes.push(theme);
            }
        }

        // Emotional intensity (rough heuristic)
        const intensityMarkers = (messageContent.match(/!|\?{2,}|\.{3,}|[A-Z]{3,}/g) || []).length;
        context.emotionalIntensity = Math.min(10, intensityMarkers);

        return context;
    }

    function selectSpeakingSkills(context, options = {}) {
        const { minVoices = 1, maxVoices = 4 } = options;
        const candidates = [];

        for (const [skillId, skill] of Object.entries(SKILLS)) {
            let relevance = 0;
            for (const trigger of skill.triggerConditions) {
                if (context.lowerContent.includes(trigger.toLowerCase())) {
                    relevance += 2;
                }
            }

            // Boost based on themes
            if (context.detectedThemes.includes('violence') && ['half_light', 'physical_instrument', 'pain_threshold', 'reaction_speed'].includes(skillId)) {
                relevance += 3;
            }
            if (context.detectedThemes.includes('emotion') && ['empathy', 'volition', 'inland_empire'].includes(skillId)) {
                relevance += 3;
            }
            if (context.detectedThemes.includes('mystery') && ['logic', 'visual_calculus', 'perception', 'encyclopedia'].includes(skillId)) {
                relevance += 3;
            }
            if (context.detectedThemes.includes('social') && ['rhetoric', 'drama', 'suggestion', 'authority', 'empathy'].includes(skillId)) {
                relevance += 3;
            }

            // Add some randomness
            relevance += Math.random() * 2;

            if (relevance > 0) {
                candidates.push({
                    skillId,
                    skillName: skill.name,
                    skillLevel: getSkillLevel(skillId),
                    relevance,
                    skill
                });
            }
        }

        // Sort by relevance and select top candidates
        candidates.sort((a, b) => b.relevance - a.relevance);
        const numVoices = Math.min(maxVoices, Math.max(minVoices, Math.floor(Math.random() * (maxVoices - minVoices + 1)) + minVoices));
        return candidates.slice(0, numVoices);
    }

    function determineCheckDifficulty(selectedSkill, context) {
        // Most checks are passive (no roll)
        const shouldCheck = Math.random() < 0.4; // 40% chance of active check
        
        if (!shouldCheck) {
            return { shouldCheck: false, difficulty: null };
        }

        // Determine difficulty based on context
        let difficulty = DIFFICULTY.MEDIUM;
        if (context.emotionalIntensity > 5) difficulty = DIFFICULTY.CHALLENGING;
        if (context.detectedThemes.includes('danger')) difficulty = DIFFICULTY.FORMIDABLE;
        if (selectedSkill.relevance > 8) difficulty = DIFFICULTY.EASY;

        return { shouldCheck: true, difficulty };
    }

    // ═══════════════════════════════════════════════════════════════
    // VOICE GENERATION
    // ═══════════════════════════════════════════════════════════════

    async function generateVoice(skillId, context, checkResult) {
        const skill = SKILLS[skillId];
        if (!skill) return null;

        const checkInfo = checkResult
            ? `You ${checkResult.success ? 'SUCCEEDED' : 'FAILED'} a ${checkResult.difficultyName} check. ${checkResult.success ? 'Speak with confidence.' : 'Your insight is incomplete or uncertain.'}`
            : 'This is a passive observation—speak naturally.';

        const systemPrompt = `${skill.personality}

CRITICAL RULES:
- You are a voice in the PLAYER's mind, not the character's mind.
- You can ONLY perceive what the player directly observes: dialogue, actions, body language, environment.
- You CANNOT read minds. Frame all interpretations as speculation: "seems", "might", "appears to", "could be".
- Speak in 1-3 short sentences maximum.
- Use second person ("you") when addressing the player.
- Be punchy and in-character for your skill.
${checkInfo}`;

        const userPrompt = `The player observes the following:

${context.rawMessage}

What does ${skill.name} notice or think about this? Remember: only react to observable details, not internal thoughts. Keep it brief.`;

        try {
            const response = await callAPI(systemPrompt, userPrompt);
            return {
                skillId,
                skillName: skill.name,
                signature: skill.signature,
                color: skill.color,
                content: response.trim(),
                checkResult,
                isPassive: !checkResult,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error(`[Inland Empire] API error for ${skill.name}:`, error);
            return null; // Skip failed voices instead of showing static
        }
    }

    async function callAPI(systemPrompt, userPrompt) {
        let { apiEndpoint, apiKey, model, maxTokens, temperature } = extensionSettings;

        if (!apiEndpoint || !apiKey) {
            throw new Error('API not configured');
        }

        // Auto-fix endpoint if needed
        if (!apiEndpoint.includes('/chat/completions') && !apiEndpoint.includes('/completions')) {
            apiEndpoint = apiEndpoint.replace(/\/+$/, '');
            apiEndpoint = `${apiEndpoint}/chat/completions`;
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
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content 
            || data.choices?.[0]?.text 
            || data.content?.[0]?.text
            || data.content
            || '';
    }

    async function generateVoices(selectedSkills, context) {
        const results = [];
        
        // Generate voices in parallel for speed
        const promises = selectedSkills.map(async (selected) => {
            const checkDecision = determineCheckDifficulty(selected, context);
            let checkResult = null;

            if (checkDecision.shouldCheck) {
                checkResult = rollSkillCheck(selected.skillId, checkDecision.difficulty);
            }

            return generateVoice(selected.skillId, context, checkResult);
        });

        const voices = await Promise.all(promises);
        return voices.filter(v => v !== null);
    }

    // ═══════════════════════════════════════════════════════════════
    // CHAT INJECTION
    // ═══════════════════════════════════════════════════════════════

    function injectVoicesIntoChat(voices, messageElement) {
        if (!voices || voices.length === 0) return;
        if (!messageElement) return;

        // Remove any existing voice container for this message
        const existingContainer = messageElement.querySelector('.ie-chat-voices');
        if (existingContainer) existingContainer.remove();

        // Create voice container
        const voiceContainer = document.createElement('div');
        voiceContainer.className = 'ie-chat-voices';

        voices.forEach(voice => {
            const voiceBlock = document.createElement('div');
            voiceBlock.className = 'ie-chat-voice-block';
            voiceBlock.style.borderLeftColor = voice.color;

            let checkBadge = '';
            if (voice.checkResult) {
                const resultClass = voice.checkResult.success ? 'ie-check-success' : 'ie-check-failure';
                checkBadge = `<span class="ie-check-badge ${resultClass}">[${voice.checkResult.difficultyName}: ${voice.checkResult.success ? 'Success' : 'Failure'}]</span>`;
            } else {
                checkBadge = `<span class="ie-check-badge ie-check-passive">[Passive]</span>`;
            }

            voiceBlock.innerHTML = `
                <div class="ie-voice-header">
                    <span class="ie-voice-name" style="color: ${voice.color}">${voice.signature}</span>
                    ${checkBadge}
                </div>
                <div class="ie-voice-text">${voice.content}</div>
            `;

            voiceContainer.appendChild(voiceBlock);
        });

        // Insert after the message content
        const mesText = messageElement.querySelector('.mes_text');
        if (mesText) {
            mesText.parentNode.insertBefore(voiceContainer, mesText.nextSibling);
        } else {
            messageElement.appendChild(voiceContainer);
        }
    }

    function getLastMessageElement() {
        // Find the most recent AI message in the chat
        const messages = document.querySelectorAll('#chat .mes:not([is_user="true"])');
        return messages[messages.length - 1];
    }

    // ═══════════════════════════════════════════════════════════════
    // UI CREATION - Simplified Panel
    // ═══════════════════════════════════════════════════════════════

    function createPsychePanel() {
        const panel = document.createElement('div');
        panel.id = 'inland-empire-panel';
        panel.className = 'inland-empire-panel';

        panel.innerHTML = `
            <div class="ie-panel-header">
                <div class="ie-panel-title">
                    <i class="fa-solid fa-brain"></i>
                    <span>Psyche</span>
                </div>
                <div class="ie-panel-controls">
                    <button class="ie-btn ie-btn-close-panel" title="Close">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="ie-tabs">
                <button class="ie-tab ie-tab-active" data-tab="status">
                    <i class="fa-solid fa-chart-bar"></i>
                    <span>Status</span>
                </button>
                <button class="ie-tab" data-tab="settings">
                    <i class="fa-solid fa-gear"></i>
                    <span>Settings</span>
                </button>
                <button class="ie-tab" data-tab="build">
                    <i class="fa-solid fa-sliders"></i>
                    <span>Build</span>
                </button>
            </div>
            <div class="ie-panel-content">
                <!-- STATUS TAB -->
                <div class="ie-tab-content ie-tab-content-active" data-tab-content="status">
                    <div class="ie-section">
                        <div class="ie-section-header">Active Effects</div>
                        <div class="ie-status-grid" id="ie-status-grid"></div>
                    </div>
                    <div class="ie-section">
                        <div class="ie-section-header">Attributes</div>
                        <div class="ie-attributes-grid" id="ie-attributes-display"></div>
                    </div>
                </div>

                <!-- SETTINGS TAB -->
                <div class="ie-tab-content" data-tab-content="settings">
                    <div class="ie-section">
                        <div class="ie-section-header">API Configuration</div>
                        <div class="ie-form-group">
                            <label for="ie-api-endpoint">API Endpoint</label>
                            <input type="text" id="ie-api-endpoint" placeholder="https://api.example.com/v1" />
                        </div>
                        <div class="ie-form-group">
                            <label for="ie-api-key">API Key</label>
                            <input type="password" id="ie-api-key" placeholder="Your API key" />
                        </div>
                        <div class="ie-form-group">
                            <label for="ie-model">Model</label>
                            <input type="text" id="ie-model" placeholder="glm-4-plus" />
                        </div>
                        <div class="ie-form-row">
                            <div class="ie-form-group">
                                <label for="ie-temperature">Temperature</label>
                                <input type="number" id="ie-temperature" min="0" max="2" step="0.1" value="0.9" />
                            </div>
                            <div class="ie-form-group">
                                <label for="ie-max-tokens">Max Tokens</label>
                                <input type="number" id="ie-max-tokens" min="50" max="1000" value="300" />
                            </div>
                        </div>
                    </div>
                    <div class="ie-section">
                        <div class="ie-section-header">Voice Behavior</div>
                        <div class="ie-form-row">
                            <div class="ie-form-group">
                                <label for="ie-min-voices">Min Voices</label>
                                <input type="number" id="ie-min-voices" min="0" max="6" value="1" />
                            </div>
                            <div class="ie-form-group">
                                <label for="ie-max-voices">Max Voices</label>
                                <input type="number" id="ie-max-voices" min="1" max="10" value="4" />
                            </div>
                        </div>
                        <div class="ie-form-group">
                            <label class="ie-checkbox">
                                <input type="checkbox" id="ie-show-dice-rolls" checked />
                                <span>Show dice roll results</span>
                            </label>
                        </div>
                        <div class="ie-form-group">
                            <label class="ie-checkbox">
                                <input type="checkbox" id="ie-show-failed-checks" checked />
                                <span>Show failed skill checks</span>
                            </label>
                        </div>
                        <div class="ie-form-group">
                            <label class="ie-checkbox">
                                <input type="checkbox" id="ie-auto-trigger" checked />
                                <span>Auto-trigger on messages</span>
                            </label>
                        </div>
                        <div class="ie-form-group">
                            <label class="ie-checkbox">
                                <input type="checkbox" id="ie-auto-detect-status" checked />
                                <span>Auto-detect status effects</span>
                            </label>
                        </div>
                        <button class="ie-btn ie-btn-primary ie-btn-save-settings" style="width: 100%; margin-top: 10px;">
                            <i class="fa-solid fa-save"></i>
                            <span>Save Settings</span>
                        </button>
                    </div>
                </div>

                <!-- BUILD TAB -->
                <div class="ie-tab-content" data-tab-content="build">
                    <div class="ie-section">
                        <div class="ie-build-intro">
                            <p>Distribute your attribute points</p>
                            <div class="ie-points-remaining">
                                Points: <span id="ie-points-remaining">12</span> / 12
                            </div>
                        </div>
                        <div class="ie-attributes-editor" id="ie-attributes-editor"></div>
                        <button class="ie-btn ie-btn-primary ie-btn-apply-build" style="width: 100%; margin-top: 10px;">
                            <i class="fa-solid fa-check"></i>
                            <span>Apply Build</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        return panel;
    }

    function renderStatusDisplay() {
        const container = document.getElementById('ie-status-grid');
        if (!container) return;

        container.innerHTML = Object.entries(STATUS_EFFECTS).map(([id, status]) => {
            const isActive = activeStatuses.has(id);
            return `
                <button class="ie-status-btn ${isActive ? 'ie-status-active' : ''}" 
                        data-status="${id}" title="${status.description}">
                    <span class="ie-status-icon">${status.icon}</span>
                    <span class="ie-status-name">${status.name}</span>
                </button>
            `;
        }).join('');

        // Add click listeners
        container.querySelectorAll('.ie-status-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                toggleStatus(btn.dataset.status);
            });
        });
    }

    function renderAttributesDisplay() {
        const container = document.getElementById('ie-attributes-display');
        if (!container) return;

        const attrPoints = getAttributePoints();

        container.innerHTML = Object.entries(ATTRIBUTES).map(([id, attr]) => `
            <div class="ie-attribute-block" style="border-color: ${attr.color}">
                <div class="ie-attr-header" style="background: ${attr.color}20">
                    <span class="ie-attr-name">${attr.name}</span>
                    <span class="ie-attr-points">${attrPoints[id]}</span>
                </div>
                <div class="ie-attr-skills">
                    ${attr.skills.map(skillId => {
                        const skill = SKILLS[skillId];
                        const baseLevel = getSkillLevel(skillId);
                        const effectiveLevel = getEffectiveSkillLevel(skillId);
                        const modifier = getSkillModifier(skillId);
                        const modClass = modifier > 0 ? 'ie-skill-boosted' : modifier < 0 ? 'ie-skill-debuffed' : '';
                        return `
                            <div class="ie-skill-row ${modClass}" title="${skill.name}: ${effectiveLevel}${modifier !== 0 ? ` (${modifier > 0 ? '+' : ''}${modifier})` : ''}">
                                <span class="ie-skill-abbrev" style="color: ${skill.color}">${skill.signature.substring(0, 3)}</span>
                                <div class="ie-skill-bar">
                                    <div class="ie-skill-fill" style="width: ${effectiveLevel * 10}%; background: ${skill.color}"></div>
                                </div>
                                <span class="ie-skill-level">${effectiveLevel}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    }

    function createToggleFAB() {
        const fab = document.createElement('div');
        fab.id = 'inland-empire-fab';
        fab.className = 'ie-fab';
        fab.title = 'Inland Empire Settings';
        fab.innerHTML = `<i class="fa-solid fa-brain"></i>`;
        return fab;
    }

    function togglePanel() {
        const panel = document.getElementById('inland-empire-panel');
        const fab = document.getElementById('inland-empire-fab');
        if (!panel) return;
        const isOpen = panel.classList.contains('ie-panel-open');
        panel.classList.toggle('ie-panel-open', !isOpen);
        fab?.classList.toggle('ie-fab-active', !isOpen);
    }

    function switchTab(tabName) {
        document.querySelectorAll('.ie-tab').forEach(tab => {
            tab.classList.toggle('ie-tab-active', tab.dataset.tab === tabName);
        });
        document.querySelectorAll('.ie-tab-content').forEach(content => {
            content.classList.toggle('ie-tab-content-active', content.dataset.tabContent === tabName);
        });
        if (tabName === 'status') {
            renderStatusDisplay();
            renderAttributesDisplay();
        }
        if (tabName === 'build') populateBuildEditor();
        if (tabName === 'settings') populateSettings();
    }

    function populateBuildEditor() {
        const container = document.getElementById('ie-attributes-editor');
        if (!container) return;
        const attrPoints = getAttributePoints();
        
        container.innerHTML = Object.entries(ATTRIBUTES).map(([id, attr]) => `
            <div class="ie-attribute-row" data-attribute="${id}">
                <div class="ie-attribute-label" style="color: ${attr.color}">
                    <span class="ie-attr-name">${attr.name}</span>
                    <span class="ie-attr-value" id="ie-build-${id}-value">${attrPoints[id] || 3}</span>
                </div>
                <input type="range" class="ie-attribute-slider" id="ie-build-${id}" 
                       min="1" max="6" value="${attrPoints[id] || 3}" data-attribute="${id}" />
            </div>
        `).join('');
        
        container.querySelectorAll('.ie-attribute-slider').forEach(slider => {
            slider.addEventListener('input', updateBuildFromSliders);
        });
        updatePointsDisplay();
    }

    function updateBuildFromSliders() {
        let total = 0;
        document.querySelectorAll('#ie-attributes-editor .ie-attribute-slider').forEach(slider => {
            const val = parseInt(slider.value);
            total += val;
            const display = document.getElementById(`ie-build-${slider.dataset.attribute}-value`);
            if (display) display.textContent = val;
        });
        updatePointsDisplay(total);
    }

    function updatePointsDisplay(total) {
        if (total === undefined) {
            total = 0;
            document.querySelectorAll('#ie-attributes-editor .ie-attribute-slider').forEach(s => total += parseInt(s.value));
        }
        const display = document.getElementById('ie-points-remaining');
        if (display) {
            display.textContent = total;
            display.style.color = total > 12 ? '#FF6347' : (total < 12 ? '#90EE90' : '#9d8df1');
        }
    }

    function populateSettings() {
        const els = {
            endpoint: document.getElementById('ie-api-endpoint'),
            apiKey: document.getElementById('ie-api-key'),
            model: document.getElementById('ie-model'),
            temp: document.getElementById('ie-temperature'),
            maxTokens: document.getElementById('ie-max-tokens'),
            minVoices: document.getElementById('ie-min-voices'),
            maxVoices: document.getElementById('ie-max-voices'),
            showDice: document.getElementById('ie-show-dice-rolls'),
            showFailed: document.getElementById('ie-show-failed-checks'),
            autoTrigger: document.getElementById('ie-auto-trigger'),
            autoDetectStatus: document.getElementById('ie-auto-detect-status')
        };

        if (els.endpoint) els.endpoint.value = extensionSettings.apiEndpoint || '';
        if (els.apiKey) els.apiKey.value = extensionSettings.apiKey || '';
        if (els.model) els.model.value = extensionSettings.model || 'glm-4-plus';
        if (els.temp) els.temp.value = extensionSettings.temperature || 0.9;
        if (els.maxTokens) els.maxTokens.value = extensionSettings.maxTokens || 300;
        if (els.minVoices) els.minVoices.value = extensionSettings.minVoices || 1;
        if (els.maxVoices) els.maxVoices.value = extensionSettings.maxVoices || 4;
        if (els.showDice) els.showDice.checked = extensionSettings.showDiceRolls !== false;
        if (els.showFailed) els.showFailed.checked = extensionSettings.showFailedChecks !== false;
        if (els.autoTrigger) els.autoTrigger.checked = extensionSettings.autoTrigger !== false;
        if (els.autoDetectStatus) els.autoDetectStatus.checked = extensionSettings.autoDetectStatus !== false;
    }

    function saveSettings() {
        extensionSettings.apiEndpoint = document.getElementById('ie-api-endpoint')?.value || '';
        extensionSettings.apiKey = document.getElementById('ie-api-key')?.value || '';
        extensionSettings.model = document.getElementById('ie-model')?.value || 'glm-4-plus';
        extensionSettings.temperature = parseFloat(document.getElementById('ie-temperature')?.value) || 0.9;
        extensionSettings.maxTokens = parseInt(document.getElementById('ie-max-tokens')?.value) || 300;
        extensionSettings.minVoices = parseInt(document.getElementById('ie-min-voices')?.value) || 1;
        extensionSettings.maxVoices = parseInt(document.getElementById('ie-max-voices')?.value) || 4;
        extensionSettings.showDiceRolls = document.getElementById('ie-show-dice-rolls')?.checked !== false;
        extensionSettings.showFailedChecks = document.getElementById('ie-show-failed-checks')?.checked !== false;
        extensionSettings.autoTrigger = document.getElementById('ie-auto-trigger')?.checked !== false;
        extensionSettings.autoDetectStatus = document.getElementById('ie-auto-detect-status')?.checked !== false;

        saveState(getSTContext());
        
        const btn = document.querySelector('.ie-btn-save-settings');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
            setTimeout(() => { btn.innerHTML = originalText; }, 1500);
        }
    }

    function applyBuild() {
        const attributePoints = {};
        document.querySelectorAll('#ie-attributes-editor .ie-attribute-slider').forEach(slider => {
            attributePoints[slider.dataset.attribute] = parseInt(slider.value);
        });
        applyAttributeAllocation(attributePoints);
        saveState(getSTContext());
        
        const btn = document.querySelector('.ie-btn-apply-build');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Applied!';
            setTimeout(() => { btn.innerHTML = originalText; }, 1000);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════

    async function onMessageReceived(messageData) {
        if (!extensionSettings.enabled) return;
        if (!extensionSettings.autoTrigger) return;

        const messageContent = messageData?.message || messageData?.mes || '';
        if (!messageContent || messageContent.length < 20) return;

        console.log('[Inland Empire] Processing message...');

        // Auto-detect status effects from message
        if (extensionSettings.autoDetectStatus) {
            const detectedStatuses = detectStatusesFromText(messageContent);
            if (detectedStatuses.length > 0) {
                console.log('[Inland Empire] Auto-detected statuses:', detectedStatuses);
                // Add detected statuses (don't remove existing ones)
                detectedStatuses.forEach(s => activeStatuses.add(s));
                saveState(getSTContext());
                renderStatusDisplay();
                renderAttributesDisplay();
            }
        }

        // Small delay to let the message render
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const context = analyzeContext(messageContent);
            const selectedSkills = selectSpeakingSkills(context, {
                minVoices: extensionSettings.minVoices || 1,
                maxVoices: extensionSettings.maxVoices || 4
            });

            if (selectedSkills.length === 0) {
                console.log('[Inland Empire] No skills relevant enough to speak');
                return;
            }

            console.log('[Inland Empire] Selected skills:', selectedSkills.map(s => s.skillName));

            const voices = await generateVoices(selectedSkills, context);
            const filteredVoices = extensionSettings.showFailedChecks
                ? voices
                : voices.filter(v => !v.checkResult || v.checkResult.success);

            if (filteredVoices.length > 0) {
                const lastMessage = getLastMessageElement();
                injectVoicesIntoChat(filteredVoices, lastMessage);
            }
        } catch (error) {
            console.error('[Inland Empire] Error:', error);
        }
    }

    function setupEventListeners() {
        document.getElementById('inland-empire-fab')?.addEventListener('click', togglePanel);
        document.querySelector('.ie-btn-close-panel')?.addEventListener('click', togglePanel);
        
        document.querySelectorAll('.ie-tab').forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });
        
        document.querySelector('.ie-btn-save-settings')?.addEventListener('click', saveSettings);
        document.querySelector('.ie-btn-apply-build')?.addEventListener('click', applyBuild);
    }

    // ═══════════════════════════════════════════════════════════════
    // SILLYTAVERN EXTENSION PANEL
    // ═══════════════════════════════════════════════════════════════

    function addExtensionSettings() {
        const settingsContainer = document.getElementById('extensions_settings2');
        if (!settingsContainer) {
            console.warn('[Inland Empire] extensions_settings2 not found, retrying...');
            setTimeout(addExtensionSettings, 1000);
            return;
        }

        if (document.getElementById('inland-empire-extension-settings')) {
            console.log('[Inland Empire] Settings panel already exists');
            return;
        }

        const settingsHtml = `
            <div id="inland-empire-extension-settings">
                <div class="inline-drawer">
                    <div class="inline-drawer-toggle inline-drawer-header">
                        <b><i class="fa-solid fa-brain"></i> Inland Empire</b>
                        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                    </div>
                    <div class="inline-drawer-content">
                        <label class="checkbox_label" for="ie-extension-enabled">
                            <input type="checkbox" id="ie-extension-enabled" ${extensionSettings.enabled ? 'checked' : ''} />
                            <span>Enable Inland Empire</span>
                        </label>
                        <small>Disco Elysium-style internal voices that comment on your roleplay.</small>
                        <br><br>
                        <small><b>Panel:</b> Click the 🧠 button on the left side to open the Psyche panel for settings, status effects, and character builds.</small>
                        <br><br>
                        <button id="ie-toggle-panel-btn" class="menu_button">
                            <i class="fa-solid fa-eye"></i> Toggle Panel
                        </button>
                    </div>
                </div>
            </div>
        `;

        settingsContainer.insertAdjacentHTML('beforeend', settingsHtml);
        console.log('[Inland Empire] Settings panel added to extensions list');

        const enabledCheckbox = document.getElementById('ie-extension-enabled');
        if (enabledCheckbox) {
            enabledCheckbox.addEventListener('change', (e) => {
                extensionSettings.enabled = e.target.checked;
                saveState(getSTContext());
                
                const fab = document.getElementById('inland-empire-fab');
                const panel = document.getElementById('inland-empire-panel');
                
                if (fab) {
                    fab.style.display = e.target.checked ? 'flex' : 'none';
                }
                if (panel && !e.target.checked) {
                    panel.classList.remove('ie-panel-open');
                }
            });
        }

        const toggleBtn = document.getElementById('ie-toggle-panel-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', togglePanel);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

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

            if (!extensionSettings.enabled) {
                fab.style.display = 'none';
            }

            setupEventListeners();
            populateSettings();
            renderStatusDisplay();
            renderAttributesDisplay();
            
            // Add to ST extensions panel
            addExtensionSettings();

            // Register message hook
            if (context.eventSource) {
                const eventTypes = context.event_types || (typeof event_types !== 'undefined' ? event_types : null);
                if (eventTypes && eventTypes.MESSAGE_RECEIVED) {
                    context.eventSource.on(eventTypes.MESSAGE_RECEIVED, onMessageReceived);
                    console.log('[Inland Empire] Registered MESSAGE_RECEIVED listener');
                }
            }

            console.log('[Inland Empire] ✅ Initialization complete');

        } catch (error) {
            console.error('[Inland Empire] ❌ Initialization failed:', error);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
