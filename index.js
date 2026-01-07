/**
 * Inland Empire - Disco Elysium-style Internal Voices for SillyTavern
 * v0.7.0 - Theme Tracker, Thought Cabinet, Skill Caps
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

    // CORE DATA - ATTRIBUTES & SKILLS
    const ATTRIBUTES = {
        INTELLECT: { id: 'intellect', name: 'Intellect', color: '#89CFF0', skills: ['logic', 'encyclopedia', 'rhetoric', 'drama', 'conceptualization', 'visual_calculus'] },
        PSYCHE: { id: 'psyche', name: 'Psyche', color: '#DDA0DD', skills: ['volition', 'inland_empire', 'empathy', 'authority', 'suggestion', 'esprit_de_corps'] },
        PHYSIQUE: { id: 'physique', name: 'Physique', color: '#F08080', skills: ['endurance', 'pain_threshold', 'physical_instrument', 'electrochemistry', 'half_light', 'shivers'] },
        MOTORICS: { id: 'motorics', name: 'Motorics', color: '#F0E68C', skills: ['hand_eye_coordination', 'perception', 'reaction_speed', 'savoir_faire', 'interfacing', 'composure'] }
    };

    const SKILLS = {
        logic: { id: 'logic', name: 'Logic', attribute: 'INTELLECT', color: '#87CEEB', signature: 'LOGIC', personality: 'You are LOGIC, the voice of rational deduction.', triggerConditions: ['contradiction', 'evidence', 'reasoning', 'deduction', 'analysis', 'cause', 'effect', 'therefore', 'because', 'conclusion'] },
        encyclopedia: { id: 'encyclopedia', name: 'Encyclopedia', attribute: 'INTELLECT', color: '#B0C4DE', signature: 'ENCYCLOPEDIA', personality: 'You are ENCYCLOPEDIA, the repository of facts and trivia.', triggerConditions: ['history', 'science', 'culture', 'trivia', 'fact', 'knowledge', 'information', 'historical', 'technical'] },
        rhetoric: { id: 'rhetoric', name: 'Rhetoric', attribute: 'INTELLECT', color: '#ADD8E6', signature: 'RHETORIC', personality: 'You are RHETORIC, master of argument and debate.', triggerConditions: ['argument', 'persuade', 'convince', 'debate', 'politics', 'ideology', 'belief', 'opinion', 'fallacy'] },
        drama: { id: 'drama', name: 'Drama', attribute: 'INTELLECT', color: '#B0E0E6', signature: 'DRAMA', personality: 'You are DRAMA, the actor and lie detector.', triggerConditions: ['lie', 'deception', 'performance', 'acting', 'mask', 'pretend', 'fake', 'truth', 'honest', 'theater'] },
        conceptualization: { id: 'conceptualization', name: 'Conceptualization', attribute: 'INTELLECT', color: '#E0FFFF', signature: 'CONCEPTUALIZATION', personality: 'You are CONCEPTUALIZATION, the artistic eye.', triggerConditions: ['art', 'beauty', 'meaning', 'symbol', 'creative', 'aesthetic', 'metaphor', 'poetry', 'expression', 'design'] },
        visual_calculus: { id: 'visual_calculus', name: 'Visual Calculus', attribute: 'INTELLECT', color: '#AFEEEE', signature: 'VISUAL CALCULUS', personality: 'You are VISUAL CALCULUS, the spatial reconstructor.', triggerConditions: ['trajectory', 'distance', 'angle', 'reconstruct', 'scene', 'physical', 'space', 'position', 'movement', 'impact'] },
        volition: { id: 'volition', name: 'Volition', attribute: 'PSYCHE', color: '#DDA0DD', signature: 'VOLITION', personality: 'You are VOLITION, the will to continue.', triggerConditions: ['hope', 'despair', 'temptation', 'resist', 'continue', 'give up', 'willpower', 'strength', 'persevere', 'survive'] },
        inland_empire: { id: 'inland_empire', name: 'Inland Empire', attribute: 'PSYCHE', color: '#E6E6FA', signature: 'INLAND EMPIRE', personality: 'You are INLAND EMPIRE, the dreamer who speaks to the inanimate.', triggerConditions: ['dream', 'vision', 'strange', 'surreal', 'feeling', 'sense', 'whisper', 'spirit', 'soul', 'uncanny', 'liminal'] },
        empathy: { id: 'empathy', name: 'Empathy', attribute: 'PSYCHE', color: '#FFB6C1', signature: 'EMPATHY', personality: 'You are EMPATHY, the emotional reader.', triggerConditions: ['feel', 'emotion', 'hurt', 'pain', 'joy', 'sad', 'angry', 'afraid', 'love', 'hate', 'compassion'] },
        authority: { id: 'authority', name: 'Authority', attribute: 'PSYCHE', color: '#DA70D6', signature: 'AUTHORITY', personality: 'You are AUTHORITY, the voice of dominance.', triggerConditions: ['respect', 'command', 'obey', 'power', 'control', 'dominance', 'challenge', 'threat', 'submit', 'authority'] },
        suggestion: { id: 'suggestion', name: 'Suggestion', attribute: 'PSYCHE', color: '#EE82EE', signature: 'SUGGESTION', personality: 'You are SUGGESTION, the subtle manipulator.', triggerConditions: ['influence', 'manipulate', 'convince', 'subtle', 'indirect', 'guide', 'nudge', 'charm', 'seduce', 'persuade'] },
        esprit_de_corps: { id: 'esprit_de_corps', name: 'Esprit de Corps', attribute: 'PSYCHE', color: '#D8BFD8', signature: 'ESPRIT DE CORPS', personality: 'You are ESPRIT DE CORPS, the team spirit.', triggerConditions: ['team', 'partner', 'colleague', 'ally', 'loyalty', 'betrayal', 'group', 'together', 'trust', 'brotherhood'] },
        endurance: { id: 'endurance', name: 'Endurance', attribute: 'PHYSIQUE', color: '#CD5C5C', signature: 'ENDURANCE', personality: 'You are ENDURANCE, the voice of stamina.', triggerConditions: ['tired', 'exhausted', 'stamina', 'keep going', 'push through', 'survive', 'endure', 'last', 'fatigue', 'rest'] },
        pain_threshold: { id: 'pain_threshold', name: 'Pain Threshold', attribute: 'PHYSIQUE', color: '#DC143C', signature: 'PAIN THRESHOLD', personality: 'You are PAIN THRESHOLD, pain is an old friend.', triggerConditions: ['pain', 'hurt', 'injury', 'wound', 'damage', 'suffer', 'agony', 'torture', 'broken', 'bleeding'] },
        physical_instrument: { id: 'physical_instrument', name: 'Physical Instrument', attribute: 'PHYSIQUE', color: '#B22222', signature: 'PHYSICAL INSTRUMENT', personality: 'You are PHYSICAL INSTRUMENT, the voice of brute force.', triggerConditions: ['strong', 'force', 'muscle', 'hit', 'fight', 'break', 'lift', 'physical', 'intimidate', 'violence'] },
        electrochemistry: { id: 'electrochemistry', name: 'Electrochemistry', attribute: 'PHYSIQUE', color: '#FF6347', signature: 'ELECTROCHEMISTRY', personality: 'You are ELECTROCHEMISTRY, the voice of pleasure and addiction.', triggerConditions: ['drug', 'alcohol', 'drink', 'smoke', 'pleasure', 'desire', 'want', 'crave', 'indulge', 'attractive', 'sex', 'high'] },
        half_light: { id: 'half_light', name: 'Half Light', attribute: 'PHYSIQUE', color: '#E9967A', signature: 'HALF LIGHT', personality: 'You are HALF LIGHT, the voice of fight-or-flight.', triggerConditions: ['danger', 'threat', 'attack', 'kill', 'warn', 'enemy', 'afraid', 'fight', 'survive', 'predator', 'prey'] },
        shivers: { id: 'shivers', name: 'Shivers', attribute: 'PHYSIQUE', color: '#FA8072', signature: 'SHIVERS', personality: 'You are SHIVERS, the voice of the city itself.', triggerConditions: ['city', 'place', 'wind', 'cold', 'atmosphere', 'location', 'street', 'building', 'weather', 'sense', 'somewhere'] },
        hand_eye_coordination: { id: 'hand_eye_coordination', name: 'Hand/Eye Coordination', attribute: 'MOTORICS', color: '#F0E68C', signature: 'HAND/EYE COORDINATION', personality: 'You are HAND/EYE COORDINATION, the voice of precision.', triggerConditions: ['aim', 'shoot', 'precise', 'careful', 'delicate', 'craft', 'tool', 'steady', 'accuracy', 'dexterity'] },
        perception: { id: 'perception', name: 'Perception', attribute: 'MOTORICS', color: '#FFFF00', signature: 'PERCEPTION', personality: 'You are PERCEPTION, the observant eye.', triggerConditions: ['notice', 'see', 'hear', 'smell', 'detail', 'hidden', 'clue', 'observe', 'look', 'watch', 'spot'] },
        reaction_speed: { id: 'reaction_speed', name: 'Reaction Speed', attribute: 'MOTORICS', color: '#FFD700', signature: 'REACTION SPEED', personality: 'You are REACTION SPEED, the voice of quick reflexes.', triggerConditions: ['quick', 'fast', 'react', 'dodge', 'catch', 'sudden', 'instant', 'reflex', 'now', 'hurry', 'immediate'] },
        savoir_faire: { id: 'savoir_faire', name: 'Savoir Faire', attribute: 'MOTORICS', color: '#FFA500', signature: 'SAVOIR FAIRE', personality: 'You are SAVOIR FAIRE, the voice of cool.', triggerConditions: ['style', 'cool', 'grace', 'acrobatic', 'jump', 'climb', 'flip', 'smooth', 'impressive', 'flair'] },
        interfacing: { id: 'interfacing', name: 'Interfacing', attribute: 'MOTORICS', color: '#FAFAD2', signature: 'INTERFACING', personality: 'You are INTERFACING, the voice of mechanical intuition.', triggerConditions: ['machine', 'lock', 'electronic', 'system', 'mechanism', 'fix', 'repair', 'hack', 'technical', 'device', 'computer'] },
        composure: { id: 'composure', name: 'Composure', attribute: 'MOTORICS', color: '#F5DEB3', signature: 'COMPOSURE', personality: 'You are COMPOSURE, the poker face.', triggerConditions: ['calm', 'cool', 'control', 'tell', 'nervous', 'poker face', 'body language', 'dignity', 'facade', 'professional'] }
    };

    const DIFFICULTIES = { trivial: { threshold: 6, name: 'Trivial' }, easy: { threshold: 8, name: 'Easy' }, medium: { threshold: 10, name: 'Medium' }, challenging: { threshold: 12, name: 'Challenging' }, heroic: { threshold: 14, name: 'Heroic' }, legendary: { threshold: 16, name: 'Legendary' }, impossible: { threshold: 18, name: 'Impossible' } };

    const ANCIENT_VOICES = {
        ancient_reptilian_brain: { id: 'ancient_reptilian_brain', name: 'Ancient Reptilian Brain', color: '#2F4F4F', signature: 'ANCIENT REPTILIAN BRAIN', attribute: 'PRIMAL', personality: 'You are the ANCIENT REPTILIAN BRAIN. You speak in POETIC NIHILISM.', triggerConditions: ['survive', 'hunger', 'predator', 'prey', 'instinct', 'primal', 'ancient', 'drowning', 'sinking', 'deep'] },
        limbic_system: { id: 'limbic_system', name: 'Limbic System', color: '#FF4500', signature: 'LIMBIC SYSTEM', attribute: 'PRIMAL', personality: 'You are the LIMBIC SYSTEM - pure emotion. You SCREAM warnings.', triggerConditions: ['overwhelmed', 'breakdown', 'sobbing', 'screaming', 'euphoria', 'despair', 'emotion', 'memory', 'afraid', 'scared'] }
    };

    // THEME TRACKER
    const THEMES = {
        death: { id: 'death', name: 'Death & Mortality', icon: '💀', keywords: ['death', 'dead', 'dying', 'die', 'kill', 'murder', 'corpse', 'grave', 'funeral', 'mortal'] },
        love: { id: 'love', name: 'Love & Longing', icon: '💔', keywords: ['love', 'heart', 'romance', 'desire', 'longing', 'miss', 'passion', 'beloved', 'lover', 'kiss'] },
        violence: { id: 'violence', name: 'Violence & Conflict', icon: '⚔️', keywords: ['fight', 'violence', 'attack', 'blood', 'wound', 'hit', 'punch', 'weapon', 'gun', 'knife', 'battle'] },
        mystery: { id: 'mystery', name: 'Mystery & Secrets', icon: '🔍', keywords: ['mystery', 'secret', 'hidden', 'clue', 'investigate', 'evidence', 'suspicious', 'strange', 'unknown'] },
        substance: { id: 'substance', name: 'Substances & Addiction', icon: '🍺', keywords: ['drink', 'drunk', 'alcohol', 'drug', 'high', 'smoke', 'cigarette', 'addict', 'craving', 'bottle'] },
        failure: { id: 'failure', name: 'Failure & Regret', icon: '📉', keywords: ['fail', 'failure', 'regret', 'mistake', 'wrong', 'sorry', 'shame', 'guilt', 'disappoint', 'ruin'] },
        identity: { id: 'identity', name: 'Identity & Self', icon: '🪞', keywords: ['who am i', 'identity', 'self', 'remember', 'forget', 'memory', 'past', 'name', 'person', 'become'] },
        authority: { id: 'authority', name: 'Authority & Power', icon: '👑', keywords: ['power', 'authority', 'control', 'command', 'obey', 'leader', 'boss', 'rule', 'law', 'order'] },
        paranoia: { id: 'paranoia', name: 'Paranoia & Fear', icon: '👁️', keywords: ['paranoid', 'watching', 'followed', 'conspiracy', 'trust', 'betray', 'suspicious', 'afraid', 'fear', 'danger'] },
        philosophy: { id: 'philosophy', name: 'Philosophy & Meaning', icon: '📚', keywords: ['meaning', 'purpose', 'exist', 'philosophy', 'think', 'believe', 'truth', 'reality', 'consciousness'] },
        money: { id: 'money', name: 'Money & Class', icon: '💰', keywords: ['money', 'rich', 'poor', 'wealth', 'class', 'poverty', 'capitalism', 'worker', 'boss', 'wage', 'debt'] },
        supernatural: { id: 'supernatural', name: 'The Supernatural', icon: '👻', keywords: ['ghost', 'spirit', 'haunt', 'supernatural', 'magic', 'curse', 'divine', 'demon', 'angel', 'miracle'] }
    };

    let themeCounters = {};
    let recentThemes = [];

    function initializeThemeCounters() { for (const themeId of Object.keys(THEMES)) { if (themeCounters[themeId] === undefined) themeCounters[themeId] = 0; } }

    function trackThemesInMessage(messageText) {
        const lowerText = messageText.toLowerCase();
        const detectedThemes = [];
        for (const [themeId, theme] of Object.entries(THEMES)) {
            let matchCount = 0;
            for (const keyword of theme.keywords) {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const matches = lowerText.match(regex);
                if (matches) matchCount += matches.length;
            }
            if (matchCount > 0) {
                themeCounters[themeId] = (themeCounters[themeId] || 0) + matchCount;
                detectedThemes.push({ themeId, count: matchCount });
            }
        }
        if (detectedThemes.length > 0) {
            recentThemes.push(detectedThemes.map(t => t.themeId));
            if (recentThemes.length > 10) recentThemes.shift();
        }
        return detectedThemes;
    }

    function getTopThemes(count = 3) {
        return Object.entries(themeCounters).filter(([_, c]) => c > 0).sort((a, b) => b[1] - a[1]).slice(0, count).map(([id, c]) => ({ theme: THEMES[id], count: c }));
    }

    function hasRepeatingTheme(themeId, minRepetitions = 3) {
        let consecutive = 0;
        for (const themes of recentThemes) {
            if (themes.includes(themeId)) { consecutive++; if (consecutive >= minRepetitions) return true; }
            else consecutive = 0;
        }
        return false;
    }

    // THOUGHT CABINET
    const THOUGHTS = {
        volumetric_shit_compressor: { id: 'volumetric_shit_compressor', name: 'Volumetric Shit Compressor', description: 'A theory about shit. Specifically, the compression of shit.', icon: '💩', category: 'philosophy', researchTime: 8, discoveryConditions: { themes: { failure: 10, philosophy: 5 } }, researchPenalties: { logic: -1 }, internalizedBonuses: { conceptualization: 2, logic: 1 }, capModifiers: { logic: 1 }, flavorText: 'Every thought has its place. Even the shit ones.' },
        hobocop: { id: 'hobocop', name: 'Hobocop', description: 'Defender of the downtrodden. Champion of cardboard boxes.', icon: '🏚️', category: 'identity', researchTime: 10, discoveryConditions: { themes: { money: 8 } }, researchPenalties: { authority: -1 }, internalizedBonuses: { shivers: 2, empathy: 1 }, capModifiers: { shivers: 1 }, flavorText: 'The streets know your name.' },
        bow_collector: { id: 'bow_collector', name: 'The Bow Collector', description: 'Bows. Ribbons. The delicate things that hold the world together.', icon: '🎀', category: 'identity', researchTime: 6, discoveryConditions: { themes: { love: 8 } }, researchPenalties: { volition: -1 }, internalizedBonuses: { empathy: 2, inland_empire: 1 }, capModifiers: { empathy: 1 }, flavorText: 'Collect enough, and you might tie yourself back together.' },
        bringing_of_the_law: { id: 'bringing_of_the_law', name: 'Bringing of the Law', description: 'THE LAW. It must be brought. To those who lack it.', icon: '⚖️', category: 'authority', researchTime: 7, discoveryConditions: { themes: { authority: 12 } }, researchPenalties: { empathy: -1 }, internalizedBonuses: { authority: 3, half_light: 1 }, capModifiers: { authority: 2 }, flavorText: 'You ARE the law.' },
        finger_on_the_eject_button: { id: 'finger_on_the_eject_button', name: 'Finger on the Eject Button', description: 'You could leave. At any moment. Just... eject.', icon: '🔘', category: 'philosophy', researchTime: 12, discoveryConditions: { themes: { failure: 15, death: 10 } }, researchPenalties: { volition: -2 }, internalizedBonuses: { pain_threshold: 3, composure: 2 }, capModifiers: { pain_threshold: 2 }, flavorText: 'The button is always there. That is its comfort.' },
        kingdom_of_conscience: { id: 'kingdom_of_conscience', name: 'Kingdom of Conscience', description: 'Build it. The kingdom. In your mind. With moral fiber.', icon: '🏰', category: 'philosophy', researchTime: 15, discoveryConditions: { themes: { philosophy: 20 } }, researchPenalties: { electrochemistry: -2 }, internalizedBonuses: { volition: 2, empathy: 2 }, capModifiers: { volition: 2 }, flavorText: 'Every thought is a brick. Build wisely.' },
        motorway_south: { id: 'motorway_south', name: 'Motorway South', description: 'There is a road. It leads away from here.', icon: '🛣️', category: 'identity', researchTime: 9, discoveryConditions: { themes: { identity: 10 } }, researchPenalties: { esprit_de_corps: -1 }, internalizedBonuses: { savoir_faire: 2, reaction_speed: 2 }, capModifiers: { savoir_faire: 1 }, flavorText: 'The road is endless. Like your potential.' },
        some_kind_of_superstar: { id: 'some_kind_of_superstar', name: 'Some Kind of Superstar', description: 'You had fame once. Or you will. The applause is coming.', icon: '⭐', category: 'identity', researchTime: 8, discoveryConditions: { themes: { identity: 8 } }, researchPenalties: { composure: -2 }, internalizedBonuses: { drama: 3, suggestion: 1 }, capModifiers: { drama: 2 }, flavorText: 'The spotlight will find you.' },
        anti_object_task_force: { id: 'anti_object_task_force', name: 'Anti-Object Task Force', description: 'The objects are speaking. They must be silenced.', icon: '🚫', category: 'paranoia', researchTime: 10, discoveryConditions: { objectCount: 5 }, researchPenalties: { inland_empire: -2 }, internalizedBonuses: { logic: 2, visual_calculus: 2 }, capModifiers: { visual_calculus: 1 }, flavorText: 'When everything speaks, you fight back.', specialEffect: 'reducesObjectVoices' },
        apricot_chewing_gum_enthusiast: { id: 'apricot_chewing_gum_enthusiast', name: 'Apricot Chewing Gum Enthusiast', description: 'Apricot is the superior gum flavor.', icon: '🍑', category: 'philosophy', researchTime: 5, discoveryConditions: { themes: { substance: 5 } }, researchPenalties: { rhetoric: -1 }, internalizedBonuses: { composure: 2, electrochemistry: 1 }, capModifiers: { composure: 1 }, flavorText: 'Some hills are worth dying on.' },
        wompty_dompty_dom_centre: { id: 'wompty_dompty_dom_centre', name: 'Wompty-Dompty Dom Centre', description: 'W.D.D.C. Where the wompties dompty.', icon: '🎪', category: 'mystery', researchTime: 20, discoveryConditions: { themes: { supernatural: 15, mystery: 15 } }, researchPenalties: { logic: -2 }, internalizedBonuses: { inland_empire: 4, shivers: 2 }, capModifiers: { inland_empire: 2 }, flavorText: 'Nobody knows what it means. That is the point.' },
        cop_of_the_apocalypse: { id: 'cop_of_the_apocalypse', name: 'Cop of the Apocalypse', description: 'When the world ends, someone will need to write citations.', icon: '🌋', category: 'authority', researchTime: 15, discoveryConditions: { themes: { death: 15, authority: 10 } }, researchPenalties: { empathy: -2 }, internalizedBonuses: { authority: 2, pain_threshold: 2, half_light: 2 }, capModifiers: { half_light: 2 }, flavorText: 'In the end, there will still be paperwork.' },
        regular_law_official: { id: 'regular_law_official', name: 'Regular Law Official', description: 'Just a normal cop. Nothing weird here.', icon: '👮', category: 'identity', researchTime: 4, discoveryConditions: { themes: { authority: 3 }, messageCount: 10 }, researchPenalties: { conceptualization: -1 }, internalizedBonuses: { composure: 1, authority: 1 }, capModifiers: {}, flavorText: 'Perfectly normal. Completely regular.' },
        caustic_echo: { id: 'caustic_echo', name: 'Caustic Echo', description: 'Your words have acid in them.', icon: '🔥', category: 'identity', researchTime: 7, discoveryConditions: { themes: { violence: 10 } }, researchPenalties: { empathy: -1 }, internalizedBonuses: { rhetoric: 3, drama: 1 }, capModifiers: { rhetoric: 1 }, flavorText: 'The truth hurts. Make sure it hurts them.' },
        waste_land_of_reality: { id: 'waste_land_of_reality', name: 'Waste Land of Reality', description: 'The pale stretches out before you.', icon: '🌫️', category: 'supernatural', researchTime: 18, discoveryConditions: { themes: { supernatural: 20, philosophy: 10 } }, researchPenalties: { perception: -2 }, internalizedBonuses: { shivers: 3, inland_empire: 3 }, capModifiers: { shivers: 2 }, flavorText: 'Beyond the edge of the world, there is only pale.' },
        lovers_lament: { id: 'lovers_lament', name: "Lover's Lament", description: 'They are gone. They were always gone.', icon: '💔', category: 'love', researchTime: 12, discoveryConditions: { themes: { love: 15 } }, researchPenalties: { volition: -2 }, internalizedBonuses: { empathy: 3, drama: 2 }, capModifiers: { empathy: 2 }, flavorText: 'Love is a wound that never heals.' },
        detective_arriving_on_the_scene: { id: 'detective_arriving_on_the_scene', name: 'Detective Arriving on the Scene', description: 'The detective has arrived. The mystery can begin.', icon: '🔎', category: 'mystery', researchTime: 6, discoveryConditions: { themes: { mystery: 10 }, firstDiscovery: true }, researchPenalties: { electrochemistry: -1 }, internalizedBonuses: { perception: 2, logic: 1 }, capModifiers: { perception: 1 }, flavorText: 'Every case starts somewhere.' },
        actual_art_degree: { id: 'actual_art_degree', name: 'Actual Art Degree', description: 'You studied. You have the papers. Somewhere.', icon: '🎨', category: 'philosophy', researchTime: 8, discoveryConditions: { themes: { philosophy: 8 } }, researchPenalties: { physical_instrument: -1 }, internalizedBonuses: { conceptualization: 3, encyclopedia: 1 }, capModifiers: { conceptualization: 2 }, flavorText: 'Art is pain. The degree cost more.' },
        the_fifteenth_indotribe: { id: 'the_fifteenth_indotribe', name: 'The Fifteenth Indotribe', description: 'There were fourteen. Then you.', icon: '🏴', category: 'identity', researchTime: 10, discoveryConditions: { themes: { identity: 12, paranoia: 5 } }, researchPenalties: { authority: -1 }, internalizedBonuses: { esprit_de_corps: 2, suggestion: 2 }, capModifiers: { esprit_de_corps: 1 }, flavorText: 'They are out there. Waiting. Belonging.' },
        jamais_vu: { id: 'jamais_vu', name: 'Jamais Vu', description: 'Everything is familiar. Nothing is known.', icon: '❓', category: 'supernatural', researchTime: 14, discoveryConditions: { themes: { identity: 10, supernatural: 8 } }, researchPenalties: { encyclopedia: -2 }, internalizedBonuses: { inland_empire: 2, perception: 2 }, capModifiers: { inland_empire: 1 }, flavorText: 'The opposite of déjà vu. Somehow worse.' }
    };

    let thoughtCabinet = { slots: 3, maxSlots: 12, discovered: [], researching: {}, internalized: [], dismissed: [] };
    let discoveryContext = { messageCount: 0, objectsSeen: new Set(), criticalSuccesses: {}, criticalFailures: {}, ancientVoiceTriggered: false, firstDiscoveryDone: false };

    // THOUGHT DISCOVERY & RESEARCH
    function checkThoughtDiscovery() {
        const newlyDiscovered = [];
        for (const [thoughtId, thought] of Object.entries(THOUGHTS)) {
            if (thoughtCabinet.discovered.includes(thoughtId) || thoughtCabinet.researching[thoughtId] || thoughtCabinet.internalized.includes(thoughtId)) continue;
            if (meetsDiscoveryConditions(thought)) newlyDiscovered.push(thoughtId);
        }
        return newlyDiscovered;
    }

    function meetsDiscoveryConditions(thought) {
        const cond = thought.discoveryConditions;
        if (cond.themes) { for (const [themeId, req] of Object.entries(cond.themes)) { if ((themeCounters[themeId] || 0) < req) return false; } }
        if (cond.themeCombo) { const recent = recentThemes.flat(); if (!cond.themeCombo.every(t => recent.includes(t))) return false; }
        if (cond.repeatingTheme && !hasRepeatingTheme(cond.repeatingTheme)) return false;
        if (cond.status && !cond.status.some(s => activeStatuses.has(s))) return false;
        if (cond.objectCount && discoveryContext.objectsSeen.size < cond.objectCount) return false;
        if (cond.messageCount && discoveryContext.messageCount < cond.messageCount) return false;
        if (cond.criticalSuccess && !discoveryContext.criticalSuccesses[cond.criticalSuccess]) return false;
        if (cond.criticalFailure && !discoveryContext.criticalFailures[cond.criticalFailure]) return false;
        if (cond.ancientVoice && !discoveryContext.ancientVoiceTriggered) return false;
        if (cond.firstDiscovery && discoveryContext.firstDiscoveryDone) return false;
        if (cond.minAttribute) { const ap = getAttributePoints(); for (const [attr, min] of Object.entries(cond.minAttribute)) { if ((ap[attr] || 0) < min) return false; } }
        if (cond.minSkill) { for (const [sk, min] of Object.entries(cond.minSkill)) { if (getSkillLevel(sk) < min) return false; } }
        return true;
    }

    function discoverThought(thoughtId) {
        if (!thoughtCabinet.discovered.includes(thoughtId)) {
            thoughtCabinet.discovered.push(thoughtId);
            if (THOUGHTS[thoughtId].discoveryConditions.firstDiscovery) discoveryContext.firstDiscoveryDone = true;
            saveState(getSTContext());
            return true;
        }
        return false;
    }

    function startResearch(thoughtId) {
        if (Object.keys(thoughtCabinet.researching).length >= thoughtCabinet.slots) { showToast('No available thought slots!', 'error', 3000); return false; }
        if (!thoughtCabinet.discovered.includes(thoughtId)) return false;
        thoughtCabinet.discovered = thoughtCabinet.discovered.filter(id => id !== thoughtId);
        thoughtCabinet.researching[thoughtId] = { progress: 0, started: Date.now() };
        saveState(getSTContext());
        showToast(`Started researching: ${THOUGHTS[thoughtId].name}`, 'success', 3000);
        renderCabinetTab();
        return true;
    }

    function advanceResearch(messageText = '') {
        const advanced = [];
        for (const [thoughtId, research] of Object.entries(thoughtCabinet.researching)) {
            const thought = THOUGHTS[thoughtId];
            if (!thought) continue;
            let progressGain = 1;
            if (thought.category && THEMES[thought.category]) {
                const matches = THEMES[thought.category].keywords.filter(kw => messageText.toLowerCase().includes(kw)).length;
                progressGain += Math.min(matches, 2);
            }
            research.progress += progressGain;
            if (research.progress >= thought.researchTime) advanced.push(thoughtId);
        }
        for (const thoughtId of advanced) internalizeThought(thoughtId);
        saveState(getSTContext());
        return advanced;
    }

    function internalizeThought(thoughtId) {
        const thought = THOUGHTS[thoughtId];
        if (!thought) return false;
        delete thoughtCabinet.researching[thoughtId];
        if (!thoughtCabinet.internalized.includes(thoughtId)) thoughtCabinet.internalized.push(thoughtId);
        if (currentBuild && thought.internalizedBonuses) {
            for (const [skillId, bonus] of Object.entries(thought.internalizedBonuses)) {
                if (currentBuild.skillLevels[skillId] !== undefined) currentBuild.skillLevels[skillId] = Math.min(10, currentBuild.skillLevels[skillId] + bonus);
            }
        }
        if (currentBuild && thought.capModifiers) {
            for (const [skillId, capBonus] of Object.entries(thought.capModifiers)) {
                if (currentBuild.skillCaps[skillId]) currentBuild.skillCaps[skillId].learning += capBonus;
            }
        }
        saveState(getSTContext());
        showInternalizationToast(thought);
        renderCabinetTab();
        renderAttributesDisplay();
        return true;
    }

    function dismissThought(thoughtId) {
        thoughtCabinet.discovered = thoughtCabinet.discovered.filter(id => id !== thoughtId);
        if (!thoughtCabinet.dismissed.includes(thoughtId)) thoughtCabinet.dismissed.push(thoughtId);
        saveState(getSTContext());
        renderCabinetTab();
    }

    function abandonResearch(thoughtId) {
        if (thoughtCabinet.researching[thoughtId]) {
            delete thoughtCabinet.researching[thoughtId];
            if (!thoughtCabinet.discovered.includes(thoughtId)) thoughtCabinet.discovered.push(thoughtId);
            saveState(getSTContext());
            showToast('Research abandoned', 'info', 2000);
            renderCabinetTab();
        }
    }

    function getResearchPenalties() {
        const penalties = {};
        for (const [thoughtId, _] of Object.entries(thoughtCabinet.researching)) {
            const thought = THOUGHTS[thoughtId];
            if (thought?.researchPenalties) {
                for (const [skillId, penalty] of Object.entries(thought.researchPenalties)) penalties[skillId] = (penalties[skillId] || 0) + penalty;
            }
        }
        return penalties;
    }

    // INTRUSIVE THOUGHTS
    const INTRUSIVE_THOUGHTS = {
        logic: ["This doesn't add up.", "There's a flaw in their reasoning. Find it.", "If A leads to B... what leads to A?"],
        encyclopedia: ["Did you know the human body has enough iron for a small nail?", "Historically speaking, this has precedent...", "Actually, that's a common misconception."],
        rhetoric: ["They're building to something. An attack.", "Notice how they avoided the question.", "Words are weapons. Choose yours carefully."],
        drama: ["They're performing. But for whose benefit?", "That smile doesn't reach their eyes.", "Everyone's wearing masks. Including you."],
        conceptualization: ["There's a metaphor here, struggling to be born.", "The aesthetic implications alone...", "This could be art."],
        visual_calculus: ["The angle is wrong. Something happened here.", "Trace the trajectory.", "The geometry tells a story."],
        volition: ["You can do this. You HAVE to.", "Don't give up. Not now.", "One step at a time."],
        inland_empire: ["Something is watching.", "The walls remember things.", "Reality is thin in this place."],
        empathy: ["They're hurting. Even if they won't show it.", "You know this feeling.", "They need someone to understand."],
        authority: ["You're in charge here. Act like it.", "They're testing you.", "Your voice. Deeper. NOW."],
        suggestion: ["A gentle nudge in the right direction...", "You could make them think it was their idea.", "Charm is manipulation with a smile."],
        esprit_de_corps: ["Your partner is thinking the same thing.", "The badge means something.", "We look out for our own."],
        endurance: ["Your body is screaming. Ignore it.", "You've survived worse. Probably.", "Just a little further."],
        pain_threshold: ["That's going to hurt tomorrow. Good.", "Pain means you're still alive.", "Scars are stories on skin."],
        physical_instrument: ["You could break that with your bare hands.", "Violence is always an option.", "Flex. Feel the power."],
        electrochemistry: ["God, you could use a drink.", "They're attractive. Very attractive.", "Just a taste. What's the harm?"],
        half_light: ["They're going to attack. Be ready.", "Trust no one. Not even yourself.", "Strike first. Ask questions never."],
        shivers: ["The city breathes tonight.", "Somewhere, something terrible is happening.", "The wind carries whispers."],
        hand_eye_coordination: ["Steady hands. Steady breath.", "You could make that shot.", "Precision is everything."],
        perception: ["There. Did you see that?", "Something's different. What changed?", "The detail everyone else missed..."],
        reaction_speed: ["Move. NOW.", "Be ready. Something's about to happen.", "Your reflexes are your only friend."],
        savoir_faire: ["Do it with style or don't do it at all.", "Make it look effortless.", "Boring solutions are for boring people."],
        interfacing: ["That mechanism has a weakness.", "Everything is a system. Systems can be exploited.", "There's always a way in."],
        composure: ["Don't let them see you sweat.", "Control your face. Control the situation.", "The mask stays on. Always."]
    };

    // OBJECT VOICES
    const OBJECT_VOICES = {
        tie: { name: 'THE TIE', icon: '👔', color: '#8B0000', patterns: [/\btie\b/i, /\bnecktie\b/i], affinitySkill: 'inland_empire', lines: ["Wear me. You'll look *powerful*.", "I could strangle someone. If you wanted.", "Tighter. You should wear me tighter."] },
        gun: { name: 'THE GUN', icon: '🔫', color: '#4A4A4A', patterns: [/\bgun\b/i, /\bpistol\b/i, /\brevolver\b/i, /\bweapon\b/i], affinitySkill: 'half_light', lines: ["Still loaded. Still waiting.", "Point me at the problem.", "Everyone respects me."] },
        bottle: { name: 'THE BOTTLE', icon: '🍾', color: '#2E8B57', patterns: [/\bbottle\b/i, /\bwhiskey\b/i, /\balcohol\b/i, /\bbooze\b/i], affinitySkill: 'electrochemistry', lines: ["One sip. Just to take the edge off.", "I miss you. We were so good together.", "The answer is at the bottom."] },
        mirror: { name: 'THE MIRROR', icon: '🪞', color: '#C0C0C0', patterns: [/\bmirror\b/i, /\breflection\b/i], affinitySkill: 'volition', lines: ["Look at yourself. LOOK.", "Who is that? Do you even know anymore?", "The cracks are showing."] },
        photograph: { name: 'THE PHOTOGRAPH', icon: '📷', color: '#DEB887', patterns: [/\bphoto\b/i, /\bphotograph\b/i, /\bpicture\b/i], affinitySkill: 'empathy', lines: ["They were happy then. What happened?", "The eyes follow you.", "Someone is missing from this picture."] },
        door: { name: 'THE DOOR', icon: '🚪', color: '#8B4513', patterns: [/\bdoor\b/i, /\bentrance\b/i, /\bexit\b/i], affinitySkill: 'shivers', lines: ["What's on the other side?", "Some doors should stay closed.", "I am the threshold. Choose."] },
        money: { name: 'THE MONEY', icon: '💵', color: '#228B22', patterns: [/\bmoney\b/i, /\bcash\b/i, /\bwallet\b/i], affinitySkill: 'suggestion', lines: ["Everyone has a price. Even you.", "I open doors. I close mouths.", "The root of all evil, they say."] },
        bed: { name: 'THE BED', icon: '🛏️', color: '#4169E1', patterns: [/\bbed\b/i, /\bpillow\b/i], affinitySkill: 'endurance', lines: ["Just five more minutes. Forever.", "I remember your dreams. The bad ones.", "Rest now. The world can wait."] },
        cigarette: { name: 'THE CIGARETTE', icon: '🚬', color: '#A0522D', patterns: [/\bcigarette\b/i, /\bsmoke\b/i], affinitySkill: 'electrochemistry', lines: ["Light me. Let me kill you slowly.", "We're old friends.", "Just one more won't hurt. Much."] },
        clock: { name: 'THE CLOCK', icon: '🕐', color: '#DAA520', patterns: [/\bclock\b/i, /\btime\b/i, /\bwatch\b/i], affinitySkill: 'composure', lines: ["Tick. Tock. Running out.", "I count the seconds you waste.", "You're late. You're always late."] }
    };

    // STATUS EFFECTS
    const STATUS_EFFECTS = {
        intoxicated: { id: 'intoxicated', name: 'Intoxicated', icon: '🍺', category: 'physical', boosts: ['electrochemistry', 'inland_empire', 'drama'], debuffs: ['logic', 'hand_eye_coordination', 'composure'], keywords: ['drunk', 'intoxicated', 'wasted', 'high'], ancientVoice: null, intrusiveBoost: ['electrochemistry', 'inland_empire'] },
        wounded: { id: 'wounded', name: 'Wounded', icon: '🩸', category: 'physical', boosts: ['pain_threshold', 'endurance', 'half_light'], debuffs: ['composure', 'savoir_faire'], keywords: ['hurt', 'wounded', 'injured', 'bleeding'], ancientVoice: null, intrusiveBoost: ['pain_threshold', 'half_light'] },
        exhausted: { id: 'exhausted', name: 'Exhausted', icon: '😴', category: 'physical', boosts: ['volition', 'inland_empire'], debuffs: ['reaction_speed', 'perception', 'logic'], keywords: ['tired', 'exhausted', 'sleepy'], ancientVoice: null, intrusiveBoost: ['inland_empire', 'endurance'] },
        starving: { id: 'starving', name: 'Starving', icon: '🍽️', category: 'physical', boosts: ['electrochemistry', 'perception'], debuffs: ['logic', 'composure'], keywords: ['hungry', 'starving'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['electrochemistry'] },
        dying: { id: 'dying', name: 'Dying', icon: '💀', category: 'physical', boosts: ['pain_threshold', 'inland_empire', 'shivers'], debuffs: ['logic', 'rhetoric'], keywords: ['dying', 'death', 'fading'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['inland_empire', 'shivers'] },
        paranoid: { id: 'paranoid', name: 'Paranoid', icon: '👁️', category: 'mental', boosts: ['half_light', 'perception', 'shivers'], debuffs: ['empathy', 'suggestion'], keywords: ['paranoid', 'suspicious', 'followed'], ancientVoice: null, intrusiveBoost: ['half_light', 'perception'] },
        aroused: { id: 'aroused', name: 'Aroused', icon: '💋', category: 'mental', boosts: ['electrochemistry', 'suggestion', 'empathy', 'drama'], debuffs: ['logic', 'volition'], keywords: ['aroused', 'desire', 'lust'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['electrochemistry', 'suggestion'] },
        enraged: { id: 'enraged', name: 'Enraged', icon: '😤', category: 'mental', boosts: ['authority', 'physical_instrument', 'half_light'], debuffs: ['empathy', 'composure'], keywords: ['angry', 'furious', 'rage'], ancientVoice: 'limbic_system', intrusiveBoost: ['half_light', 'authority'] },
        terrified: { id: 'terrified', name: 'Terrified', icon: '😨', category: 'mental', boosts: ['half_light', 'shivers', 'reaction_speed'], debuffs: ['authority', 'composure'], keywords: ['scared', 'afraid', 'terrified'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['half_light', 'shivers'] },
        confident: { id: 'confident', name: 'Confident', icon: '😎', category: 'mental', boosts: ['authority', 'savoir_faire', 'rhetoric'], debuffs: ['inland_empire', 'empathy'], keywords: ['confident', 'bold', 'swagger'], ancientVoice: null, intrusiveBoost: ['authority', 'savoir_faire'] },
        grieving: { id: 'grieving', name: 'Grieving', icon: '😢', category: 'mental', boosts: ['empathy', 'inland_empire', 'shivers', 'volition'], debuffs: ['authority', 'electrochemistry'], keywords: ['grief', 'loss', 'mourning'], ancientVoice: 'limbic_system', intrusiveBoost: ['empathy', 'inland_empire'] },
        manic: { id: 'manic', name: 'Manic', icon: '⚡', category: 'mental', boosts: ['electrochemistry', 'reaction_speed', 'conceptualization'], debuffs: ['composure', 'logic'], keywords: ['manic', 'hyper', 'racing'], ancientVoice: 'limbic_system', intrusiveBoost: ['electrochemistry', 'conceptualization'] },
        dissociated: { id: 'dissociated', name: 'Dissociated', icon: '🌫️', category: 'mental', boosts: ['inland_empire', 'shivers', 'pain_threshold'], debuffs: ['perception', 'reaction_speed'], keywords: ['dissociate', 'unreal', 'floating'], ancientVoice: null, intrusiveBoost: ['inland_empire', 'shivers'] }
    };

    let activeStatuses = new Set();
