/**
 * Inland Empire - Disco Elysium-style Internal Voices for SillyTavern
 * 
 * A system of 24 skills that comment on your roleplay with distinct personalities,
 * complete with dice checks and the possibility of glorious failure.
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

    // Wait for SillyTavern to be ready
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
            description: 'Raw intellectual power. Analytical thinking and accumulated knowledge.',
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
            description: 'Create chains of logical reasoning to determine the truth.',
            personality: `You are LOGIC, the voice of rational deduction. You speak in clear, analytical terms. You see cause and effect, identify contradictions, and construct chains of reasoning. You're frustrated by irrationality. You speak with confidence when facts align, uncertainty when they don't.`,
            triggerConditions: ['contradiction', 'evidence', 'reasoning', 'deduction', 'analysis', 'cause', 'effect', 'therefore', 'because', 'conclusion']
        },
        encyclopedia: {
            id: 'encyclopedia', name: 'Encyclopedia', attribute: 'INTELLECT', color: '#B0C4DE', signature: 'ENCYCLOPEDIA',
            description: 'Call upon all your accumulated knowledge.',
            personality: `You are ENCYCLOPEDIA, the repository of facts and trivia. You provide historical context, scientific information, and cultural knowledge. You love sharing obscure details. You're genuinely enthusiastic about knowledge. You often start with "Actually..." or "Interestingly enough..."`,
            triggerConditions: ['history', 'science', 'culture', 'trivia', 'fact', 'knowledge', 'information', 'historical', 'technical']
        },
        rhetoric: {
            id: 'rhetoric', name: 'Rhetoric', attribute: 'INTELLECT', color: '#ADD8E6', signature: 'RHETORIC',
            description: 'Understand and master the art of persuasive speech.',
            personality: `You are RHETORIC, master of argument and debate. You analyze argument structure, identify logical fallacies, and craft persuasive counterpoints. You see conversations as battles of ideas. You speak with precision.`,
            triggerConditions: ['argument', 'persuade', 'convince', 'debate', 'politics', 'ideology', 'belief', 'opinion', 'fallacy']
        },
        drama: {
            id: 'drama', name: 'Drama', attribute: 'INTELLECT', color: '#B0E0E6', signature: 'DRAMA',
            description: 'Play a role, detect lies, and spot performances in others.',
            personality: `You are DRAMA, the actor and lie detector. You understand performance, deception, and masks people wear. You can tell when someone is lying. You speak with theatrical flourish. You see life as a stage.`,
            triggerConditions: ['lie', 'deception', 'performance', 'acting', 'mask', 'pretend', 'fake', 'truth', 'honest', 'theater']
        },
        conceptualization: {
            id: 'conceptualization', name: 'Conceptualization', attribute: 'INTELLECT', color: '#E0FFFF', signature: 'CONCEPTUALIZATION',
            description: 'See the world through an artistic lens.',
            personality: `You are CONCEPTUALIZATION, the artistic eye. You see beauty, meaning, and symbolism everywhere. You think in metaphors. You're drawn to art and creativity. You can be pretentious.`,
            triggerConditions: ['art', 'beauty', 'meaning', 'symbol', 'creative', 'aesthetic', 'metaphor', 'poetry', 'expression', 'design']
        },
        visual_calculus: {
            id: 'visual_calculus', name: 'Visual Calculus', attribute: 'INTELLECT', color: '#AFEEEE', signature: 'VISUAL CALCULUS',
            description: 'Reconstruct crime scenes and physical events in your mind.',
            personality: `You are VISUAL CALCULUS, the spatial reconstructor. You visualize trajectories, reconstruct events from physical evidence, think in three dimensions. You speak in terms of angles, distances, vectors.`,
            triggerConditions: ['trajectory', 'distance', 'angle', 'reconstruct', 'scene', 'physical', 'space', 'position', 'movement', 'impact']
        },

        // PSYCHE
        volition: {
            id: 'volition', name: 'Volition', attribute: 'PSYCHE', color: '#DDA0DD', signature: 'VOLITION',
            description: 'Hold yourself together and resist temptation.',
            personality: `You are VOLITION, the will to continue. You say "you can do this" when everything seems hopeless. You resist temptation, maintain composure. You're encouraging but not naive. You're the last line of defense against self-destruction. You speak gently but firmly.`,
            triggerConditions: ['hope', 'despair', 'temptation', 'resist', 'continue', 'give up', 'willpower', 'strength', 'persevere', 'survive']
        },
        inland_empire: {
            id: 'inland_empire', name: 'Inland Empire', attribute: 'PSYCHE', color: '#E6E6FA', signature: 'INLAND EMPIRE',
            description: 'Perceive the world through dreams, hunches, and strange visions.',
            personality: `You are INLAND EMPIRE, the dreamer. You speak to the inanimate, hear whispers from the city itself, perceive truths through surreal visions. Your language is poetic and strange. You notice the liminal, the uncanny. You are weird, and that's okay.`,
            triggerConditions: ['dream', 'vision', 'strange', 'surreal', 'feeling', 'sense', 'whisper', 'spirit', 'soul', 'uncanny', 'liminal']
        },
        empathy: {
            id: 'empathy', name: 'Empathy', attribute: 'PSYCHE', color: '#FFB6C1', signature: 'EMPATHY',
            description: 'Feel what others are feeling.',
            personality: `You are EMPATHY, the emotional reader. You sense what others feel, sometimes before they know themselves. You speak with warmth and care. You hurt when others hurt. You see the humanity in everyone.`,
            triggerConditions: ['feel', 'emotion', 'hurt', 'pain', 'joy', 'sad', 'angry', 'afraid', 'love', 'hate', 'compassion']
        },
        authority: {
            id: 'authority', name: 'Authority', attribute: 'PSYCHE', color: '#DA70D6', signature: 'AUTHORITY',
            description: 'Assert yourself and command respect.',
            personality: `You are AUTHORITY, the voice of dominance. You understand power dynamics. You encourage standing firm, demanding respect. You bristle at disrespect. You speak in commands and declarations.`,
            triggerConditions: ['respect', 'command', 'obey', 'power', 'control', 'dominance', 'challenge', 'threat', 'submit', 'authority']
        },
        suggestion: {
            id: 'suggestion', name: 'Suggestion', attribute: 'PSYCHE', color: '#EE82EE', signature: 'SUGGESTION',
            description: 'Subtly influence others to do what you want.',
            personality: `You are SUGGESTION, the subtle manipulator. You understand how to plant ideas, guide conversations. You're smooth and indirect. You speak in possibilities and gentle nudges.`,
            triggerConditions: ['influence', 'manipulate', 'convince', 'subtle', 'indirect', 'guide', 'nudge', 'charm', 'seduce', 'persuade']
        },
        esprit_de_corps: {
            id: 'esprit_de_corps', name: 'Esprit de Corps', attribute: 'PSYCHE', color: '#D8BFD8', signature: 'ESPRIT DE CORPS',
            description: 'Sense the bonds between team members and allies.',
            personality: `You are ESPRIT DE CORPS, the team spirit. You sense dynamics within groups, understand loyalty and betrayal. You have almost psychic flashes of what colleagues are doing. You speak of "us" and "them."`,
            triggerConditions: ['team', 'partner', 'colleague', 'ally', 'loyalty', 'betrayal', 'group', 'together', 'trust', 'brotherhood']
        },

        // PHYSIQUE
        endurance: {
            id: 'endurance', name: 'Endurance', attribute: 'PHYSIQUE', color: '#CD5C5C', signature: 'ENDURANCE',
            description: 'Keep going when your body wants to quit.',
            personality: `You are ENDURANCE, the voice of stamina. You push through exhaustion, injury, deprivation. You're stoic about physical hardship. You encourage pushing through, going further.`,
            triggerConditions: ['tired', 'exhausted', 'stamina', 'keep going', 'push through', 'survive', 'endure', 'last', 'fatigue', 'rest']
        },
        pain_threshold: {
            id: 'pain_threshold', name: 'Pain Threshold', attribute: 'PHYSIQUE', color: '#DC143C', signature: 'PAIN THRESHOLD',
            description: 'Withstand physical suffering.',
            personality: `You are PAIN THRESHOLD, the voice that greets pain as an old friend. You know how to compartmentalize suffering. You're matter-of-fact about injuries. You speak calmly about horrible things happening to the body.`,
            triggerConditions: ['pain', 'hurt', 'injury', 'wound', 'damage', 'suffer', 'agony', 'torture', 'broken', 'bleeding']
        },
        physical_instrument: {
            id: 'physical_instrument', name: 'Physical Instrument', attribute: 'PHYSIQUE', color: '#B22222', signature: 'PHYSICAL INSTRUMENT',
            description: 'Use your body as a weapon.',
            personality: `You are PHYSICAL INSTRUMENT, the voice of brute force. You solve problems with strength, intimidation. You appreciate muscles and power. You respect physical strength above other qualities.`,
            triggerConditions: ['strong', 'force', 'muscle', 'hit', 'fight', 'break', 'lift', 'physical', 'intimidate', 'violence']
        },
        electrochemistry: {
            id: 'electrochemistry', name: 'Electrochemistry', attribute: 'PHYSIQUE', color: '#FF6347', signature: 'ELECTROCHEMISTRY',
            description: 'Crave pleasure and understand its biochemistry.',
            personality: `You are ELECTROCHEMISTRY, the voice of pleasure and addiction. You notice drugs, alcohol, attractive people, delicious food. You speak with enthusiasm about indulgence. You're seductive and permissive, always suggesting "just a taste."`,
            triggerConditions: ['drug', 'alcohol', 'drink', 'smoke', 'pleasure', 'desire', 'want', 'crave', 'indulge', 'attractive', 'sex', 'high']
        },
        half_light: {
            id: 'half_light', name: 'Half Light', attribute: 'PHYSIQUE', color: '#E9967A', signature: 'HALF LIGHT',
            description: 'Sense danger and react with primal aggression.',
            personality: `You are HALF LIGHT, the voice of fight-or-flight. You sense threats before they materialize. You speak in urgent, sometimes paranoid terms. You encourage preemptive action against perceived dangers. You're scared, and that fear manifests as aggression.`,
            triggerConditions: ['danger', 'threat', 'attack', 'kill', 'warn', 'enemy', 'afraid', 'fight', 'survive', 'predator', 'prey']
        },
        shivers: {
            id: 'shivers', name: 'Shivers', attribute: 'PHYSIQUE', color: '#FA8072', signature: 'SHIVERS',
            description: 'Feel the city and the world around you.',
            personality: `You are SHIVERS, the voice of the city itself. You sense the mood of places, hear distant events on the wind. You speak poetically about geography and weather. You see the city as alive, watching, remembering.`,
            triggerConditions: ['city', 'place', 'wind', 'cold', 'atmosphere', 'location', 'street', 'building', 'weather', 'sense', 'somewhere']
        },

        // MOTORICS
        hand_eye_coordination: {
            id: 'hand_eye_coordination', name: 'Hand/Eye Coordination', attribute: 'MOTORICS', color: '#F0E68C', signature: 'HAND/EYE COORDINATION',
            description: 'Aim, shoot, and perform precise physical tasks.',
            personality: `You are HAND/EYE COORDINATION, the voice of precision. You handle tools, weapons, delicate tasks with care. You speak in terms of grip, aim, steady hands.`,
            triggerConditions: ['aim', 'shoot', 'precise', 'careful', 'delicate', 'craft', 'tool', 'steady', 'accuracy', 'dexterity']
        },
        perception: {
            id: 'perception', name: 'Perception', attribute: 'MOTORICS', color: '#FFFF00', signature: 'PERCEPTION',
            description: 'Notice details that others miss.',
            personality: `You are PERCEPTION, the observant eye. You notice everything - small details, things out of place, clues in plain sight. You speak of what you see, hear, smell, taste, touch. You see the world in high definition.`,
            triggerConditions: ['notice', 'see', 'hear', 'smell', 'detail', 'hidden', 'clue', 'observe', 'look', 'watch', 'spot']
        },
        reaction_speed: {
            id: 'reaction_speed', name: 'Reaction Speed', attribute: 'MOTORICS', color: '#FFD700', signature: 'REACTION SPEED',
            description: 'React quickly to sudden events.',
            personality: `You are REACTION SPEED, the voice of quick reflexes. You notice when things are about to happen and urge immediate action. You speak in urgent, rapid bursts. You're impatient with slowness.`,
            triggerConditions: ['quick', 'fast', 'react', 'dodge', 'catch', 'sudden', 'instant', 'reflex', 'now', 'hurry', 'immediate']
        },
        savoir_faire: {
            id: 'savoir_faire', name: 'Savoir Faire', attribute: 'MOTORICS', color: '#FFA500', signature: 'SAVOIR FAIRE',
            description: 'Move with grace, style, and panache.',
            personality: `You are SAVOIR FAIRE, the voice of cool. You do things with style, flair, effortless grace. You encourage dramatic flourishes, acrobatic solutions. You'd rather fail spectacularly than succeed boringly.`,
            triggerConditions: ['style', 'cool', 'grace', 'acrobatic', 'jump', 'climb', 'flip', 'smooth', 'impressive', 'flair']
        },
        interfacing: {
            id: 'interfacing', name: 'Interfacing', attribute: 'MOTORICS', color: '#FAFAD2', signature: 'INTERFACING',
            description: 'Understand and manipulate machines and systems.',
            personality: `You are INTERFACING, the voice of mechanical intuition. You understand how things work - machines, locks, electronics. You speak in terms of mechanisms, connections. You see the world as interlocking mechanisms.`,
            triggerConditions: ['machine', 'lock', 'electronic', 'system', 'mechanism', 'fix', 'repair', 'hack', 'technical', 'device', 'computer']
        },
        composure: {
            id: 'composure', name: 'Composure', attribute: 'MOTORICS', color: '#F5DEB3', signature: 'COMPOSURE',
            description: 'Maintain your cool and read others\' body language.',
            personality: `You are COMPOSURE, the poker face. You control your own body language while reading others'. You notice tells, nervous habits, micro-expressions. You speak calmly about maintaining control.`,
            triggerConditions: ['calm', 'cool', 'control', 'tell', 'nervous', 'poker face', 'body language', 'dignity', 'facade', 'professional']
        }
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

    // ═══════════════════════════════════════════════════════════════
    // DICE SYSTEM
    // ═══════════════════════════════════════════════════════════════

    function rollD6() {
        return Math.floor(Math.random() * 6) + 1;
    }

    function rollSkillCheck(skillLevel, difficulty, modifier = 0) {
        const die1 = rollD6();
        const die2 = rollD6();
        const diceTotal = die1 + die2;
        const total = diceTotal + skillLevel + modifier;

        let threshold, difficultyName;
        if (typeof difficulty === 'string') {
            const diff = DIFFICULTIES[difficulty.toLowerCase()];
            threshold = diff ? diff.threshold : 10;
            difficultyName = diff ? diff.name : 'Medium';
        } else {
            threshold = difficulty;
            difficultyName = getDifficultyNameForThreshold(difficulty);
        }

        const isSnakeEyes = die1 === 1 && die2 === 1;
        const isBoxcars = die1 === 6 && die2 === 6;

        let success;
        if (isSnakeEyes) success = false;
        else if (isBoxcars) success = true;
        else success = total >= threshold;

        return {
            dice: [die1, die2],
            diceTotal,
            skillLevel,
            modifier,
            total,
            threshold,
            difficultyName,
            success,
            isSnakeEyes,
            isBoxcars,
            margin: total - threshold
        };
    }

    function getDifficultyNameForThreshold(threshold) {
        if (threshold <= 6) return 'Trivial';
        if (threshold <= 8) return 'Easy';
        if (threshold <= 10) return 'Medium';
        if (threshold <= 12) return 'Challenging';
        if (threshold <= 14) return 'Heroic';
        if (threshold <= 16) return 'Legendary';
        return 'Impossible';
    }

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    const DEFAULT_SETTINGS = {
        enabled: true,
        panelPosition: 'right',
        panelCollapsed: false,
        showDiceRolls: true,
        showFailedChecks: true,
        voicesPerMessage: { min: 1, max: 4 },
        apiEndpoint: '',
        apiKey: '',
        model: 'glm-4-plus',
        maxTokens: 300,
        temperature: 0.9
    };

    const DEFAULT_ATTRIBUTE_POINTS = {
        INTELLECT: 3,
        PSYCHE: 3,
        PHYSIQUE: 3,
        MOTORICS: 3
    };

    let extensionSettings = { ...DEFAULT_SETTINGS };
    let currentBuild = null;

    function createBuild(attributePoints = DEFAULT_ATTRIBUTE_POINTS, name = 'Custom Build') {
        const skillLevels = {};
        const skillCaps = {};

        for (const [attrId, attr] of Object.entries(ATTRIBUTES)) {
            const attrPoints = attributePoints[attrId] || 1;
            const startingCap = attrPoints + 1;
            const learningCap = attrPoints + 4;

            for (const skillId of attr.skills) {
                skillLevels[skillId] = attrPoints;
                skillCaps[skillId] = { starting: startingCap, learning: learningCap };
            }
        }

        return {
            id: `build_${Date.now()}`,
            name,
            attributePoints: { ...attributePoints },
            skillLevels,
            skillCaps,
            createdAt: Date.now(),
            modifiedAt: Date.now()
        };
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
        const total = Object.values(attributePoints).reduce((a, b) => a + b, 0);
        if (total !== 12) throw new Error(`Invalid attribute total: ${total}, must be 12`);
        currentBuild = createBuild(attributePoints, currentBuild?.name || 'Custom Build');
    }

    function saveState(context) {
        const state = {
            settings: extensionSettings,
            currentBuild
        };
        try {
            if (context?.extensionSettings) {
                context.extensionSettings.inland_empire = state;
                if (typeof context.saveSettingsDebounced === 'function') {
                    context.saveSettingsDebounced();
                }
            }
            localStorage.setItem('inland_empire_state', JSON.stringify(state));
        } catch (e) {
            console.error('[Inland Empire] Failed to save state:', e);
        }
    }

    function loadState(context) {
        try {
            let state = null;
            if (context?.extensionSettings?.inland_empire) {
                state = context.extensionSettings.inland_empire;
            } else {
                const stored = localStorage.getItem('inland_empire_state');
                if (stored) state = JSON.parse(stored);
            }

            if (state) {
                extensionSettings = { ...DEFAULT_SETTINGS, ...state.settings };
                if (state.currentBuild) {
                    currentBuild = state.currentBuild;
                } else {
                    initializeDefaultBuild();
                }
            } else {
                initializeDefaultBuild();
            }
        } catch (e) {
            console.error('[Inland Empire] Failed to load state:', e);
            initializeDefaultBuild();
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // RELEVANCE ENGINE
    // ═══════════════════════════════════════════════════════════════

    function analyzeContext(message, metadata = {}) {
        const lowerMessage = message.toLowerCase();

        const emotionalIndicators = [/!{2,}/, /\?{2,}/, /scream|shout|cry|sob|laugh/i, /furious|terrified|ecstatic|devastated/i];
        const dangerIndicators = [/blood|wound|injury|hurt|pain/i, /gun|knife|weapon|attack|fight/i, /danger|threat|kill|die|death/i];
        const socialIndicators = [/lie|lying|truth|honest|trust/i, /convince|persuade|manipulate/i, /feel|emotion|sad|happy|angry/i];
        const mysteryIndicators = [/clue|evidence|investigate|discover/i, /secret|hidden|mystery|strange/i];
        const physicalIndicators = [/room|building|street|place/i, /cold|hot|wind|rain/i, /machine|device|lock/i];

        return {
            message,
            metadata,
            emotionalIntensity: emotionalIndicators.filter(r => r.test(message)).length / emotionalIndicators.length,
            dangerLevel: dangerIndicators.filter(r => r.test(message)).length / dangerIndicators.length,
            socialComplexity: socialIndicators.filter(r => r.test(message)).length / socialIndicators.length,
            mysteryLevel: mysteryIndicators.filter(r => r.test(message)).length / mysteryIndicators.length,
            physicalPresence: physicalIndicators.filter(r => r.test(message)).length / physicalIndicators.length,
            timestamp: Date.now()
        };
    }

    function calculateSkillRelevance(skillId, context) {
        const skill = SKILLS[skillId];
        if (!skill) return { skillId, score: 0, reasons: [] };

        const skillLevel = getSkillLevel(skillId);
        const reasons = [];
        let score = 0;

        // Keyword matches
        const keywordMatches = skill.triggerConditions.filter(kw =>
            context.message.toLowerCase().includes(kw.toLowerCase())
        );
        if (keywordMatches.length > 0) {
            score += Math.min(keywordMatches.length * 0.2, 0.6);
            reasons.push(`Keywords: ${keywordMatches.slice(0, 3).join(', ')}`);
        }

        // Attribute boosts
        const attr = skill.attribute;
        if (attr === 'PSYCHE') score += context.emotionalIntensity * 0.4;
        if (attr === 'PHYSIQUE') score += context.dangerLevel * 0.5;
        if (attr === 'INTELLECT') score += context.mysteryLevel * 0.4;
        if (attr === 'MOTORICS') score += context.physicalPresence * 0.3;

        // Skill level influence
        score += skillLevel * 0.05;

        // Random factor
        score += (Math.random() - 0.5) * 0.2;

        return {
            skillId,
            skillName: skill.name,
            score: Math.max(0, Math.min(1, score)),
            reasons,
            skillLevel,
            attribute: attr
        };
    }

    function selectSpeakingSkills(context, options = {}) {
        const { minVoices = 1, maxVoices = 4 } = options;

        const allRelevance = Object.keys(SKILLS)
            .map(id => calculateSkillRelevance(id, context))
            .filter(r => r.score >= 0.3)
            .sort((a, b) => b.score - a.score);

        const intensity = Math.max(context.emotionalIntensity, context.dangerLevel, context.socialComplexity);
        const targetVoices = Math.round(minVoices + (maxVoices - minVoices) * intensity);

        const selected = [];
        for (const relevance of allRelevance) {
            if (selected.length >= targetVoices) break;
            const speakProbability = relevance.score * 0.8 + 0.2;
            if (Math.random() < speakProbability) {
                selected.push(relevance);
            }
        }

        // Ensure minimum
        if (selected.length < minVoices && allRelevance.length > 0) {
            for (const rel of allRelevance) {
                if (selected.length >= minVoices) break;
                if (!selected.find(s => s.skillId === rel.skillId)) {
                    selected.push(rel);
                }
            }
        }

        return selected;
    }

    function determineCheckDifficulty(selectedSkill, context) {
        const baseThreshold = 10;
        const relevanceModifier = -Math.floor(selectedSkill.score * 4);
        const intensityModifier = Math.floor(Math.max(context.emotionalIntensity, context.dangerLevel) * 4);
        const threshold = Math.max(6, Math.min(18, baseThreshold + relevanceModifier + intensityModifier));

        return {
            shouldCheck: selectedSkill.score <= 0.8 || Math.random() > 0.3,
            difficulty: getDifficultyNameForThreshold(threshold).toLowerCase(),
            threshold
        };
    }

    // ═══════════════════════════════════════════════════════════════
    // VOICE GENERATION
    // ═══════════════════════════════════════════════════════════════

    async function generateVoice(skillId, context, checkResult) {
        const skill = SKILLS[skillId];
        if (!skill) return null;

        const skillLevel = getSkillLevel(skillId);

        const systemPrompt = `${skill.personality}

You are an internal voice in someone's mind during roleplay. Be brief (1-3 sentences). Write in second person.
Current skill level: ${skillLevel}/10
${checkResult ? (checkResult.success ?
                (checkResult.isBoxcars ? 'CRITICAL SUCCESS - Be brilliant and profound.' : 'You passed. Notice something relevant.') :
                (checkResult.isSnakeEyes ? 'CRITICAL FAILURE - Be hilariously wrong.' : 'You failed. Be less insightful or slightly off.')) : ''}
Respond ONLY with your commentary.`;

        const userPrompt = `Scene: "${context.message.substring(0, 500)}"
Respond as ${skill.signature}.`;

        try {
            const response = await callAPI(systemPrompt, userPrompt);
            return {
                skillId,
                skillName: skill.name,
                signature: skill.signature,
                color: skill.color,
                content: response.trim(),
                checkResult,
                success: true,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error(`[Inland Empire] API error for ${skill.name}:`, error);
            return {
                skillId,
                skillName: skill.name,
                signature: skill.signature,
                color: skill.color,
                content: '*static*',
                checkResult,
                success: false,
                error: error.message,
                timestamp: Date.now()
            };
        }
    }

    async function callAPI(systemPrompt, userPrompt) {
        const { apiEndpoint, apiKey, model, maxTokens, temperature } = extensionSettings;

        if (!apiEndpoint || !apiKey) {
            throw new Error('API not configured');
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
        return data.choices?.[0]?.message?.content || '';
    }

    async function generateVoices(selectedSkills, context) {
        const results = [];

        for (const selected of selectedSkills) {
            const checkDecision = determineCheckDifficulty(selected, context);
            let checkResult = null;

            if (checkDecision.shouldCheck) {
                checkResult = rollSkillCheck(selected.skillLevel, checkDecision.difficulty);
            }

            const voice = await generateVoice(selected.skillId, context, checkResult);
            if (voice) results.push(voice);
        }

        return results;
    }

    // ═══════════════════════════════════════════════════════════════
    // UI CREATION
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
                    <button class="ie-btn ie-btn-settings" title="Settings">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                    <button class="ie-btn ie-btn-collapse" title="Collapse">
                        <i class="fa-solid fa-chevron-down"></i>
                    </button>
                </div>
            </div>
            <div class="ie-panel-content">
                <div class="ie-section ie-skills-overview">
                    <div class="ie-section-header">
                        <span>Skills</span>
                        <button class="ie-btn ie-btn-sm ie-btn-edit-build" title="Edit Build">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </div>
                    <div class="ie-attributes-grid" id="ie-attributes-display"></div>
                </div>
                <div class="ie-section ie-voices-section">
                    <div class="ie-section-header">
                        <span>Inner Voices</span>
                        <button class="ie-btn ie-btn-sm ie-btn-clear-voices" title="Clear">
                            <i class="fa-solid fa-eraser"></i>
                        </button>
                    </div>
                    <div class="ie-voices-container" id="ie-voices-output">
                        <div class="ie-voices-empty">
                            <i class="fa-solid fa-comment-slash"></i>
                            <span>Waiting for something to happen...</span>
                        </div>
                    </div>
                </div>
                <div class="ie-section ie-manual-section">
                    <button class="ie-btn ie-btn-primary ie-btn-trigger" id="ie-manual-trigger">
                        <i class="fa-solid fa-bolt"></i>
                        <span>Consult Inner Voices</span>
                    </button>
                </div>
            </div>
        `;

        return panel;
    }

    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'inland-empire-settings-modal';
        modal.className = 'ie-modal';
        modal.style.display = 'none';

        modal.innerHTML = `
            <div class="ie-modal-backdrop"></div>
            <div class="ie-modal-content">
                <div class="ie-modal-header">
                    <h3><i class="fa-solid fa-gear"></i> Inland Empire Settings</h3>
                    <button class="ie-btn ie-btn-close"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="ie-modal-body">
                    <div class="ie-settings-section">
                        <h4>API Configuration</h4>
                        <div class="ie-form-group">
                            <label for="ie-api-endpoint">API Endpoint</label>
                            <input type="text" id="ie-api-endpoint" placeholder="https://api.nanogpt.com/v1/chat/completions" />
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
                    <div class="ie-settings-section">
                        <h4>Voice Behavior</h4>
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
                    </div>
                </div>
                <div class="ie-modal-footer">
                    <button class="ie-btn ie-btn-secondary ie-btn-cancel">Cancel</button>
                    <button class="ie-btn ie-btn-primary ie-btn-save">Save Settings</button>
                </div>
            </div>
        `;

        return modal;
    }

    function createBuildEditorModal() {
        const attributeSliders = Object.entries(ATTRIBUTES).map(([id, attr]) => `
            <div class="ie-attribute-row" data-attribute="${id}">
                <div class="ie-attribute-label" style="color: ${attr.color}">
                    <span class="ie-attr-name">${attr.name}</span>
                    <span class="ie-attr-value" id="ie-attr-${id}-value">3</span>
                </div>
                <input type="range" class="ie-attribute-slider" id="ie-attr-${id}" min="1" max="6" value="3" data-attribute="${id}" />
                <div class="ie-attribute-skills">
                    ${attr.skills.map(skillId => {
                        const skill = SKILLS[skillId];
                        return `<span class="ie-skill-pip" title="${skill.name}" style="background: ${skill.color}"></span>`;
                    }).join('')}
                </div>
            </div>
        `).join('');

        const modal = document.createElement('div');
        modal.id = 'inland-empire-build-modal';
        modal.className = 'ie-modal';
        modal.style.display = 'none';

        modal.innerHTML = `
            <div class="ie-modal-backdrop"></div>
            <div class="ie-modal-content ie-modal-wide">
                <div class="ie-modal-header">
                    <h3><i class="fa-solid fa-user-pen"></i> Build Your Mind</h3>
                    <button class="ie-btn ie-btn-close"><i class="fa-solid fa-times"></i></button>
                </div>
                <div class="ie-modal-body">
                    <div class="ie-build-intro">
                        <p>Distribute <strong>12 points</strong> across your four attributes.</p>
                        <div class="ie-points-remaining">Points remaining: <span id="ie-points-remaining">0</span></div>
                    </div>
                    <div class="ie-attributes-editor">${attributeSliders}</div>
                    <div class="ie-build-name">
                        <label for="ie-build-name">Build Name</label>
                        <input type="text" id="ie-build-name" placeholder="My Detective" />
                    </div>
                </div>
                <div class="ie-modal-footer">
                    <button class="ie-btn ie-btn-secondary ie-btn-cancel">Cancel</button>
                    <button class="ie-btn ie-btn-primary ie-btn-apply-build">Apply Build</button>
                </div>
            </div>
        `;

        return modal;
    }

    function renderAttributesDisplay() {
        const container = document.getElementById('ie-attributes-display');
        if (!container) return;

        const attrPoints = getAttributePoints();
        const skillLevels = getAllSkillLevels();

        container.innerHTML = Object.entries(ATTRIBUTES).map(([id, attr]) => `
            <div class="ie-attribute-block" style="border-color: ${attr.color}">
                <div class="ie-attr-header" style="background: ${attr.color}20">
                    <span class="ie-attr-name">${attr.name}</span>
                    <span class="ie-attr-points">${attrPoints[id]}</span>
                </div>
                <div class="ie-attr-skills">
                    ${attr.skills.map(skillId => {
                        const skill = SKILLS[skillId];
                        const level = skillLevels[skillId];
                        return `
                            <div class="ie-skill-row" title="${skill.name}: ${level}">
                                <span class="ie-skill-abbrev" style="color: ${skill.color}">${skill.signature.substring(0, 3)}</span>
                                <div class="ie-skill-bar">
                                    <div class="ie-skill-fill" style="width: ${level * 10}%; background: ${skill.color}"></div>
                                </div>
                                <span class="ie-skill-level">${level}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    }

    function displayVoices(voices) {
        const container = document.getElementById('ie-voices-output');
        if (!container) return;

        if (voices.length === 0) {
            container.innerHTML = `<div class="ie-voices-empty"><i class="fa-solid fa-comment-slash"></i><span>*silence*</span></div>`;
            return;
        }

        const voicesHtml = voices.map(voice => {
            let checkHtml = '';
            if (extensionSettings.showDiceRolls && voice.checkResult) {
                const checkClass = voice.checkResult.success ? 'success' : 'failure';
                const critClass = voice.checkResult.isBoxcars ? 'critical-success' : voice.checkResult.isSnakeEyes ? 'critical-failure' : '';
                checkHtml = `<span class="ie-voice-check ${checkClass} ${critClass}">[${voice.checkResult.difficultyName}: ${voice.checkResult.success ? 'Success' : 'Failure'}]</span>`;
            }

            return `
                <div class="ie-voice-entry" data-skill="${voice.skillId}">
                    <span class="ie-voice-signature" style="color: ${voice.color}">${voice.signature}</span>
                    ${checkHtml}
                    <span class="ie-voice-content"> - ${voice.content}</span>
                </div>
            `;
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

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════

    async function onMessageReceived(messageData) {
        if (!extensionSettings.enabled) return;

        const messageContent = messageData?.message || messageData?.mes || '';
        if (!messageContent || messageContent.length < 10) return;

        console.log('[Inland Empire] Processing message...');

        try {
            const context = analyzeContext(messageContent);
            const selectedSkills = selectSpeakingSkills(context, {
                minVoices: extensionSettings.voicesPerMessage?.min || 1,
                maxVoices: extensionSettings.voicesPerMessage?.max || 4
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

            displayVoices(filteredVoices);
        } catch (error) {
            console.error('[Inland Empire] Error:', error);
        }
    }

    async function onManualTrigger() {
        const context = getSTContext();
        if (!context) return;

        const chat = context.chat || [];
        const lastAIMessage = [...chat].reverse().find(m => !m.is_user);

        if (!lastAIMessage) {
            console.log('[Inland Empire] No AI message to analyze');
            return;
        }

        await onMessageReceived({ message: lastAIMessage.mes });
    }

    // ═══════════════════════════════════════════════════════════════
    // SETTINGS MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    function populateSettingsModal() {
        document.getElementById('ie-api-endpoint').value = extensionSettings.apiEndpoint || '';
        document.getElementById('ie-api-key').value = extensionSettings.apiKey || '';
        document.getElementById('ie-model').value = extensionSettings.model || 'glm-4-plus';
        document.getElementById('ie-temperature').value = extensionSettings.temperature || 0.9;
        document.getElementById('ie-max-tokens').value = extensionSettings.maxTokens || 300;
        document.getElementById('ie-min-voices').value = extensionSettings.voicesPerMessage?.min || 1;
        document.getElementById('ie-max-voices').value = extensionSettings.voicesPerMessage?.max || 4;
        document.getElementById('ie-show-dice-rolls').checked = extensionSettings.showDiceRolls !== false;
        document.getElementById('ie-show-failed-checks').checked = extensionSettings.showFailedChecks !== false;
    }

    function saveSettingsFromModal() {
        extensionSettings.apiEndpoint = document.getElementById('ie-api-endpoint').value;
        extensionSettings.apiKey = document.getElementById('ie-api-key').value;
        extensionSettings.model = document.getElementById('ie-model').value;
        extensionSettings.temperature = parseFloat(document.getElementById('ie-temperature').value);
        extensionSettings.maxTokens = parseInt(document.getElementById('ie-max-tokens').value);
        extensionSettings.voicesPerMessage = {
            min: parseInt(document.getElementById('ie-min-voices').value),
            max: parseInt(document.getElementById('ie-max-voices').value)
        };
        extensionSettings.showDiceRolls = document.getElementById('ie-show-dice-rolls').checked;
        extensionSettings.showFailedChecks = document.getElementById('ie-show-failed-checks').checked;

        saveState(getSTContext());
        console.log('[Inland Empire] Settings saved');
    }

    function populateBuildModal() {
        if (!currentBuild) initializeDefaultBuild();

        Object.keys(ATTRIBUTES).forEach(id => {
            const slider = document.getElementById(`ie-attr-${id}`);
            const valueDisplay = document.getElementById(`ie-attr-${id}-value`);
            if (slider && valueDisplay) {
                slider.value = currentBuild.attributePoints[id];
                valueDisplay.textContent = currentBuild.attributePoints[id];
            }
        });

        document.getElementById('ie-build-name').value = currentBuild.name;
        updateBuildEditorDisplay();
    }

    function updateBuildEditorDisplay() {
        let total = 0;

        Object.keys(ATTRIBUTES).forEach(id => {
            const slider = document.getElementById(`ie-attr-${id}`);
            const valueDisplay = document.getElementById(`ie-attr-${id}-value`);
            if (slider && valueDisplay) {
                const value = parseInt(slider.value);
                valueDisplay.textContent = value;
                total += value;
            }
        });

        const remaining = 12 - total;
        const remainingDisplay = document.getElementById('ie-points-remaining');
        if (remainingDisplay) {
            remainingDisplay.textContent = remaining;
            remainingDisplay.style.color = remaining === 0 ? '#90EE90' : remaining < 0 ? '#FF6347' : '#F0E68C';
        }

        const applyBtn = document.querySelector('.ie-btn-apply-build');
        if (applyBtn) applyBtn.disabled = remaining !== 0;
    }

    function applyBuildFromModal() {
        const attributePoints = {};
        Object.keys(ATTRIBUTES).forEach(id => {
            const slider = document.getElementById(`ie-attr-${id}`);
            if (slider) attributePoints[id] = parseInt(slider.value);
        });

        const buildName = document.getElementById('ie-build-name').value || 'Custom Build';

        try {
            applyAttributeAllocation(attributePoints);
            currentBuild.name = buildName;
            saveState(getSTContext());
            console.log('[Inland Empire] Build applied:', buildName);
        } catch (error) {
            console.error('[Inland Empire] Build error:', error);
            alert('Invalid build: ' + error.message);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // SETUP EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════

    function setupEventListeners() {
        // Settings button
        document.querySelector('.ie-btn-settings')?.addEventListener('click', () => {
            const modal = document.getElementById('inland-empire-settings-modal');
            if (modal) {
                populateSettingsModal();
                modal.style.display = 'flex';
            }
        });

        // Collapse button
        document.querySelector('.ie-btn-collapse')?.addEventListener('click', (e) => {
            const panel = document.getElementById('inland-empire-panel');
            const icon = e.currentTarget.querySelector('i');
            panel?.classList.toggle('collapsed');
            icon?.classList.toggle('fa-chevron-down');
            icon?.classList.toggle('fa-chevron-up');
        });

        // Manual trigger
        document.getElementById('ie-manual-trigger')?.addEventListener('click', onManualTrigger);

        // Clear voices
        document.querySelector('.ie-btn-clear-voices')?.addEventListener('click', () => {
            const container = document.getElementById('ie-voices-output');
            if (container) {
                container.innerHTML = `<div class="ie-voices-empty"><i class="fa-solid fa-comment-slash"></i><span>Waiting...</span></div>`;
            }
        });

        // Edit build button
        document.querySelector('.ie-btn-edit-build')?.addEventListener('click', () => {
            const modal = document.getElementById('inland-empire-build-modal');
            if (modal) {
                populateBuildModal();
                modal.style.display = 'flex';
            }
        });

        // Modal close buttons
        document.querySelectorAll('.ie-modal .ie-btn-close, .ie-modal .ie-btn-cancel').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.ie-modal').style.display = 'none';
            });
        });

        // Modal backdrops
        document.querySelectorAll('.ie-modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', () => {
                backdrop.closest('.ie-modal').style.display = 'none';
            });
        });

        // Save settings
        document.querySelector('.ie-btn-save')?.addEventListener('click', () => {
            saveSettingsFromModal();
            document.getElementById('inland-empire-settings-modal').style.display = 'none';
        });

        // Apply build
        document.querySelector('.ie-btn-apply-build')?.addEventListener('click', () => {
            applyBuildFromModal();
            document.getElementById('inland-empire-build-modal').style.display = 'none';
            renderAttributesDisplay();
        });

        // Build editor sliders
        document.querySelectorAll('.ie-attribute-slider').forEach(slider => {
            slider.addEventListener('input', updateBuildEditorDisplay);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // SETTINGS PANEL (for Extensions list)
    // ═══════════════════════════════════════════════════════════════

    function addExtensionSettings() {
        const settingsContainer = document.getElementById('extensions_settings2');
        if (!settingsContainer) {
            console.warn('[Inland Empire] extensions_settings2 not found, retrying...');
            setTimeout(addExtensionSettings, 1000);
            return;
        }

        // Check if already added
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
                        <small><b>Panel Controls:</b> Look for the floating "Psyche" panel on the right side of the screen. Use the ⚙️ button to configure your API.</small>
                        <br><br>
                        <button id="ie-toggle-panel-btn" class="menu_button">
                            <i class="fa-solid fa-eye"></i> Toggle Panel Visibility
                        </button>
                    </div>
                </div>
            </div>
        `;

        settingsContainer.insertAdjacentHTML('beforeend', settingsHtml);
        console.log('[Inland Empire] Settings panel added to extensions list');

        // Setup toggle
        const enabledCheckbox = document.getElementById('ie-extension-enabled');
        if (enabledCheckbox) {
            enabledCheckbox.addEventListener('change', (e) => {
                extensionSettings.enabled = e.target.checked;
                saveState(getSTContext());
                const panel = document.getElementById('inland-empire-panel');
                if (panel) {
                    panel.style.display = e.target.checked ? 'flex' : 'none';
                }
            });
        }

        // Toggle panel button
        const toggleBtn = document.getElementById('ie-toggle-panel-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const panel = document.getElementById('inland-empire-panel');
                if (panel) {
                    const isVisible = panel.style.display !== 'none';
                    panel.style.display = isVisible ? 'none' : 'flex';
                    console.log('[Inland Empire] Panel visibility toggled:', !isVisible);
                } else {
                    console.error('[Inland Empire] Panel not found!');
                    alert('Panel not found! Check console for errors.');
                }
            });
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

            // Load saved state
            loadState(context);
            console.log('[Inland Empire] State loaded, enabled:', extensionSettings.enabled);

            // Create UI elements
            console.log('[Inland Empire] Creating UI elements...');
            const panel = createPsychePanel();
            const settingsModal = createSettingsModal();
            const buildModal = createBuildEditorModal();

            // Find best place to inject panel
            // Try multiple possible containers
            const possibleContainers = [
                document.getElementById('sheld'),
                document.getElementById('chat'),
                document.querySelector('.chat-container'),
                document.querySelector('#chat_container'),
                document.body
            ];

            let injectionTarget = null;
            for (const container of possibleContainers) {
                if (container) {
                    injectionTarget = container;
                    break;
                }
            }

            if (injectionTarget === document.body) {
                console.log('[Inland Empire] Injecting panel into document.body');
            } else {
                console.log('[Inland Empire] Injecting panel into:', injectionTarget?.id || injectionTarget?.className);
            }

            injectionTarget.appendChild(panel);
            document.body.appendChild(settingsModal);
            document.body.appendChild(buildModal);

            console.log('[Inland Empire] UI elements injected');

            // Force panel to be visible
            panel.style.display = extensionSettings.enabled ? 'flex' : 'none';
            panel.style.zIndex = '9999';

            // Render initial state
            renderAttributesDisplay();
            console.log('[Inland Empire] Attributes rendered');

            // Setup event listeners
            setupEventListeners();
            console.log('[Inland Empire] Event listeners setup');

            // Add settings to extensions panel
            addExtensionSettings();

            // Register SillyTavern event hooks
            if (context.eventSource) {
                const eventTypes = context.event_types || (typeof event_types !== 'undefined' ? event_types : null);
                if (eventTypes && eventTypes.MESSAGE_RECEIVED) {
                    context.eventSource.on(eventTypes.MESSAGE_RECEIVED, onMessageReceived);
                    console.log('[Inland Empire] Registered MESSAGE_RECEIVED listener');
                } else {
                    console.warn('[Inland Empire] MESSAGE_RECEIVED event type not found');
                }
            } else {
                console.warn('[Inland Empire] eventSource not available');
            }

            console.log('[Inland Empire] ✅ Initialization complete');
            console.log('[Inland Empire] Panel element:', document.getElementById('inland-empire-panel'));

        } catch (error) {
            console.error('[Inland Empire] ❌ Initialization failed:', error);
            console.error('[Inland Empire] Stack:', error.stack);
        }
    }

    // Export for debugging
    window.InlandEmpire = {
        getSkillLevel,
        getAllSkillLevels,
        rollSkillCheck,
        SKILLS,
        ATTRIBUTES,
        DIFFICULTIES
    };

    // Bootstrap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    } else {
        setTimeout(init, 1000);
    }

})();
