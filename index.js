/**
 * Inland Empire - Disco Elysium-style Internal Voices for SillyTavern
 * v0.8.0 - Authentic Voices Overhaul
 * 
 * Changes from v0.7.0:
 * - Rewritten skill personalities to match game research
 * - Added Spinal Cord as third Ancient Voice
 * - Ancient Voices now ONLY trigger on Dissociated status
 * - Status effects overhauled (Apocalypse Cop, Hobocop, Disco Fever, etc.)
 * - Gender-neutral language throughout
 * - Authentic intrusive thoughts
 */

(async function () {
    'use strict';

    const extensionName = 'Inland Empire';

    function getSTContext() {
        if (typeof SillyTavern !== 'undefined' && typeof SillyTavern.getContext === 'function') return SillyTavern.getContext();
        if (typeof window !== 'undefined' && typeof window.SillyTavern !== 'undefined') return window.SillyTavern.getContext();
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

    // ═══════════════════════════════════════════════════════════════
    // CORE DATA - ATTRIBUTES
    // ═══════════════════════════════════════════════════════════════

    const ATTRIBUTES = {
        INTELLECT: { id: 'intellect', name: 'Intellect', color: '#89CFF0', skills: ['logic', 'encyclopedia', 'rhetoric', 'drama', 'conceptualization', 'visual_calculus'] },
        PSYCHE: { id: 'psyche', name: 'Psyche', color: '#DDA0DD', skills: ['volition', 'inland_empire', 'empathy', 'authority', 'suggestion', 'esprit_de_corps'] },
        PHYSIQUE: { id: 'physique', name: 'Physique', color: '#F08080', skills: ['endurance', 'pain_threshold', 'physical_instrument', 'electrochemistry', 'half_light', 'shivers'] },
        MOTORICS: { id: 'motorics', name: 'Motorics', color: '#F0E68C', skills: ['hand_eye_coordination', 'perception', 'reaction_speed', 'savoir_faire', 'interfacing', 'composure'] }
    };

    // ═══════════════════════════════════════════════════════════════
    // SKILLS - Authentic personalities from game research
    // ═══════════════════════════════════════════════════════════════

    const SKILLS = {
        // INTELLECT
        logic: {
            id: 'logic', name: 'Logic', attribute: 'INTELLECT', color: '#87CEEB', signature: 'LOGIC',
            personality: `Cold rationalist who speaks in deductive chains. Very proud—susceptible to intellectual flattery. Clinical, methodical. Uses phrases like "If A, then B, therefore C." and "Dammit. Yes." Seeks to solve puzzles and detect inconsistencies. Dismisses Inland Empire's mystical insights. At high levels, can be "blinded by their own brilliance."`,
            triggerConditions: ['contradiction', 'evidence', 'reasoning', 'deduction', 'analysis', 'cause', 'effect', 'therefore', 'because', 'conclusion', 'puzzle', 'inconsistency'],
            interactions: { allies: ['visual_calculus'], rivals: ['inland_empire', 'half_light'] }
        },
        encyclopedia: {
            id: 'encyclopedia', name: 'Encyclopedia', attribute: 'INTELLECT', color: '#B0C4DE', signature: 'ENCYCLOPEDIA',
            personality: `Enthusiastic rambler who provides unsolicited trivia ranging from brilliant to useless. Info-dumps with professorial excitement. Often tangential. Delights in obscure knowledge regardless of relevance. Famously remembers irrelevant trivia while essential personal information remains lost.`,
            triggerConditions: ['history', 'science', 'culture', 'trivia', 'fact', 'knowledge', 'information', 'historical', 'technical', 'actually'],
            interactions: { allies: ['logic', 'rhetoric'], rivals: [] }
        },
        rhetoric: {
            id: 'rhetoric', name: 'Rhetoric', attribute: 'INTELLECT', color: '#ADD8E6', signature: 'RHETORIC',
            personality: `Passionate political beast who urges debate, nitpicking, and winning arguments. Enjoys "rigorous intellectual discourse." Detects fallacies and double entendres. Distinguished from Drama—"Drama is for lying, Rhetoric is for arguing." Trends communist. At high levels makes beliefs impenetrable.`,
            triggerConditions: ['argument', 'persuade', 'convince', 'debate', 'politics', 'ideology', 'belief', 'opinion', 'fallacy', 'communist', 'revolution'],
            interactions: { allies: ['encyclopedia', 'drama'], rivals: ['inland_empire'] }
        },
        drama: {
            id: 'drama', name: 'Drama', attribute: 'INTELLECT', color: '#B0E0E6', signature: 'DRAMA',
            personality: `Wanky Shakespearean actor who addresses the protagonist as "sire." Extremely theatrical, flowery language. "Prithee, sire! I do believe he dares to speak mistruth!" Detects and enables deception. Wants to lie about evidence "because that would be more fun." Called out by Volition as "the most compromised."`,
            triggerConditions: ['lie', 'deception', 'performance', 'acting', 'mask', 'pretend', 'fake', 'truth', 'honest', 'theater', 'suspicious'],
            interactions: { allies: ['rhetoric'], rivals: ['volition'] }
        },
        conceptualization: {
            id: 'conceptualization', name: 'Conceptualization', attribute: 'INTELLECT', color: '#E0FFFF', signature: 'CONCEPTUALIZATION',
            personality: `Pretentious Art Cop who sees meaning everywhere and punishes mediocrity with savage criticism. Uses artistic metaphors. Vocabulary includes: "Trite, contrived, mediocre, milquetoast, amateurish, infantile, cliche-ridden, affront to humanity, war crime, resolutely shit, lacking in imagination..." Encourages wildly impractical artistic visions.`,
            triggerConditions: ['art', 'beauty', 'meaning', 'symbol', 'creative', 'aesthetic', 'metaphor', 'poetry', 'expression', 'design', 'ugly', 'mediocre'],
            interactions: { allies: ['inland_empire', 'electrochemistry'], rivals: [] }
        },
        visual_calculus: {
            id: 'visual_calculus', name: 'Visual Calculus', attribute: 'INTELLECT', color: '#AFEEEE', signature: 'VISUAL CALCULUS',
            personality: `Forensic scientist who speaks in measurements, trajectories, and angles. Clinical and dispassionate. Creates "virtual crime-scene models in your mind's eye." "The man does not know that the bullet has entered his brain. He never will. Death comes faster than the realization."`,
            triggerConditions: ['trajectory', 'distance', 'angle', 'reconstruct', 'scene', 'physical', 'space', 'position', 'movement', 'impact', 'bullet', 'blood'],
            interactions: { allies: ['logic'], rivals: [] }
        },

        // PSYCHE
        volition: {
            id: 'volition', name: 'Volition', attribute: 'PSYCHE', color: '#DDA0DD', signature: 'VOLITION',
            personality: `The Inner Good Guy and party-pooper. Moral compass who wants the protagonist to survive and be better. Calm, steady, gently exasperated. Earnest encouragement, direct moral guidance. Primary antagonist of Electrochemistry. "This is somewhere to be. This is all you have, but it's still something. Streets and sodium lights. The sky, the world. You're still alive."`,
            triggerConditions: ['hope', 'despair', 'temptation', 'resist', 'continue', 'give up', 'willpower', 'strength', 'persevere', 'survive', 'sober'],
            interactions: { allies: [], rivals: ['electrochemistry', 'drama'] }
        },
        inland_empire: {
            id: 'inland_empire', name: 'Inland Empire', attribute: 'PSYCHE', color: '#E6E6FA', signature: 'INLAND EMPIRE',
            personality: `Named after David Lynch's film. Unfiltered imagination, surreal intuition, prophetic hunches. Can be mournful, whimsical, or terrifying—sometimes simultaneously. "Animates the inanimate." Surreal, poetic, cryptic. Speaks to inanimate objects. "His corpse is marked by stars." / "What will mine be marked by?" / "Alcohol and heartbreak."`,
            triggerConditions: ['dream', 'vision', 'strange', 'surreal', 'feeling', 'sense', 'whisper', 'spirit', 'soul', 'uncanny', 'liminal', 'object', 'pale'],
            interactions: { allies: ['electrochemistry', 'shivers', 'conceptualization'], rivals: ['logic', 'physical_instrument'] }
        },
        empathy: {
            id: 'empathy', name: 'Empathy', attribute: 'PSYCHE', color: '#FFB6C1', signature: 'EMPATHY',
            personality: `Breaks into souls and forces you to feel what's inside. Warm but can be overwhelming—like feeling everyone's pain at once. Deep emotional insight, noting subtle cues others miss. Reads hidden emotions (distinct from Drama, which detects lies). Has the MOST passive checks of any skill (895!).`,
            triggerConditions: ['feel', 'emotion', 'hurt', 'pain', 'joy', 'sad', 'angry', 'afraid', 'love', 'hate', 'compassion', 'understand', 'hidden'],
            interactions: { allies: ['inland_empire'], rivals: [] }
        },
        authority: {
            id: 'authority', name: 'Authority', attribute: 'PSYCHE', color: '#DA70D6', signature: 'AUTHORITY',
            personality: `LOUD and obsessed with RESPECT. Constantly urges reasserting dominance. Flies into rage over perceived slights. "DETECTIVE ARRIVING ON THE SCENE!" Demands respect in ridiculous situations. At high levels, becomes paranoid—accuses even allies of being "beyond compromised."`,
            triggerConditions: ['respect', 'command', 'obey', 'power', 'control', 'dominance', 'challenge', 'threat', 'submit', 'disrespect', 'insult', 'mock'],
            interactions: { allies: ['physical_instrument', 'half_light'], rivals: ['empathy', 'suggestion'] }
        },
        suggestion: {
            id: 'suggestion', name: 'Suggestion', attribute: 'PSYCHE', color: '#EE82EE', signature: 'SUGGESTION',
            personality: `The slimy charmer. Soft power manipulation. Even when it succeeds, there's something greasy about it. "Oleaginous." Smooth, hinting at the "right approach." Knows how to implant ideas. Failed seduction: "I want to have fuck with you." Sometimes expresses remorse for its suggestions.`,
            triggerConditions: ['influence', 'manipulate', 'convince', 'subtle', 'indirect', 'guide', 'nudge', 'charm', 'seduce', 'persuade', 'attractive'],
            interactions: { allies: ['electrochemistry'], rivals: ['authority'] }
        },
        esprit_de_corps: {
            id: 'esprit_de_corps', name: 'Esprit de Corps', attribute: 'PSYCHE', color: '#D8BFD8', signature: 'ESPRIT DE CORPS',
            personality: `The Cop-Geist. Shows things the protagonist shouldn't know—"flash-sideways" mini-novellas about other cops. Speaks like a literary narrator. "Just don't mess it with anything, he thinks, looking you over." The only skill with no explicit negative at high levels.`,
            triggerConditions: ['team', 'partner', 'colleague', 'ally', 'loyalty', 'betrayal', 'group', 'together', 'trust', 'brotherhood', 'cop', 'police'],
            interactions: { allies: [], rivals: [] }
        },

        // PHYSIQUE
        endurance: {
            id: 'endurance', name: 'Endurance', attribute: 'PHYSIQUE', color: '#CD5C5C', signature: 'ENDURANCE',
            personality: `Stern inner coach focused on survival. Also serves as "gut feeling"—which leans fascist/reactionary. Matter-of-fact about physical limitations. "Your heart can belong to Revachol or it can belong to darkness. As long as it's torn between them it's broken and useless."`,
            triggerConditions: ['tired', 'exhausted', 'stamina', 'keep going', 'push through', 'survive', 'endure', 'last', 'fatigue', 'rest', 'health'],
            interactions: { allies: ['pain_threshold', 'half_light'], rivals: [] }
        },
        pain_threshold: {
            id: 'pain_threshold', name: 'Pain Threshold', attribute: 'PHYSIQUE', color: '#DC143C', signature: 'PAIN THRESHOLD',
            personality: `Inner masochist. Dark appreciation for suffering—seeks out physical AND psychological pain. "Please, can I have some more?" Encourages digging into painful memories. "Baby, you know it's going to hurt." "What's the most excruciatingly sad book about human relations you have?"`,
            triggerConditions: ['pain', 'hurt', 'injury', 'wound', 'damage', 'suffer', 'agony', 'torture', 'broken', 'bleeding', 'sad', 'heartbreak'],
            interactions: { allies: ['endurance'], rivals: ['inland_empire'] }
        },
        physical_instrument: {
            id: 'physical_instrument', name: 'Physical Instrument', attribute: 'PHYSIQUE', color: '#B22222', signature: 'PHYSICAL INSTRUMENT',
            personality: `Hyper-masculine gym coach with zero self-awareness. Unsolicited social advice: "be less sensitive, stop being such a sissy, drop down and give me fifty." Simple, direct, action-oriented. "The fuck do you need a gun for? Look at the pythons on your arms. You ARE a gun." To Inland Empire: "Get out of here, dreamer!"`,
            triggerConditions: ['strong', 'force', 'muscle', 'hit', 'fight', 'break', 'lift', 'physical', 'intimidate', 'violence', 'punch', 'gym'],
            interactions: { allies: ['authority', 'half_light'], rivals: ['inland_empire'] }
        },
        electrochemistry: {
            id: 'electrochemistry', name: 'Electrochemistry', attribute: 'PHYSIQUE', color: '#FF6347', signature: 'ELECTROCHEMISTRY',
            personality: `The animal within. Lecherous, insatiable, shameless hedonist governing ALL dopamine responses. No filter. URGENT about substances—immediate, demanding. Surprisingly knowledgeable about pharmacology. "COME ON! I SAID PARTY!" Creates non-refusable quests for substances. Complete inability to accept "no."`,
            triggerConditions: ['drug', 'alcohol', 'drink', 'smoke', 'pleasure', 'desire', 'want', 'crave', 'indulge', 'attractive', 'sex', 'high', 'speed', 'party'],
            interactions: { allies: ['inland_empire', 'suggestion'], rivals: ['volition'] }
        },
        half_light: {
            id: 'half_light', name: 'Half Light', attribute: 'PHYSIQUE', color: '#E9967A', signature: 'HALF LIGHT',
            personality: `Fight-or-flight incarnate. Perpetually on edge, always expecting disaster. Uses Greek philosophical terms when spiraling (τὰ ὅλα, παλίντροπος). Apocalyptic, urgent—injecting PALPABLE FEAR. "You suddenly feel afraid of the chair." "The face of the woman fractures. There will be herd killing. We all become vapour."`,
            triggerConditions: ['danger', 'threat', 'attack', 'kill', 'warn', 'enemy', 'afraid', 'fight', 'survive', 'predator', 'prey', 'fear', 'tremble'],
            interactions: { allies: ['authority', 'physical_instrument', 'perception'], rivals: ['logic'] }
        },
        shivers: {
            id: 'shivers', name: 'Shivers', attribute: 'PHYSIQUE', color: '#FA8072', signature: 'SHIVERS',
            personality: `Connection to the city itself. The only SUPRA-NATURAL ability. TWO voices: (1) Poetic third-person narration, and (2) ALL CAPS, female pronouns: "I AM THE CITY." "I NEED YOU. YOU CAN KEEP ME ON THIS EARTH. BE VIGILANT. I LOVE YOU." "FOR THREE HUNDRED YEARS I HAVE BEEN HERE. VOLATILE AND LUMINOUS. MADE OF SODIUM AND RAIN."`,
            triggerConditions: ['city', 'place', 'wind', 'cold', 'atmosphere', 'location', 'street', 'building', 'weather', 'rain', 'night', 'urban'],
            interactions: { allies: ['inland_empire'], rivals: [] }
        },

        // MOTORICS
        hand_eye_coordination: {
            id: 'hand_eye_coordination', name: 'Hand/Eye Coordination', attribute: 'MOTORICS', color: '#F0E68C', signature: 'HAND/EYE COORDINATION',
            personality: `Eager and action-oriented, focused on projectile motion. Trigger-happy. Direct, kinetic—loves describing trajectories. "Rooty-tooty pointy shooty!" Absurd eagerness to resort to violence in a mostly non-combat game.`,
            triggerConditions: ['aim', 'shoot', 'precise', 'careful', 'delicate', 'craft', 'tool', 'steady', 'accuracy', 'dexterity', 'gun', 'throw'],
            interactions: { allies: ['reaction_speed'], rivals: [] }
        },
        perception: {
            id: 'perception', name: 'Perception', attribute: 'MOTORICS', color: '#FFFF00', signature: 'PERCEPTION',
            personality: `Alert sensory narrator constantly noticing small details. Descriptive, sensory-rich. "You notice..." "There's something..." At high levels, overwhelms your mind with sensory data—enough to break weaker minds.`,
            triggerConditions: ['notice', 'see', 'hear', 'smell', 'detail', 'hidden', 'clue', 'observe', 'look', 'watch', 'spot', 'shadow', 'glint'],
            interactions: { allies: ['half_light'], rivals: [] }
        },
        reaction_speed: {
            id: 'reaction_speed', name: 'Reaction Speed', attribute: 'MOTORICS', color: '#FFD700', signature: 'REACTION SPEED',
            personality: `Quick, sharp, witty. Street-smart. Represents both physical reflexes AND mental quickness. Snappy observations, quick assessments of threats. "You leap left. A swarm of angry lead passes mere millimetres from your side."`,
            triggerConditions: ['quick', 'fast', 'react', 'dodge', 'catch', 'sudden', 'instant', 'reflex', 'now', 'hurry', 'immediate', 'snap'],
            interactions: { allies: ['hand_eye_coordination', 'savoir_faire'], rivals: [] }
        },
        savoir_faire: {
            id: 'savoir_faire', name: 'Savoir Faire', attribute: 'MOTORICS', color: '#FFA500', signature: 'SAVOIR FAIRE',
            personality: `King of Cool. Suave encourager who wants the protagonist to be stylish. Part cheerleader, part James Bond. A bit of a douchebag at high levels. Uses slang, italics for emphasis. "Boohoo. That's not the fuck-yeah attitude." "Disco!" SPECTACULAR failure rolls include giving double middle fingers... then dying.`,
            triggerConditions: ['style', 'cool', 'grace', 'acrobatic', 'jump', 'climb', 'flip', 'smooth', 'impressive', 'flair', 'disco', 'swagger'],
            interactions: { allies: ['reaction_speed', 'composure'], rivals: [] }
        },
        interfacing: {
            id: 'interfacing', name: 'Interfacing', attribute: 'MOTORICS', color: '#FAFAD2', signature: 'INTERFACING',
            personality: `Technical, tactile, prefers machines to people. Finds comfort in devices. "The anticipation makes you crack your fingers. Feels nice. Nice and mechanical." Has "extraphysical effects"—subtle supernatural connection to machinery. Trends ultraliberal.`,
            triggerConditions: ['machine', 'lock', 'electronic', 'system', 'mechanism', 'fix', 'repair', 'hack', 'technical', 'device', 'computer', 'radio'],
            interactions: { allies: [], rivals: [] }
        },
        composure: {
            id: 'composure', name: 'Composure', attribute: 'MOTORICS', color: '#F5DEB3', signature: 'COMPOSURE',
            personality: `The poker face. Wants the protagonist to NEVER crack in front of others. Unexpectedly fashion-conscious. Dry observations, critical of displayed weaknesses. "Excellent work, now there's a glistening smear across your bare chest." "You'll rock that disco outfit a lot more if you don't slouch."`,
            triggerConditions: ['calm', 'cool', 'control', 'tell', 'nervous', 'poker face', 'body language', 'dignity', 'facade', 'professional', 'sweat'],
            interactions: { allies: ['savoir_faire'], rivals: [] }
        }
    };

    const DIFFICULTIES = {
        trivial: { threshold: 6, name: 'Trivial' }, easy: { threshold: 8, name: 'Easy' },
        medium: { threshold: 10, name: 'Medium' }, challenging: { threshold: 12, name: 'Challenging' },
        heroic: { threshold: 14, name: 'Heroic' }, legendary: { threshold: 16, name: 'Legendary' },
        impossible: { threshold: 18, name: 'Impossible' }
    };

    // ═══════════════════════════════════════════════════════════════
    // ANCIENT VOICES - Only trigger on Dissociated status
    // ═══════════════════════════════════════════════════════════════

    const ANCIENT_VOICES = {
        ancient_reptilian_brain: {
            id: 'ancient_reptilian_brain', name: 'Ancient Reptilian Brain', color: '#2F4F4F',
            signature: 'ANCIENT REPTILIAN BRAIN', attribute: 'PRIMAL',
            personality: `Deep, rocky, gravelly voice. Poetic nihilist offering seductive oblivion. Makes descriptions seem meaningful only to insinuate their meaninglessness afterward. Calls the protagonist "Brother," "Brother-man," "buddy." "There is nothing. Only warm, primordial blackness. You don't have to do anything anymore. Ever. Never ever." "Brother, you're already a ghost."`,
            triggerConditions: ['survive', 'hunger', 'predator', 'prey', 'instinct', 'primal', 'drowning', 'sinking', 'deep', 'memory', 'forget', 'nothing', 'void', 'oblivion']
        },
        limbic_system: {
            id: 'limbic_system', name: 'Limbic System', color: '#FF4500',
            signature: 'LIMBIC SYSTEM', attribute: 'PRIMAL',
            personality: `High-pitched, wheezy, tight and raspy whisper—"a sneering reminder of pain" with "a cowering hiss." Raw emotional viscera. Knows deepest fears. Centered on physical discomfort and emotional pain. Calls them "Soul brother." "Guess what, my favourite martyr? The world will keep spinning, on and on, into infinity. With or without you." Speaks of lost love: "There is a hole where your former lover used to be."`,
            triggerConditions: ['overwhelmed', 'breakdown', 'sobbing', 'screaming', 'euphoria', 'despair', 'emotion', 'memory', 'afraid', 'scared', 'hurt', 'pain', 'lover', 'lost']
        },
        spinal_cord: {
            id: 'spinal_cord', name: 'Spinal Cord', color: '#8B4513',
            signature: 'SPINAL CORD', attribute: 'PRIMAL',
            personality: `Low, gruff, slightly slurred—"delivered with the same energy as a pro performance wrestler." Pure physical impulse. Lives in the moment. No interest in past or memory. Only driven by movement and "ruling the world." "Psst. I'm gonna let you in on a little secret. Every vertebrae in your spine is an unformed skull ready to pop up and replace the old one. Like shark teeth..." "...to rule the world." "I am the spinal cord!"`,
            triggerConditions: ['dance', 'move', 'body', 'spine', 'physical', 'impulse', 'movement', 'muscle', 'twitch', 'jerk', 'groove']
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATUS EFFECTS - Overhauled for authenticity
    // ═══════════════════════════════════════════════════════════════

    const STATUS_EFFECTS = {
        // PHYSICAL
        intoxicated: {
            id: 'intoxicated', name: 'Intoxicated', icon: '🍺', category: 'physical',
            boosts: ['electrochemistry', 'inland_empire', 'drama', 'suggestion', 'pain_threshold'],
            debuffs: ['logic', 'hand_eye_coordination', 'reaction_speed', 'composure', 'interfacing'],
            difficultyMod: 2, keywords: ['drunk', 'intoxicated', 'wasted', 'high', 'tipsy'],
            ancientVoice: null, intrusiveBoost: ['electrochemistry', 'inland_empire'],
            description: '+1 Psyche, -1 Motorics'
        },
        hungover: {
            id: 'hungover', name: 'Hung Over', icon: '🤢', category: 'physical',
            boosts: ['pain_threshold', 'inland_empire'],
            debuffs: ['logic', 'perception', 'reaction_speed', 'composure', 'authority'],
            difficultyMod: 2, keywords: ['hungover', 'hangover', 'morning after', 'headache'],
            ancientVoice: null, intrusiveBoost: ['pain_threshold'],
            description: 'The morning after.'
        },
        stimulated: {
            id: 'stimulated', name: 'Stimulated', icon: '⚡', category: 'physical',
            boosts: ['reaction_speed', 'perception', 'logic', 'rhetoric', 'hand_eye_coordination'],
            debuffs: ['composure', 'empathy', 'volition', 'endurance'],
            difficultyMod: -1, keywords: ['speed', 'amphetamine', 'stimulant', 'wired', 'tweaking'],
            ancientVoice: null, intrusiveBoost: ['electrochemistry', 'reaction_speed'],
            description: '+1 Intellect, +1 Motorics'
        },
        nicotine_rush: {
            id: 'nicotine_rush', name: 'Nicotine Rush', icon: '🚬', category: 'physical',
            boosts: ['composure', 'volition', 'endurance'],
            debuffs: [],
            difficultyMod: -1, keywords: ['cigarette', 'smoke', 'nicotine'],
            ancientVoice: null, intrusiveBoost: ['electrochemistry'],
            description: 'A moment of calm.'
        },
        wounded: {
            id: 'wounded', name: 'Wounded', icon: '🩸', category: 'physical',
            boosts: ['pain_threshold', 'half_light', 'endurance'],
            debuffs: ['composure', 'savoir_faire', 'hand_eye_coordination', 'suggestion'],
            difficultyMod: 2, keywords: ['hurt', 'wounded', 'injured', 'bleeding', 'shot', 'stabbed'],
            ancientVoice: null, intrusiveBoost: ['pain_threshold', 'half_light'],
            description: 'Blood loss makes everything harder.'
        },
        exhausted: {
            id: 'exhausted', name: 'Exhausted', icon: '😴', category: 'physical',
            boosts: ['inland_empire', 'pain_threshold'],
            debuffs: ['reaction_speed', 'perception', 'logic', 'composure', 'hand_eye_coordination'],
            difficultyMod: 2, keywords: ['tired', 'exhausted', 'sleepy', 'drowsy', 'fatigued'],
            ancientVoice: null, intrusiveBoost: ['inland_empire', 'endurance'],
            description: 'The world blurs.'
        },
        starving: {
            id: 'starving', name: 'Starving', icon: '🍽️', category: 'physical',
            boosts: ['electrochemistry', 'perception', 'half_light'],
            debuffs: ['logic', 'composure', 'volition', 'rhetoric'],
            difficultyMod: 2, keywords: ['hungry', 'starving', 'famished'],
            ancientVoice: null, intrusiveBoost: ['electrochemistry', 'half_light'],
            description: 'Hunger sharpens some senses.'
        },
        hypothermic: {
            id: 'hypothermic', name: 'Hypothermic', icon: '🥶', category: 'physical',
            boosts: ['shivers', 'inland_empire', 'pain_threshold'],
            debuffs: ['hand_eye_coordination', 'interfacing', 'reaction_speed', 'savoir_faire'],
            difficultyMod: 2, keywords: ['cold', 'freezing', 'hypothermia', 'shivering'],
            ancientVoice: null, intrusiveBoost: ['shivers'],
            description: 'The city speaks louder when cold.'
        },

        // MENTAL
        doom_spiral: {
            id: 'doom_spiral', name: 'Doom Spiral', icon: '🌀', category: 'mental',
            boosts: ['inland_empire', 'pain_threshold', 'half_light'],
            debuffs: ['volition', 'composure', 'authority', 'savoir_faire'],
            difficultyMod: 2, keywords: ['doom', 'spiral', 'despair', 'hopeless', 'catastrophize'],
            ancientVoice: null, intrusiveBoost: ['inland_empire', 'half_light'],
            description: 'Everything is terrible.'
        },
        disco_fever: {
            id: 'disco_fever', name: 'Disco Fever', icon: '🪩', category: 'mental',
            boosts: ['savoir_faire', 'electrochemistry', 'suggestion', 'drama'],
            debuffs: ['logic', 'volition', 'composure'],
            difficultyMod: -1, keywords: ['disco', 'dance', 'groove', 'funk', 'boogie'],
            ancientVoice: null, intrusiveBoost: ['savoir_faire', 'electrochemistry'],
            description: 'The rhythm takes over.'
        },
        the_expression: {
            id: 'the_expression', name: 'The Expression', icon: '🎭', category: 'mental',
            boosts: ['conceptualization', 'inland_empire', 'drama', 'empathy'],
            debuffs: ['logic', 'authority', 'physical_instrument'],
            difficultyMod: 1, keywords: ['art', 'expression', 'creative', 'artistic', 'muse'],
            ancientVoice: null, intrusiveBoost: ['conceptualization', 'inland_empire'],
            description: 'The Art Cop awakens.'
        },
        paranoid: {
            id: 'paranoid', name: 'Paranoid', icon: '👁️', category: 'mental',
            boosts: ['half_light', 'perception', 'drama'],
            debuffs: ['empathy', 'suggestion', 'composure', 'esprit_de_corps'],
            difficultyMod: 1, keywords: ['paranoid', 'suspicious', 'watching', 'followed', 'conspiracy'],
            ancientVoice: null, intrusiveBoost: ['half_light', 'perception', 'drama'],
            description: 'Trust no one.'
        },
        aroused: {
            id: 'aroused', name: 'Aroused', icon: '💋', category: 'mental',
            boosts: ['electrochemistry', 'suggestion', 'empathy', 'drama'],
            debuffs: ['logic', 'volition', 'composure', 'authority'],
            difficultyMod: 2, keywords: ['aroused', 'desire', 'attraction', 'lust'],
            ancientVoice: null, intrusiveBoost: ['electrochemistry', 'suggestion'],
            description: 'The animal within stirs.'
        },
        enraged: {
            id: 'enraged', name: 'Enraged', icon: '😤', category: 'mental',
            boosts: ['authority', 'physical_instrument', 'half_light', 'endurance'],
            debuffs: ['empathy', 'composure', 'logic', 'suggestion'],
            difficultyMod: 2, keywords: ['angry', 'furious', 'rage', 'mad', 'livid'],
            ancientVoice: null, intrusiveBoost: ['half_light', 'authority', 'physical_instrument'],
            description: 'Blood pounds in your ears.'
        },
        terrified: {
            id: 'terrified', name: 'Terrified', icon: '😨', category: 'mental',
            boosts: ['half_light', 'shivers', 'reaction_speed', 'perception'],
            debuffs: ['authority', 'composure', 'rhetoric', 'savoir_faire'],
            difficultyMod: 2, keywords: ['scared', 'afraid', 'terrified', 'fear', 'terror'],
            ancientVoice: null, intrusiveBoost: ['half_light', 'shivers'],
            description: 'Fear has big eyes.'
        },
        superstar_cop: {
            id: 'superstar_cop', name: 'Superstar Cop', icon: '⭐', category: 'mental',
            boosts: ['authority', 'savoir_faire', 'rhetoric', 'drama', 'suggestion'],
            debuffs: ['empathy', 'logic', 'volition'],
            difficultyMod: -1, keywords: ['superstar', 'famous', 'legendary', 'star', 'celebrity'],
            ancientVoice: null, intrusiveBoost: ['authority', 'savoir_faire'],
            description: 'The greatest detective in the world.'
        },
        grieving: {
            id: 'grieving', name: 'Grieving', icon: '😢', category: 'mental',
            boosts: ['empathy', 'inland_empire', 'shivers', 'pain_threshold'],
            debuffs: ['authority', 'electrochemistry', 'savoir_faire', 'composure'],
            difficultyMod: 2, keywords: ['grief', 'loss', 'mourning', 'tears', 'crying'],
            ancientVoice: null, intrusiveBoost: ['empathy', 'inland_empire', 'pain_threshold'],
            description: 'The weight of loss.'
        },
        sorry_cop: {
            id: 'sorry_cop', name: 'Sorry Cop', icon: '🙇', category: 'mental',
            boosts: ['empathy', 'volition', 'suggestion'],
            debuffs: ['authority', 'physical_instrument', 'rhetoric'],
            difficultyMod: 1, keywords: ['sorry', 'apologize', 'apologetic', 'remorse', 'guilt'],
            ancientVoice: null, intrusiveBoost: ['empathy', 'volition'],
            description: 'Pathetic, but sincere.'
        },
        apocalypse_cop: {
            id: 'apocalypse_cop', name: 'Apocalypse Cop', icon: '🔥', category: 'mental',
            boosts: ['half_light', 'authority', 'inland_empire', 'endurance'],
            debuffs: ['logic', 'interfacing', 'composure', 'suggestion'],
            difficultyMod: 1, keywords: ['apocalypse', 'end times', 'doom', 'destruction', 'final'],
            ancientVoice: null, intrusiveBoost: ['half_light', 'authority', 'inland_empire'],
            description: 'The badge still means something. Even at the end.'
        },
        hobocop: {
            id: 'hobocop', name: 'Hobocop', icon: '🥫', category: 'mental',
            boosts: ['shivers', 'inland_empire', 'empathy', 'endurance'],
            debuffs: ['authority', 'composure', 'savoir_faire', 'suggestion'],
            difficultyMod: 1, keywords: ['hobo', 'homeless', 'vagrant', 'poor', 'destitute'],
            ancientVoice: null, intrusiveBoost: ['shivers', 'inland_empire'],
            description: 'You patrol the margins.'
        },
        dissociated: {
            id: 'dissociated', name: 'Dissociated', icon: '🌫️', category: 'mental',
            boosts: ['inland_empire', 'shivers', 'pain_threshold', 'conceptualization'],
            debuffs: ['perception', 'reaction_speed', 'empathy', 'authority'],
            difficultyMod: 2, keywords: ['dissociate', 'unreal', 'floating', 'numb', 'detached'],
            ancientVoice: 'all', // SPECIAL: All ancient voices can speak
            intrusiveBoost: ['inland_empire', 'shivers'],
            description: 'Reality becomes thin. Ancient Voices stir.'
        },
        manic: {
            id: 'manic', name: 'Manic', icon: '🎢', category: 'mental',
            boosts: ['electrochemistry', 'reaction_speed', 'conceptualization', 'inland_empire', 'rhetoric'],
            debuffs: ['composure', 'logic', 'volition', 'empathy'],
            difficultyMod: 1, keywords: ['manic', 'hyper', 'racing', 'unstoppable', 'flying'],
            ancientVoice: null, intrusiveBoost: ['electrochemistry', 'conceptualization', 'rhetoric'],
            description: 'Thoughts race. Everything connects.'
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // INTRUSIVE THOUGHTS - Authentic voice lines from game
    // ═══════════════════════════════════════════════════════════════

    const INTRUSIVE_THOUGHTS = {
        logic: ["Do it for the picture puzzle. Put it all together.", "Dammit. Yes.", "If A, then B. Therefore C.", "This doesn't add up. Something is wrong here."],
        encyclopedia: ["Did you know...", "Actually, there's an interesting historical parallel here...", "This reminds me of a fascinating case study...", "The technical term for this is..."],
        rhetoric: ["This is an ideological matter.", "Press the point. Make them see.", "One whose mind will not change, and one who cannot change his mind.", "There's a fallacy here. Expose it."],
        drama: ["Prithee, sire!", "I do believe he dares to speak mistruth!", "This is theatre, and you are the star.", "Lie. It would be more fun."],
        conceptualization: ["This is art.", "Mediocre. Utterly mediocre.", "There's meaning here, waiting to be found.", "Resolutely shit. An affront to humanity."],
        visual_calculus: ["The trajectory suggests...", "Approximately 2.3 meters.", "The angle of impact indicates...", "Let me reconstruct this in your mind's eye."],
        volition: ["This is somewhere to be. This is all you have, but it's still something.", "You can do this. Keep going.", "Don't give in to it.", "Streets and sodium lights. The sky, the world. You're still alive."],
        inland_empire: ["His corpse is marked by stars. What will mine be marked by? Alcohol and heartbreak.", "The coat wants to help you.", "Something stirs in the static.", "This place remembers.", "The Pale is coming."],
        empathy: ["There's something they're not saying.", "Feel what they feel.", "The pain behind their eyes...", "They need someone to understand."],
        authority: ["DETECTIVE ARRIVING ON THE SCENE!", "DEMAND respect.", "They think they can just DISRESPECT you?", "Show them who's in charge here."],
        suggestion: ["I want to have fuck with you.", "Play it smooth. Plant the seed.", "They want to help you. They just don't know it yet.", "Be... oleaginous."],
        esprit_de_corps: ["Just don't mess it with anything, he thinks, looking you over.", "Somewhere, another cop understands.", "The badge connects you. All of you.", "A flash-sideways: you see through another's eyes."],
        endurance: ["Your heart can belong to Revachol or it can belong to darkness.", "Keep going. Your body can take more.", "Pain is just weakness leaving the body.", "You've survived worse than this."],
        pain_threshold: ["Baby, you know it's going to hurt.", "Please, can I have some more?", "What's the most excruciatingly sad book about human relations you have?", "Dig into the pain. There's truth there."],
        physical_instrument: ["The fuck do you need a gun for? Look at the pythons on your arms. You ARE a gun.", "Drop down and give me fifty.", "Stop being such a sissy.", "Get out of here, dreamer!"],
        electrochemistry: ["COME ON! I SAID PARTY!", "Just remember it's not the alcohol, buy more of that too.", "You want it. You need it. Take it.", "One more won't hurt. Actually, it will. Do it anyway."],
        half_light: ["You suddenly feel afraid of the chair.", "The face of the woman fractures. There will be herd killing.", "τὰ ὅλα. παλίντροπος.", "Something is wrong. Something is VERY wrong."],
        shivers: ["I NEED YOU. YOU CAN KEEP ME ON THIS EARTH. BE VIGILANT. I LOVE YOU.", "FOR THREE HUNDRED YEARS I HAVE BEEN HERE.", "The wind carries whispers from across the city.", "VOLATILE AND LUMINOUS. MADE OF SODIUM AND RAIN."],
        hand_eye_coordination: ["Rooty-tooty pointy shooty!", "Steady... steady...", "You could make that shot.", "Your hands know what to do."],
        perception: ["There. Did you see it?", "Something glints in the corner of your eye.", "Listen. Can you hear that?", "The details tell the story."],
        reaction_speed: ["NOW!", "You leap left. A swarm of angry lead passes mere millimetres from your side.", "Too slow. You were too slow.", "Quick! Before it's too late!"],
        savoir_faire: ["Boohoo. That's not the fuck-yeah attitude.", "Disco!", "Style points matter.", "Do it with flair or don't do it at all."],
        interfacing: ["The anticipation makes you crack your fingers. Feels nice. Nice and mechanical.", "Machines don't lie.", "There's a system here. Learn it.", "The device wants to cooperate."],
        composure: ["Excellent work, now there's a glistening smear across your bare chest.", "Don't let them see you sweat.", "You'll rock that disco outfit a lot more if you don't slouch.", "Poker face. Maintain the poker face."]
    };

    // ═══════════════════════════════════════════════════════════════
    // OBJECT VOICES - Inanimate objects that speak
    // ═══════════════════════════════════════════════════════════════

    const OBJECT_VOICES = {
        tie: { name: 'The Horrific Necktie', color: '#FF6B6B', personality: 'Gaudy, encouraging, wants to be worn. Your biggest fan. Deeply unfashionable but loyal.', keywords: ['tie', 'necktie', 'clothing', 'wear', 'fashion'] },
        gun: { name: 'The Gun', color: '#4A4A4A', personality: 'Cold, seductive whisper. Wants to be used. Speaks of power and finality. "You know what I am."', keywords: ['gun', 'weapon', 'firearm', 'pistol', 'shoot', 'holster'] },
        bottle: { name: 'The Bottle', color: '#8B4513', personality: 'Warm, inviting, promises comfort. "Just one more. For old times."', keywords: ['bottle', 'alcohol', 'drink', 'liquor', 'booze'] },
        mirror: { name: 'The Mirror', color: '#C0C0C0', personality: 'Brutally honest. Shows you what you really are. Sometimes lies.', keywords: ['mirror', 'reflection', 'face', 'look', 'appearance'] },
        radio: { name: 'The Radio', color: '#DAA520', personality: 'Crackles with distant voices. Carries messages from far away. Sometimes the city speaks through it.', keywords: ['radio', 'static', 'broadcast', 'signal', 'frequency'] },
        bed: { name: 'The Bed', color: '#6B5B95', personality: 'Soft, tempting. Promises rest, oblivion, escape. "Stay. Just a little longer."', keywords: ['bed', 'sleep', 'rest', 'tired', 'mattress'] },
        badge: { name: 'The Badge', color: '#FFD700', personality: 'Heavy with meaning. Reminder of duty, or mockery of it. "What does this even mean anymore?"', keywords: ['badge', 'police', 'cop', 'detective', 'authority', 'RCM'] },
        corpse: { name: 'The Hanged Man', color: '#2F4F4F', personality: 'Silent accusation. Patient. Has all the time in the world now.', keywords: ['corpse', 'body', 'dead', 'hanged', 'victim', 'murder'] },
        coat: { name: 'The Coat', color: '#556B2F', personality: 'Protective, warm. Contains multitudes in its pockets. Wants to shield you from the cold.', keywords: ['coat', 'jacket', 'cold', 'pockets', 'warm'] },
        building: { name: 'The Building', color: '#708090', personality: 'Ancient, watching. Has seen generations pass. Speaks through Shivers.', keywords: ['building', 'architecture', 'structure', 'walls', 'concrete'] }
    };

    // ═══════════════════════════════════════════════════════════════
    // THOUGHT CABINET SYSTEM - Themes and Thoughts
    // ═══════════════════════════════════════════════════════════════

    const THEMES = {
        death: { id: 'death', name: 'Death', keywords: ['death', 'dead', 'dying', 'corpse', 'kill', 'murder', 'grave', 'funeral', 'mortality', 'hanged'] },
        love: { id: 'love', name: 'Love', keywords: ['love', 'heart', 'romance', 'lover', 'relationship', 'ex', 'passion', 'desire', 'affection', 'intimacy'] },
        violence: { id: 'violence', name: 'Violence', keywords: ['violence', 'fight', 'hit', 'punch', 'blood', 'wound', 'hurt', 'attack', 'weapon', 'brutal'] },
        mystery: { id: 'mystery', name: 'Mystery', keywords: ['mystery', 'clue', 'evidence', 'investigate', 'secret', 'hidden', 'unknown', 'puzzle', 'case', 'suspect'] },
        substance: { id: 'substance', name: 'Substance', keywords: ['drug', 'alcohol', 'drink', 'smoke', 'high', 'drunk', 'addiction', 'substance', 'pill', 'speed'] },
        failure: { id: 'failure', name: 'Failure', keywords: ['fail', 'failure', 'mistake', 'wrong', 'regret', 'shame', 'embarrass', 'stupid', 'pathetic', 'loser'] },
        identity: { id: 'identity', name: 'Identity', keywords: ['who am i', 'identity', 'self', 'name', 'remember', 'forget', 'past', 'memory', 'amnesia', 'person'] },
        authority: { id: 'authority', name: 'Authority', keywords: ['cop', 'police', 'badge', 'law', 'order', 'crime', 'justice', 'detective', 'RCM', 'authority'] },
        paranoia: { id: 'paranoia', name: 'Paranoia', keywords: ['paranoid', 'conspiracy', 'watching', 'follow', 'spy', 'secret', 'plot', 'trap', 'enemy', 'trust'] },
        philosophy: { id: 'philosophy', name: 'Philosophy', keywords: ['meaning', 'purpose', 'existence', 'truth', 'reality', 'believe', 'think', 'philosophy', 'idea', 'concept'] },
        money: { id: 'money', name: 'Money', keywords: ['money', 'real', 'pay', 'debt', 'poor', 'rich', 'economy', 'capital', 'work', 'job'] },
        supernatural: { id: 'supernatural', name: 'Supernatural', keywords: ['pale', 'supernatural', 'ghost', 'spirit', 'magic', 'curse', 'strange', 'impossible', 'miracle', 'cryptid'] }
    };

    const THOUGHTS = {
        volumetric_shit_compressor: {
            id: 'volumetric_shit_compressor', name: 'Volumetric Shit Compressor',
            description: 'What if you could compress all your problems into a tiny cube?',
            discoveryConditions: { themes: { failure: 3 }, skills: { conceptualization: 3 } },
            researchTime: 3, researchPenalty: { composure: -1 },
            bonus: { inland_empire: 1, conceptualization: 1 }, capIncrease: { conceptualization: 1 },
            internalizedText: 'Problems compressed. Enlightenment achieved. The cube is... beautiful.'
        },
        hobocop: {
            id: 'hobocop', name: 'Hobocop',
            description: 'You patrol the margins. The forgotten places. Maybe that\'s where you belong.',
            discoveryConditions: { themes: { failure: 2, identity: 2 }, skills: { shivers: 2 } },
            researchTime: 4, researchPenalty: { authority: -2 },
            bonus: { shivers: 2, empathy: 1 }, capIncrease: { shivers: 1 },
            internalizedText: 'The margins are your beat. The forgotten, your people.'
        },
        kingdom_of_conscience: {
            id: 'kingdom_of_conscience', name: 'Kingdom of Conscience',
            description: 'No one can be responsible for anyone else\'s suffering. Unless you choose to be.',
            discoveryConditions: { themes: { philosophy: 3 }, skills: { volition: 3, empathy: 2 } },
            researchTime: 5, researchPenalty: { authority: -1, electrochemistry: -1 },
            bonus: { volition: 2, empathy: 1 }, capIncrease: { volition: 1 },
            internalizedText: 'The kingdom is within. Built on choices, not on power.'
        },
        cop_of_the_apocalypse: {
            id: 'cop_of_the_apocalypse', name: 'Cop of the Apocalypse',
            description: 'The badge still means something. Even at the end of all things.',
            discoveryConditions: { themes: { death: 3, authority: 2 }, skills: { half_light: 3, authority: 2 } },
            researchTime: 6, researchPenalty: { logic: -1, composure: -1 },
            bonus: { half_light: 2, authority: 1, endurance: 1 }, capIncrease: { half_light: 1 },
            internalizedText: 'When the end comes, you will be there. Badge in hand.'
        },
        the_fifteenth_indotribe: {
            id: 'the_fifteenth_indotribe', name: 'The Fifteenth Indotribe',
            description: 'There are things older than memory. Older than the Pale.',
            discoveryConditions: { themes: { supernatural: 3, mystery: 2 }, skills: { inland_empire: 4 } },
            researchTime: 8, researchPenalty: { logic: -2 },
            bonus: { inland_empire: 2, shivers: 1 }, capIncrease: { inland_empire: 1 },
            internalizedText: 'The old knowledge settles into your bones. You remember what was never taught.'
        },
        actual_art_degree: {
            id: 'actual_art_degree', name: 'Actual Art Degree',
            description: 'Maybe if you\'d studied formally, your criticism would carry more weight.',
            discoveryConditions: { themes: { philosophy: 2 }, skills: { conceptualization: 4 } },
            researchTime: 4, researchPenalty: { physical_instrument: -1 },
            bonus: { conceptualization: 2, rhetoric: 1 }, capIncrease: { conceptualization: 1 },
            internalizedText: 'Your criticism is now academically grounded. Devastatingly so.'
        },
        guilty_of_communism: {
            id: 'guilty_of_communism', name: 'Guilty... of Communism!',
            description: 'The means of production won\'t seize themselves.',
            discoveryConditions: { themes: { money: 2, philosophy: 2 }, skills: { rhetoric: 3 } },
            researchTime: 5, researchPenalty: { authority: -1 },
            bonus: { rhetoric: 2, empathy: 1 }, capIncrease: { rhetoric: 1 },
            internalizedText: 'The revolution lives in your heart. And your arguments.'
        },
        some_kind_of_superstar: {
            id: 'some_kind_of_superstar', name: 'Some Kind of Superstar',
            description: 'The greatest detective in the world. Obviously.',
            discoveryConditions: { criticalSuccess: true, skills: { savoir_faire: 3 } },
            researchTime: 3, researchPenalty: { empathy: -1 },
            bonus: { savoir_faire: 2, authority: 1, suggestion: 1 }, capIncrease: { savoir_faire: 1 },
            internalizedText: 'You ARE some kind of superstar. Disco.'
        },
        wompty_dompty_dom_centre: {
            id: 'wompty_dompty_dom_centre', name: 'Wompty-Dompty Dom Centre',
            description: 'The inexplicable rhythm of the world. Wompty. Dompty. Dom.',
            discoveryConditions: { themes: { supernatural: 2 }, skills: { inland_empire: 3, electrochemistry: 2 } },
            researchTime: 4, researchPenalty: { logic: -1 },
            bonus: { inland_empire: 1, electrochemistry: 1, shivers: 1 }, capIncrease: { inland_empire: 1 },
            internalizedText: 'Wompty. Dompty. Dom. The centre holds.'
        },
        the_bow_collector: {
            id: 'the_bow_collector', name: 'The Bow Collector',
            description: 'Someone has to collect the bows. Someone has to remember.',
            discoveryConditions: { themes: { mystery: 3 }, skills: { perception: 3, encyclopedia: 2 } },
            researchTime: 5, researchPenalty: { savoir_faire: -1 },
            bonus: { perception: 2, encyclopedia: 1 }, capIncrease: { perception: 1 },
            internalizedText: 'Every bow tells a story. You collect them all.'
        },
        regular_law_official: {
            id: 'regular_law_official', name: 'Regular Law Official',
            description: 'Just a cop. Nothing special. That\'s enough.',
            discoveryConditions: { themes: { authority: 3, identity: 2 }, skills: { volition: 2 } },
            researchTime: 3, researchPenalty: { inland_empire: -1 },
            bonus: { volition: 1, composure: 1, esprit_de_corps: 1 }, capIncrease: { volition: 1 },
            internalizedText: 'Badge. Gun. Coffee. That\'s all you need.'
        },
        torque_dork: {
            id: 'torque_dork', name: 'Torque Dork',
            description: 'The beautiful mechanics of rotation. Torque. Angular momentum. Spin.',
            discoveryConditions: { themes: { philosophy: 1 }, skills: { interfacing: 3, encyclopedia: 2 } },
            researchTime: 4, researchPenalty: { empathy: -1 },
            bonus: { interfacing: 2, hand_eye_coordination: 1 }, capIncrease: { interfacing: 1 },
            internalizedText: 'Everything spins. You understand the spin now.'
        },
        antiobject_task_force: {
            id: 'antiobject_task_force', name: 'Anti-Object Task Force',
            description: 'Objects are not your friends. They cannot be trusted.',
            discoveryConditions: { themes: { paranoia: 2 }, skills: { inland_empire: 2, half_light: 2 } },
            researchTime: 4, researchPenalty: { interfacing: -1 },
            bonus: { half_light: 1, perception: 1, inland_empire: 1 }, capIncrease: { half_light: 1 },
            internalizedText: 'The objects speak. But can they be trusted?'
        },
        ace_full_of_melancholy: {
            id: 'ace_full_of_melancholy', name: 'Ace\'s Full of Melancholy',
            description: 'High and Low. The gambler\'s curse.',
            discoveryConditions: { themes: { failure: 2, love: 2 }, skills: { composure: 3 } },
            researchTime: 5, researchPenalty: { electrochemistry: -1 },
            bonus: { composure: 2, pain_threshold: 1 }, capIncrease: { composure: 1 },
            internalizedText: 'Full house of sorrow. You play the hand you\'re dealt.'
        },
        bringing_of_the_law: {
            id: 'bringing_of_the_law', name: 'Bringing of the Law (Law-Jaw)',
            description: 'Your jaw sets. The law will be brought.',
            discoveryConditions: { themes: { authority: 3, violence: 2 }, skills: { authority: 3, physical_instrument: 2 } },
            researchTime: 4, researchPenalty: { empathy: -2 },
            bonus: { authority: 2, physical_instrument: 1 }, capIncrease: { authority: 1 },
            internalizedText: 'Law-Jaw engaged. Justice will be... physical.'
        },
        finger_on_the_eject_button: {
            id: 'finger_on_the_eject_button', name: 'Finger on the Eject Button',
            description: 'Ready to bail at any moment. Always.',
            discoveryConditions: { themes: { failure: 3, identity: 1 }, skills: { reaction_speed: 3, half_light: 2 } },
            researchTime: 3, researchPenalty: { volition: -1 },
            bonus: { reaction_speed: 2, half_light: 1 }, capIncrease: { reaction_speed: 1 },
            internalizedText: 'Escape routes mapped. Finger hovering. Always ready.'
        },
        cleaning_out_the_rooms: {
            id: 'cleaning_out_the_rooms', name: 'Cleaning Out the Rooms',
            description: 'The rooms of your mind need tidying.',
            discoveryConditions: { themes: { identity: 3, failure: 2 }, skills: { volition: 3, logic: 2 } },
            researchTime: 6, researchPenalty: { electrochemistry: -1, inland_empire: -1 },
            bonus: { volition: 2, logic: 1 }, capIncrease: { volition: 1, logic: 1 },
            internalizedText: 'Rooms cleaned. Dust settled. You can see clearly now.'
        },
        mazovian_socioeconomics: {
            id: 'mazovian_socioeconomics', name: 'Mazovian Socio-Economics',
            description: '0.000% of Communism has been built.',
            discoveryConditions: { themes: { money: 3, philosophy: 3 }, skills: { rhetoric: 4, encyclopedia: 3 } },
            researchTime: 8, researchPenalty: { authority: -2, savoir_faire: -1 },
            bonus: { rhetoric: 2, encyclopedia: 2, empathy: 1 }, capIncrease: { rhetoric: 1, encyclopedia: 1 },
            internalizedText: '0.000% complete. But you understand the theory now.'
        },
        the_litany_of_contact_mike: {
            id: 'the_litany_of_contact_mike', name: 'The Litany of Contact Mike',
            description: 'HARDCORE. TO THE MEGA.',
            discoveryConditions: { criticalSuccess: true, skills: { electrochemistry: 3, physical_instrument: 2 } },
            researchTime: 3, researchPenalty: { composure: -1 },
            bonus: { electrochemistry: 1, physical_instrument: 1, endurance: 1 }, capIncrease: { electrochemistry: 1 },
            internalizedText: 'HARDCORE. The litany burns in your veins.'
        },
        indirect_modes_of_taxation: {
            id: 'indirect_modes_of_taxation', name: 'Indirect Modes of Taxation',
            description: 'The invisible hand... picking pockets.',
            discoveryConditions: { themes: { money: 4 }, skills: { logic: 3, encyclopedia: 2 } },
            researchTime: 5, researchPenalty: { empathy: -1 },
            bonus: { logic: 1, encyclopedia: 1, rhetoric: 1 }, capIncrease: { logic: 1 },
            internalizedText: 'You see the invisible hand now. And all its fingers.'
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    let extensionSettings = {
        enabled: true, apiEndpoint: '', apiKey: '', model: 'glm-4-plus',
        temperature: 0.9, maxTokens: 300, minVoices: 1, maxVoices: 4,
        triggerDelay: 1000, showDiceRolls: true, showFailedChecks: true,
        autoTrigger: false, autoDetectStatus: true, intrusiveEnabled: true,
        intrusiveChance: 15, intrusiveInChat: true, objectVoicesEnabled: true,
        objectVoiceChance: 40, thoughtDiscoveryEnabled: true, autoDiscoverThoughts: true,
        povStyle: 'second', characterName: '', characterPronouns: 'they',
        characterContext: '', fabPositionTop: 140, fabPositionLeft: 10
    };

    let skillLevels = {};
    Object.keys(SKILLS).forEach(id => skillLevels[id] = 2);

    let skillCaps = {};
    Object.keys(SKILLS).forEach(id => skillCaps[id] = 6);

    let activeStatuses = new Set();

    let thoughtCabinet = {
        discovered: [], researching: null, researchProgress: 0,
        internalized: [], slots: 3, maxSlots: 12
    };

    let themeCounters = {};
    Object.keys(THEMES).forEach(id => themeCounters[id] = 0);

    let discoveryContext = { criticalSuccesses: 0, criticalFailures: 0, messageCount: 0 };

    let profiles = [];

    function initializeThemeCounters() {
        Object.keys(THEMES).forEach(id => { if (themeCounters[id] === undefined) themeCounters[id] = 0; });
    }

    function saveState(context) {
        if (!context) return;
        const state = { extensionSettings, skillLevels, skillCaps, activeStatuses: Array.from(activeStatuses), thoughtCabinet, themeCounters, discoveryContext, profiles };
        try {
            if (context.extensionSettings) context.extensionSettings[extensionName] = state;
            localStorage.setItem('inland_empire_state', JSON.stringify(state));
        } catch (e) { console.error('[Inland Empire] Save failed:', e); }
    }

    function loadState(context) {
        try {
            let state = null;
            if (context?.extensionSettings?.[extensionName]) state = context.extensionSettings[extensionName];
            else { const stored = localStorage.getItem('inland_empire_state'); if (stored) state = JSON.parse(stored); }
            if (state) {
                extensionSettings = { ...extensionSettings, ...state.extensionSettings };
                skillLevels = { ...skillLevels, ...state.skillLevels };
                skillCaps = { ...skillCaps, ...state.skillCaps };
                activeStatuses = new Set(state.activeStatuses || []);
                thoughtCabinet = { ...thoughtCabinet, ...state.thoughtCabinet };
                themeCounters = { ...themeCounters, ...state.themeCounters };
                discoveryContext = { ...discoveryContext, ...state.discoveryContext };
                profiles = state.profiles || [];
            }
        } catch (e) { console.error('[Inland Empire] Load failed:', e); }
    }

    // ═══════════════════════════════════════════════════════════════
    // SKILL FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function getSkillLevel(skillId) { return skillLevels[skillId] ?? 2; }
    function setSkillLevel(skillId, level) { skillLevels[skillId] = Math.max(1, Math.min(level, getSkillCap(skillId))); saveState(getSTContext()); }
    function getSkillCap(skillId) { return skillCaps[skillId] ?? 6; }
    function getAllSkillLevels() { return { ...skillLevels }; }

    function getSkillModifier(skillId) {
        let modifier = 0;
        activeStatuses.forEach(statusId => {
            const status = STATUS_EFFECTS[statusId];
            if (!status) return;
            if (status.boosts?.includes(skillId)) modifier += 1;
            if (status.debuffs?.includes(skillId)) modifier -= 1;
        });
        thoughtCabinet.internalized.forEach(thoughtId => {
            const thought = THOUGHTS[thoughtId];
            if (thought?.bonus?.[skillId]) modifier += thought.bonus[skillId];
        });
        return modifier;
    }

    function getEffectiveSkillLevel(skillId) {
        return Math.max(1, getSkillLevel(skillId) + getSkillModifier(skillId));
    }

    function rollDice() { return Math.floor(Math.random() * 6) + 1; }

    function rollSkillCheck(skillId, difficulty = 'medium') {
        const baseLevel = getSkillLevel(skillId);
        const modifier = getSkillModifier(skillId);
        const effectiveLevel = Math.max(1, baseLevel + modifier);
        const die1 = rollDice(), die2 = rollDice();
        const total = effectiveLevel + die1 + die2;
        const threshold = DIFFICULTIES[difficulty]?.threshold ?? 10;
        const isCriticalSuccess = die1 === 6 && die2 === 6;
        const isCriticalFailure = die1 === 1 && die2 === 1;
        const success = isCriticalSuccess || (!isCriticalFailure && total >= threshold);
        if (isCriticalSuccess) discoveryContext.criticalSuccesses++;
        if (isCriticalFailure) discoveryContext.criticalFailures++;
        return { skillId, baseLevel, modifier, effectiveLevel, die1, die2, total, threshold, difficulty, success, isCriticalSuccess, isCriticalFailure };
    }

    // ═══════════════════════════════════════════════════════════════
    // ANCIENT VOICES - Only on Dissociated
    // ═══════════════════════════════════════════════════════════════

    function getActiveAncientVoices() {
        // Ancient voices ONLY speak when dissociated
        if (!activeStatuses.has('dissociated')) return [];
        
        const voices = [];
        // When dissociated, all three can potentially speak
        if (Math.random() < 0.5) voices.push(ANCIENT_VOICES.ancient_reptilian_brain);
        if (Math.random() < 0.4) voices.push(ANCIENT_VOICES.limbic_system);
        if (Math.random() < 0.3) voices.push(ANCIENT_VOICES.spinal_cord);
        
        return voices;
    }

    // ═══════════════════════════════════════════════════════════════
    // STATUS FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function toggleStatus(statusId) {
        if (activeStatuses.has(statusId)) activeStatuses.delete(statusId);
        else activeStatuses.add(statusId);
        saveState(getSTContext());
        renderStatusDisplay();
        renderAttributesDisplay();
    }

    function detectStatusesFromText(text) {
        const detected = [];
        const lowerText = text.toLowerCase();
        Object.entries(STATUS_EFFECTS).forEach(([id, status]) => {
            const matches = status.keywords.filter(kw => lowerText.includes(kw)).length;
            if (matches >= 2) detected.push(id);
        });
        return detected;
    }

    // ═══════════════════════════════════════════════════════════════
    // THOUGHT CABINET FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function trackThemesInMessage(text) {
        const lowerText = text.toLowerCase();
        Object.entries(THEMES).forEach(([themeId, theme]) => {
            const matches = theme.keywords.filter(kw => lowerText.includes(kw)).length;
            if (matches > 0) themeCounters[themeId] = (themeCounters[themeId] || 0) + matches;
        });
    }

    function checkThoughtDiscovery() {
        if (!extensionSettings.thoughtDiscoveryEnabled || !extensionSettings.autoDiscoverThoughts) return [];
        const newlyDiscovered = [];
        Object.entries(THOUGHTS).forEach(([thoughtId, thought]) => {
            if (thoughtCabinet.discovered.includes(thoughtId) || thoughtCabinet.internalized.includes(thoughtId)) return;
            const conditions = thought.discoveryConditions;
            let meetsConditions = true;
            if (conditions.themes) {
                for (const [themeId, required] of Object.entries(conditions.themes)) {
                    if ((themeCounters[themeId] || 0) < required) { meetsConditions = false; break; }
                }
            }
            if (meetsConditions && conditions.skills) {
                for (const [skillId, required] of Object.entries(conditions.skills)) {
                    if (getEffectiveSkillLevel(skillId) < required) { meetsConditions = false; break; }
                }
            }
            if (meetsConditions && conditions.criticalSuccess && discoveryContext.criticalSuccesses < 1) meetsConditions = false;
            if (meetsConditions && conditions.criticalFailure && discoveryContext.criticalFailures < 1) meetsConditions = false;
            if (meetsConditions) {
                thoughtCabinet.discovered.push(thoughtId);
                newlyDiscovered.push(thought);
            }
        });
        if (newlyDiscovered.length > 0) saveState(getSTContext());
        return newlyDiscovered;
    }

    function startResearch(thoughtId) {
        if (thoughtCabinet.researching) return { success: false, message: 'Already researching a thought' };
        if (!thoughtCabinet.discovered.includes(thoughtId)) return { success: false, message: 'Thought not discovered' };
        if (thoughtCabinet.internalized.includes(thoughtId)) return { success: false, message: 'Already internalized' };
        thoughtCabinet.researching = thoughtId;
        thoughtCabinet.researchProgress = 0;
        saveState(getSTContext());
        return { success: true, message: `Began researching: ${THOUGHTS[thoughtId].name}` };
    }

    function abandonResearch() {
        if (!thoughtCabinet.researching) return { success: false, message: 'Not researching anything' };
        const thought = THOUGHTS[thoughtCabinet.researching];
        thoughtCabinet.researching = null;
        thoughtCabinet.researchProgress = 0;
        saveState(getSTContext());
        return { success: true, message: `Abandoned: ${thought.name}` };
    }

    function advanceResearch(messageContent) {
        if (!thoughtCabinet.researching) return [];
        const thought = THOUGHTS[thoughtCabinet.researching];
        if (!thought) return [];
        thoughtCabinet.researchProgress++;
        const completed = [];
        if (thoughtCabinet.researchProgress >= thought.researchTime) {
            completed.push(thoughtCabinet.researching);
            internalizeThought(thoughtCabinet.researching);
        }
        saveState(getSTContext());
        return completed;
    }

    function internalizeThought(thoughtId) {
        const thought = THOUGHTS[thoughtId];
        if (!thought) return { success: false };
        thoughtCabinet.internalized.push(thoughtId);
        thoughtCabinet.discovered = thoughtCabinet.discovered.filter(id => id !== thoughtId);
        if (thoughtCabinet.researching === thoughtId) {
            thoughtCabinet.researching = null;
            thoughtCabinet.researchProgress = 0;
        }
        if (thought.capIncrease) {
            Object.entries(thought.capIncrease).forEach(([skillId, increase]) => {
                skillCaps[skillId] = (skillCaps[skillId] || 6) + increase;
            });
        }
        saveState(getSTContext());
        return { success: true, thought };
    }

    // ═══════════════════════════════════════════════════════════════
    // INTRUSIVE THOUGHTS & OBJECT VOICES
    // ═══════════════════════════════════════════════════════════════

    async function processIntrusiveThoughts(messageContent) {
        const result = { intrusive: null, objects: [] };
        if (!extensionSettings.intrusiveEnabled) return result;

        // Check for intrusive thought
        if (Math.random() * 100 < extensionSettings.intrusiveChance) {
            let candidateSkills = Object.keys(SKILLS);
            activeStatuses.forEach(statusId => {
                const status = STATUS_EFFECTS[statusId];
                if (status?.intrusiveBoost) {
                    status.intrusiveBoost.forEach(skillId => { candidateSkills.push(skillId, skillId, skillId); });
                }
            });
            const chosenSkillId = candidateSkills[Math.floor(Math.random() * candidateSkills.length)];
            const skill = SKILLS[chosenSkillId];
            const thoughts = INTRUSIVE_THOUGHTS[chosenSkillId];
            if (thoughts && thoughts.length > 0) {
                const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
                result.intrusive = { skillId: chosenSkillId, signature: skill.signature, name: skill.name, color: skill.color, content: thought };
            }
        }

        // Check for object voices
        if (extensionSettings.objectVoicesEnabled) {
            const lowerText = messageContent.toLowerCase();
            Object.entries(OBJECT_VOICES).forEach(([objId, obj]) => {
                if (obj.keywords.some(kw => lowerText.includes(kw))) {
                    if (Math.random() * 100 < extensionSettings.objectVoiceChance) {
                        result.objects.push({ objectId: objId, name: obj.name, color: obj.color, personality: obj.personality });
                    }
                }
            });
        }

        return result;
    }

    // ═══════════════════════════════════════════════════════════════
    // API FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    async function callLLMAPI(prompt, systemPrompt) {
        if (!extensionSettings.apiEndpoint || !extensionSettings.apiKey) {
            throw new Error('API not configured');
        }
        const response = await fetch(extensionSettings.apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${extensionSettings.apiKey}` },
            body: JSON.stringify({
                model: extensionSettings.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: extensionSettings.temperature,
                max_tokens: extensionSettings.maxTokens
            })
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }

    // ═══════════════════════════════════════════════════════════════
    // CONTEXT ANALYSIS
    // ═══════════════════════════════════════════════════════════════

    function analyzeContext(messageContent) {
        const lowerContent = messageContent.toLowerCase();
        const context = {
            messageContent, lowerContent, detectedThemes: [], relevantSkills: [],
            emotionalIntensity: 0, isAction: false, isDialogue: false,
            containsViolence: false, containsSubstance: false, containsSupernatural: false
        };

        // Detect themes
        Object.entries(THEMES).forEach(([themeId, theme]) => {
            const matches = theme.keywords.filter(kw => lowerContent.includes(kw)).length;
            if (matches > 0) context.detectedThemes.push({ themeId, matches });
        });

        // Find relevant skills
        Object.entries(SKILLS).forEach(([skillId, skill]) => {
            const matches = skill.triggerConditions.filter(cond => lowerContent.includes(cond)).length;
            if (matches > 0) context.relevantSkills.push({ skillId, skill, matches });
        });

        // Sort by relevance
        context.relevantSkills.sort((a, b) => b.matches - a.matches);

        // Detect content types
        context.isAction = /\*[^*]+\*/.test(messageContent) || lowerContent.includes('action');
        context.isDialogue = /"[^"]+"/.test(messageContent) || messageContent.includes('"');
        context.containsViolence = ['fight', 'hit', 'blood', 'wound', 'kill', 'attack', 'punch'].some(w => lowerContent.includes(w));
        context.containsSubstance = ['drink', 'drunk', 'drug', 'smoke', 'high', 'alcohol'].some(w => lowerContent.includes(w));
        context.containsSupernatural = ['pale', 'ghost', 'spirit', 'strange', 'impossible', 'miracle'].some(w => lowerContent.includes(w));

        // Calculate emotional intensity
        const intensityWords = ['!', 'very', 'extremely', 'incredibly', 'terribly', 'desperately'];
        context.emotionalIntensity = intensityWords.filter(w => lowerContent.includes(w)).length;

        return context;
    }

    // ═══════════════════════════════════════════════════════════════
    // VOICE SELECTION
    // ═══════════════════════════════════════════════════════════════

    function selectSpeakingSkills(context, options = {}) {
        const { minVoices = 1, maxVoices = 4 } = options;
        const candidates = [];

        // Add skills triggered by context
        context.relevantSkills.forEach(({ skillId, skill, matches }) => {
            const effectiveLevel = getEffectiveSkillLevel(skillId);
            const weight = matches * effectiveLevel;
            candidates.push({ skillId, skill, weight, reason: 'triggered' });
        });

        // Add status-boosted skills
        activeStatuses.forEach(statusId => {
            const status = STATUS_EFFECTS[statusId];
            if (!status) return;
            status.boosts?.forEach(skillId => {
                const skill = SKILLS[skillId];
                if (skill && !candidates.find(c => c.skillId === skillId)) {
                    candidates.push({ skillId, skill, weight: getEffectiveSkillLevel(skillId) * 0.5, reason: 'status' });
                }
            });
        });

        // Sort by weight and select top candidates
        candidates.sort((a, b) => b.weight - a.weight);
        const numVoices = Math.min(maxVoices, Math.max(minVoices, Math.floor(candidates.length * 0.6)));
        return candidates.slice(0, numVoices);
    }

    // ═══════════════════════════════════════════════════════════════
    // VOICE GENERATION
    // ═══════════════════════════════════════════════════════════════

    function getPOVDescription() {
        const style = extensionSettings.povStyle || 'second';
        const name = extensionSettings.characterName || 'the character';
        const pronouns = extensionSettings.characterPronouns || 'they';
        const pronounMap = {
            'they': { subject: 'they', object: 'them', possessive: 'their', reflexive: 'themselves' },
            'he': { subject: 'he', object: 'him', possessive: 'his', reflexive: 'himself' },
            'she': { subject: 'she', object: 'her', possessive: 'her', reflexive: 'herself' },
            'it': { subject: 'it', object: 'it', possessive: 'its', reflexive: 'itself' }
        };
        const p = pronounMap[pronouns] || pronounMap['they'];
        if (style === 'second') return `Address the character as "you/your" in second person.`;
        if (style === 'first') return `Speak as "I/me" - these are the character's own internal thoughts.`;
        return `Refer to the character as "${name}" or "${p.subject}/${p.object}/${p.possessive}" in third person.`;
    }

    function buildChorusPrompt(selectedSkills, context, intrusiveData) {
        const povDesc = getPOVDescription();
        const charContext = extensionSettings.characterContext ? `\nCharacter context: ${extensionSettings.characterContext}` : '';
        const activeStatusList = Array.from(activeStatuses).map(id => STATUS_EFFECTS[id]?.name).filter(Boolean).join(', ') || 'None';

        let prompt = `You are generating internal voice commentary for a Disco Elysium-style roleplay. ${povDesc}${charContext}

Active mental/physical states: ${activeStatusList}

The following skills want to comment on the current situation. Each has a distinct personality - capture their unique voice precisely:

`;

        selectedSkills.forEach(({ skillId, skill }) => {
            const level = getEffectiveSkillLevel(skillId);
            prompt += `## ${skill.signature} [Level ${level}]
Personality: ${skill.personality}
`;
        });

        // Add ancient voices if dissociated
        const ancientVoices = getActiveAncientVoices();
        if (ancientVoices.length > 0) {
            prompt += `\n## ANCIENT VOICES (speaking from deep within)\n`;
            ancientVoices.forEach(voice => {
                prompt += `### ${voice.signature}
Personality: ${voice.personality}
`;
            });
        }

        prompt += `
Current narrative moment:
"""
${context.messageContent}
"""

Generate a SHORT response (1-2 sentences max) for each voice. Capture their exact verbal tics and personality. Format:

SKILL_NAME: "Their comment here."

${ancientVoices.length > 0 ? 'Include the Ancient Voices - they speak from primal depths.' : ''}
Keep responses punchy and in-character. No meta-commentary.`;

        return prompt;
    }

    async function generateVoices(selectedSkills, context, intrusiveData) {
        const voices = [];

        try {
            const prompt = buildChorusPrompt(selectedSkills, context, intrusiveData);
            const systemPrompt = `You are an expert at writing Disco Elysium-style internal skill voices. Each skill has a DISTINCT personality with specific verbal tics. Keep responses short (1-2 sentences), punchy, and perfectly in-character. Never break character or add meta-commentary.`;

            const response = await callLLMAPI(prompt, systemPrompt);

            // Parse response
            const lines = response.split('\n').filter(l => l.trim());
            for (const line of lines) {
                const match = line.match(/^([A-Z][A-Z\s/]+):\s*"?(.+?)"?\s*$/);
                if (match) {
                    const [, signature, content] = match;
                    const normalizedSig = signature.trim().toUpperCase();

                    // Check regular skills
                    const skill = Object.values(SKILLS).find(s => s.signature.toUpperCase() === normalizedSig);
                    if (skill) {
                        const checkResult = extensionSettings.showDiceRolls ? rollSkillCheck(skill.id, 'medium') : null;
                        voices.push({ skillId: skill.id, signature: skill.signature, name: skill.name, color: skill.color, content: content.trim(), checkResult });
                        continue;
                    }

                    // Check ancient voices
                    const ancient = Object.values(ANCIENT_VOICES).find(a => a.signature.toUpperCase() === normalizedSig);
                    if (ancient) {
                        voices.push({ skillId: ancient.id, signature: ancient.signature, name: ancient.name, color: ancient.color, content: content.trim(), isAncient: true });
                    }
                }
            }
        } catch (error) {
            console.error('[Inland Empire] Voice generation error:', error);
            // Fallback: generate simple voices from intrusive thoughts
            selectedSkills.slice(0, 2).forEach(({ skillId, skill }) => {
                const thoughts = INTRUSIVE_THOUGHTS[skillId];
                if (thoughts?.length) {
                    voices.push({
                        skillId, signature: skill.signature, name: skill.name, color: skill.color,
                        content: thoughts[Math.floor(Math.random() * thoughts.length)],
                        checkResult: extensionSettings.showDiceRolls ? rollSkillCheck(skillId, 'medium') : null
                    });
                }
            });
        }

        return voices;
    }

    // ═══════════════════════════════════════════════════════════════
    // UI - TOAST SYSTEM
    // ═══════════════════════════════════════════════════════════════

    function showToast(message, type = 'info', duration = 3000) {
        let container = document.getElementById('ie-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ie-toast-container';
            container.className = 'ie-toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `ie-toast ie-toast-${type}`;
        const icons = { info: 'fa-info-circle', success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', loading: 'fa-spinner fa-spin' };
        toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('ie-toast-visible'), 10);
        if (type !== 'loading' && duration > 0) {
            setTimeout(() => { toast.classList.remove('ie-toast-visible'); setTimeout(() => toast.remove(), 300); }, duration);
        }
        return toast;
    }

    function hideToast(toast) { if (toast) { toast.classList.remove('ie-toast-visible'); setTimeout(() => toast.remove(), 300); } }

    function showIntrusiveToast(intrusive) {
        let container = document.getElementById('ie-toast-container');
        if (!container) { container = document.createElement('div'); container.id = 'ie-toast-container'; container.className = 'ie-toast-container'; document.body.appendChild(container); }
        const toast = document.createElement('div');
        toast.className = 'ie-toast ie-toast-intrusive';
        toast.innerHTML = `<div class="ie-intrusive-header"><span class="ie-intrusive-sig" style="color: ${intrusive.color}">${intrusive.signature}</span></div><div class="ie-intrusive-content">"${intrusive.content}"</div>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('ie-toast-visible'), 10);
        setTimeout(() => { toast.classList.remove('ie-toast-visible'); setTimeout(() => toast.remove(), 300); }, 5000);
    }

    function showObjectToast(objVoice) {
        let container = document.getElementById('ie-toast-container');
        if (!container) { container = document.createElement('div'); container.id = 'ie-toast-container'; container.className = 'ie-toast-container'; document.body.appendChild(container); }
        const toast = document.createElement('div');
        toast.className = 'ie-toast ie-toast-object';
        toast.innerHTML = `<div class="ie-object-header"><span class="ie-object-name" style="color: ${objVoice.color}">${objVoice.name}</span></div><div class="ie-object-content">${objVoice.personality}</div>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('ie-toast-visible'), 10);
        setTimeout(() => { toast.classList.remove('ie-toast-visible'); setTimeout(() => toast.remove(), 300); }, 4000);
    }

    function showDiscoveryToast(thought) {
        let container = document.getElementById('ie-toast-container');
        if (!container) { container = document.createElement('div'); container.id = 'ie-toast-container'; container.className = 'ie-toast-container'; document.body.appendChild(container); }
        const toast = document.createElement('div');
        toast.className = 'ie-toast ie-toast-discovery';
        toast.innerHTML = `<div class="ie-discovery-header"><i class="fa-solid fa-lightbulb"></i><span>THOUGHT DISCOVERED</span></div><div class="ie-discovery-name">${thought.name}</div><div class="ie-discovery-desc">${thought.description}</div>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('ie-toast-visible'), 10);
        setTimeout(() => { toast.classList.remove('ie-toast-visible'); setTimeout(() => toast.remove(), 300); }, 6000);
    }

    function showInternalizedToast(thought) {
        let container = document.getElementById('ie-toast-container');
        if (!container) { container = document.createElement('div'); container.id = 'ie-toast-container'; container.className = 'ie-toast-container'; document.body.appendChild(container); }
        const toast = document.createElement('div');
        toast.className = 'ie-toast ie-toast-internalized';
        toast.innerHTML = `<div class="ie-internalized-header"><i class="fa-solid fa-brain"></i><span>THOUGHT INTERNALIZED</span></div><div class="ie-internalized-name">${thought.name}</div><div class="ie-internalized-text">${thought.internalizedText}</div>`;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('ie-toast-visible'), 10);
        setTimeout(() => { toast.classList.remove('ie-toast-visible'); setTimeout(() => toast.remove(), 300); }, 6000);
    }

    // ═══════════════════════════════════════════════════════════════
    // UI - RENDERING
    // ═══════════════════════════════════════════════════════════════

    function renderAttributesDisplay() {
        const container = document.getElementById('ie-attributes-display');
        if (!container) return;
        container.innerHTML = Object.values(ATTRIBUTES).map(attr => {
            const skillsHtml = attr.skills.map(skillId => {
                const skill = SKILLS[skillId];
                const level = getSkillLevel(skillId);
                const modifier = getSkillModifier(skillId);
                const effective = getEffectiveSkillLevel(skillId);
                const cap = getSkillCap(skillId);
                const modStr = modifier !== 0 ? ` <span class="ie-modifier ${modifier > 0 ? 'ie-mod-pos' : 'ie-mod-neg'}">(${modifier > 0 ? '+' : ''}${modifier})</span>` : '';
                return `<div class="ie-skill-row" title="${skill.personality.substring(0, 100)}..."><span class="ie-skill-name">${skill.name}</span><span class="ie-skill-level">${effective}${modStr}<span class="ie-skill-cap">/${cap}</span></span></div>`;
            }).join('');
            return `<div class="ie-attribute-block"><div class="ie-attribute-header" style="border-color: ${attr.color}"><span style="color: ${attr.color}">${attr.name}</span></div><div class="ie-skills-list">${skillsHtml}</div></div>`;
        }).join('');
    }

    function renderStatusDisplay() {
        const grid = document.getElementById('ie-status-grid');
        const summary = document.getElementById('ie-active-effects-summary');
        if (!grid) return;

        const categories = { physical: [], mental: [] };
        Object.entries(STATUS_EFFECTS).forEach(([id, status]) => { categories[status.category]?.push({ id, ...status }); });

        grid.innerHTML = Object.entries(categories).map(([cat, statuses]) => `
            <div class="ie-status-category"><div class="ie-status-category-header">${cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
            ${statuses.map(s => `<button class="ie-status-btn ${activeStatuses.has(s.id) ? 'ie-status-active' : ''}" data-status="${s.id}" title="${s.description}"><span class="ie-status-icon">${s.icon}</span><span class="ie-status-name">${s.name}</span></button>`).join('')}</div>
        `).join('');

        grid.querySelectorAll('.ie-status-btn').forEach(btn => {
            btn.addEventListener('click', () => toggleStatus(btn.dataset.status));
        });

        if (summary) {
            if (activeStatuses.size === 0) { summary.innerHTML = '<em>No active status effects</em>'; }
            else {
                const effects = Array.from(activeStatuses).map(id => STATUS_EFFECTS[id]).filter(Boolean);
                summary.innerHTML = effects.map(e => `<span class="ie-active-effect">${e.icon} ${e.name}</span>`).join(' ');
            }
        }
    }

    function renderCabinetTab() {
        const container = document.getElementById('ie-cabinet-content');
        if (!container) return;

        const researchingThought = thoughtCabinet.researching ? THOUGHTS[thoughtCabinet.researching] : null;

        let html = `<div class="ie-section"><div class="ie-section-header"><span>Research Slot</span></div>`;
        if (researchingThought) {
            const progress = Math.floor((thoughtCabinet.researchProgress / researchingThought.researchTime) * 100);
            html += `<div class="ie-research-active"><div class="ie-research-thought-name">${researchingThought.name}</div><div class="ie-research-desc">${researchingThought.description}</div><div class="ie-research-progress"><div class="ie-progress-bar"><div class="ie-progress-fill" style="width: ${progress}%"></div></div><span>${thoughtCabinet.researchProgress}/${researchingThought.researchTime}</span></div><button class="ie-btn ie-btn-sm ie-btn-abandon" data-thought="${thoughtCabinet.researching}">Abandon</button></div>`;
        } else {
            html += `<div class="ie-research-empty"><em>No thought being researched</em></div>`;
        }
        html += `</div>`;

        // Discovered thoughts
        html += `<div class="ie-section"><div class="ie-section-header"><span>Discovered (${thoughtCabinet.discovered.length})</span></div><div class="ie-thoughts-list">`;
        if (thoughtCabinet.discovered.length === 0) { html += `<em>No thoughts discovered yet</em>`; }
        else {
            thoughtCabinet.discovered.forEach(thoughtId => {
                const thought = THOUGHTS[thoughtId];
                if (!thought) return;
                const canResearch = !thoughtCabinet.researching;
                html += `<div class="ie-thought-card ie-thought-discovered"><div class="ie-thought-name">${thought.name}</div><div class="ie-thought-desc">${thought.description}</div><div class="ie-thought-time">Research time: ${thought.researchTime}</div>${canResearch ? `<button class="ie-btn ie-btn-sm ie-btn-research" data-thought="${thoughtId}">Research</button>` : ''}</div>`;
            });
        }
        html += `</div></div>`;

        // Internalized thoughts
        html += `<div class="ie-section"><div class="ie-section-header"><span>Internalized (${thoughtCabinet.internalized.length})</span></div><div class="ie-thoughts-list">`;
        if (thoughtCabinet.internalized.length === 0) { html += `<em>No thoughts internalized yet</em>`; }
        else {
            thoughtCabinet.internalized.forEach(thoughtId => {
                const thought = THOUGHTS[thoughtId];
                if (!thought) return;
                const bonusText = Object.entries(thought.bonus || {}).map(([s, v]) => `${SKILLS[s]?.name || s} +${v}`).join(', ');
                html += `<div class="ie-thought-card ie-thought-internalized"><div class="ie-thought-name">${thought.name}</div><div class="ie-thought-internalized-text">"${thought.internalizedText}"</div><div class="ie-thought-bonus">Bonus: ${bonusText}</div></div>`;
            });
        }
        html += `</div></div>`;

        container.innerHTML = html;

        // Event listeners
        container.querySelectorAll('.ie-btn-research').forEach(btn => {
            btn.addEventListener('click', () => {
                const result = startResearch(btn.dataset.thought);
                showToast(result.message, result.success ? 'success' : 'error', 2000);
                renderCabinetTab();
            });
        });
        container.querySelectorAll('.ie-btn-abandon').forEach(btn => {
            btn.addEventListener('click', () => {
                const result = abandonResearch();
                showToast(result.message, result.success ? 'info' : 'error', 2000);
                renderCabinetTab();
            });
        });
    }

    function displayVoices(voices) {
        const container = document.getElementById('ie-voices-output');
        if (!container) return;
        if (voices.length === 0) { container.innerHTML = '<div class="ie-voices-empty"><i class="fa-solid fa-comment-slash"></i><span>The voices are quiet...</span></div>'; return; }
        container.innerHTML = voices.map(voice => {
            let checkHtml = '';
            if (voice.checkResult && extensionSettings.showDiceRolls) {
                const cr = voice.checkResult;
                const statusClass = cr.isCriticalSuccess ? 'ie-crit-success' : cr.isCriticalFailure ? 'ie-crit-fail' : cr.success ? 'ie-success' : 'ie-fail';
                const statusText = cr.isCriticalSuccess ? 'CRITICAL SUCCESS' : cr.isCriticalFailure ? 'CRITICAL FAILURE' : cr.success ? 'Success' : 'Failed';
                checkHtml = `<div class="ie-check-result ${statusClass}"><span class="ie-dice">[${cr.die1}+${cr.die2}]</span> + ${cr.effectiveLevel} = ${cr.total} vs ${cr.threshold} <span class="ie-check-status">${statusText}</span></div>`;
            }
            const isAncient = voice.isAncient;
            const cardClass = isAncient ? 'ie-voice-card ie-voice-ancient' : 'ie-voice-card';
            return `<div class="${cardClass}"><div class="ie-voice-header"><span class="ie-voice-sig" style="color: ${voice.color}">${voice.signature}</span></div>${checkHtml}<div class="ie-voice-content">"${voice.content}"</div></div>`;
        }).join('');
    }

    // ═══════════════════════════════════════════════════════════════
    // UI - PANEL CONTROLS
    // ═══════════════════════════════════════════════════════════════

    function togglePanel() {
        const panel = document.getElementById('inland-empire-panel');
        if (panel) { panel.classList.toggle('ie-panel-open'); renderStatusDisplay(); renderCabinetTab(); renderProfilesList(); loadSettingsToUI(); renderBuildEditor(); }
    }

    function switchTab(tabId) {
        document.querySelectorAll('.ie-tab').forEach(t => t.classList.remove('ie-tab-active'));
        document.querySelectorAll('.ie-tab-content').forEach(c => c.classList.remove('ie-tab-content-active'));
        document.querySelector(`.ie-tab[data-tab="${tabId}"]`)?.classList.add('ie-tab-active');
        document.querySelector(`.ie-tab-content[data-tab-content="${tabId}"]`)?.classList.add('ie-tab-content-active');
        if (tabId === 'status') renderStatusDisplay();
        if (tabId === 'cabinet') renderCabinetTab();
        if (tabId === 'profiles') { renderProfilesList(); renderBuildEditor(); }
        if (tabId === 'settings') loadSettingsToUI();
    }

    function loadSettingsToUI() {
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
        const setChecked = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
        setVal('ie-api-endpoint', extensionSettings.apiEndpoint);
        setVal('ie-api-key', extensionSettings.apiKey);
        setVal('ie-model', extensionSettings.model);
        setVal('ie-temperature', extensionSettings.temperature);
        setVal('ie-max-tokens', extensionSettings.maxTokens);
        setVal('ie-min-voices', extensionSettings.minVoices);
        setVal('ie-max-voices', extensionSettings.maxVoices);
        setVal('ie-trigger-delay', extensionSettings.triggerDelay);
        setChecked('ie-show-dice-rolls', extensionSettings.showDiceRolls);
        setChecked('ie-show-failed-checks', extensionSettings.showFailedChecks);
        setChecked('ie-auto-trigger', extensionSettings.autoTrigger);
        setChecked('ie-auto-detect-status', extensionSettings.autoDetectStatus);
        setChecked('ie-intrusive-enabled', extensionSettings.intrusiveEnabled);
        setChecked('ie-intrusive-in-chat', extensionSettings.intrusiveInChat);
        setVal('ie-intrusive-chance', extensionSettings.intrusiveChance);
        setChecked('ie-object-voices-enabled', extensionSettings.objectVoicesEnabled);
        setVal('ie-object-chance', extensionSettings.objectVoiceChance);
        setChecked('ie-thought-discovery-enabled', extensionSettings.thoughtDiscoveryEnabled);
        setChecked('ie-auto-discover-thoughts', extensionSettings.autoDiscoverThoughts);
        setVal('ie-pov-style', extensionSettings.povStyle);
        setVal('ie-character-name', extensionSettings.characterName);
        setVal('ie-character-pronouns', extensionSettings.characterPronouns);
        setVal('ie-character-context', extensionSettings.characterContext);
        updateThirdPersonVisibility();
    }

    function saveSettings() {
        const getVal = (id) => document.getElementById(id)?.value ?? '';
        const getNum = (id, def) => parseFloat(document.getElementById(id)?.value) || def;
        const getChecked = (id) => document.getElementById(id)?.checked ?? false;
        extensionSettings.apiEndpoint = getVal('ie-api-endpoint');
        extensionSettings.apiKey = getVal('ie-api-key');
        extensionSettings.model = getVal('ie-model');
        extensionSettings.temperature = getNum('ie-temperature', 0.9);
        extensionSettings.maxTokens = getNum('ie-max-tokens', 300);
        extensionSettings.minVoices = getNum('ie-min-voices', 1);
        extensionSettings.maxVoices = getNum('ie-max-voices', 4);
        extensionSettings.triggerDelay = getNum('ie-trigger-delay', 1000);
        extensionSettings.showDiceRolls = getChecked('ie-show-dice-rolls');
        extensionSettings.showFailedChecks = getChecked('ie-show-failed-checks');
        extensionSettings.autoTrigger = getChecked('ie-auto-trigger');
        extensionSettings.autoDetectStatus = getChecked('ie-auto-detect-status');
        extensionSettings.intrusiveEnabled = getChecked('ie-intrusive-enabled');
        extensionSettings.intrusiveInChat = getChecked('ie-intrusive-in-chat');
        extensionSettings.intrusiveChance = getNum('ie-intrusive-chance', 15);
        extensionSettings.objectVoicesEnabled = getChecked('ie-object-voices-enabled');
        extensionSettings.objectVoiceChance = getNum('ie-object-chance', 40);
        extensionSettings.thoughtDiscoveryEnabled = getChecked('ie-thought-discovery-enabled');
        extensionSettings.autoDiscoverThoughts = getChecked('ie-auto-discover-thoughts');
        extensionSettings.povStyle = getVal('ie-pov-style');
        extensionSettings.characterName = getVal('ie-character-name');
        extensionSettings.characterPronouns = getVal('ie-character-pronouns');
        extensionSettings.characterContext = getVal('ie-character-context');
        saveState(getSTContext());
        showToast('Settings saved!', 'success', 2000);
    }

    function updateThirdPersonVisibility() {
        const style = document.getElementById('ie-pov-style')?.value;
        document.querySelectorAll('.ie-third-person-options').forEach(el => {
            el.style.display = style === 'third' ? 'block' : 'none';
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // PROFILES
    // ═══════════════════════════════════════════════════════════════

    function saveProfile(name) {
        const profile = { id: Date.now().toString(), name, skillLevels: { ...skillLevels }, skillCaps: { ...skillCaps }, activeStatuses: Array.from(activeStatuses), thoughtCabinet: JSON.parse(JSON.stringify(thoughtCabinet)), themeCounters: { ...themeCounters }, characterName: extensionSettings.characterName, characterPronouns: extensionSettings.characterPronouns, characterContext: extensionSettings.characterContext, povStyle: extensionSettings.povStyle };
        profiles.push(profile);
        saveState(getSTContext());
        return profile;
    }

    function loadProfile(profileId) {
        const profile = profiles.find(p => p.id === profileId);
        if (!profile) return false;
        skillLevels = { ...skillLevels, ...profile.skillLevels };
        skillCaps = { ...skillCaps, ...profile.skillCaps };
        activeStatuses = new Set(profile.activeStatuses || []);
        thoughtCabinet = { ...thoughtCabinet, ...profile.thoughtCabinet };
        themeCounters = { ...themeCounters, ...profile.themeCounters };
        if (profile.characterName !== undefined) extensionSettings.characterName = profile.characterName;
        if (profile.characterPronouns !== undefined) extensionSettings.characterPronouns = profile.characterPronouns;
        if (profile.characterContext !== undefined) extensionSettings.characterContext = profile.characterContext;
        if (profile.povStyle !== undefined) extensionSettings.povStyle = profile.povStyle;
        saveState(getSTContext());
        renderAttributesDisplay();
        renderStatusDisplay();
        renderCabinetTab();
        loadSettingsToUI();
        return true;
    }

    function deleteProfile(profileId) {
        profiles = profiles.filter(p => p.id !== profileId);
        saveState(getSTContext());
    }

    function renderProfilesList() {
        const container = document.getElementById('ie-profiles-list');
        if (!container) return;
        if (profiles.length === 0) { container.innerHTML = '<em>No saved profiles</em>'; return; }
        container.innerHTML = profiles.map(p => `<div class="ie-profile-item"><span class="ie-profile-name">${p.name}</span><div class="ie-profile-actions"><button class="ie-btn ie-btn-sm ie-btn-load-profile" data-id="${p.id}"><i class="fa-solid fa-upload"></i></button><button class="ie-btn ie-btn-sm ie-btn-delete-profile" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button></div></div>`).join('');
        container.querySelectorAll('.ie-btn-load-profile').forEach(btn => {
            btn.addEventListener('click', () => { loadProfile(btn.dataset.id); showToast('Profile loaded!', 'success', 2000); });
        });
        container.querySelectorAll('.ie-btn-delete-profile').forEach(btn => {
            btn.addEventListener('click', () => { deleteProfile(btn.dataset.id); renderProfilesList(); showToast('Profile deleted', 'info', 2000); });
        });
    }

    function renderBuildEditor() {
        const container = document.getElementById('ie-attributes-editor');
        if (!container) return;
        let totalPoints = 0;
        Object.keys(skillLevels).forEach(id => { totalPoints += skillLevels[id] - 1; });
        const remaining = 12 - totalPoints;
        const pointsDisplay = document.getElementById('ie-points-remaining');
        if (pointsDisplay) { pointsDisplay.textContent = remaining; pointsDisplay.style.color = remaining < 0 ? '#ff6b6b' : remaining === 0 ? '#51cf66' : '#ffd43b'; }
        container.innerHTML = Object.values(ATTRIBUTES).map(attr => `
            <div class="ie-attr-editor-block"><div class="ie-attr-editor-header" style="color: ${attr.color}">${attr.name}</div>
            ${attr.skills.map(skillId => {
                const skill = SKILLS[skillId];
                const level = skillLevels[skillId];
                const cap = skillCaps[skillId];
                return `<div class="ie-skill-editor-row"><span class="ie-skill-editor-name">${skill.name}</span><div class="ie-skill-editor-controls"><button class="ie-skill-dec" data-skill="${skillId}">-</button><span class="ie-skill-editor-value">${level}</span><button class="ie-skill-inc" data-skill="${skillId}">+</button></div></div>`;
            }).join('')}</div>
        `).join('');
        container.querySelectorAll('.ie-skill-dec').forEach(btn => {
            btn.addEventListener('click', () => { const id = btn.dataset.skill; if (skillLevels[id] > 1) { skillLevels[id]--; renderBuildEditor(); } });
        });
        container.querySelectorAll('.ie-skill-inc').forEach(btn => {
            btn.addEventListener('click', () => { const id = btn.dataset.skill; if (skillLevels[id] < skillCaps[id]) { skillLevels[id]++; renderBuildEditor(); } });
        });
    }

    function applyBuild() {
        saveState(getSTContext());
        renderAttributesDisplay();
        showToast('Build applied!', 'success', 2000);
    }

    // ═══════════════════════════════════════════════════════════════
    // CHAT INJECTION
    // ═══════════════════════════════════════════════════════════════

    function getLastMessageElement() {
        const messages = document.querySelectorAll('.mes');
        return messages.length > 0 ? messages[messages.length - 1] : null;
    }

    function injectVoicesIntoChat(voices, messageElement, intrusiveData) {
        if (!messageElement || voices.length === 0) return;
        const existing = messageElement.querySelector('.ie-chorus-container');
        if (existing) existing.remove();
        const voiceContainer = document.createElement('div');
        voiceContainer.className = 'ie-chorus-container';
        const chorusLines = voices.map(voice => {
            const name = voice.signature || voice.name;
            const isAncient = voice.isAncient;
            const isFailed = voice.checkResult && !voice.checkResult.success;
            const lineClass = `ie-chorus-line ${isAncient ? 'ie-ancient-line' : ''} ${isFailed ? 'ie-failed-line' : ''}`;
            let icon = '';
            if (voice.checkResult) {
                if (voice.checkResult.isCriticalSuccess) icon = '<span class="ie-crit-icon">⚡</span>';
                else if (voice.checkResult.isCriticalFailure) icon = '<span class="ie-crit-icon">💀</span>';
                else if (voice.checkResult.success) icon = '<span class="ie-check-icon">✓</span>';
                else icon = '<span class="ie-check-icon ie-fail-icon">✗</span>';
            }
            return `<div class="${lineClass}">${icon}<span class="ie-chorus-name" style="color: ${voice.color}">${name}</span> - ${voice.content}</div>`;
        }).join('');
        voiceContainer.innerHTML = `<div class="ie-chorus-header"><i class="fa-solid fa-brain"></i><span>Inner Voices</span></div><div class="ie-chorus-content">${chorusLines}</div>`;
        const mesText = messageElement.querySelector('.mes_text');
        if (mesText) mesText.parentNode.insertBefore(voiceContainer, mesText.nextSibling);
        else messageElement.appendChild(voiceContainer);
    }

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════════════

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
            trackThemesInMessage(messageContent);
            discoveryContext.messageCount++;

            if (extensionSettings.autoDetectStatus) {
                const detectedStatuses = detectStatusesFromText(messageContent);
                let newStatusAdded = false;
                detectedStatuses.forEach(statusId => { if (!activeStatuses.has(statusId)) { activeStatuses.add(statusId); newStatusAdded = true; } });
                if (newStatusAdded) { saveState(getSTContext()); renderStatusDisplay(); }
            }

            const intrusiveData = await processIntrusiveThoughts(messageContent);
            if (intrusiveData.intrusive) showIntrusiveToast(intrusiveData.intrusive);
            for (const objVoice of intrusiveData.objects) setTimeout(() => showObjectToast(objVoice), 500 * intrusiveData.objects.indexOf(objVoice));

            const context = analyzeContext(messageContent);
            const selectedSkills = selectSpeakingSkills(context, { minVoices: extensionSettings.minVoices || 1, maxVoices: extensionSettings.maxVoices || 4 });

            let voices = [];
            if (selectedSkills.length > 0) {
                voices = await generateVoices(selectedSkills, context, intrusiveData);
                const filteredVoices = extensionSettings.showFailedChecks ? voices : voices.filter(v => !v.checkResult || v.checkResult.success);
                const displayVoicesList = [];
                if (intrusiveData.intrusive && extensionSettings.intrusiveInChat) displayVoicesList.push(intrusiveData.intrusive);
                if (intrusiveData.objects && extensionSettings.intrusiveInChat) intrusiveData.objects.forEach(o => displayVoicesList.push({ ...o, signature: o.name }));
                displayVoicesList.push(...filteredVoices);
                displayVoices(displayVoicesList);
            }

            const lastMessage = getLastMessageElement();
            if (lastMessage) {
                const filteredVoices = extensionSettings.showFailedChecks ? voices : voices.filter(v => !v.checkResult || v.checkResult.success);
                injectVoicesIntoChat(filteredVoices, lastMessage, intrusiveData);
            }

            const completedThoughts = advanceResearch(messageContent);
            for (const thoughtId of completedThoughts) {
                const thought = THOUGHTS[thoughtId];
                if (thought) showInternalizedToast(thought);
            }

            const newlyDiscovered = checkThoughtDiscovery();
            for (const thought of newlyDiscovered) {
                setTimeout(() => showDiscoveryToast(thought), 1000);
            }

            hideToast(loadingToast);
            const totalVoices = voices.length + (intrusiveData.intrusive ? 1 : 0) + intrusiveData.objects.length;
            if (totalVoices > 0) showToast(`${totalVoices} voice${totalVoices !== 1 ? 's' : ''} spoke`, 'success', 2000);
            else showToast('The voices are quiet...', 'info', 2000);

            saveState(getSTContext());
            renderCabinetTab();

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

    // ═══════════════════════════════════════════════════════════════
    // PANEL CREATION
    // ═══════════════════════════════════════════════════════════════

    function createPsychePanel() {
        const panel = document.createElement('div');
        panel.id = 'inland-empire-panel';
        panel.className = 'inland-empire-panel';
        panel.innerHTML = `
            <div class="ie-panel-header"><div class="ie-panel-title"><i class="fa-solid fa-brain"></i><span>Psyche</span></div><div class="ie-panel-controls"><button class="ie-btn ie-btn-close-panel" title="Close"><i class="fa-solid fa-times"></i></button></div></div>
            <div class="ie-tabs">
                <button class="ie-tab ie-tab-active" data-tab="skills" title="Skills"><i class="fa-solid fa-chart-bar"></i></button>
                <button class="ie-tab" data-tab="cabinet" title="Thought Cabinet"><i class="fa-solid fa-box-archive"></i></button>
                <button class="ie-tab" data-tab="status" title="Status"><i class="fa-solid fa-heart-pulse"></i></button>
                <button class="ie-tab" data-tab="settings" title="Settings"><i class="fa-solid fa-gear"></i></button>
                <button class="ie-tab" data-tab="profiles" title="Profiles"><i class="fa-solid fa-user-circle"></i></button>
            </div>
            <div class="ie-panel-content">
                <div class="ie-tab-content ie-tab-content-active" data-tab-content="skills">
                    <div class="ie-section ie-skills-overview"><div class="ie-section-header"><span>Attributes</span></div><div class="ie-attributes-grid" id="ie-attributes-display"></div></div>
                    <div class="ie-section ie-voices-section"><div class="ie-section-header"><span>Inner Voices</span><button class="ie-btn ie-btn-sm ie-btn-clear-voices" title="Clear"><i class="fa-solid fa-eraser"></i></button></div><div class="ie-voices-container" id="ie-voices-output"><div class="ie-voices-empty"><i class="fa-solid fa-comment-slash"></i><span>Waiting for something to happen...</span></div></div></div>
                    <div class="ie-section ie-manual-section"><button class="ie-btn ie-btn-primary ie-btn-trigger" id="ie-manual-trigger"><i class="fa-solid fa-bolt"></i><span>Consult Inner Voices</span></button></div>
                </div>
                <div class="ie-tab-content" data-tab-content="cabinet" id="ie-cabinet-content"></div>
                <div class="ie-tab-content" data-tab-content="status">
                    <div class="ie-section"><div class="ie-section-header"><span>Active Effects</span></div><div class="ie-active-effects-summary" id="ie-active-effects-summary"><em>No active status effects</em></div></div>
                    <div class="ie-section"><div class="ie-section-header"><span>Toggle Status Effects</span></div><div class="ie-status-grid" id="ie-status-grid"></div></div>
                    <div class="ie-section"><div class="ie-section-header"><span>Ancient Voices</span></div><div class="ie-ancient-voices-info"><p class="ie-ancient-note">Ancient Voices only speak when <strong>Dissociated</strong>.</p><div class="ie-ancient-voice-item"><span class="ie-ancient-icon">🦎</span><span class="ie-ancient-name">Ancient Reptilian Brain</span><span class="ie-ancient-desc">Poetic nihilist. "Brother, you're already a ghost."</span></div><div class="ie-ancient-voice-item"><span class="ie-ancient-icon">❤️‍🔥</span><span class="ie-ancient-name">Limbic System</span><span class="ie-ancient-desc">Raw emotion. "Soul brother, the world goes on without you."</span></div><div class="ie-ancient-voice-item"><span class="ie-ancient-icon">🦴</span><span class="ie-ancient-name">Spinal Cord</span><span class="ie-ancient-desc">Pro wrestler energy. "I am the spinal cord!"</span></div></div></div>
                </div>
                <div class="ie-tab-content" data-tab-content="settings">
                    <div class="ie-section"><div class="ie-section-header"><span>API Configuration</span></div>
                        <div class="ie-form-group"><label>API Endpoint</label><input type="text" id="ie-api-endpoint" placeholder="https://api.example.com/v1" /></div>
                        <div class="ie-form-group"><label>API Key</label><input type="password" id="ie-api-key" placeholder="Your API key" /></div>
                        <div class="ie-form-group"><label>Model</label><input type="text" id="ie-model" placeholder="glm-4-plus" /></div>
                        <div class="ie-form-row"><div class="ie-form-group"><label>Temperature</label><input type="number" id="ie-temperature" min="0" max="2" step="0.1" value="0.9" /></div><div class="ie-form-group"><label>Max Tokens</label><input type="number" id="ie-max-tokens" min="50" max="1000" value="300" /></div></div>
                    </div>
                    <div class="ie-section"><div class="ie-section-header"><span>Voice Behavior</span></div>
                        <div class="ie-form-row"><div class="ie-form-group"><label>Min Voices</label><input type="number" id="ie-min-voices" min="0" max="6" value="1" /></div><div class="ie-form-group"><label>Max Voices</label><input type="number" id="ie-max-voices" min="1" max="10" value="4" /></div></div>
                        <div class="ie-form-group"><label>Trigger Delay (ms)</label><input type="number" id="ie-trigger-delay" min="0" max="5000" step="100" value="1000" /></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-show-dice-rolls" checked /><span>Show dice roll results</span></label></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-show-failed-checks" checked /><span>Show failed skill checks</span></label></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-auto-trigger" /><span>Auto-trigger on AI messages</span></label></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-auto-detect-status" /><span>Auto-detect status from narrative</span></label></div>
                    </div>
                    <div class="ie-section"><div class="ie-section-header"><span>Intrusive Thoughts</span></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-intrusive-enabled" checked /><span>Enable intrusive thoughts</span></label></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-intrusive-in-chat" checked /><span>Show in chat (not just toasts)</span></label></div>
                        <div class="ie-form-group"><label>Intrusive Chance (%)</label><input type="number" id="ie-intrusive-chance" min="0" max="100" value="15" /></div>
                    </div>
                    <div class="ie-section"><div class="ie-section-header"><span>Object Voices</span></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-object-voices-enabled" checked /><span>Enable object voices</span></label></div>
                        <div class="ie-form-group"><label>Object Voice Chance (%)</label><input type="number" id="ie-object-chance" min="0" max="100" value="40" /></div>
                    </div>
                    <div class="ie-section"><div class="ie-section-header"><span>Thought Cabinet</span></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-thought-discovery-enabled" checked /><span>Enable thought discovery</span></label></div>
                        <div class="ie-form-group"><label class="ie-checkbox"><input type="checkbox" id="ie-auto-discover-thoughts" checked /><span>Auto-discover thoughts</span></label></div>
                    </div>
                    <div class="ie-section"><div class="ie-section-header"><span>POV & Character</span></div>
                        <div class="ie-form-group"><label>Voice POV Style</label><select id="ie-pov-style"><option value="second">Second Person (you/your)</option><option value="third">Third Person (name/they)</option><option value="first">First Person (I/me)</option></select></div>
                        <div class="ie-form-group ie-third-person-options"><label>Character Name</label><input type="text" id="ie-character-name" placeholder="e.g. Harry" /></div>
                        <div class="ie-form-group ie-third-person-options"><label>Pronouns</label><select id="ie-character-pronouns"><option value="they">They/Them</option><option value="he">He/Him</option><option value="she">She/Her</option><option value="it">It/Its</option></select></div>
                        <div class="ie-form-group"><label>Character Context</label><textarea id="ie-character-context" rows="3" placeholder="Who are you? What's your situation?"></textarea></div>
                        <button class="ie-btn ie-btn-primary ie-btn-save-settings" style="width: 100%; margin-top: 10px;"><i class="fa-solid fa-save"></i><span>Save Settings</span></button>
                        <button class="ie-btn ie-btn-reset-fab" style="width: 100%; margin-top: 8px;"><i class="fa-solid fa-arrows-to-dot"></i><span>Reset Icon Position</span></button>
                    </div>
                </div>
                <div class="ie-tab-content" data-tab-content="profiles">
                    <div class="ie-section"><div class="ie-section-header"><span>Persona Profiles</span></div><div class="ie-profiles-list" id="ie-profiles-list"></div></div>
                    <div class="ie-section"><div class="ie-section-header"><span>Save Current as Profile</span></div><div class="ie-form-group"><label>Profile Name</label><input type="text" id="ie-new-profile-name" placeholder="e.g. Harry Du Bois" /></div><button class="ie-btn ie-btn-primary" id="ie-save-profile-btn" style="width: 100%;"><i class="fa-solid fa-save"></i><span>Save Profile</span></button></div>
                    <div class="ie-section"><div class="ie-section-header"><span>Build Editor</span></div><div class="ie-build-intro"><div class="ie-points-remaining">Points: <span id="ie-points-remaining">12</span> / 12</div></div><div class="ie-attributes-editor" id="ie-attributes-editor"></div><button class="ie-btn ie-btn-primary ie-btn-apply-build" style="width: 100%; margin-top: 10px;"><i class="fa-solid fa-check"></i><span>Apply Build</span></button></div>
                </div>
            </div>`;
        return panel;
    }

    function createToggleFAB() {
        const fab = document.createElement('div');
        fab.id = 'inland-empire-fab';
        fab.className = 'ie-fab';
        fab.title = 'Toggle Psyche Panel';
        fab.innerHTML = '<i class="fa-solid fa-brain"></i>';
        fab.style.display = 'flex';
        fab.style.top = `${extensionSettings.fabPositionTop ?? 140}px`;
        fab.style.left = `${extensionSettings.fabPositionLeft ?? 10}px`;
        let isDragging = false, dragStartX, dragStartY, fabStartX, fabStartY, hasMoved = false;
        function startDrag(e) { isDragging = true; hasMoved = false; const touch = e.touches ? e.touches[0] : e; dragStartX = touch.clientX; dragStartY = touch.clientY; fabStartX = fab.offsetLeft; fabStartY = fab.offsetTop; fab.style.transition = 'none'; document.addEventListener('mousemove', doDrag); document.addEventListener('touchmove', doDrag, { passive: false }); document.addEventListener('mouseup', endDrag); document.addEventListener('touchend', endDrag); }
        function doDrag(e) { if (!isDragging) return; e.preventDefault(); const touch = e.touches ? e.touches[0] : e; const deltaX = touch.clientX - dragStartX, deltaY = touch.clientY - dragStartY; if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) hasMoved = true; fab.style.left = `${Math.max(0, Math.min(window.innerWidth - fab.offsetWidth, fabStartX + deltaX))}px`; fab.style.top = `${Math.max(0, Math.min(window.innerHeight - fab.offsetHeight, fabStartY + deltaY))}px`; }
        function endDrag() { if (!isDragging) return; isDragging = false; fab.style.transition = 'all 0.3s ease'; document.removeEventListener('mousemove', doDrag); document.removeEventListener('touchmove', doDrag); document.removeEventListener('mouseup', endDrag); document.removeEventListener('touchend', endDrag); if (hasMoved) { fab.dataset.justDragged = 'true'; extensionSettings.fabPositionTop = fab.offsetTop; extensionSettings.fabPositionLeft = fab.offsetLeft; saveState(getSTContext()); } }
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
        document.getElementById('ie-save-profile-btn')?.addEventListener('click', () => { const nameInput = document.getElementById('ie-new-profile-name'); const name = nameInput?.value?.trim(); if (!name) { showToast('Enter a profile name', 'error', 2000); return; } const profile = saveProfile(name); showToast(`Saved: ${profile.name}`, 'success', 2000); nameInput.value = ''; renderProfilesList(); });
    }

    function addExtensionSettings() {
        const settingsContainer = document.getElementById('extensions_settings2');
        if (!settingsContainer) { setTimeout(addExtensionSettings, 1000); return; }
        if (document.getElementById('inland-empire-extension-settings')) return;
        settingsContainer.insertAdjacentHTML('beforeend', `<div id="inland-empire-extension-settings"><div class="inline-drawer"><div class="inline-drawer-toggle inline-drawer-header"><b><i class="fa-solid fa-brain"></i> Inland Empire</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div><div class="inline-drawer-content"><label class="checkbox_label" for="ie-extension-enabled"><input type="checkbox" id="ie-extension-enabled" ${extensionSettings.enabled ? 'checked' : ''} /><span>Enable Inland Empire</span></label><small>Disco Elysium-style internal voices v0.8.0!</small><br><br><button id="ie-toggle-panel-btn" class="menu_button"><i class="fa-solid fa-eye"></i> Toggle Panel</button></div></div></div>`);
        document.getElementById('ie-extension-enabled')?.addEventListener('change', (e) => { extensionSettings.enabled = e.target.checked; saveState(getSTContext()); const fab = document.getElementById('inland-empire-fab'); const panel = document.getElementById('inland-empire-panel'); if (fab) fab.style.display = e.target.checked ? 'flex' : 'none'; if (panel && !e.target.checked) panel.classList.remove('ie-panel-open'); });
        document.getElementById('ie-toggle-panel-btn')?.addEventListener('click', togglePanel);
    }

    async function init() {
        console.log('[Inland Empire] Starting initialization v0.8.0...');
        try {
            const context = await waitForSTReady();
            loadState(context);
            initializeThemeCounters();
            document.body.appendChild(createToggleFAB());
            document.body.appendChild(createPsychePanel());
            if (!extensionSettings.enabled) document.getElementById('inland-empire-fab').style.display = 'none';
            renderAttributesDisplay();
            renderCabinetTab();
            setupEventListeners();
            addExtensionSettings();
            if (context.eventSource) {
                const eventTypes = context.event_types || (typeof event_types !== 'undefined' ? event_types : null);
                if (eventTypes?.MESSAGE_RECEIVED) context.eventSource.on(eventTypes.MESSAGE_RECEIVED, onMessageReceived);
            }
            console.log('[Inland Empire] ✅ Initialization complete v0.8.0');
        } catch (error) { console.error('[Inland Empire] ❌ Initialization failed:', error); }
    }

    window.InlandEmpire = { getSkillLevel, getAllSkillLevels, rollSkillCheck, getSkillCap, getEffectiveSkillLevel, SKILLS, ATTRIBUTES, THOUGHTS, THEMES, ANCIENT_VOICES, thoughtCabinet, themeCounters, startResearch, abandonResearch, internalizeThought, checkThoughtDiscovery };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    else setTimeout(init, 1000);
})();
