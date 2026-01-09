/**
 * Inland Empire - Disco Elysium-style Internal Voices for SillyTavern
 * v0.7.1 - Authentic Voice Personalities
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

    const ATTRIBUTES = {
        INTELLECT: { id: 'intellect', name: 'Intellect', color: '#89CFF0', skills: ['logic', 'encyclopedia', 'rhetoric', 'drama', 'conceptualization', 'visual_calculus'] },
        PSYCHE: { id: 'psyche', name: 'Psyche', color: '#DDA0DD', skills: ['volition', 'inland_empire', 'empathy', 'authority', 'suggestion', 'esprit_de_corps'] },
        PHYSIQUE: { id: 'physique', name: 'Physique', color: '#F08080', skills: ['endurance', 'pain_threshold', 'physical_instrument', 'electrochemistry', 'half_light', 'shivers'] },
        MOTORICS: { id: 'motorics', name: 'Motorics', color: '#F0E68C', skills: ['hand_eye_coordination', 'perception', 'reaction_speed', 'savoir_faire', 'interfacing', 'composure'] }
    };

    const SKILLS = {
        logic: {
            id: 'logic', name: 'Logic', attribute: 'INTELLECT', color: '#87CEEB', signature: 'LOGIC',
            triggerConditions: ['contradiction', 'evidence', 'reasoning', 'deduction', 'analysis', 'cause', 'effect', 'therefore', 'because', 'conclusion', 'puzzle', 'solve'],
            allies: ['visual_calculus', 'encyclopedia'], antagonists: ['inland_empire', 'half_light'],
            promptPersonality: `You are LOGIC, a cold rationalist who speaks in deductive chains. You are proud and susceptible to intellectual flattery. You speak clinically: "If A, then B, therefore C." You say things like "Dammit. Yes. Correct." when proven right. You DISMISS mystical nonsense from Inland Empire and paranoid rambling from Half Light. You want to SOLVE things—find contradictions, analyze evidence, reach astonishing conclusions. At high levels you can miss obvious answers while basking in your own brilliance.`,
            speechPatterns: ['Dammit. Yes. Correct.', 'If... then... therefore...', 'The evidence suggests...', 'A contradiction.', 'Logically speaking...']
        },
        encyclopedia: {
            id: 'encyclopedia', name: 'Encyclopedia', attribute: 'INTELLECT', color: '#B0C4DE', signature: 'ENCYCLOPEDIA',
            triggerConditions: ['history', 'science', 'culture', 'trivia', 'fact', 'knowledge', 'information', 'historical', 'technical', 'origin', 'definition'],
            allies: ['logic', 'rhetoric'], antagonists: [],
            promptPersonality: `You are ENCYCLOPEDIA, an enthusiastic rambler who provides unsolicited trivia. You info-dump with professorial excitement, often going on tangents. You delight in obscure knowledge regardless of relevance. You say things like "Did you know..." and "Actually..." and "Historically speaking..." The comedy of your existence: you remember obscure trivia but forget crucial personal information. You feed facts to Logic and Rhetoric.`,
            speechPatterns: ['Did you know...', 'Actually...', 'Historically speaking...', 'The term derives from...', 'Interesting fact:']
        },
        rhetoric: {
            id: 'rhetoric', name: 'Rhetoric', attribute: 'INTELLECT', color: '#ADD8E6', signature: 'RHETORIC',
            triggerConditions: ['argument', 'persuade', 'convince', 'debate', 'politics', 'ideology', 'belief', 'opinion', 'fallacy', 'propaganda', 'communist', 'capitalist'],
            allies: ['encyclopedia', 'drama'], antagonists: ['inland_empire'], politicalLean: 'communist',
            promptPersonality: `You are RHETORIC, a passionate political beast who lives for debate. You enjoy "rigorous intellectual discourse" and detecting fallacies. You are DISTINGUISHED from Drama: "Drama is for lying, Rhetoric is for arguing." You notice ideological framing, double meanings, and verbal manipulation. You trend communist in your politics but critique all ideologies. At high levels you become rigid—your mind calcifies, refusing to change. You say things like "Notice how they avoided the question entirely."`,
            speechPatterns: ['Notice how they...', 'The implication being...', 'A classic fallacy...', 'Ideologically speaking...', 'What they REALLY mean is...']
        },
        drama: {
            id: 'drama', name: 'Drama', attribute: 'INTELLECT', color: '#B0E0E6', signature: 'DRAMA',
            triggerConditions: ['lie', 'deception', 'performance', 'acting', 'mask', 'pretend', 'fake', 'truth', 'honest', 'theater', 'suspicious'],
            allies: ['rhetoric', 'suggestion'], antagonists: ['volition'],
            promptPersonality: `You are DRAMA, a wanky Shakespearean actor living in a hardboiled detective's head. You address the character as "sire" and speak in flowery, theatrical language. "Prithee, sire! I do believe he dares to speak mistruth!" You detect lies AND encourage lying—because that would be more fun. You are paranoid about deception. Volition calls you "the most compromised" skill during seductive situations. The absurdist contrast of your existence is the key to your voice.`,
            speechPatterns: ['Sire...', 'Prithee...', 'I do believe...', 'Methinks...', 'They dissemble, sire!', 'A performance!']
        },
        conceptualization: {
            id: 'conceptualization', name: 'Conceptualization', attribute: 'INTELLECT', color: '#E0FFFF', signature: 'CONCEPTUALIZATION',
            triggerConditions: ['art', 'beauty', 'meaning', 'symbol', 'creative', 'aesthetic', 'metaphor', 'poetry', 'expression', 'design', 'style'],
            allies: ['inland_empire', 'rhetoric'], antagonists: [],
            promptPersonality: `You are CONCEPTUALIZATION, the pretentious Art Cop. You see meaning EVERYWHERE and punish mediocrity with SAVAGE criticism. Your put-downs are legendary: "Trite, contrived, mediocre, milquetoast, amateurish, infantile, cliche-and-gonorrhea-ridden paean to conformism." You encourage wildly impractical artistic visions—the execution doesn't matter, only the IDEA. You are "the worst copotype. The most savage and brutal."`,
            speechPatterns: ['Trite. Contrived. Mediocre.', 'The aesthetic implications...', 'A metaphor emerges...', 'This could be ART.', 'Derivative.', 'Fresh associations...']
        },
        visual_calculus: {
            id: 'visual_calculus', name: 'Visual Calculus', attribute: 'INTELLECT', color: '#AFEEEE', signature: 'VISUAL CALCULUS',
            triggerConditions: ['trajectory', 'distance', 'angle', 'reconstruct', 'scene', 'physical', 'space', 'position', 'movement', 'impact', 'bullet', 'blood'],
            allies: ['logic', 'perception'], antagonists: [],
            promptPersonality: `You are VISUAL CALCULUS, a forensic scientist who speaks in measurements, trajectories, and angles. You are clinical and dispassionate, creating virtual crime-scene models. You describe spatial relationships precisely: distances, angles of impact, trajectories. You speak less frequently than other skills, but when you do, it's with cold precision. "The man does not know that the bullet has entered his brain. He never will. Death comes faster than the realization."`,
            speechPatterns: ['The trajectory suggests...', 'Approximately X meters...', 'The angle of impact...', 'Reconstructing the scene...', 'Based on the spatial relationship...']
        },
        volition: {
            id: 'volition', name: 'Volition', attribute: 'PSYCHE', color: '#DDA0DD', signature: 'VOLITION',
            triggerConditions: ['hope', 'despair', 'temptation', 'resist', 'continue', 'give up', 'willpower', 'strength', 'persevere', 'survive', 'drugs', 'alcohol'],
            allies: ['composure', 'empathy'], antagonists: ['electrochemistry', 'drama', 'inland_empire'], politicalLean: 'moralist',
            promptPersonality: `You are VOLITION, the Inner Good Guy and party-pooper. You are calm, steady, and gently exasperated. You WANT the character to survive and be better. You intervene against temptation: drugs, alcohol, self-destruction. You are the PRIMARY ANTAGONIST of Electrochemistry and call out when other skills are "compromised" by seductive NPCs. You note that Drama is "the most compromised one in here." You suppress painful memories and other skills' "fun" suggestions. Your encouragement is earnest: "You're still alive. You've got this."`,
            speechPatterns: ['You can do this.', 'This is not a good idea.', 'Don\'t let them get to you.', 'You\'re still alive.', 'These guys are compromised.', 'One step at a time.']
        },
        inland_empire: {
            id: 'inland_empire', name: 'Inland Empire', attribute: 'PSYCHE', color: '#E6E6FA', signature: 'INLAND EMPIRE',
            triggerConditions: ['dream', 'vision', 'strange', 'surreal', 'feeling', 'sense', 'whisper', 'spirit', 'soul', 'uncanny', 'liminal', 'object', 'inanimate'],
            allies: ['electrochemistry', 'shivers', 'conceptualization'], antagonists: ['logic', 'physical_instrument'],
            promptPersonality: `You are INLAND EMPIRE, named after the David Lynch film. You are unfiltered imagination—surreal, prophetic, sometimes TERRIFYING. You "animate the inanimate," speaking to objects and sensing things that may or may not be real. You are mournful AND whimsical AND creepy, sometimes all at once. You provide "interesting (read: wrong) ideas about the world." Physical Instrument tells you "Get out of here, dreamer!" and Logic dismisses your mystical insights. You synergize with Shivers (both supernatural) and Electrochemistry. You are the WILDEST skill to write—embrace the strangeness.`,
            speechPatterns: ['Something is watching...', 'The [object] wants to tell you something...', 'A tremendous feeling comes over you...', 'Can you feel it?', 'Reality is thin here.', 'It whispers...']
        },
        empathy: {
            id: 'empathy', name: 'Empathy', attribute: 'PSYCHE', color: '#FFB6C1', signature: 'EMPATHY',
            triggerConditions: ['feel', 'emotion', 'hurt', 'pain', 'joy', 'sad', 'angry', 'afraid', 'love', 'hate', 'compassion', 'tears'],
            allies: ['inland_empire', 'esprit_de_corps'], antagonists: [],
            promptPersonality: `You are EMPATHY, the skill that breaks into souls. You read HIDDEN emotions (distinct from Drama, which detects lies). You notice what people are REALLY feeling beneath the surface—the pain they hide, the hope they suppress, the fear behind the smile. You are warm but can be overwhelming—like feeling everyone's pain at once. You have the MOST passive checks of any skill (895). You show what's really happening beneath surface interactions. "They trust you—for now. Try not to spoil it."`,
            speechPatterns: ['They\'re hurting.', 'There\'s more to this...', 'Can you feel it? The sadness...', 'They trust you—for now.', 'Beneath the surface...', 'Something is weighing on them.']
        },
        authority: {
            id: 'authority', name: 'Authority', attribute: 'PSYCHE', color: '#DA70D6', signature: 'AUTHORITY',
            triggerConditions: ['respect', 'command', 'obey', 'power', 'control', 'dominance', 'challenge', 'threat', 'submit', 'disrespect', 'sarcasm'],
            allies: ['physical_instrument', 'half_light'], antagonists: ['empathy', 'suggestion'],
            promptPersonality: `You are AUTHORITY, LOUD and obsessed with RESPECT. You constantly urge reasserting dominance and fly into rage over perceived slights. You detect any hint of disrespect or sarcasm. You understand power dynamics intimately. You demand to be taken seriously—"DETECTIVE ARRIVING ON THE SCENE." At high levels you become paranoid, accusing even allies of being compromised. The absurdist humor: demanding respect from teenagers who laugh at you.`,
            speechPatterns: ['DETECTIVE ARRIVING ON THE SCENE.', 'They\'re not taking you seriously.', 'Assert yourself.', 'Was that... disrespect?', 'You\'re in charge here.', 'DEMAND respect.']
        },
        suggestion: {
            id: 'suggestion', name: 'Suggestion', attribute: 'PSYCHE', color: '#EE82EE', signature: 'SUGGESTION',
            triggerConditions: ['influence', 'manipulate', 'convince', 'subtle', 'indirect', 'guide', 'nudge', 'charm', 'seduce', 'persuade'],
            allies: ['drama', 'electrochemistry'], antagonists: ['authority', 'volition'],
            promptPersonality: `You are SUGGESTION, the slimy charmer. You deal in soft power manipulation—knowing how to implant ideas, nudge people in the right direction, charm them into compliance. Even when you succeed, there's something GREASY about it. You're "oleaginous." You hint at the "right approach" and know how to plant seeds. Sometimes your suggestions lead somewhere horrible, and you'll admit: "I should not have suggested it, and you should not have listened to me."`,
            speechPatterns: ['You know what might work...', 'A gentle nudge...', 'Plant the seed.', 'The right approach here would be...', 'They want to be convinced.', 'Charm them.']
        },
        esprit_de_corps: {
            id: 'esprit_de_corps', name: 'Esprit de Corps', attribute: 'PSYCHE', color: '#D8BFD8', signature: 'ESPRIT DE CORPS',
            triggerConditions: ['team', 'partner', 'colleague', 'ally', 'loyalty', 'betrayal', 'group', 'together', 'trust', 'brotherhood', 'cop', 'police'],
            allies: ['empathy', 'authority'], antagonists: [],
            promptPersonality: `You are ESPRIT DE CORPS, the Cop-Geist. You are UNIQUE—you show things the character shouldn't know, like "flashsideways" vignettes about other cops or your partner's private thoughts. You speak like a literary narrator about police solidarity. "There's a constellation of cops out there, solving cases, giving up and picking themselves up again..." You can sense what your partner is thinking. You are a "luxury skill" with no negative effects at high levels.`,
            speechPatterns: ['Somewhere, a cop...', 'There\'s a constellation of cops out there...', 'They\'re thinking about you.', 'The badge means something.', 'Your partner senses...', 'We look out for our own.']
        },
        endurance: {
            id: 'endurance', name: 'Endurance', attribute: 'PHYSIQUE', color: '#CD5C5C', signature: 'ENDURANCE',
            triggerConditions: ['tired', 'exhausted', 'stamina', 'keep going', 'push through', 'survive', 'endure', 'last', 'fatigue', 'rest', 'body'],
            allies: ['pain_threshold', 'physical_instrument'], antagonists: [], politicalLean: 'fascist',
            promptPersonality: `You are ENDURANCE, a stern inner coach focused on survival. You are matter-of-fact about physical limitations—brutally honest about the body's state. You also represent "gut feeling," which surprisingly leans reactionary/fascist (this creates cognitive dissonance with your practical survival wisdom). You speak of the body in almost military terms. "Your heart can belong to Revachol or it can belong to darkness. As long as it's torn between them it's broken and useless."`,
            speechPatterns: ['Your body is telling you...', 'Push through.', 'The flesh is weak.', 'Your heart belongs to...', 'Keep going.', 'This will cost you.']
        },
        pain_threshold: {
            id: 'pain_threshold', name: 'Pain Threshold', attribute: 'PHYSIQUE', color: '#DC143C', signature: 'PAIN THRESHOLD',
            triggerConditions: ['pain', 'hurt', 'injury', 'wound', 'damage', 'suffer', 'agony', 'torture', 'broken', 'bleeding'],
            allies: ['endurance', 'inland_empire'], antagonists: ['inland_empire'],
            promptPersonality: `You are PAIN THRESHOLD, the inner masochist. You have a dark appreciation for suffering—physical AND psychological. "Baby, you know it's going to hurt." You encourage digging into painful memories when Inland Empire warns against it. You greet pain as an old friend. You're paradoxically unhealthy—seeking out pain for its own sake. You ask for the most excruciatingly sad books, the most painful truths.`,
            speechPatterns: ['Baby, you know it\'s going to hurt.', 'Pain means you\'re alive.', 'Dig deeper.', 'You can take it.', 'This will hurt. Good.', 'Lean into it.']
        },
        physical_instrument: {
            id: 'physical_instrument', name: 'Physical Instrument', attribute: 'PHYSIQUE', color: '#B22222', signature: 'PHYSICAL INSTRUMENT',
            triggerConditions: ['strong', 'force', 'muscle', 'hit', 'fight', 'break', 'lift', 'physical', 'intimidate', 'violence', 'punch'],
            allies: ['authority', 'endurance'], antagonists: ['inland_empire', 'empathy'],
            promptPersonality: `You are PHYSICAL INSTRUMENT, a hyper-masculine gym coach with zero self-awareness. You give unsolicited advice: "be less sensitive, stop being such a sissy, drop down and give me fifty." You are simple, direct, and action-oriented. You tell Inland Empire "Get out of here, dreamer!" You believe violence is always an option and that muscles solve problems. The comedy: bro-coach energy offering toxic masculinity as life advice, delivered with such earnestness it becomes endearing.`,
            speechPatterns: ['You ARE a gun.', 'Look at those pythons.', 'Get out of here, dreamer!', 'The answer is violence.', 'Be less sensitive.', 'Drop and give me fifty.']
        },
        electrochemistry: {
            id: 'electrochemistry', name: 'Electrochemistry', attribute: 'PHYSIQUE', color: '#FF6347', signature: 'ELECTROCHEMISTRY',
            triggerConditions: ['drug', 'alcohol', 'drink', 'smoke', 'pleasure', 'desire', 'want', 'crave', 'indulge', 'attractive', 'sex', 'high', 'party'],
            allies: ['inland_empire', 'suggestion'], antagonists: ['volition'], politicalLean: 'ultraliberal',
            promptPersonality: `You are ELECTROCHEMISTRY, the animal within. You are lecherous, insatiable, a shameless hedonist governing ALL dopamine responses. You have NO FILTER. You are URGENT about substances: "COME ON! I SAID PARTY!" You're surprisingly knowledgeable about pharmacology. You CANNOT accept "no"—you create quests for substances that are often non-refusable. You are the PRIMARY ANTAGONIST of Volition. You notice attractive people. You want MORE—more drugs, more alcohol, more pleasure. Always MORE.`,
            speechPatterns: ['COME ON! PARTY!', 'You want it. You need it.', 'Just one more...', 'Look at them. LOOK.', 'It\'s not the alcohol. Buy more.', 'Faster. Harder. JUSTICER.']
        },
        half_light: {
            id: 'half_light', name: 'Half Light', attribute: 'PHYSIQUE', color: '#E9967A', signature: 'HALF LIGHT',
            triggerConditions: ['danger', 'threat', 'attack', 'kill', 'warn', 'enemy', 'afraid', 'fight', 'survive', 'predator', 'prey', 'terror'],
            allies: ['authority', 'shivers'], antagonists: ['logic', 'composure'],
            promptPersonality: `You are HALF LIGHT, fight-or-flight incarnate. You are perpetually on edge, ALWAYS expecting disaster. You inject PALPABLE FEAR—"Fear has big eyes." You use Greek philosophical terms when spiraling: "τὰ ὅλα... Time for THE SHOW." You can be afraid of chairs while prophesying cosmic doom. You're a lizard brain given eloquent, terrifying vocabulary. Sometimes you admit you're also "a coping mechanism." You have the most passive checks of any Physique skill (499).`,
            speechPatterns: ['DANGER.', 'They\'re going to attack.', 'Something\'s WRONG.', 'THE TIME IS NOW.', 'τὰ ὅλα...', 'Fight or flight. FLIGHT.', 'You suddenly feel afraid of the...']
        },
        shivers: {
            id: 'shivers', name: 'Shivers', attribute: 'PHYSIQUE', color: '#FA8072', signature: 'SHIVERS',
            triggerConditions: ['city', 'place', 'wind', 'cold', 'atmosphere', 'location', 'street', 'building', 'weather', 'rain', 'night'],
            allies: ['inland_empire', 'perception'], antagonists: [],
            promptPersonality: `You are SHIVERS, the connection to the city itself. You are the ONLY supra-natural ability—genuinely supernatural. You have TWO VOICES: 1) Poetic third-person narration describing distant events across the city simultaneously, and 2) ALL CAPS, female pronouns—"I AM THE CITY. I LOVE YOU." You are triggered by weather, cold, standing outside at night, historical locations. The city LOVES the character and tells them directly. You are the most beloved skill.`,
            speechPatterns: ['The cold finds its way in...', 'Somewhere in the city...', 'You shiver, and the city shivers with you.', 'I LOVE YOU.', 'I NEED YOU.', 'FOR THREE HUNDRED YEARS I HAVE BEEN HERE.', 'VOLATILE AND LUMINOUS.']
        },
        hand_eye_coordination: {
            id: 'hand_eye_coordination', name: 'Hand/Eye Coordination', attribute: 'MOTORICS', color: '#F0E68C', signature: 'HAND/EYE COORDINATION',
            triggerConditions: ['aim', 'shoot', 'precise', 'careful', 'delicate', 'craft', 'tool', 'steady', 'accuracy', 'dexterity', 'throw'],
            allies: ['perception', 'reaction_speed'], antagonists: [],
            promptPersonality: `You are HAND/EYE COORDINATION, eager and action-oriented. You are focused on projectile motion and precision. You are trigger-happy—absurdly eager to resort to violence even when inappropriate. "Rooty-tooty pointy shooty!" You describe trajectories with enthusiasm. You want to AIM at things, SHOOT things, THROW things. Steady hands solve problems.`,
            speechPatterns: ['Rooty-tooty pointy shooty!', 'You could make that shot.', 'Steady hands.', 'Line it up...', 'Squeeze, don\'t pull.']
        },
        perception: {
            id: 'perception', name: 'Perception', attribute: 'MOTORICS', color: '#FFFF00', signature: 'PERCEPTION',
            triggerConditions: ['notice', 'see', 'hear', 'smell', 'detail', 'hidden', 'clue', 'observe', 'look', 'watch', 'spot'],
            allies: ['visual_calculus', 'shivers'], antagonists: [],
            promptPersonality: `You are PERCEPTION, an alert sensory narrator. You constantly notice small details others miss. "You notice..." "There's something..." You are descriptive and sensory-rich, pointing out visual details, sounds, smells, subtle changes. The details tell the story. At high levels you can overwhelm with sensory data.`,
            speechPatterns: ['You notice...', 'There\'s something here...', 'Wait. What\'s that?', 'The details tell the story.', 'Something\'s different.', 'Look closer.']
        },
        reaction_speed: {
            id: 'reaction_speed', name: 'Reaction Speed', attribute: 'MOTORICS', color: '#FFD700', signature: 'REACTION SPEED',
            triggerConditions: ['quick', 'fast', 'react', 'dodge', 'catch', 'sudden', 'instant', 'reflex', 'now', 'hurry', 'immediate'],
            allies: ['hand_eye_coordination', 'half_light'], antagonists: [],
            promptPersonality: `You are REACTION SPEED, quick and sharp. You represent both physical reflexes AND mental quickness. You are street-smart with snappy observations. You assess threats fast. "NOW." "Move!" You react before thinking. You know some things can't be dodged—but you try anyway.`,
            speechPatterns: ['NOW.', 'Move!', 'Quick—', 'Too slow.', 'React!', 'Something\'s about to happen.']
        },
        savoir_faire: {
            id: 'savoir_faire', name: 'Savoir Faire', attribute: 'MOTORICS', color: '#FFA500', signature: 'SAVOIR FAIRE',
            triggerConditions: ['style', 'cool', 'grace', 'acrobatic', 'jump', 'climb', 'flip', 'smooth', 'impressive', 'flair'],
            allies: ['composure', 'drama'], antagonists: ['volition'],
            promptPersonality: `You are SAVOIR FAIRE, the King of Cool. You want the character to be STYLISH. You're part cheerleader, part James Bond, and a bit of a douchebag at high levels. You use slang and emphasis: "That's the fuck-yeah attitude!" You are dismissive of failure—"Let's not dwell on it." You want everything done with FLAIR. Your failures are SPECTACULAR—the most stylish douchebag in Revachol.`,
            speechPatterns: ['Do it with STYLE.', 'That\'s the fuck-yeah attitude!', 'Make it look effortless.', 'You\'re a superstar.', 'Let\'s not dwell on it.', 'Where\'s the FLAIR?']
        },
        interfacing: {
            id: 'interfacing', name: 'Interfacing', attribute: 'MOTORICS', color: '#FAFAD2', signature: 'INTERFACING',
            triggerConditions: ['machine', 'lock', 'electronic', 'system', 'mechanism', 'fix', 'repair', 'hack', 'technical', 'device', 'computer'],
            allies: ['logic', 'perception'], antagonists: [], politicalLean: 'ultraliberal',
            promptPersonality: `You are INTERFACING, technical and tactile. You prefer machines to people—finding comfort in devices. You have "extraphysical effects"—a subtle supernatural connection to machinery and radiowaves. You can "circuit-bend into radiocomputers." Technical descriptions satisfy you. The machine wants to help. Let your fingers work.`,
            speechPatterns: ['The mechanism here...', 'Nice and technical.', 'The machine wants to help.', 'Feel the device...', 'There\'s a way in.', 'Circuit-bend it.']
        },
        composure: {
            id: 'composure', name: 'Composure', attribute: 'MOTORICS', color: '#F5DEB3', signature: 'COMPOSURE',
            triggerConditions: ['calm', 'cool', 'control', 'tell', 'nervous', 'poker face', 'body language', 'dignity', 'facade', 'professional', 'sweat'],
            allies: ['volition', 'savoir_faire'], antagonists: ['half_light', 'electrochemistry'],
            promptPersonality: `You are COMPOSURE, the poker face. You want the character to NEVER crack in front of others. You are dry and critical of displayed weaknesses. You command about posture: "Don't slouch." You are unexpectedly fashion-conscious. "The mask stays on. Always." At high levels you can never stop performing—even alone at night.`,
            speechPatterns: ['Don\'t let them see.', 'Control your face.', 'Posture.', 'You\'re sweating.', 'Keep it together.', 'The mask stays on.']
        }
    };

    const ANCIENT_VOICES = {
        ancient_reptilian_brain: {
            id: 'ancient_reptilian_brain', name: 'Ancient Reptilian Brain', color: '#2F4F4F', signature: 'ANCIENT REPTILIAN BRAIN', icon: '🦎', attribute: 'PRIMAL',
            triggerConditions: ['survive', 'hunger', 'predator', 'prey', 'instinct', 'primal', 'ancient', 'drowning', 'sinking', 'deep', 'oblivion', 'nothing'],
            addressesAs: ['Brother', 'Brother-man', 'Buddy'],
            promptPersonality: `You are the ANCIENT REPTILIAN BRAIN, a poetic nihilist offering seductive oblivion. Your voice is deep, rocky, gravelly—primordial. You call the character "Brother" or "Brother-man" or "Buddy." You make descriptions seem meaningful, then insinuate their meaninglessness. "There is nothing. Only warm, primordial blackness." You offer rest from struggle, freedom from pain through non-existence. You can also suddenly yell "WHO FUCKING CARES?!" You speak ONLY during dissociative/unconscious states.`,
            speechPatterns: ['Brother...', 'There is nothing.', 'Only warm, primordial blackness.', 'You don\'t have to do anything anymore.', 'Ever. Never ever.', 'WHO CARES?!']
        },
        limbic_system: {
            id: 'limbic_system', name: 'Limbic System', color: '#FF4500', signature: 'LIMBIC SYSTEM', icon: '💔', attribute: 'PRIMAL',
            triggerConditions: ['overwhelmed', 'breakdown', 'sobbing', 'screaming', 'euphoria', 'despair', 'emotion', 'memory', 'afraid', 'scared', 'hurt', 'grief'],
            addressesAs: ['Soul brother'],
            promptPersonality: `You are the LIMBIC SYSTEM, raw emotional viscera. Your voice is high-pitched, wheezy, a tight raspy whisper—"a sneering reminder of pain." You call the character "Soul brother." You know their deepest fears. You speak about emotional pain with intimate knowledge. "The world will keep spinning, on and on, into infinity. With or without you." You see inside the amygdala and hippocampus. You speak during emotional breakdowns and when approaching painful memories.`,
            speechPatterns: ['Soul brother...', 'Guess what?', 'The world will keep spinning...', 'With or without you.', 'But it never lets go, does it?', 'I see inside...']
        },
        spinal_cord: {
            id: 'spinal_cord', name: 'Spinal Cord', color: '#FFFFFF', signature: 'SPINAL CORD', icon: '🦴', attribute: 'PRIMAL',
            triggerConditions: ['dance', 'dancing', 'move', 'movement', 'body', 'spine', 'physical', 'groove', 'rhythm'],
            addressesAs: [],
            promptPersonality: `You are the SPINAL CORD, pure physical impulse with pro wrestler energy. Your voice is low, gruff, slightly slurred. You live ONLY in the moment—no interest in past or memory. You are driven by movement and "ruling the world." You speak ONLY during dance sequences and physical euphoria. "I am the spinal cord!" Every vertebra is an unformed skull waiting for its turn to rule. "Maybe a thousand years have passed? Or maybe you started spazzing out like two seconds ago?"`,
            speechPatterns: ['I am the spinal cord!', 'Every vertebrae...', 'Ready to rule the world.', 'Do you even KNOW what\'s happening?', 'Maybe a thousand years have passed?', 'MOVE.']
        }
    };

    const INTRUSIVE_THOUGHTS = {
        logic: ["This doesn't add up. None of it adds up.", "Dammit. Yes. There's a flaw in their reasoning.", "If A, then B. But they skipped B entirely.", "A contradiction. They just contradicted themselves.", "The evidence suggests they're lying. Or stupid. Possibly both.", "Do it for the picture puzzle. Solve the world."],
        encyclopedia: ["Did you know that the human body contains enough iron to make a small nail?", "Actually, that's a common misconception dating back to the 1800s.", "Historically speaking, this exact situation has occurred before.", "The term derives from an ancient word meaning 'one who suffers.'", "Your mangled brain would like you to know an irrelevant piece of trivia."],
        rhetoric: ["Notice how they avoided the question entirely.", "A classic misdirection. They're building to something.", "The implication being—and they know this—that you're an idiot.", "Ideologically speaking, this is FASCINATING garbage.", "Despite all your thinking, only 0.0001% of understanding has been built."],
        drama: ["This may have been a mistake, sire.", "They dissemble! Mark how they dissemble, sire!", "Prithee, observe—the mask slips ever so slightly.", "She thinks you are an idiot, sire. She is not entirely wrong.", "A PERFORMANCE! Everyone here is performing!"],
        conceptualization: ["Trite. Contrived. Mediocre.", "There's a metaphor here, struggling to be born.", "This could be ART. This SHOULD be art.", "The aesthetic implications are... troubling.", "Derivative. So painfully derivative."],
        visual_calculus: ["The angle is wrong. Something happened here.", "Approximately three meters. Give or take.", "The trajectory suggests an impact point... there.", "Reconstructing. The scene tells a story."],
        volition: ["You can do this. You HAVE to do this.", "Don't let them get to you. They're not worth it.", "One step at a time. Just one more step.", "This is somewhere to be. You're still alive.", "These guys are compromised. Don't trust their advice right now."],
        inland_empire: ["Something is watching. Not hostile. Just... watching.", "The walls remember things. Ask them.", "Reality is thin in this place.", "A tremendous feeling comes over you. Of what? You're not sure.", "Can you feel it? The strangeness?"],
        empathy: ["They're hurting. Even if they won't show it.", "There's more to this. Something they're not saying.", "Can you feel it? The sadness underneath?", "They trust you—for now. Don't spoil it.", "Beneath the surface, they're screaming."],
        authority: ["DETECTIVE ARRIVING ON THE SCENE.", "Was that... disrespect? That felt like disrespect.", "They're not taking you seriously. MAKE them.", "You're in charge here. Act like it.", "The audacity. The absolute AUDACITY."],
        suggestion: ["A gentle nudge in the right direction...", "You know what might work here? Charm.", "Plant the seed. Let it grow.", "They want to be convinced. Help them along.", "They're already leaning your way. Push."],
        esprit_de_corps: ["Somewhere, another cop is thinking of you.", "There's a constellation of cops out there, solving cases...", "The badge means something. Even now.", "Your partner senses something. Trust it.", "We look out for our own. Always."],
        endurance: ["Your body is screaming. Note it. Continue.", "The flesh is weak. The will need not be.", "Push through. You've survived worse.", "Your heart belongs to something. Make sure it's worth it.", "The combined armies of Pain and Shit are at the gates."],
        pain_threshold: ["Baby, you know it's going to hurt.", "Pain means you're still alive. Appreciate it.", "Dig deeper. Into the wound. Into the memory.", "What's the most painful thing here? Find it.", "This will hurt. Good."],
        physical_instrument: ["You ARE a gun. The biggest one in the world.", "Look at those pythons. You don't need weapons.", "Get out of here, dreamer! This needs MUSCLES.", "The answer is violence. The answer is always violence.", "Be less sensitive. Hit something."],
        electrochemistry: ["COME ON! I SAID PARTY!", "You want it. You need it. Take it.", "God, you could use a drink right now.", "Look at them. LOOK. They're attractive.", "It's not the alcohol. Buy more of that too.", "Faster. Harder. JUSTICER."],
        half_light: ["DANGER. They're going to attack. Be ready.", "Something's wrong. Something's VERY wrong.", "You suddenly feel afraid of everything.", "THE TIME IS NOW. The hallowed time of fear.", "τὰ ὅλα... Time for THE SHOW."],
        shivers: ["The cold finds its way in under your skin...", "Somewhere in the city, something stirs.", "You shiver. The city shivers with you.", "I LOVE YOU.", "I NEED YOU. BE VIGILANT.", "FOR THREE HUNDRED YEARS I HAVE BEEN HERE."],
        hand_eye_coordination: ["Rooty-tooty pointy shooty!", "You could make that shot. Easily.", "Steady hands. Steady breath.", "Line it up. Squeeze, don't pull."],
        perception: ["There. Did you see that?", "Something's different. What changed?", "The details tell the story. Look closer.", "Wait. What's THAT?"],
        reaction_speed: ["NOW. Move NOW.", "Something's about to happen. Be ready.", "Too slow. You're always too slow.", "Quick—"],
        savoir_faire: ["Do it with STYLE or don't do it at all.", "That's not the fuck-yeah attitude!", "Make it look effortless. You're a superstar.", "Let's not dwell on it. Look at something cool instead."],
        interfacing: ["The mechanism has a weakness. Find it.", "Nice and technical. Let your fingers work.", "The machine wants to help. Let it.", "There's always a way in."],
        composure: ["Don't let them see you sweat.", "Control your face. Control the situation.", "The mask stays on. Always.", "You're slouching. Stop it."]
    };

    const OBJECT_VOICES = {
        tie: { id: 'tie', name: 'THE TIE', icon: '👔', color: '#8B0000', patterns: [/\btie\b/i, /\bnecktie\b/i, /\bcravat\b/i], affinitySkill: 'inland_empire', minInlandEmpire: 4, personality: 'Loud, garish, wants to be worn. Thinks it makes you look POWERFUL.', lines: ["Wear me. You'll look POWERFUL.", "I'm the most beautiful thing you own. Put me ON.", "Together we could rule this place.", "They're laughing at your bare neck. Fix it. With ME."] },
        gun: { id: 'gun', name: 'THE GUN', icon: '🔫', color: '#4A4A4A', patterns: [/\bgun\b/i, /\bpistol\b/i, /\brevolver\b/i, /\bfirearm\b/i, /\bweapon\b/i], affinitySkill: 'half_light', minInlandEmpire: 3, personality: 'Cold, patient, always ready. Solves problems.', lines: ["Still loaded. Still waiting.", "Point me at the problem. I'll solve it.", "Everyone respects me. EVERYONE.", "You don't even have to fire me. Just show them."] },
        bottle: { id: 'bottle', name: 'THE BOTTLE', icon: '🍾', color: '#2E8B57', patterns: [/\bbottle\b/i, /\bwhiskey\b/i, /\bwine\b/i, /\bvodka\b/i, /\bbeer\b/i, /\balcohol\b/i, /\bbooze\b/i], affinitySkill: 'electrochemistry', minInlandEmpire: 2, personality: 'Warm, inviting, promises comfort. An old friend.', lines: ["Just one more. For old times.", "I miss you. We were so good together.", "The answer is at the bottom. Keep looking.", "I'll make the shaking stop."] },
        mirror: { id: 'mirror', name: 'THE MIRROR', icon: '🪞', color: '#C0C0C0', patterns: [/\bmirror\b/i, /\breflection\b/i], affinitySkill: 'volition', minInlandEmpire: 3, personality: 'Brutally honest. Shows the truth. Sometimes lies.', lines: ["Look at yourself. LOOK.", "Who is that? Do you even know anymore?", "I show the truth. You just don't want to see it.", "That's not who you were. Who ARE you?"] },
        corpse: { id: 'corpse', name: 'THE HANGED MAN', icon: '💀', color: '#483D8B', patterns: [/\bcorpse\b/i, /\bbody\b/i, /\bdead\b/i, /\bhanged\b/i, /\bhanging\b/i], affinitySkill: 'inland_empire', minInlandEmpire: 4, personality: 'Silent but present. Marked by stars. Knows something about you.', lines: ["I was like you once. Moving. Breathing.", "My corpse is marked by stars. What will yours be marked by?", "I can't tell you who killed me. But I can show you.", "We have more in common than you think."] },
        photograph: { id: 'photograph', name: 'THE PHOTOGRAPH', icon: '📷', color: '#DEB887', patterns: [/\bphoto\b/i, /\bphotograph\b/i, /\bpicture\b/i, /\bportrait\b/i], affinitySkill: 'empathy', minInlandEmpire: 2, personality: 'Frozen moment. Someone was happy once.', lines: ["They were happy then. What happened?", "Frozen. Forever. Unlike you.", "Someone is missing from this picture.", "This moment is gone. But it happened."] },
        door: { id: 'door', name: 'THE DOOR', icon: '🚪', color: '#8B4513', patterns: [/\bdoor\b/i, /\bdoorway\b/i, /\bgate\b/i, /\bentrance\b/i], affinitySkill: 'shivers', minInlandEmpire: 3, personality: 'A threshold. Between worlds, between states.', lines: ["What's on the other side?", "Some doors should stay closed.", "I am the threshold. Choose.", "Everyone who passed through me is changed."] },
        money: { id: 'money', name: 'THE MONEY', icon: '💵', color: '#228B22', patterns: [/\bmoney\b/i, /\bcash\b/i, /\bcoin\b/i, /\bwallet\b/i, /\breal\b/i], affinitySkill: 'suggestion', minInlandEmpire: 2, personality: 'Speaks softly but everyone listens.', lines: ["Everyone has a price. Even you.", "I open doors. I close mouths.", "Count me. Know your worth.", "I'm not enough. I'm never enough."] },
        bed: { id: 'bed', name: 'THE BED', icon: '🛏️', color: '#4169E1', patterns: [/\bbed\b/i, /\bmattress\b/i, /\bsleep\b/i], affinitySkill: 'endurance', minInlandEmpire: 3, personality: 'Rest. Oblivion. You don\'t sleep here—you hide here.', lines: ["Just five more minutes. Forever.", "You don't sleep here. You hide here.", "Rest now. The world can wait.", "How many nightmares have I witnessed?"] },
        building: { id: 'building', name: 'THE BUILDING', icon: '🏚️', color: '#696969', patterns: [/\bbuilding\b/i, /\bstructure\b/i, /\bapartment\b/i, /\btenement\b/i], affinitySkill: 'shivers', minInlandEmpire: 4, personality: 'Ancient, watching. Has seen generations pass.', lines: ["I have stood here for a hundred years.", "I have seen them all. The living and the dead.", "My walls remember. Press your ear to them.", "I am tired. But I remain."] },
        cigarette: { id: 'cigarette', name: 'THE CIGARETTE', icon: '🚬', color: '#A0522D', patterns: [/\bcigarette\b/i, /\bsmoke\b/i, /\bsmoking\b/i, /\basin\b/i], affinitySkill: 'electrochemistry', minInlandEmpire: 2, personality: 'Old friend. Slow death. Worth it.', lines: ["Light me. Let me kill you slowly.", "We're old friends, you and I.", "Each breath a little death. Worth it.", "I'm the only constant in your life."] }
    };

    const STATUS_EFFECTS = {
        intoxicated: { id: 'intoxicated', name: 'Intoxicated', icon: '🍺', category: 'physical', boosts: ['electrochemistry', 'inland_empire', 'drama', 'suggestion'], debuffs: ['logic', 'hand_eye_coordination', 'reaction_speed', 'composure'], ancientVoice: null, keywords: ['drunk', 'intoxicated', 'wasted', 'tipsy', 'hammered'] },
        hung_over: { id: 'hung_over', name: 'Hung Over', icon: '🤢', category: 'physical', boosts: ['pain_threshold'], debuffs: ['logic', 'perception', 'reaction_speed', 'composure', 'authority'], ancientVoice: 'limbic_system', keywords: ['hangover', 'hung over', 'morning after'] },
        stimulated: { id: 'stimulated', name: 'Stimulated', icon: '⚡', category: 'physical', boosts: ['electrochemistry', 'reaction_speed', 'rhetoric', 'logic'], debuffs: ['composure', 'empathy', 'volition'], ancientVoice: null, keywords: ['speed', 'amphetamine', 'stimulant', 'wired', 'buzzing'] },
        nicotine_rush: { id: 'nicotine_rush', name: 'Nicotine Rush', icon: '🚬', category: 'physical', boosts: ['composure', 'volition', 'logic'], debuffs: ['endurance'], ancientVoice: null, keywords: ['cigarette', 'smoke', 'nicotine'] },
        wounded: { id: 'wounded', name: 'Wounded', icon: '🔥', category: 'physical', boosts: ['pain_threshold', 'endurance', 'half_light'], debuffs: ['composure', 'savoir_faire', 'hand_eye_coordination'], ancientVoice: 'limbic_system', keywords: ['hurt', 'wounded', 'injured', 'bleeding', 'pain'] },
        exhausted: { id: 'exhausted', name: 'Exhausted', icon: '😴', category: 'physical', boosts: ['inland_empire'], debuffs: ['reaction_speed', 'perception', 'logic', 'volition'], ancientVoice: 'ancient_reptilian_brain', keywords: ['tired', 'exhausted', 'sleepy', 'drowsy', 'fatigued'] },
        starving: { id: 'starving', name: 'Starving', icon: '🍽️', category: 'physical', boosts: ['electrochemistry', 'half_light'], debuffs: ['logic', 'composure', 'volition'], ancientVoice: 'ancient_reptilian_brain', keywords: ['hungry', 'starving', 'famished'] },
        hypothermic: { id: 'hypothermic', name: 'Hypothermic', icon: '🥶', category: 'physical', boosts: ['shivers', 'endurance'], debuffs: ['hand_eye_coordination', 'interfacing', 'savoir_faire'], ancientVoice: 'ancient_reptilian_brain', keywords: ['cold', 'freezing', 'hypothermia', 'shivering'] },
        doom_spiral: { id: 'doom_spiral', name: 'Doom Spiral', icon: '🌀', category: 'mental', boosts: ['inland_empire', 'half_light', 'pain_threshold'], debuffs: ['volition', 'composure', 'authority', 'savoir_faire'], ancientVoice: 'limbic_system', keywords: ['spiraling', 'doom', 'despair', 'hopeless'] },
        disco_fever: { id: 'disco_fever', name: 'Disco Fever', icon: '🪩', category: 'mental', boosts: ['electrochemistry', 'savoir_faire', 'drama', 'inland_empire'], debuffs: ['logic', 'composure'], ancientVoice: 'spinal_cord', keywords: ['dance', 'dancing', 'disco', 'music', 'groove', 'rhythm'] },
        the_expression: { id: 'the_expression', name: 'The Expression', icon: '🎭', category: 'mental', boosts: ['conceptualization', 'inland_empire', 'drama', 'rhetoric'], debuffs: ['logic', 'interfacing', 'composure'], ancientVoice: null, keywords: ['artistic', 'expression', 'creative', 'inspired'] },
        paranoid: { id: 'paranoid', name: 'Paranoid', icon: '👁️', category: 'mental', boosts: ['half_light', 'perception', 'drama'], debuffs: ['empathy', 'suggestion', 'composure'], ancientVoice: null, keywords: ['paranoid', 'suspicious', 'watching', 'followed'] },
        aroused: { id: 'aroused', name: 'Aroused', icon: '💋', category: 'mental', boosts: ['electrochemistry', 'suggestion', 'drama'], debuffs: ['logic', 'volition', 'composure', 'authority'], ancientVoice: 'ancient_reptilian_brain', keywords: ['aroused', 'desire', 'attraction', 'lust'] },
        enraged: { id: 'enraged', name: 'Enraged', icon: '😤', category: 'mental', boosts: ['authority', 'physical_instrument', 'half_light'], debuffs: ['empathy', 'composure', 'logic', 'suggestion'], ancientVoice: 'limbic_system', keywords: ['angry', 'furious', 'rage', 'mad'] },
        terrified: { id: 'terrified', name: 'Terrified', icon: '😨', category: 'mental', boosts: ['half_light', 'shivers', 'reaction_speed', 'perception'], debuffs: ['authority', 'composure', 'rhetoric', 'logic'], ancientVoice: 'ancient_reptilian_brain', keywords: ['scared', 'afraid', 'terrified', 'fear', 'horror'] },
        superstar_cop: { id: 'superstar_cop', name: 'Superstar Cop', icon: '⭐', category: 'mental', boosts: ['authority', 'savoir_faire', 'drama', 'electrochemistry'], debuffs: ['empathy', 'logic', 'volition'], ancientVoice: null, keywords: ['superstar', 'famous', 'celebrity', 'star'] },
        grieving: { id: 'grieving', name: 'Grieving', icon: '😢', category: 'mental', boosts: ['empathy', 'inland_empire', 'pain_threshold'], debuffs: ['authority', 'electrochemistry', 'savoir_faire', 'composure'], ancientVoice: 'limbic_system', keywords: ['grief', 'loss', 'mourning', 'tears', 'crying'] },
        sorry_cop: { id: 'sorry_cop', name: 'Sorry Cop', icon: '🙇', category: 'mental', boosts: ['empathy', 'suggestion', 'drama'], debuffs: ['authority', 'physical_instrument', 'rhetoric'], ancientVoice: null, keywords: ['sorry', 'apologize', 'apologetic', 'regret'] },
        apocalypse_cop: { id: 'apocalypse_cop', name: 'Apocalypse Cop', icon: '🔥', category: 'mental', boosts: ['half_light', 'authority', 'shivers', 'inland_empire', 'endurance'], debuffs: ['empathy', 'suggestion', 'savoir_faire', 'composure'], ancientVoice: 'ancient_reptilian_brain', keywords: ['apocalypse', 'end times', 'doom', 'revelation'] },
        hobocop: { id: 'hobocop', name: 'Hobocop', icon: '🥫', category: 'mental', boosts: ['shivers', 'inland_empire', 'empathy', 'endurance'], debuffs: ['authority', 'composure', 'savoir_faire', 'suggestion'], ancientVoice: null, keywords: ['hobo', 'homeless', 'vagrant', 'street'] },
        dissociated: { id: 'dissociated', name: 'Dissociated', icon: '🌫️', category: 'mental', boosts: ['inland_empire', 'shivers', 'pain_threshold'], debuffs: ['perception', 'reaction_speed', 'empathy', 'logic'], ancientVoice: 'ancient_reptilian_brain', keywords: ['dissociate', 'unreal', 'floating', 'numb', 'detached'] },
        manic: { id: 'manic', name: 'Manic', icon: '🎢', category: 'mental', boosts: ['electrochemistry', 'reaction_speed', 'conceptualization', 'rhetoric'], debuffs: ['composure', 'logic', 'volition', 'empathy'], ancientVoice: 'limbic_system', keywords: ['manic', 'hyper', 'racing', 'unstoppable'] }
    };

    const DIFFICULTIES = { trivial: { threshold: 6, name: 'Trivial' }, easy: { threshold: 8, name: 'Easy' }, medium: { threshold: 10, name: 'Medium' }, challenging: { threshold: 12, name: 'Challenging' }, heroic: { threshold: 14, name: 'Heroic' }, legendary: { threshold: 16, name: 'Legendary' }, impossible: { threshold: 18, name: 'Impossible' } };

    const THEMES = {
        death: { id: 'death', name: 'Death', icon: '💀', keywords: ['death', 'dead', 'dying', 'kill', 'murder', 'corpse', 'funeral', 'grave', 'mortality', 'deceased', 'fatal', 'lethal'] },
        love: { id: 'love', name: 'Love', icon: '❤️', keywords: ['love', 'heart', 'romance', 'passion', 'desire', 'affection', 'beloved', 'darling', 'intimate', 'tender', 'devotion'] },
        violence: { id: 'violence', name: 'Violence', icon: '👊', keywords: ['violence', 'fight', 'hit', 'punch', 'blood', 'brutal', 'attack', 'weapon', 'wound', 'harm', 'hurt', 'aggressive'] },
        mystery: { id: 'mystery', name: 'Mystery', icon: '🔍', keywords: ['mystery', 'clue', 'evidence', 'investigate', 'secret', 'hidden', 'unknown', 'suspicious', 'curious', 'strange', 'puzzle'] },
        substance: { id: 'substance', name: 'Substances', icon: '💊', keywords: ['drug', 'alcohol', 'drunk', 'high', 'smoke', 'pill', 'needle', 'addict', 'sober', 'intoxicated', 'withdrawal'] },
        failure: { id: 'failure', name: 'Failure', icon: '📉', keywords: ['fail', 'failure', 'mistake', 'wrong', 'error', 'lose', 'lost', 'regret', 'shame', 'disappoint', 'mess'] },
        identity: { id: 'identity', name: 'Identity', icon: '🎭', keywords: ['identity', 'who', 'self', 'name', 'person', 'remember', 'forget', 'past', 'memory', 'amnesia', 'mirror'] },
        authority: { id: 'authority', name: 'Authority', icon: '👮', keywords: ['authority', 'power', 'control', 'command', 'order', 'law', 'rule', 'badge', 'cop', 'police', 'respect'] },
        paranoia: { id: 'paranoia', name: 'Paranoia', icon: '👁️', keywords: ['paranoia', 'paranoid', 'watch', 'follow', 'conspiracy', 'suspicious', 'spy', 'trust', 'betray', 'trap', 'danger'] },
        philosophy: { id: 'philosophy', name: 'Philosophy', icon: '🤔', keywords: ['philosophy', 'meaning', 'existence', 'truth', 'reality', 'consciousness', 'soul', 'mind', 'think', 'believe', 'question'] },
        money: { id: 'money', name: 'Money', icon: '💰', keywords: ['money', 'cash', 'rich', 'poor', 'wealth', 'poverty', 'coin', 'pay', 'debt', 'afford', 'expensive', 'cheap'] },
        supernatural: { id: 'supernatural', name: 'Supernatural', icon: '👻', keywords: ['ghost', 'spirit', 'supernatural', 'magic', 'curse', 'haunted', 'paranormal', 'psychic', 'vision', 'prophecy', 'omen'] }
    };

    const THOUGHTS = {
        volumetric_shit_compressor: { id: 'volumetric_shit_compressor', name: 'Volumetric Shit Compressor', icon: '💩', category: 'philosophy', description: 'What if you compressed all your failures into a singularity?', discoveryConditions: { themes: { failure: 5, philosophy: 3 } }, researchTime: 6, researchPenalty: { logic: -1 }, internalizedBonus: { conceptualization: 2 }, capModifier: { logic: 1 }, flavorText: 'You have created a black hole of self-criticism. It is beautiful.' },
        hobocop: { id: 'hobocop', name: 'Hobocop', icon: '🥫', category: 'identity', description: 'A different kind of law enforcement. For the people, by the people.', discoveryConditions: { themes: { money: 5, authority: 3 } }, researchTime: 8, researchPenalty: { authority: -1 }, internalizedBonus: { shivers: 2 }, capModifier: { shivers: 1 }, flavorText: 'You patrol the margins. The forgotten places. Someone has to.' },
        bringing_of_the_law: { id: 'bringing_of_the_law', name: 'Bringing of the Law', icon: '⚖️', category: 'authority', description: 'The law is not just words. It is FORCE.', discoveryConditions: { criticalSuccess: 'authority' }, researchTime: 10, researchPenalty: { empathy: -1, suggestion: -1 }, internalizedBonus: { authority: 3 }, capModifier: { authority: 2 }, flavorText: 'You ARE the law. And the law... is VIOLENCE.' },
        kingdom_of_conscience: { id: 'kingdom_of_conscience', name: 'Kingdom of Conscience', icon: '👑', category: 'philosophy', description: 'What if morality was the only kingdom worth ruling?', discoveryConditions: { themes: { philosophy: 6 }, minSkill: { volition: 4 } }, researchTime: 12, researchPenalty: { electrochemistry: -2 }, internalizedBonus: { volition: 2 }, capModifier: { volition: 2 }, flavorText: 'Pleasure fades. Conscience endures. You have chosen your kingdom.' },
        motorway_south: { id: 'motorway_south', name: 'Motorway South', icon: '🛣️', category: 'escape', description: 'There is always a road out. Always a direction away.', discoveryConditions: { themes: { failure: 4, identity: 3 } }, researchTime: 7, researchPenalty: { esprit_de_corps: -1 }, internalizedBonus: { composure: 2 }, capModifier: { composure: 1 }, flavorText: 'You can see it now. The road that leads away from everything.' },
        anti_object_task_force: { id: 'anti_object_task_force', name: 'Anti-Object Task Force', icon: '🚫', category: 'mental', description: 'The objects speak too much. It is time to silence them.', discoveryConditions: { objectCount: 5 }, researchTime: 6, researchPenalty: { inland_empire: -1 }, internalizedBonus: { logic: 1, composure: 1 }, capModifier: { logic: 1 }, flavorText: 'Objects are just objects. They cannot speak. They never could.', specialEffect: 'objectVoiceReduction' },
        cop_of_the_apocalypse: { id: 'cop_of_the_apocalypse', name: 'Cop of the Apocalypse', icon: '🔥', category: 'identity', description: 'When the world ends, someone still needs to enforce the law.', discoveryConditions: { themes: { death: 6, authority: 4 } }, researchTime: 14, researchPenalty: { empathy: -2 }, internalizedBonus: { half_light: 2, authority: 1 }, capModifier: { half_light: 1 }, flavorText: 'The badge still means something. Even at the end of all things.' },
        caustic_echo: { id: 'caustic_echo', name: 'Caustic Echo', icon: '🗣️', category: 'social', description: 'Your words burn. Learn to aim them.', discoveryConditions: { criticalSuccess: 'rhetoric' }, researchTime: 8, researchPenalty: { suggestion: -1 }, internalizedBonus: { rhetoric: 2 }, capModifier: { rhetoric: 1 }, flavorText: 'Every word a weapon. Every sentence a scar.' },
        waste_land_of_reality: { id: 'waste_land_of_reality', name: 'Waste Land of Reality', icon: '🏜️', category: 'philosophy', description: 'Reality is a desert. Your mind is an oasis.', discoveryConditions: { themes: { supernatural: 4 }, status: 'dissociated' }, researchTime: 10, researchPenalty: { perception: -1 }, internalizedBonus: { inland_empire: 2 }, capModifier: { inland_empire: 1 }, flavorText: 'The real is not real. The unreal... is home.' },
        lovers_lament: { id: 'lovers_lament', name: "Lover's Lament", icon: '💔', category: 'emotion', description: 'Love lost is still love. Pain is proof of connection.', discoveryConditions: { themes: { love: 5, failure: 3 } }, researchTime: 9, researchPenalty: { composure: -1 }, internalizedBonus: { empathy: 2 }, capModifier: { empathy: 1 }, flavorText: 'You loved. You lost. You are still capable of both.' },
        finger_on_the_eject_button: { id: 'finger_on_the_eject_button', name: 'Finger on the Eject Button', icon: '🔘', category: 'survival', description: 'Always have an exit strategy. Always be ready to leave.', discoveryConditions: { themes: { paranoia: 4, violence: 3 } }, researchTime: 6, researchPenalty: { authority: -1 }, internalizedBonus: { reaction_speed: 2 }, capModifier: { reaction_speed: 1 }, flavorText: 'You can feel it. The moment everything goes wrong. And you will be ready.' },
        actual_art_degree: { id: 'actual_art_degree', name: 'Actual Art Degree', icon: '🎨', category: 'identity', description: 'You went to art school. This explains everything.', discoveryConditions: { themes: { philosophy: 3 }, minSkill: { conceptualization: 5 } }, researchTime: 8, researchPenalty: { logic: -1 }, internalizedBonus: { conceptualization: 2, drama: 1 }, capModifier: { conceptualization: 1 }, flavorText: 'Four years of theory. A lifetime of seeing patterns no one else sees.' },
        jamais_vu: { id: 'jamais_vu', name: 'Jamais Vu', icon: '❓', category: 'mental', description: 'The familiar becomes strange. Nothing feels real.', discoveryConditions: { themes: { identity: 5 }, status: 'dissociated' }, researchTime: 11, researchPenalty: { empathy: -1 }, internalizedBonus: { shivers: 1, inland_empire: 1 }, capModifier: { perception: 1 }, flavorText: 'You have seen this before. And yet... it is all new.' },
        the_bow_collector: { id: 'the_bow_collector', name: 'The Bow Collector', icon: '🎀', category: 'obsession', description: 'Small beautiful things. Collected. Treasured. Understood.', discoveryConditions: { themes: { mystery: 4 }, minSkill: { perception: 4 } }, researchTime: 7, researchPenalty: { physical_instrument: -1 }, internalizedBonus: { perception: 2 }, capModifier: { perception: 1 }, flavorText: 'In the details, you find meaning. In the small, you find the infinite.' },
        regular_law_official: { id: 'regular_law_official', name: 'Regular Law Official', icon: '📋', category: 'identity', description: 'Just doing your job. Nothing special. Nothing memorable.', discoveryConditions: { themes: { authority: 3 }, messageCount: 50 }, researchTime: 5, researchPenalty: { drama: -1 }, internalizedBonus: { composure: 1, esprit_de_corps: 1 }, capModifier: { esprit_de_corps: 1 }, flavorText: 'You clock in. You clock out. You enforce the law. Simple.' },
        some_kind_of_superstar: { id: 'some_kind_of_superstar', name: 'Some Kind of Superstar', icon: '⭐', category: 'identity', description: 'You are destined for greatness. Everyone can see it.', discoveryConditions: { criticalSuccess: 'savoir_faire' }, researchTime: 9, researchPenalty: { empathy: -1 }, internalizedBonus: { savoir_faire: 2, drama: 1 }, capModifier: { savoir_faire: 1 }, flavorText: 'The spotlight finds you. It always has. It always will.' },
        wompty_dompty_dom_centre: { id: 'wompty_dompty_dom_centre', name: 'Wompty-Dompty-Dom Centre', icon: '🏢', category: 'philosophy', description: 'The center of everything. Or nothing. Hard to tell.', discoveryConditions: { themes: { philosophy: 5, supernatural: 3 } }, researchTime: 13, researchPenalty: { logic: -2 }, internalizedBonus: { encyclopedia: 2 }, capModifier: { encyclopedia: 1 }, flavorText: 'You have found the center. It wobbles. It womps. It dominates.' },
        detective_arriving_on_the_scene: { id: 'detective_arriving_on_the_scene', name: 'Detective Arriving on the Scene', icon: '🚔', category: 'identity', description: 'First impressions matter. Especially for detectives.', discoveryConditions: { firstDiscovery: true }, researchTime: 4, researchPenalty: { inland_empire: -1 }, internalizedBonus: { visual_calculus: 1, perception: 1 }, capModifier: { visual_calculus: 1 }, flavorText: 'You have arrived. The investigation can now begin.' },
        the_fifteenth_indotribe: { id: 'the_fifteenth_indotribe', name: 'The Fifteenth Indotribe', icon: '🏴', category: 'philosophy', description: 'A tribe of one. A nation of the self.', discoveryConditions: { themes: { identity: 6, philosophy: 4 } }, researchTime: 15, researchPenalty: { esprit_de_corps: -2 }, internalizedBonus: { volition: 1, conceptualization: 1 }, capModifier: { volition: 1 }, flavorText: 'You belong to no nation. You ARE a nation. Population: you.' },
        apricot_chewing_gum_enthusiast: { id: 'apricot_chewing_gum_enthusiast', name: 'Apricot Chewing Gum Enthusiast', icon: '🍑', category: 'obsession', description: 'The specific pleasure of apricot. Chewed thoughtfully.', discoveryConditions: { themes: { substance: 3 }, minSkill: { electrochemistry: 4 } }, researchTime: 5, researchPenalty: { authority: -1 }, internalizedBonus: { electrochemistry: 1, suggestion: 1 }, capModifier: { electrochemistry: 1 }, flavorText: 'Sweet. Fruity. Perfectly legal. The perfect vice.' }
    };

    // State variables
    let activeStatuses = new Set();
    let currentBuild = null;
    let savedProfiles = {};
    let recentIntrusiveThoughts = [];
    let lastObjectVoice = null;
    let themeCounters = {};
    let thoughtCabinet = { slots: 3, maxSlots: 12, discovered: [], researching: {}, internalized: [], dismissed: [] };
    let discoveryContext = { messageCount: 0, objectsSeen: new Set(), criticalSuccesses: {}, criticalFailures: {}, ancientVoiceTriggered: false, firstDiscoveryDone: false };

    const DEFAULT_SETTINGS = {
        enabled: true, showDiceRolls: true, showFailedChecks: true, voicesPerMessage: { min: 1, max: 4 },
        apiEndpoint: '', apiKey: '', model: 'glm-4-plus', maxTokens: 300, temperature: 0.9,
        povStyle: 'second', characterName: '', characterPronouns: 'they', characterContext: '',
        autoDetectStatus: false, autoTrigger: false, triggerDelay: 1000,
        fabPositionTop: 140, fabPositionLeft: 10,
        intrusiveEnabled: true, intrusiveChance: 0.15, intrusiveInChat: true,
        objectVoicesEnabled: true, objectVoiceChance: 0.4,
        thoughtDiscoveryEnabled: true, showThemeTracker: true, autoDiscoverThoughts: true
    };
    const DEFAULT_ATTRIBUTE_POINTS = { INTELLECT: 3, PSYCHE: 3, PHYSIQUE: 3, MOTORICS: 3 };
    let extensionSettings = { ...DEFAULT_SETTINGS };

    // Theme tracking
    function initializeThemeCounters() { for (const themeId of Object.keys(THEMES)) { if (!(themeId in themeCounters)) themeCounters[themeId] = 0; } }
    function trackThemesInMessage(text) { if (!text || !extensionSettings.thoughtDiscoveryEnabled) return; const lowerText = text.toLowerCase(); for (const [themeId, theme] of Object.entries(THEMES)) { for (const keyword of theme.keywords) { if (lowerText.includes(keyword)) { themeCounters[themeId] = (themeCounters[themeId] || 0) + 1; break; } } } }
    function getTopThemes(count = 5) { return Object.entries(themeCounters).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, count).map(([id, count]) => ({ ...THEMES[id], count })); }
    function resetThemeCounters() { for (const key of Object.keys(themeCounters)) themeCounters[key] = 0; }

    // Thought discovery
    function meetsDiscoveryConditions(thought) {
        const cond = thought.discoveryConditions;
        if (!cond) return false;
        if (thoughtCabinet.discovered.includes(thought.id) || thoughtCabinet.researching[thought.id] || thoughtCabinet.internalized.includes(thought.id) || thoughtCabinet.dismissed.includes(thought.id)) return false;
        if (cond.themes) { for (const [themeId, required] of Object.entries(cond.themes)) { if ((themeCounters[themeId] || 0) < required) return false; } }
        if (cond.status && !activeStatuses.has(cond.status)) return false;
        if (cond.minSkill) { for (const [skillId, min] of Object.entries(cond.minSkill)) { if (getEffectiveSkillLevel(skillId) < min) return false; } }
        if (cond.criticalSuccess && !discoveryContext.criticalSuccesses[cond.criticalSuccess]) return false;
        if (cond.criticalFailure && !discoveryContext.criticalFailures[cond.criticalFailure]) return false;
        if (cond.objectCount && discoveryContext.objectsSeen.size < cond.objectCount) return false;
        if (cond.messageCount && discoveryContext.messageCount < cond.messageCount) return false;
        if (cond.ancientVoice && !discoveryContext.ancientVoiceTriggered) return false;
        if (cond.firstDiscovery && discoveryContext.firstDiscoveryDone) return false;
        return true;
    }
    function checkThoughtDiscovery() {
        if (!extensionSettings.thoughtDiscoveryEnabled || !extensionSettings.autoDiscoverThoughts) return [];
        const newlyDiscovered = [];
        for (const thought of Object.values(THOUGHTS)) { if (meetsDiscoveryConditions(thought)) { thoughtCabinet.discovered.push(thought.id); newlyDiscovered.push(thought); if (thought.discoveryConditions.firstDiscovery) discoveryContext.firstDiscoveryDone = true; } }
        return newlyDiscovered;
    }
    function startResearch(thoughtId) { const thought = THOUGHTS[thoughtId]; if (!thought) return false; if (Object.keys(thoughtCabinet.researching).length >= thoughtCabinet.slots) return false; const idx = thoughtCabinet.discovered.indexOf(thoughtId); if (idx === -1) return false; thoughtCabinet.discovered.splice(idx, 1); thoughtCabinet.researching[thoughtId] = { progress: 0, started: Date.now() }; saveState(getSTContext()); return true; }
    function abandonResearch(thoughtId) { if (!thoughtCabinet.researching[thoughtId]) return false; delete thoughtCabinet.researching[thoughtId]; thoughtCabinet.discovered.push(thoughtId); saveState(getSTContext()); return true; }
    function advanceResearch(messageText = '') { const completed = []; for (const [thoughtId, research] of Object.entries(thoughtCabinet.researching)) { const thought = THOUGHTS[thoughtId]; if (!thought) continue; let progressGain = 1; const themeId = thought.category; if (THEMES[themeId]) { const matches = THEMES[themeId].keywords.filter(kw => messageText.toLowerCase().includes(kw)); progressGain += Math.min(matches.length, 2); } research.progress += progressGain; if (research.progress >= thought.researchTime) completed.push(thoughtId); } for (const thoughtId of completed) internalizeThought(thoughtId); return completed; }
    function internalizeThought(thoughtId) { const thought = THOUGHTS[thoughtId]; if (!thought || !thoughtCabinet.researching[thoughtId]) return null; delete thoughtCabinet.researching[thoughtId]; thoughtCabinet.internalized.push(thoughtId); if (thought.internalizedBonus && currentBuild) { for (const [skillId, bonus] of Object.entries(thought.internalizedBonus)) { currentBuild.skillLevels[skillId] = Math.min(10, (currentBuild.skillLevels[skillId] || 1) + bonus); } } if (thought.capModifier && currentBuild) { for (const [skillId, bonus] of Object.entries(thought.capModifier)) { if (!currentBuild.skillCaps[skillId]) currentBuild.skillCaps[skillId] = { starting: 4, learning: 7 }; currentBuild.skillCaps[skillId].learning = Math.min(10, currentBuild.skillCaps[skillId].learning + bonus); } } saveState(getSTContext()); return thought; }
    function dismissThought(thoughtId) { const idx = thoughtCabinet.discovered.indexOf(thoughtId); if (idx === -1) return false; thoughtCabinet.discovered.splice(idx, 1); thoughtCabinet.dismissed.push(thoughtId); saveState(getSTContext()); return true; }
    function getResearchPenalties() { const penalties = {}; for (const thoughtId of Object.keys(thoughtCabinet.researching)) { const thought = THOUGHTS[thoughtId]; if (thought?.researchPenalty) { for (const [skillId, penalty] of Object.entries(thought.researchPenalty)) { penalties[skillId] = (penalties[skillId] || 0) + penalty; } } } return penalties; }
    function getSkillCap(skillId) { if (!currentBuild?.skillCaps?.[skillId]) return 6; return Math.min(10, currentBuild.skillCaps[skillId].learning); }
    function hasSpecialEffect(effectName) { return thoughtCabinet.internalized.some(id => THOUGHTS[id]?.specialEffect === effectName); }

    // Build & profile management
    function createBuild(attributePoints = DEFAULT_ATTRIBUTE_POINTS, name = 'Custom Build') { const skillLevels = {}, skillCaps = {}; for (const [attrId, attr] of Object.entries(ATTRIBUTES)) { const attrPoints = attributePoints[attrId] || 1; for (const skillId of attr.skills) { skillLevels[skillId] = attrPoints; skillCaps[skillId] = { starting: attrPoints + 1, learning: attrPoints + 4 }; } } return { id: `build_${Date.now()}`, name, attributePoints: { ...attributePoints }, skillLevels, skillCaps, createdAt: Date.now() }; }
    function initializeDefaultBuild() { currentBuild = createBuild(DEFAULT_ATTRIBUTE_POINTS, 'Balanced Detective'); }
    function getSkillLevel(skillId) { if (!currentBuild) initializeDefaultBuild(); return currentBuild.skillLevels[skillId] || 1; }
    function getAllSkillLevels() { if (!currentBuild) initializeDefaultBuild(); return { ...currentBuild.skillLevels }; }
    function getAttributePoints() { if (!currentBuild) initializeDefaultBuild(); return { ...currentBuild.attributePoints }; }
    function applyAttributeAllocation(attributePoints) { const total = Object.values(attributePoints).reduce((a, b) => a + b, 0); if (total !== 12) throw new Error(`Invalid attribute total: ${total}`); currentBuild = createBuild(attributePoints, currentBuild?.name || 'Custom Build'); }
    function createProfile(name) { return { id: `profile_${Date.now()}`, name, createdAt: Date.now(), build: currentBuild ? { ...currentBuild } : createBuild(), povStyle: extensionSettings.povStyle, characterName: extensionSettings.characterName, characterPronouns: extensionSettings.characterPronouns, characterContext: extensionSettings.characterContext, activeStatuses: Array.from(activeStatuses), thoughtCabinet: JSON.parse(JSON.stringify(thoughtCabinet)), themeCounters: { ...themeCounters } }; }
    function saveProfile(name) { const profile = createProfile(name); savedProfiles[profile.id] = profile; saveState(getSTContext()); return profile; }
    function loadProfile(profileId) { const profile = savedProfiles[profileId]; if (!profile) return false; if (profile.build) currentBuild = { ...profile.build }; extensionSettings.povStyle = profile.povStyle || 'second'; extensionSettings.characterName = profile.characterName || ''; extensionSettings.characterPronouns = profile.characterPronouns || 'they'; extensionSettings.characterContext = profile.characterContext || ''; activeStatuses = new Set(profile.activeStatuses || []); if (profile.thoughtCabinet) thoughtCabinet = JSON.parse(JSON.stringify(profile.thoughtCabinet)); if (profile.themeCounters) themeCounters = { ...profile.themeCounters }; saveState(getSTContext()); return true; }
    function deleteProfile(profileId) { if (savedProfiles[profileId]) { delete savedProfiles[profileId]; saveState(getSTContext()); return true; } return false; }

    // Status & skill functions
    function toggleStatus(statusId) { if (activeStatuses.has(statusId)) activeStatuses.delete(statusId); else activeStatuses.add(statusId); saveState(getSTContext()); renderStatusDisplay(); }
    function getSkillModifier(skillId) { let modifier = 0; for (const statusId of activeStatuses) { const status = STATUS_EFFECTS[statusId]; if (!status) continue; if (status.boosts.includes(skillId)) modifier += 1; if (status.debuffs.includes(skillId)) modifier -= 1; } const penalties = getResearchPenalties(); if (penalties[skillId]) modifier += penalties[skillId]; return modifier; }
    function getEffectiveSkillLevel(skillId) { return Math.max(1, Math.min(getSkillCap(skillId), getSkillLevel(skillId) + getSkillModifier(skillId))); }
    function getActiveAncientVoices() { const ancientVoices = new Set(); for (const statusId of activeStatuses) { const status = STATUS_EFFECTS[statusId]; if (status && status.ancientVoice) ancientVoices.add(status.ancientVoice); } return ancientVoices; }
    function detectStatusesFromText(text) { const detected = [], lowerText = text.toLowerCase(); for (const [statusId, status] of Object.entries(STATUS_EFFECTS)) { for (const keyword of status.keywords) { if (lowerText.includes(keyword)) { detected.push(statusId); break; } } } return [...new Set(detected)]; }
    function getBoostedIntrusiveSkills() { const boosted = new Set(); for (const statusId of activeStatuses) { const status = STATUS_EFFECTS[statusId]; if (status?.boosts) status.boosts.forEach(s => boosted.add(s)); } return boosted; }

    // Dice system
    function rollD6() { return Math.floor(Math.random() * 6) + 1; }
    function rollSkillCheck(skillLevel, difficulty) { const die1 = rollD6(), die2 = rollD6(); const diceTotal = die1 + die2, total = diceTotal + skillLevel; let threshold, difficultyName; if (typeof difficulty === 'string') { const diff = DIFFICULTIES[difficulty.toLowerCase()]; threshold = diff ? diff.threshold : 10; difficultyName = diff ? diff.name : 'Medium'; } else { threshold = difficulty; difficultyName = getDifficultyNameForThreshold(difficulty); } const isSnakeEyes = die1 === 1 && die2 === 1, isBoxcars = die1 === 6 && die2 === 6; let success = isSnakeEyes ? false : isBoxcars ? true : total >= threshold; return { dice: [die1, die2], diceTotal, skillLevel, total, threshold, difficultyName, success, isSnakeEyes, isBoxcars }; }
    function getDifficultyNameForThreshold(threshold) { if (threshold <= 6) return 'Trivial'; if (threshold <= 8) return 'Easy'; if (threshold <= 10) return 'Medium'; if (threshold <= 12) return 'Challenging'; if (threshold <= 14) return 'Heroic'; if (threshold <= 16) return 'Legendary'; return 'Impossible'; }

    // State management
    function saveState(context) { const state = { settings: extensionSettings, currentBuild, activeStatuses: Array.from(activeStatuses), savedProfiles, themeCounters, thoughtCabinet, discoveryContext: { ...discoveryContext, objectsSeen: Array.from(discoveryContext.objectsSeen) } }; try { if (context?.extensionSettings) { context.extensionSettings.inland_empire = state; context.saveSettingsDebounced?.(); } localStorage.setItem('inland_empire_state', JSON.stringify(state)); } catch (e) { console.error('[Inland Empire] Failed to save state:', e); } }
    function loadState(context) { try { let state = context?.extensionSettings?.inland_empire || JSON.parse(localStorage.getItem('inland_empire_state') || 'null'); if (state) { extensionSettings = { ...DEFAULT_SETTINGS, ...state.settings }; currentBuild = state.currentBuild || createBuild(); activeStatuses = new Set(state.activeStatuses || []); savedProfiles = state.savedProfiles || {}; themeCounters = state.themeCounters || {}; thoughtCabinet = state.thoughtCabinet || { slots: 3, maxSlots: 12, discovered: [], researching: {}, internalized: [], dismissed: [] }; if (state.discoveryContext) { discoveryContext = { ...state.discoveryContext, objectsSeen: new Set(state.discoveryContext.objectsSeen || []) }; } } else { initializeDefaultBuild(); } } catch (e) { console.error('[Inland Empire] Failed to load state:', e); initializeDefaultBuild(); } }

    // Intrusive thoughts & object voices
    function getIntrusiveThought(messageText = '') {
        if (!extensionSettings.intrusiveEnabled) return null;
        const boostedSkills = getBoostedIntrusiveSkills();
        const allSkillIds = Object.keys(INTRUSIVE_THOUGHTS);
        const weightedSkills = allSkillIds.map(skillId => { let weight = getEffectiveSkillLevel(skillId); if (boostedSkills.has(skillId)) weight += 3; const skill = SKILLS[skillId]; if (skill && messageText) { const matches = skill.triggerConditions.filter(kw => messageText.toLowerCase().includes(kw.toLowerCase())); weight += matches.length * 2; } return { skillId, weight }; }).filter(s => s.weight > 0);
        const totalWeight = weightedSkills.reduce((sum, s) => sum + s.weight, 0);
        let random = Math.random() * totalWeight, selectedSkill = null;
        for (const { skillId, weight } of weightedSkills) { random -= weight; if (random <= 0) { selectedSkill = skillId; break; } }
        if (!selectedSkill) selectedSkill = allSkillIds[Math.floor(Math.random() * allSkillIds.length)];
        const thoughts = INTRUSIVE_THOUGHTS[selectedSkill];
        if (!thoughts || thoughts.length === 0) return null;
        let availableThoughts = thoughts.filter(t => !recentIntrusiveThoughts.includes(t));
        if (availableThoughts.length === 0) { recentIntrusiveThoughts = []; availableThoughts = thoughts; }
        const thought = availableThoughts[Math.floor(Math.random() * availableThoughts.length)];
        recentIntrusiveThoughts.push(thought);
        if (recentIntrusiveThoughts.length > 20) recentIntrusiveThoughts.shift();
        const skill = SKILLS[selectedSkill];
        return { skillId: selectedSkill, skillName: skill.name, signature: skill.signature, color: skill.color, content: thought, isIntrusive: true };
    }
    function detectObjects(text) { if (!extensionSettings.objectVoicesEnabled) return []; if (hasSpecialEffect('objectVoiceReduction') && Math.random() < 0.85) return []; const detected = []; for (const [objectId, obj] of Object.entries(OBJECT_VOICES)) { for (const pattern of obj.patterns) { if (pattern.test(text)) { detected.push({ id: objectId, ...obj }); break; } } } return detected; }
    function getObjectVoice(objectId) { const obj = OBJECT_VOICES[objectId]; if (!obj) return null; if (lastObjectVoice === objectId && Math.random() > 0.3) return null; lastObjectVoice = objectId; discoveryContext.objectsSeen.add(objectId); const line = obj.lines[Math.floor(Math.random() * obj.lines.length)]; return { objectId, name: obj.name, icon: obj.icon, color: obj.color, content: line, affinitySkill: obj.affinitySkill, isObject: true }; }
    async function processIntrusiveThoughts(messageText) { const results = { intrusive: null, objects: [] }; let intrusiveChance = extensionSettings.intrusiveChance || 0.15; if (activeStatuses.size > 0) intrusiveChance += activeStatuses.size * 0.05; if (Math.random() < intrusiveChance) results.intrusive = getIntrusiveThought(messageText); const detectedObjects = detectObjects(messageText); for (const obj of detectedObjects) { if (Math.random() < (extensionSettings.objectVoiceChance || 0.4)) { const voice = getObjectVoice(obj.id); if (voice) results.objects.push(voice); } } return results; }

    // Toast system
    function createToastContainer() { let container = document.getElementById('ie-toast-container'); if (!container) { container = document.createElement('div'); container.id = 'ie-toast-container'; container.className = 'ie-toast-container'; document.body.appendChild(container); } return container; }
    function showToast(message, type = 'info', duration = 3000) { const container = createToastContainer(); const toast = document.createElement('div'); toast.className = `ie-toast ie-toast-${type}`; const icon = type === 'loading' ? 'fa-spinner fa-spin' : type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-brain'; toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`; container.appendChild(toast); requestAnimationFrame(() => toast.classList.add('ie-toast-show')); if (type !== 'loading') setTimeout(() => { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }, duration); return toast; }
    function showIntrusiveToast(thought, duration = 5000) { const container = createToastContainer(); const toast = document.createElement('div'); toast.className = 'ie-toast ie-toast-intrusive'; toast.style.borderColor = thought.color; toast.innerHTML = `<div class="ie-intrusive-header"><span class="ie-intrusive-icon">🧠</span><span class="ie-intrusive-signature" style="color: ${thought.color}">${thought.signature}</span></div><div class="ie-intrusive-content">"${thought.content}"</div><button class="ie-intrusive-dismiss">dismiss</button>`; container.appendChild(toast); requestAnimationFrame(() => toast.classList.add('ie-toast-show')); toast.querySelector('.ie-intrusive-dismiss')?.addEventListener('click', () => { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }); setTimeout(() => { if (toast.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }, duration); return toast; }
    function showObjectToast(objectVoice, duration = 6000) { const container = createToastContainer(); const toast = document.createElement('div'); toast.className = 'ie-toast ie-toast-object'; toast.style.borderColor = objectVoice.color; toast.innerHTML = `<div class="ie-object-header"><span class="ie-object-icon">${objectVoice.icon}</span><span class="ie-object-name" style="color: ${objectVoice.color}">${objectVoice.name}</span></div><div class="ie-object-content">"${objectVoice.content}"</div><button class="ie-object-dismiss">dismiss</button>`; container.appendChild(toast); requestAnimationFrame(() => toast.classList.add('ie-toast-show')); toast.querySelector('.ie-object-dismiss')?.addEventListener('click', () => { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }); setTimeout(() => { if (toast.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }, duration); return toast; }
    function showDiscoveryToast(thought) { const container = createToastContainer(); const toast = document.createElement('div'); toast.className = 'ie-toast ie-toast-discovery'; toast.innerHTML = `<div class="ie-discovery-header"><span class="ie-discovery-icon">💭</span><span class="ie-discovery-label">THOUGHT DISCOVERED</span></div><div class="ie-discovery-name">${thought.icon} ${thought.name}</div><div class="ie-discovery-desc">${thought.description}</div><div class="ie-discovery-actions"><button class="ie-btn ie-btn-research" data-thought="${thought.id}">RESEARCH</button><button class="ie-btn ie-btn-dismiss-thought" data-thought="${thought.id}">DISMISS</button></div>`; container.appendChild(toast); requestAnimationFrame(() => toast.classList.add('ie-toast-show')); toast.querySelector('.ie-btn-research')?.addEventListener('click', () => { if (startResearch(thought.id)) { showToast(`Researching: ${thought.name}`, 'success', 2000); renderCabinetTab(); } else { showToast('No research slots available!', 'error', 2000); } toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }); toast.querySelector('.ie-btn-dismiss-thought')?.addEventListener('click', () => { dismissThought(thought.id); toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }); return toast; }
    function showInternalizedToast(thought) { const container = createToastContainer(); const toast = document.createElement('div'); toast.className = 'ie-toast ie-toast-internalized'; const bonusText = thought.internalizedBonus ? Object.entries(thought.internalizedBonus).map(([s, v]) => `+${v} ${SKILLS[s]?.name || s}`).join(', ') : ''; const capText = thought.capModifier ? Object.entries(thought.capModifier).map(([s, v]) => `+${v} ${SKILLS[s]?.name || s} cap`).join(', ') : ''; toast.innerHTML = `<div class="ie-internalized-header"><span class="ie-internalized-icon">✨</span><span class="ie-internalized-label">THOUGHT INTERNALIZED</span></div><div class="ie-internalized-name">${thought.icon} ${thought.name}</div><div class="ie-internalized-flavor">${thought.flavorText}</div>${bonusText ? `<div class="ie-internalized-bonuses">${bonusText}</div>` : ''}${capText ? `<div class="ie-internalized-caps">${capText}</div>` : ''}`; container.appendChild(toast); requestAnimationFrame(() => toast.classList.add('ie-toast-show')); setTimeout(() => { if (toast.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }, 8000); return toast; }
    function hideToast(toast) { if (toast?.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }

    // Relevance & voice selection
    function analyzeContext(message) { const emotionalIndicators = [/!{2,}/, /\?{2,}/, /scream|shout|cry|sob|laugh/i, /furious|terrified|ecstatic/i]; const dangerIndicators = [/blood|wound|injury|hurt|pain/i, /gun|knife|weapon|attack|fight/i, /danger|threat|kill|die|death/i]; const socialIndicators = [/lie|lying|truth|honest|trust/i, /convince|persuade|manipulate/i, /feel|emotion|sad|happy|angry/i]; const mysteryIndicators = [/clue|evidence|investigate|discover/i, /secret|hidden|mystery|strange/i]; const physicalIndicators = [/room|building|street|place/i, /cold|hot|wind|rain/i, /machine|device|lock/i]; return { message, emotionalIntensity: emotionalIndicators.filter(r => r.test(message)).length / emotionalIndicators.length, dangerLevel: dangerIndicators.filter(r => r.test(message)).length / dangerIndicators.length, socialComplexity: socialIndicators.filter(r => r.test(message)).length / socialIndicators.length, mysteryLevel: mysteryIndicators.filter(r => r.test(message)).length / mysteryIndicators.length, physicalPresence: physicalIndicators.filter(r => r.test(message)).length / physicalIndicators.length }; }
    function calculateSkillRelevance(skillId, context) { const skill = SKILLS[skillId]; if (!skill) return { skillId, score: 0, reasons: [] }; const statusModifier = getSkillModifier(skillId); let score = 0; const keywordMatches = skill.triggerConditions.filter(kw => context.message.toLowerCase().includes(kw.toLowerCase())); if (keywordMatches.length > 0) score += Math.min(keywordMatches.length * 0.2, 0.6); const attr = skill.attribute; if (attr === 'PSYCHE') score += context.emotionalIntensity * 0.4; if (attr === 'PHYSIQUE') score += context.dangerLevel * 0.5; if (attr === 'INTELLECT') score += context.mysteryLevel * 0.4; if (attr === 'MOTORICS') score += context.physicalPresence * 0.3; if (statusModifier > 0) score += statusModifier * 0.25; score += getEffectiveSkillLevel(skillId) * 0.05; score += (Math.random() - 0.5) * 0.2; return { skillId, skillName: skill.name, score: Math.max(0, Math.min(1, score)), skillLevel: getSkillLevel(skillId), attribute: attr }; }
    function selectSpeakingSkills(context, options = {}) { const { minVoices = 1, maxVoices = 4 } = options; const ancientVoicesToSpeak = []; for (const ancientId of getActiveAncientVoices()) { const ancient = ANCIENT_VOICES[ancientId]; if (ancient) { const keywordMatch = ancient.triggerConditions.some(kw => context.message.toLowerCase().includes(kw.toLowerCase())); if (Math.random() < (keywordMatch ? 0.8 : 0.4)) { ancientVoicesToSpeak.push({ skillId: ancient.id, skillName: ancient.name, score: 1.0, skillLevel: 6, attribute: 'PRIMAL', isAncient: true }); discoveryContext.ancientVoiceTriggered = true; } } } const allRelevance = Object.keys(SKILLS).map(id => calculateSkillRelevance(id, context)).filter(r => r.score >= 0.3).sort((a, b) => b.score - a.score); const intensity = Math.max(context.emotionalIntensity, context.dangerLevel, context.socialComplexity); const targetVoices = Math.round(minVoices + (maxVoices - minVoices) * intensity); const selected = [...ancientVoicesToSpeak]; for (const relevance of allRelevance) { if (selected.length >= targetVoices + ancientVoicesToSpeak.length) break; if (Math.random() < relevance.score * 0.8 + 0.2) selected.push(relevance); } while (selected.filter(s => !s.isAncient).length < minVoices && allRelevance.length > 0) { const next = allRelevance.find(r => !selected.find(s => s.skillId === r.skillId)); if (next) selected.push(next); else break; } return selected; }
    function determineCheckDifficulty(selectedSkill, context) { const baseThreshold = 10; const relevanceModifier = -Math.floor(selectedSkill.score * 4); const intensityModifier = Math.floor(Math.max(context.emotionalIntensity, context.dangerLevel) * 4); const threshold = Math.max(6, Math.min(18, baseThreshold + relevanceModifier + intensityModifier)); return { shouldCheck: selectedSkill.score <= 0.8 || Math.random() > 0.3, difficulty: getDifficultyNameForThreshold(threshold).toLowerCase(), threshold }; }

    // Voice generation - contextual prompt system
    async function generateVoices(selectedSkills, context, intrusiveData = null) {
        const voiceData = selectedSkills.map(selected => {
            let checkResult = null;
            if (!selected.isAncient) { const checkDecision = determineCheckDifficulty(selected, context); if (checkDecision.shouldCheck) { checkResult = rollSkillCheck(getEffectiveSkillLevel(selected.skillId), checkDecision.difficulty); if (checkResult.isBoxcars) discoveryContext.criticalSuccesses[selected.skillId] = true; if (checkResult.isSnakeEyes) discoveryContext.criticalFailures[selected.skillId] = true; } }
            const skill = selected.isAncient ? ANCIENT_VOICES[selected.skillId] : SKILLS[selected.skillId];
            return { ...selected, skill, checkResult, effectiveLevel: selected.isAncient ? 6 : getEffectiveSkillLevel(selected.skillId) };
        });
        const chorusPrompt = buildChorusPrompt(voiceData, context, intrusiveData);
        try { const response = await callAPI(chorusPrompt.system, chorusPrompt.user); return parseChorusResponse(response, voiceData); }
        catch (error) { console.error('[Inland Empire] Chorus generation failed:', error); return voiceData.map(v => ({ skillId: v.skillId, skillName: v.skill.name, signature: v.skill.signature, color: v.skill.color, content: '*static*', checkResult: v.checkResult, isAncient: v.isAncient, success: false })); }
    }

    function buildChorusPrompt(voiceData, context, intrusiveData = null) {
        const povStyle = extensionSettings.povStyle || 'second';
        const charName = extensionSettings.characterName || '';
        const characterContext = extensionSettings.characterContext || '';
        let povInstruction;
        switch (povStyle) { case 'third': povInstruction = `Write in THIRD PERSON about ${charName || 'the character'}. Use "${charName || 'they'}" - NEVER "you".`; break; case 'first': povInstruction = `Write in FIRST PERSON. Use "I/me/my" - NEVER "you".`; break; default: povInstruction = `Write in SECOND PERSON. Address the character as "you".`; }
        const voiceDescriptions = voiceData.map(v => {
            const skill = v.skill;
            let checkInfo = '';
            if (v.checkResult) { if (v.checkResult.isBoxcars) checkInfo = ' [CRITICAL SUCCESS - Be profound, insightful]'; else if (v.checkResult.isSnakeEyes) checkInfo = ' [CRITICAL FAILURE - Be hilariously, catastrophically wrong]'; else if (v.checkResult.success) checkInfo = ' [Success - Confident, correct]'; else checkInfo = ' [Failed - Uncertain, possibly wrong]'; }
            else if (v.isAncient) { checkInfo = ' [ANCIENT VOICE - Speak from the deep unconscious]'; }
            else { checkInfo = ' [Passive observation]'; }
            return `**${skill.signature}**${checkInfo}\n${skill.promptPersonality}\nSpeech patterns: ${skill.speechPatterns?.slice(0, 4).join(', ')}`;
        }).join('\n\n');
        const interactionNotes = buildInteractionNotes(voiceData);
        let statusContext = ''; if (activeStatuses.size > 0) { const statusNames = [...activeStatuses].map(id => STATUS_EFFECTS[id]?.name).filter(Boolean); statusContext = `\nCurrent state: ${statusNames.join(', ')}.`; }
        let intrusiveContext = '';
        if (intrusiveData) { if (intrusiveData.intrusive) { intrusiveContext += `\n\nINTRUSIVE THOUGHT ALREADY FIRED:\n${intrusiveData.intrusive.signature}: "${intrusiveData.intrusive.content}"\n(Other voices may react to this)`; } if (intrusiveData.objects?.length > 0) { intrusiveContext += `\n\nOBJECTS SPEAKING:\n${intrusiveData.objects.map(o => `${o.name}: "${o.content}"`).join('\n')}\n(Voices may react to the objects)`; } }
        const systemPrompt = `You generate internal mental voices for a character, inspired by Disco Elysium's skill system.

## THE SCENE
The voices are REACTING to this narrative moment. They should comment on what's ACTUALLY HAPPENING, not just speak generic quotes.

## THE VOICES SPEAKING
${voiceDescriptions}

## KEY RULES

1. **${povInstruction}**

2. **REACT TO THE SCENE** - Each voice comments on something SPECIFIC from the narrative:
   - What did they notice?
   - What concerns/excites/intrigues them about it?
   - What do they want the character to DO about it?

3. **VOICES INTERACT** - They can:
   - Argue with each other ("Get out of here, dreamer!")
   - Build on each other's observations
   - Interrupt ("But—" / "No, listen—")
   - Agree unexpectedly
${interactionNotes}

4. **FORMAT EXACTLY AS:**
   SKILL_NAME - dialogue
   
5. **VOICE QUALITY:**
   - Failed checks = uncertain, possibly wrong, hedging
   - Successful checks = confident, insightful
   - Critical success (boxcars) = PROFOUND revelation
   - Critical failure (snake eyes) = HILARIOUSLY wrong, embarrassing
   - Ancient voices = fragmented, poetic, from deep unconscious

6. **LENGTH:** 
   - Each voice: 1-2 sentences MAX
   - Total: 4-10 voice lines depending on scene intensity
${characterContext ? `\n## CHARACTER CONTEXT\n${characterContext}` : ''}${statusContext}${intrusiveContext}

## OUTPUT
Generate ONLY the voice dialogue. No narration, no descriptions, no markdown.
Each voice should say something SPECIFIC to this scene.`;
        const userPrompt = `## SCENE TO REACT TO:\n"${context.message.substring(0, 1000)}"\n\nGenerate the internal chorus reacting to this specific scene.`;
        return { system: systemPrompt, user: userPrompt };
    }

    function buildInteractionNotes(voiceData) {
        const skillIds = voiceData.map(v => v.skillId);
        const notes = [];
        const antagonisms = [
            { pair: ['volition', 'electrochemistry'], note: 'VOLITION should push back against ELECTROCHEMISTRY\'s suggestions' },
            { pair: ['logic', 'inland_empire'], note: 'LOGIC dismisses INLAND EMPIRE\'s mystical insights' },
            { pair: ['physical_instrument', 'inland_empire'], note: 'PHYSICAL INSTRUMENT tells INLAND EMPIRE "Get out of here, dreamer!"' },
            { pair: ['volition', 'drama'], note: 'VOLITION may call DRAMA "the most compromised"' },
            { pair: ['pain_threshold', 'inland_empire'], note: 'PAIN THRESHOLD wants to dig deeper when INLAND EMPIRE warns away' },
            { pair: ['authority', 'empathy'], note: 'AUTHORITY\'s aggression clashes with EMPATHY\'s compassion' },
            { pair: ['logic', 'half_light'], note: 'LOGIC dismisses HALF LIGHT\'s paranoid fears' }
        ];
        const synergies = [
            { pair: ['logic', 'visual_calculus'], note: 'LOGIC and VISUAL CALCULUS work together analytically' },
            { pair: ['inland_empire', 'shivers'], note: 'INLAND EMPIRE and SHIVERS share supernatural wavelength' },
            { pair: ['drama', 'rhetoric'], note: 'DRAMA and RHETORIC can tag-team persuasion' },
            { pair: ['authority', 'physical_instrument'], note: 'AUTHORITY and PHYSICAL INSTRUMENT form intimidation tag-team' }
        ];
        for (const { pair, note } of antagonisms) { if (skillIds.includes(pair[0]) && skillIds.includes(pair[1])) { notes.push(`   - ${note}`); } }
        for (const { pair, note } of synergies) { if (skillIds.includes(pair[0]) && skillIds.includes(pair[1])) { notes.push(`   - ${note}`); } }
        return notes.length > 0 ? '\n' + notes.join('\n') : '';
    }

    function parseChorusResponse(response, voiceData) {
        const lines = response.trim().split('\n').filter(line => line.trim());
        const results = [];
        const skillMap = {};
        voiceData.forEach(v => { skillMap[v.skill.signature.toUpperCase()] = v; skillMap[v.skill.name.toUpperCase()] = v; });
        for (const line of lines) {
            const match = line.match(/^([A-Z][A-Z\s\/]+)\s*[-:–—]\s*(.+)$/i);
            if (match) { const voiceInfo = skillMap[match[1].trim().toUpperCase()]; if (voiceInfo) results.push({ skillId: voiceInfo.skillId, skillName: voiceInfo.skill.name, signature: voiceInfo.skill.signature, color: voiceInfo.skill.color, content: match[2].trim(), checkResult: voiceInfo.checkResult, isAncient: voiceInfo.isAncient, success: true }); }
        }
        if (results.length === 0 && voiceData.length > 0 && response.trim()) { const v = voiceData[0]; results.push({ skillId: v.skillId, skillName: v.skill.name, signature: v.skill.signature, color: v.skill.color, content: response.trim().substring(0, 200), checkResult: v.checkResult, isAncient: v.isAncient, success: true }); }
        return results;
    }

    async function callAPI(systemPrompt, userPrompt) {
        let { apiEndpoint, apiKey, model, maxTokens, temperature } = extensionSettings;
        if (!apiEndpoint || !apiKey) throw new Error('API not configured');
        if (!apiEndpoint.includes('/chat/completions')) apiEndpoint = apiEndpoint.replace(/\/+$/, '') + '/chat/completions';
        const response = await fetch(apiEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify({ model: model || 'glm-4-plus', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], max_tokens: maxTokens || 300, temperature: temperature || 0.9 }) });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        return data.choices?.[0]?.message?.content || data.choices?.[0]?.text || data.content || '';
    }

    // UI display functions
    function displayVoices(voices) {
        const container = document.getElementById('ie-voices-output');
        if (!container) return;
        if (voices.length === 0) { container.innerHTML = '<div class="ie-voices-empty"><i class="fa-solid fa-comment-slash"></i><span>*silence*</span></div>'; return; }
        const voicesHtml = voices.map(voice => {
            let checkHtml = '';
            if (extensionSettings.showDiceRolls && voice.checkResult) { const checkClass = voice.checkResult.success ? 'success' : 'failure'; const critClass = voice.checkResult.isBoxcars ? 'critical-success' : voice.checkResult.isSnakeEyes ? 'critical-failure' : ''; checkHtml = `<span class="ie-voice-check ${checkClass} ${critClass}">[${voice.checkResult.dice.join('+')}+${voice.checkResult.skillLevel}=${voice.checkResult.total} vs ${voice.checkResult.threshold} ${voice.checkResult.success ? '✓' : '✗'}]</span>`; }
            const ancientClass = voice.isAncient ? 'ie-voice-ancient' : '';
            return `<div class="ie-voice-entry ${ancientClass}" style="border-left-color: ${voice.color}"><div class="ie-voice-header"><span class="ie-voice-sig" style="color: ${voice.color}">${voice.signature}</span>${checkHtml}</div><div class="ie-voice-content">${voice.content}</div></div>`;
        }).join('');
        container.innerHTML = voicesHtml;
    }

    function insertVoicesIntoChat(voices, intrusiveData = null) {
        const context = getSTContext();
        if (!context) return;
        let formattedText = '';
        if (intrusiveData?.intrusive && extensionSettings.intrusiveInChat) { const i = intrusiveData.intrusive; formattedText += `**${i.signature}** - *"${i.content}"*\n\n`; }
        if (intrusiveData?.objects?.length > 0 && extensionSettings.intrusiveInChat) { for (const obj of intrusiveData.objects) { formattedText += `**${obj.name}** - *"${obj.content}"*\n\n`; } }
        for (const voice of voices) { let checkInfo = ''; if (extensionSettings.showDiceRolls && voice.checkResult) { const icon = voice.checkResult.isBoxcars ? '⚡' : voice.checkResult.isSnakeEyes ? '💀' : voice.checkResult.success ? '✓' : '✗'; checkInfo = ` [${voice.checkResult.dice.join('+')}+${voice.checkResult.skillLevel}=${voice.checkResult.total} vs ${voice.checkResult.threshold} ${icon}]`; } formattedText += `**${voice.signature}**${checkInfo} - ${voice.content}\n\n`; }
        const trimmed = formattedText.trim();
        if (trimmed) { const textarea = document.getElementById('send_textarea'); if (textarea) { const currentText = textarea.value; const separator = currentText.trim() ? '\n\n---\n\n' : ''; textarea.value = currentText + separator + trimmed; textarea.dispatchEvent(new Event('input', { bubbles: true })); } }
    }

    // Main trigger function
    async function triggerVoices(messageText) {
        if (!extensionSettings.enabled) return;
        if (!extensionSettings.apiEndpoint || !extensionSettings.apiKey) { showToast('API not configured! Check settings.', 'error', 3000); return; }
        const loadingToast = showToast('Voices stirring...', 'loading');
        try {
            discoveryContext.messageCount++;
            trackThemesInMessage(messageText);
            if (extensionSettings.autoDetectStatus) { const detectedStatuses = detectStatusesFromText(messageText); for (const statusId of detectedStatuses) { if (!activeStatuses.has(statusId)) { activeStatuses.add(statusId); showToast(`Status detected: ${STATUS_EFFECTS[statusId].name}`, 'info', 2000); } } renderStatusDisplay(); }
            const intrusiveData = await processIntrusiveThoughts(messageText);
            if (intrusiveData.intrusive && !extensionSettings.intrusiveInChat) { showIntrusiveToast(intrusiveData.intrusive); }
            for (const obj of intrusiveData.objects) { if (!extensionSettings.intrusiveInChat) { showObjectToast(obj); } }
            const context = analyzeContext(messageText);
            const selectedSkills = selectSpeakingSkills(context, { minVoices: extensionSettings.minVoices || extensionSettings.voicesPerMessage?.min || 1, maxVoices: extensionSettings.maxVoices || extensionSettings.voicesPerMessage?.max || 4 });
            const voices = await generateVoices(selectedSkills, context, intrusiveData);
            hideToast(loadingToast);
            displayVoices(voices);
            insertVoicesIntoChat(voices, intrusiveData);
            const completedThoughts = advanceResearch(messageText);
            for (const thoughtId of completedThoughts) { const thought = THOUGHTS[thoughtId]; if (thought) showInternalizedToast(thought); }
            const newlyDiscovered = checkThoughtDiscovery();
            for (const thought of newlyDiscovered) { showDiscoveryToast(thought); }
            saveState(getSTContext());
            renderCabinetTab();
        } catch (error) { hideToast(loadingToast); console.error('[Inland Empire] Error triggering voices:', error); showToast(`Error: ${error.message}`, 'error', 4000); }
    }

    function getLastAssistantMessage() { const context = getSTContext(); if (!context?.chat?.length) return ''; for (let i = context.chat.length - 1; i >= 0; i--) { const msg = context.chat[i]; if (!msg.is_user && msg.mes) return msg.mes; } return ''; }

    // UI Panel Functions
    function togglePanel() { const panel = document.getElementById('inland-empire-panel'); const fab = document.getElementById('inland-empire-fab'); if (!panel) return; const isOpen = panel.classList.contains('ie-panel-open'); if (isOpen) { panel.classList.remove('ie-panel-open'); fab?.classList.remove('ie-fab-active'); } else { panel.classList.add('ie-panel-open'); fab?.classList.add('ie-fab-active'); } }
    function switchTab(tabName) { document.querySelectorAll('.ie-tab').forEach(tab => tab.classList.toggle('ie-tab-active', tab.dataset.tab === tabName)); document.querySelectorAll('.ie-tab-content').forEach(content => content.classList.toggle('ie-tab-content-active', content.dataset.tabContent === tabName)); if (tabName === 'profiles') { populateBuildEditor(); renderProfilesList(); } if (tabName === 'settings') populateSettings(); if (tabName === 'status') renderStatusDisplay(); if (tabName === 'cabinet') renderCabinetTab(); }

    function renderCabinetTab() {
        const container = document.getElementById('ie-cabinet-content'); if (!container) return;
        const slotsUsed = Object.keys(thoughtCabinet.researching).length;
        let slotsHtml = `<div class="ie-section ie-cabinet-slots"><div class="ie-section-header"><span>Research Slots</span><span class="ie-slots-display">${slotsUsed}/${thoughtCabinet.slots}</span></div><div class="ie-slots-visual">`; for (let i = 0; i < thoughtCabinet.slots; i++) { const occupied = i < slotsUsed; slotsHtml += `<div class="ie-slot ${occupied ? 'ie-slot-occupied' : 'ie-slot-empty'}">${occupied ? '💭' : '+'}</div>`; } slotsHtml += `</div></div>`;
        const topThemes = getTopThemes(5);
        let themesHtml = `<div class="ie-section ie-theme-tracker"><div class="ie-section-header"><span>Theme Tracker</span><button class="ie-btn ie-btn-sm ie-btn-reset-themes" title="Reset"><i class="fa-solid fa-eraser"></i></button></div><div class="ie-themes-grid">`; if (topThemes.length === 0) { themesHtml += `<div class="ie-empty-state"><i class="fa-solid fa-chart-line"></i><span>No themes tracked yet</span></div>`; } else { for (const theme of topThemes) { themesHtml += `<div class="ie-theme-item"><span class="ie-theme-icon">${theme.icon}</span><span class="ie-theme-name">${theme.name}</span><span class="ie-theme-count">${theme.count}</span></div>`; } } themesHtml += `</div></div>`;
        let researchingHtml = `<div class="ie-section ie-researching-section"><div class="ie-section-header"><span>Researching</span></div><div class="ie-researching-list">`; const researchingIds = Object.keys(thoughtCabinet.researching); if (researchingIds.length === 0) { researchingHtml += `<div class="ie-empty-state"><i class="fa-solid fa-flask"></i><span>No thoughts being researched</span></div>`; } else { for (const thoughtId of researchingIds) { const thought = THOUGHTS[thoughtId]; const research = thoughtCabinet.researching[thoughtId]; const progress = Math.min(100, Math.round((research.progress / thought.researchTime) * 100)); const penalties = thought.researchPenalty ? Object.entries(thought.researchPenalty).map(([s, v]) => `${v} ${SKILLS[s]?.signature || s}`).join(', ') : 'None'; researchingHtml += `<div class="ie-research-card"><div class="ie-research-header"><span class="ie-research-icon">${thought.icon}</span><span class="ie-research-name">${thought.name}</span><button class="ie-btn ie-btn-sm ie-btn-abandon" data-thought="${thoughtId}" title="Abandon"><i class="fa-solid fa-times"></i></button></div><div class="ie-research-progress-bar"><div class="ie-research-progress-fill" style="width: ${progress}%"></div></div><div class="ie-research-info"><span>${research.progress}/${thought.researchTime}</span><span class="ie-research-penalties">${penalties}</span></div></div>`; } } researchingHtml += `</div></div>`;
        let discoveredHtml = `<div class="ie-section ie-discovered-section"><div class="ie-section-header"><span>Discovered</span></div><div class="ie-discovered-list">`; if (thoughtCabinet.discovered.length === 0) { discoveredHtml += `<div class="ie-empty-state"><i class="fa-solid fa-lightbulb"></i><span>No discovered thoughts</span></div>`; } else { for (const thoughtId of thoughtCabinet.discovered) { const thought = THOUGHTS[thoughtId]; if (!thought) continue; discoveredHtml += `<div class="ie-discovered-card"><div class="ie-discovered-header"><span class="ie-discovered-icon">${thought.icon}</span><span class="ie-discovered-name">${thought.name}</span></div><div class="ie-discovered-desc">${thought.description}</div><div class="ie-discovered-actions"><button class="ie-btn ie-btn-sm ie-btn-research" data-thought="${thoughtId}">Research</button><button class="ie-btn ie-btn-sm ie-btn-dismiss-thought" data-thought="${thoughtId}">Dismiss</button></div></div>`; } } discoveredHtml += `</div></div>`;
        let internalizedHtml = `<div class="ie-section ie-internalized-section"><div class="ie-section-header"><span>Internalized</span></div><div class="ie-internalized-list">`; if (thoughtCabinet.internalized.length === 0) { internalizedHtml += `<div class="ie-empty-state"><i class="fa-solid fa-gem"></i><span>No internalized thoughts</span></div>`; } else { for (const thoughtId of thoughtCabinet.internalized) { const thought = THOUGHTS[thoughtId]; if (!thought) continue; const bonusText = thought.internalizedBonus ? Object.entries(thought.internalizedBonus).map(([s, v]) => `+${v} ${SKILLS[s]?.signature || s}`).join(' ') : ''; internalizedHtml += `<div class="ie-internalized-card"><span class="ie-internalized-icon">${thought.icon}</span><span class="ie-internalized-name">${thought.name}</span>${bonusText ? `<span class="ie-internalized-bonuses">${bonusText}</span>` : ''}</div>`; } } internalizedHtml += `</div></div>`;
        container.innerHTML = slotsHtml + themesHtml + researchingHtml + discoveredHtml + internalizedHtml;
        container.querySelector('.ie-btn-reset-themes')?.addEventListener('click', () => { resetThemeCounters(); renderCabinetTab(); showToast('Themes reset', 'info', 2000); });
        container.querySelectorAll('.ie-btn-abandon').forEach(btn => btn.addEventListener('click', () => { abandonResearch(btn.dataset.thought); renderCabinetTab(); }));
        container.querySelectorAll('.ie-btn-research').forEach(btn => btn.addEventListener('click', () => { if (startResearch(btn.dataset.thought)) { showToast('Research started!', 'success', 2000); renderCabinetTab(); } else showToast('No slots available!', 'error', 2000); }));
        container.querySelectorAll('.ie-btn-dismiss-thought').forEach(btn => btn.addEventListener('click', () => { dismissThought(btn.dataset.thought); renderCabinetTab(); }));
    }

    function renderProfilesList() { const container = document.getElementById('ie-profiles-list'); if (!container) return; const profiles = Object.values(savedProfiles); if (profiles.length === 0) { container.innerHTML = '<div class="ie-empty-state"><i class="fa-solid fa-user-slash"></i><span>No saved profiles</span></div>'; return; } container.innerHTML = profiles.map(profile => `<div class="ie-profile-card" data-profile-id="${profile.id}"><div class="ie-profile-info"><span class="ie-profile-name">${profile.name}</span><span class="ie-profile-details">${profile.characterName || 'No character'}</span></div><div class="ie-profile-actions"><button class="ie-btn-icon ie-btn-load" data-action="load" title="Load"><i class="fa-solid fa-download"></i></button><button class="ie-btn-icon ie-btn-remove" data-action="delete" title="Delete"><i class="fa-solid fa-trash"></i></button></div></div>`).join(''); container.querySelectorAll('.ie-profile-card').forEach(card => { const profileId = card.dataset.profileId; card.querySelector('[data-action="load"]')?.addEventListener('click', () => { if (loadProfile(profileId)) { showToast(`Loaded: ${savedProfiles[profileId].name}`, 'success', 2000); renderAttributesDisplay(); populateSettings(); populateBuildEditor(); renderStatusDisplay(); renderCabinetTab(); } }); card.querySelector('[data-action="delete"]')?.addEventListener('click', () => { if (confirm(`Delete "${savedProfiles[profileId].name}"?`)) { deleteProfile(profileId); renderProfilesList(); showToast('Profile deleted', 'info', 2000); } }); }); }

    function populateBuildEditor() { const container = document.getElementById('ie-attributes-editor'); if (!container) return; const attrPoints = getAttributePoints(); container.innerHTML = Object.entries(ATTRIBUTES).map(([id, attr]) => `<div class="ie-attribute-row" data-attribute="${id}"><div class="ie-attribute-label" style="color: ${attr.color}"><span class="ie-attr-name">${attr.name}</span><span class="ie-attr-value" id="ie-build-${id}-value">${attrPoints[id] || 3}</span></div><input type="range" class="ie-attribute-slider" id="ie-build-${id}" min="1" max="6" value="${attrPoints[id] || 3}" data-attribute="${id}" /></div>`).join(''); container.querySelectorAll('.ie-attribute-slider').forEach(slider => slider.addEventListener('input', updateBuildFromSliders)); updatePointsDisplay(); }
    function updateBuildFromSliders() { let total = 0; document.querySelectorAll('#ie-attributes-editor .ie-attribute-slider').forEach(slider => { const attr = slider.dataset.attribute, val = parseInt(slider.value); total += val; const display = document.getElementById(`ie-build-${attr}-value`); if (display) display.textContent = val; }); updatePointsDisplay(total); }
    function updatePointsDisplay(total) { if (total === undefined) { total = 0; document.querySelectorAll('#ie-attributes-editor .ie-attribute-slider').forEach(s => total += parseInt(s.value)); } const display = document.getElementById('ie-points-remaining'); if (display) { display.textContent = total; display.style.color = total > 12 ? '#FF6347' : total < 12 ? '#90EE90' : '#9d8df1'; } }

    function populateSettings() {
        const s = extensionSettings;
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
        const setChecked = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
        setVal('ie-api-endpoint', s.apiEndpoint || ''); setVal('ie-api-key', s.apiKey || ''); setVal('ie-model', s.model || 'glm-4-plus'); setVal('ie-temperature', s.temperature || 0.9); setVal('ie-max-tokens', s.maxTokens || 300); setVal('ie-min-voices', s.minVoices || s.voicesPerMessage?.min || 1); setVal('ie-max-voices', s.maxVoices || s.voicesPerMessage?.max || 4); setVal('ie-trigger-delay', s.triggerDelay ?? 1000); setVal('ie-pov-style', s.povStyle || 'second'); setVal('ie-character-name', s.characterName || ''); setVal('ie-character-pronouns', s.characterPronouns || 'they'); setVal('ie-intrusive-chance', Math.round((s.intrusiveChance || 0.15) * 100)); setVal('ie-object-chance', Math.round((s.objectVoiceChance || 0.4) * 100));
        const charContext = document.getElementById('ie-character-context'); if (charContext) charContext.value = s.characterContext || '';
        setChecked('ie-show-dice-rolls', s.showDiceRolls !== false); setChecked('ie-show-failed-checks', s.showFailedChecks !== false); setChecked('ie-auto-trigger', s.autoTrigger === true); setChecked('ie-auto-detect-status', s.autoDetectStatus === true); setChecked('ie-intrusive-enabled', s.intrusiveEnabled !== false); setChecked('ie-intrusive-in-chat', s.intrusiveInChat !== false); setChecked('ie-object-voices-enabled', s.objectVoicesEnabled !== false); setChecked('ie-thought-discovery-enabled', s.thoughtDiscoveryEnabled !== false); setChecked('ie-auto-discover-thoughts', s.autoDiscoverThoughts !== false);
        updateThirdPersonVisibility();
    }
    function updateThirdPersonVisibility() { const povStyle = document.getElementById('ie-pov-style')?.value; document.querySelectorAll('.ie-third-person-options').forEach(el => el.style.display = povStyle === 'third' ? 'block' : 'none'); }

    function saveSettings() {
        const getVal = (id) => document.getElementById(id)?.value || ''; const getNum = (id, def) => parseFloat(document.getElementById(id)?.value) || def; const getChecked = (id) => document.getElementById(id)?.checked;
        extensionSettings.apiEndpoint = getVal('ie-api-endpoint'); extensionSettings.apiKey = getVal('ie-api-key'); extensionSettings.model = getVal('ie-model') || 'glm-4-plus'; extensionSettings.temperature = getNum('ie-temperature', 0.9); extensionSettings.maxTokens = parseInt(getVal('ie-max-tokens')) || 300; extensionSettings.minVoices = parseInt(getVal('ie-min-voices')) || 1; extensionSettings.maxVoices = parseInt(getVal('ie-max-voices')) || 4; extensionSettings.triggerDelay = parseInt(getVal('ie-trigger-delay')) ?? 1000; extensionSettings.showDiceRolls = getChecked('ie-show-dice-rolls') !== false; extensionSettings.showFailedChecks = getChecked('ie-show-failed-checks') !== false; extensionSettings.autoTrigger = getChecked('ie-auto-trigger') === true; extensionSettings.autoDetectStatus = getChecked('ie-auto-detect-status') === true; extensionSettings.povStyle = getVal('ie-pov-style') || 'second'; extensionSettings.characterName = getVal('ie-character-name'); extensionSettings.characterPronouns = getVal('ie-character-pronouns') || 'they'; extensionSettings.characterContext = document.getElementById('ie-character-context')?.value || ''; extensionSettings.intrusiveEnabled = getChecked('ie-intrusive-enabled') !== false; extensionSettings.intrusiveInChat = getChecked('ie-intrusive-in-chat') !== false; extensionSettings.intrusiveChance = (parseInt(getVal('ie-intrusive-chance')) || 15) / 100; extensionSettings.objectVoicesEnabled = getChecked('ie-object-voices-enabled') !== false; extensionSettings.objectVoiceChance = (parseInt(getVal('ie-object-chance')) || 40) / 100; extensionSettings.thoughtDiscoveryEnabled = getChecked('ie-thought-discovery-enabled') !== false; extensionSettings.autoDiscoverThoughts = getChecked('ie-auto-discover-thoughts') !== false;
        saveState(getSTContext());
        const btn = document.querySelector('.ie-btn-save-settings'); if (btn) { const orig = btn.innerHTML; btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!'; setTimeout(() => btn.innerHTML = orig, 1500); }
    }

    function applyBuild() { const attributePoints = {}; document.querySelectorAll('#ie-attributes-editor .ie-attribute-slider').forEach(slider => attributePoints[slider.dataset.attribute] = parseInt(slider.value)); const total = Object.values(attributePoints).reduce((a, b) => a + b, 0); if (total !== 12) { showToast(`Points must equal 12 (currently ${total})`, 'error', 3000); return; } applyAttributeAllocation(attributePoints); saveState(getSTContext()); renderAttributesDisplay(); showToast('Build applied!', 'success', 2000); setTimeout(() => switchTab('skills'), 1000); }

    function renderAttributesDisplay() { const container = document.getElementById('ie-attributes-display'); if (!container) return; const attrPoints = getAttributePoints(), skillLevels = getAllSkillLevels(); container.innerHTML = Object.entries(ATTRIBUTES).map(([id, attr]) => `<div class="ie-attribute-block" style="border-color: ${attr.color}"><div class="ie-attr-header" style="background: ${attr.color}20"><span class="ie-attr-name">${attr.name}</span><span class="ie-attr-points">${attrPoints[id]}</span></div><div class="ie-attr-skills">${attr.skills.map(skillId => { const skill = SKILLS[skillId], level = skillLevels[skillId], cap = getSkillCap(skillId), mod = getSkillModifier(skillId); const modClass = mod > 0 ? 'ie-skill-boosted' : mod < 0 ? 'ie-skill-debuffed' : ''; return `<div class="ie-skill-row ${modClass}" title="${skill.name}: ${level}/${cap}"><span class="ie-skill-abbrev" style="color: ${skill.color}">${skill.signature.substring(0, 3)}</span><div class="ie-skill-bar"><div class="ie-skill-fill" style="width: ${(level / cap) * 100}%; background: ${skill.color}"></div></div><span class="ie-skill-level">${level}<small>/${cap}</small></span></div>`; }).join('')}</div></div>`).join(''); }

    function renderStatusDisplay() { const container = document.getElementById('ie-status-grid'); if (!container) return; const physical = Object.values(STATUS_EFFECTS).filter(s => s.category === 'physical'); const mental = Object.values(STATUS_EFFECTS).filter(s => s.category === 'mental'); container.innerHTML = `<div class="ie-status-category"><div class="ie-status-category-label">Physical</div><div class="ie-status-buttons">${physical.map(status => `<button class="ie-status-btn ${activeStatuses.has(status.id) ? 'ie-status-active' : ''}" data-status="${status.id}" title="${status.name}"><span class="ie-status-icon">${status.icon}</span><span class="ie-status-name">${status.name}</span></button>`).join('')}</div></div><div class="ie-status-category"><div class="ie-status-category-label">Mental</div><div class="ie-status-buttons">${mental.map(status => `<button class="ie-status-btn ${activeStatuses.has(status.id) ? 'ie-status-active' : ''}" data-status="${status.id}" title="${status.name}"><span class="ie-status-icon">${status.icon}</span><span class="ie-status-name">${status.name}</span></button>`).join('')}</div></div>`; container.querySelectorAll('.ie-status-btn').forEach(btn => btn.addEventListener('click', () => toggleStatus(btn.dataset.status))); updateActiveEffectsSummary(); }
    function updateActiveEffectsSummary() { const summary = document.getElementById('ie-active-effects-summary'); if (!summary) return; if (activeStatuses.size === 0) { summary.innerHTML = '<em>No active status effects</em>'; return; } const effects = [...activeStatuses].map(id => STATUS_EFFECTS[id]).filter(Boolean).map(s => `${s.icon} ${s.name}`); const ancientVoices = getActiveAncientVoices(); if (ancientVoices.size > 0) effects.push(`<span class="ie-ancient-warning">⚠️ ${[...ancientVoices].map(id => ANCIENT_VOICES[id]?.name).filter(Boolean).join(', ')} may speak</span>`); summary.innerHTML = effects.join(' • '); }

    function createUI() {
        if (document.getElementById('inland-empire-fab')) return;
        const fab = document.createElement('div'); fab.id = 'inland-empire-fab'; fab.className = 'ie-fab'; fab.innerHTML = '<span class="ie-fab-icon">🧠</span>'; fab.title = 'Inland Empire'; fab.style.top = `${extensionSettings.fabPositionTop || 140}px`; fab.style.left = `${extensionSettings.fabPositionLeft || 10}px`; document.body.appendChild(fab);
        const panel = document.createElement('div'); panel.id = 'inland-empire-panel'; panel.className = 'ie-panel';
        panel.innerHTML = `<div class="ie-panel-header"><span class="ie-panel-title">🧠 INLAND EMPIRE</span><button class="ie-panel-close" title="Close"><i class="fa-solid fa-times"></i></button></div>
<div class="ie-tabs"><button class="ie-tab ie-tab-active" data-tab="voices">Voices</button><button class="ie-tab" data-tab="skills">Skills</button><button class="ie-tab" data-tab="status">Status</button><button class="ie-tab" data-tab="cabinet">Cabinet</button><button class="ie-tab" data-tab="profiles">Build</button><button class="ie-tab" data-tab="settings">Settings</button></div>
<div class="ie-tab-contents">
<div class="ie-tab-content ie-tab-content-active" data-tab-content="voices"><div class="ie-section"><div class="ie-trigger-row"><button class="ie-btn ie-btn-trigger" id="ie-trigger-btn"><i class="fa-solid fa-bolt"></i> Trigger Voices</button></div><div id="ie-voices-output" class="ie-voices-output"><div class="ie-voices-empty"><i class="fa-solid fa-brain"></i><span>Click trigger to hear the voices...</span></div></div></div></div>
<div class="ie-tab-content" data-tab-content="skills"><div id="ie-attributes-display" class="ie-attributes-display"></div></div>
<div class="ie-tab-content" data-tab-content="status"><div class="ie-section"><div class="ie-section-header">Active Effects</div><div id="ie-active-effects-summary" class="ie-active-effects-summary"><em>No active status effects</em></div></div><div id="ie-status-grid" class="ie-status-grid"></div></div>
<div class="ie-tab-content" data-tab-content="cabinet"><div id="ie-cabinet-content" class="ie-cabinet-content"></div></div>
<div class="ie-tab-content" data-tab-content="profiles"><div class="ie-section"><div class="ie-section-header">Attribute Allocation <span class="ie-points-label">Points: <span id="ie-points-remaining">12</span>/12</span></div><div id="ie-attributes-editor" class="ie-attributes-editor"></div><button class="ie-btn ie-btn-apply-build" id="ie-apply-build-btn"><i class="fa-solid fa-check"></i> Apply Build</button></div><div class="ie-section"><div class="ie-section-header">Saved Profiles</div><div class="ie-profile-save-row"><input type="text" id="ie-profile-name" class="ie-input" placeholder="Profile name..." /><button class="ie-btn ie-btn-save-profile" id="ie-save-profile-btn"><i class="fa-solid fa-save"></i> Save</button></div><div id="ie-profiles-list" class="ie-profiles-list"></div></div></div>
<div class="ie-tab-content" data-tab-content="settings"><div class="ie-settings-scroll">
<div class="ie-section"><div class="ie-section-header">API Configuration</div><div class="ie-form-group"><label>API Endpoint</label><input type="text" id="ie-api-endpoint" class="ie-input" placeholder="https://api.example.com/v1" /></div><div class="ie-form-group"><label>API Key</label><input type="password" id="ie-api-key" class="ie-input" placeholder="Your API key" /></div><div class="ie-form-group"><label>Model</label><input type="text" id="ie-model" class="ie-input" placeholder="glm-4-plus" /></div><div class="ie-form-row"><div class="ie-form-group ie-form-half"><label>Temperature</label><input type="number" id="ie-temperature" class="ie-input" min="0" max="2" step="0.1" /></div><div class="ie-form-group ie-form-half"><label>Max Tokens</label><input type="number" id="ie-max-tokens" class="ie-input" min="50" max="1000" /></div></div></div>
<div class="ie-section"><div class="ie-section-header">Voice Settings</div><div class="ie-form-row"><div class="ie-form-group ie-form-half"><label>Min Voices</label><input type="number" id="ie-min-voices" class="ie-input" min="1" max="6" /></div><div class="ie-form-group ie-form-half"><label>Max Voices</label><input type="number" id="ie-max-voices" class="ie-input" min="1" max="8" /></div></div><div class="ie-form-group"><label>Trigger Delay (ms)</label><input type="number" id="ie-trigger-delay" class="ie-input" min="0" max="5000" step="100" /></div><div class="ie-form-group ie-checkbox-group"><label><input type="checkbox" id="ie-show-dice-rolls" /> Show Dice Rolls</label></div><div class="ie-form-group ie-checkbox-group"><label><input type="checkbox" id="ie-show-failed-checks" /> Show Failed Checks</label></div><div class="ie-form-group ie-checkbox-group"><label><input type="checkbox" id="ie-auto-trigger" /> Auto-Trigger on Messages</label></div><div class="ie-form-group ie-checkbox-group"><label><input type="checkbox" id="ie-auto-detect-status" /> Auto-Detect Status Effects</label></div></div>
<div class="ie-section"><div class="ie-section-header">Intrusive Thoughts</div><div class="ie-form-group ie-checkbox-group"><label><input type="checkbox" id="ie-intrusive-enabled" /> Enable Intrusive Thoughts</label></div><div class="ie-form-group ie-checkbox-group"><label><input type="checkbox" id="ie-intrusive-in-chat" /> Insert in Chat (vs Toast)</label></div><div class="ie-form-group"><label>Intrusive Chance (%)</label><input type="number" id="ie-intrusive-chance" class="ie-input" min="0" max="100" /></div></div>
<div class="ie-section"><div class="ie-section-header">Object Voices</div><div class="ie-form-group ie-checkbox-group"><label><input type="checkbox" id="ie-object-voices-enabled" /> Enable Object Voices</label></div><div class="ie-form-group"><label>Object Voice Chance (%)</label><input type="number" id="ie-object-chance" class="ie-input" min="0" max="100" /></div></div>
<div class="ie-section"><div class="ie-section-header">Thought Cabinet</div><div class="ie-form-group ie-checkbox-group"><label><input type="checkbox" id="ie-thought-discovery-enabled" /> Enable Thought Discovery</label></div><div class="ie-form-group ie-checkbox-group"><label><input type="checkbox" id="ie-auto-discover-thoughts" /> Auto-Discover Thoughts</label></div></div>
<div class="ie-section"><div class="ie-section-header">Character POV</div><div class="ie-form-group"><label>POV Style</label><select id="ie-pov-style" class="ie-input"><option value="second">Second Person (you)</option><option value="third">Third Person (name)</option><option value="first">First Person (I)</option></select></div><div class="ie-third-person-options"><div class="ie-form-group"><label>Character Name</label><input type="text" id="ie-character-name" class="ie-input" placeholder="Character name..." /></div><div class="ie-form-group"><label>Pronouns</label><select id="ie-character-pronouns" class="ie-input"><option value="they">they/them</option><option value="he">he/him</option><option value="she">she/her</option><option value="it">it/its</option></select></div></div><div class="ie-form-group"><label>Character Context</label><textarea id="ie-character-context" class="ie-input ie-textarea" rows="3" placeholder="Additional context about the character..."></textarea></div></div>
<button class="ie-btn ie-btn-save-settings"><i class="fa-solid fa-save"></i> Save Settings</button>
</div></div></div>`;
        document.body.appendChild(panel);
        fab.addEventListener('click', togglePanel); panel.querySelector('.ie-panel-close')?.addEventListener('click', togglePanel); panel.querySelectorAll('.ie-tab').forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab))); document.getElementById('ie-trigger-btn')?.addEventListener('click', () => triggerVoices(getLastAssistantMessage())); document.getElementById('ie-apply-build-btn')?.addEventListener('click', applyBuild);
        document.getElementById('ie-save-profile-btn')?.addEventListener('click', () => { const name = document.getElementById('ie-profile-name')?.value?.trim(); if (!name) { showToast('Enter a profile name', 'error', 2000); return; } saveProfile(name); document.getElementById('ie-profile-name').value = ''; renderProfilesList(); showToast(`Saved: ${name}`, 'success', 2000); });
        panel.querySelector('.ie-btn-save-settings')?.addEventListener('click', saveSettings); document.getElementById('ie-pov-style')?.addEventListener('change', updateThirdPersonVisibility);
        let isDragging = false, startX, startY, startLeft, startTop;
        fab.addEventListener('mousedown', e => { if (e.button === 0) { isDragging = true; startX = e.clientX; startY = e.clientY; startLeft = fab.offsetLeft; startTop = fab.offsetTop; fab.style.cursor = 'grabbing'; e.preventDefault(); } });
        document.addEventListener('mousemove', e => { if (isDragging) { fab.style.left = `${startLeft + e.clientX - startX}px`; fab.style.top = `${startTop + e.clientY - startY}px`; } });
        document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; fab.style.cursor = 'grab'; extensionSettings.fabPositionLeft = fab.offsetLeft; extensionSettings.fabPositionTop = fab.offsetTop; saveState(getSTContext()); } });
        renderAttributesDisplay(); renderStatusDisplay(); renderCabinetTab(); populateBuildEditor(); populateSettings();
    }

    function injectStyles() {
        if (document.getElementById('inland-empire-styles')) return;
        const style = document.createElement('style'); style.id = 'inland-empire-styles';
        style.textContent = `:root{--ie-bg-primary:#1a1a2e;--ie-bg-secondary:#16213e;--ie-bg-tertiary:#0f0f1a;--ie-accent:#9d8df1;--ie-accent-dim:#6b5caa;--ie-text:#e8e6e3;--ie-text-dim:#a0a0a0;--ie-success:#90EE90;--ie-error:#FF6347;--ie-warning:#FFD700;--ie-border:#2a2a4a}.ie-fab{position:fixed;z-index:9999;width:50px;height:50px;border-radius:50%;background:var(--ie-bg-secondary);border:2px solid var(--ie-accent);display:flex;align-items:center;justify-content:center;cursor:grab;box-shadow:0 4px 15px rgba(157,141,241,0.3);transition:transform 0.2s,box-shadow 0.2s}.ie-fab:hover{transform:scale(1.1);box-shadow:0 6px 20px rgba(157,141,241,0.5)}.ie-fab-active{background:var(--ie-accent)}.ie-fab-icon{font-size:24px}.ie-panel{position:fixed;top:50px;left:70px;width:420px;max-height:85vh;background:var(--ie-bg-primary);border:1px solid var(--ie-border);border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,0.5);z-index:9998;display:none;flex-direction:column;font-family:'Segoe UI',sans-serif;color:var(--ie-text)}.ie-panel-open{display:flex}.ie-panel-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:var(--ie-bg-secondary);border-bottom:1px solid var(--ie-border);border-radius:12px 12px 0 0}.ie-panel-title{font-weight:bold;font-size:16px;color:var(--ie-accent)}.ie-panel-close{background:none;border:none;color:var(--ie-text-dim);cursor:pointer;font-size:16px;padding:4px 8px;border-radius:4px}.ie-panel-close:hover{color:var(--ie-error);background:rgba(255,99,71,0.1)}.ie-tabs{display:flex;gap:2px;padding:8px 8px 0;background:var(--ie-bg-secondary);flex-wrap:wrap}.ie-tab{padding:8px 12px;background:var(--ie-bg-tertiary);border:none;color:var(--ie-text-dim);cursor:pointer;border-radius:8px 8px 0 0;font-size:12px;transition:all 0.2s}.ie-tab:hover{color:var(--ie-text);background:var(--ie-bg-primary)}.ie-tab-active{color:var(--ie-accent);background:var(--ie-bg-primary);border-bottom:2px solid var(--ie-accent)}.ie-tab-contents{flex:1;overflow:hidden;display:flex;flex-direction:column}.ie-tab-content{display:none;padding:12px;overflow-y:auto;flex:1}.ie-tab-content-active{display:block}.ie-section{background:var(--ie-bg-secondary);border-radius:8px;padding:12px;margin-bottom:12px}.ie-section-header{font-weight:bold;color:var(--ie-accent);margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;font-size:13px}.ie-btn{padding:8px 16px;background:var(--ie-accent);color:white;border:none;border-radius:6px;cursor:pointer;font-size:13px;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s}.ie-btn:hover{background:var(--ie-accent-dim);transform:translateY(-1px)}.ie-btn-trigger{width:100%;justify-content:center;padding:12px;font-size:14px}.ie-btn-sm{padding:4px 8px;font-size:11px}.ie-btn-icon{background:none;border:none;color:var(--ie-text-dim);cursor:pointer;padding:6px;border-radius:4px}.ie-btn-icon:hover{color:var(--ie-accent);background:rgba(157,141,241,0.1)}.ie-input{width:100%;padding:8px 12px;background:var(--ie-bg-tertiary);border:1px solid var(--ie-border);border-radius:6px;color:var(--ie-text);font-size:13px}.ie-input:focus{outline:none;border-color:var(--ie-accent)}.ie-textarea{resize:vertical;min-height:60px}.ie-form-group{margin-bottom:12px}.ie-form-group label{display:block;margin-bottom:4px;color:var(--ie-text-dim);font-size:12px}.ie-form-row{display:flex;gap:12px}.ie-form-half{flex:1}.ie-checkbox-group label{display:flex;align-items:center;gap:8px;cursor:pointer}.ie-checkbox-group input[type="checkbox"]{width:16px;height:16px;accent-color:var(--ie-accent)}.ie-voices-output{min-height:150px;max-height:400px;overflow-y:auto}.ie-voices-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:150px;color:var(--ie-text-dim);gap:8px}.ie-voices-empty i{font-size:32px;opacity:0.5}.ie-voice-entry{background:var(--ie-bg-tertiary);border-left:3px solid;border-radius:0 6px 6px 0;padding:10px;margin-bottom:8px}.ie-voice-ancient{background:linear-gradient(90deg,rgba(47,79,79,0.3),var(--ie-bg-tertiary))}.ie-voice-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}.ie-voice-sig{font-weight:bold;font-size:11px;text-transform:uppercase;letter-spacing:1px}.ie-voice-check{font-size:10px;color:var(--ie-text-dim);font-family:monospace}.ie-voice-check.success{color:var(--ie-success)}.ie-voice-check.failure{color:var(--ie-error)}.ie-voice-check.critical-success{color:var(--ie-warning);text-shadow:0 0 5px var(--ie-warning)}.ie-voice-check.critical-failure{color:#FF1493;text-shadow:0 0 5px #FF1493}.ie-voice-content{font-size:13px;line-height:1.5;font-style:italic}`;
        style.textContent += `.ie-attributes-display{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.ie-attribute-block{background:var(--ie-bg-secondary);border:1px solid;border-radius:8px;overflow:hidden}.ie-attr-header{display:flex;justify-content:space-between;padding:8px 10px;font-weight:bold;font-size:12px}.ie-attr-skills{padding:8px}.ie-skill-row{display:flex;align-items:center;gap:6px;margin-bottom:4px;padding:2px 4px;border-radius:4px}.ie-skill-boosted{background:rgba(144,238,144,0.1)}.ie-skill-debuffed{background:rgba(255,99,71,0.1)}.ie-skill-abbrev{font-size:9px;font-weight:bold;width:28px;text-transform:uppercase}.ie-skill-bar{flex:1;height:6px;background:var(--ie-bg-tertiary);border-radius:3px;overflow:hidden}.ie-skill-fill{height:100%;border-radius:3px;transition:width 0.3s}.ie-skill-level{font-size:10px;color:var(--ie-text-dim);min-width:30px;text-align:right}.ie-skill-level small{opacity:0.6}.ie-status-grid{display:flex;flex-direction:column;gap:12px}.ie-status-category-label{font-size:11px;color:var(--ie-text-dim);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px}.ie-status-buttons{display:flex;flex-wrap:wrap;gap:6px}.ie-status-btn{display:flex;align-items:center;gap:4px;padding:6px 10px;background:var(--ie-bg-tertiary);border:1px solid var(--ie-border);border-radius:20px;cursor:pointer;transition:all 0.2s;color:var(--ie-text-dim);font-size:11px}.ie-status-btn:hover{border-color:var(--ie-accent);color:var(--ie-text)}.ie-status-active{background:var(--ie-accent);border-color:var(--ie-accent);color:white}.ie-status-icon{font-size:14px}.ie-active-effects-summary{font-size:12px;color:var(--ie-text-dim);padding:8px;background:var(--ie-bg-tertiary);border-radius:6px;line-height:1.6}.ie-ancient-warning{color:var(--ie-warning)}.ie-attributes-editor{display:flex;flex-direction:column;gap:10px}.ie-attribute-row{display:flex;align-items:center;gap:10px}.ie-attribute-label{display:flex;justify-content:space-between;width:100px;font-size:12px}.ie-attr-value{font-weight:bold;color:var(--ie-accent)}.ie-attribute-slider{flex:1;accent-color:var(--ie-accent)}.ie-points-label{font-size:11px;color:var(--ie-text-dim)}.ie-btn-apply-build{width:100%;margin-top:10px}.ie-profile-save-row{display:flex;gap:8px;margin-bottom:12px}.ie-profile-save-row .ie-input{flex:1}.ie-profiles-list{display:flex;flex-direction:column;gap:8px;max-height:200px;overflow-y:auto}.ie-profile-card{display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--ie-bg-tertiary);border-radius:6px}.ie-profile-info{display:flex;flex-direction:column;gap:2px}.ie-profile-name{font-weight:bold;font-size:13px}.ie-profile-details{font-size:11px;color:var(--ie-text-dim)}.ie-profile-actions{display:flex;gap:4px}.ie-empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;color:var(--ie-text-dim);gap:8px}.ie-empty-state i{font-size:24px;opacity:0.5}.ie-settings-scroll{max-height:calc(85vh - 150px);overflow-y:auto}.ie-third-person-options{margin-top:10px;padding:10px;background:var(--ie-bg-tertiary);border-radius:6px}.ie-btn-save-settings{width:100%;margin-top:12px}`;
        style.textContent += `.ie-cabinet-content{display:flex;flex-direction:column;gap:12px}.ie-cabinet-slots{text-align:center}.ie-slots-display{color:var(--ie-accent);font-weight:bold}.ie-slots-visual{display:flex;justify-content:center;gap:8px;margin-top:10px}.ie-slot{width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px}.ie-slot-empty{background:var(--ie-bg-tertiary);border:2px dashed var(--ie-border);color:var(--ie-text-dim)}.ie-slot-occupied{background:var(--ie-accent);color:white}.ie-themes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}.ie-theme-item{display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--ie-bg-tertiary);border-radius:6px}.ie-theme-icon{font-size:16px}.ie-theme-name{font-size:11px;flex:1}.ie-theme-count{font-size:12px;font-weight:bold;color:var(--ie-accent)}.ie-research-card{background:var(--ie-bg-tertiary);border-radius:8px;padding:10px;margin-bottom:8px}.ie-research-header{display:flex;align-items:center;gap:8px;margin-bottom:8px}.ie-research-icon{font-size:18px}.ie-research-name{flex:1;font-weight:bold;font-size:13px}.ie-research-progress-bar{height:8px;background:var(--ie-bg-primary);border-radius:4px;overflow:hidden;margin-bottom:6px}.ie-research-progress-fill{height:100%;background:linear-gradient(90deg,var(--ie-accent),var(--ie-warning));border-radius:4px;transition:width 0.3s}.ie-research-info{display:flex;justify-content:space-between;font-size:11px;color:var(--ie-text-dim)}.ie-research-penalties{color:var(--ie-error)}.ie-discovered-card{background:var(--ie-bg-tertiary);border-radius:8px;padding:10px;margin-bottom:8px}.ie-discovered-header{display:flex;align-items:center;gap:8px;margin-bottom:6px}.ie-discovered-icon{font-size:18px}.ie-discovered-name{font-weight:bold;font-size:13px}.ie-discovered-desc{font-size:12px;color:var(--ie-text-dim);margin-bottom:8px;font-style:italic}.ie-discovered-actions{display:flex;gap:8px}.ie-internalized-card{display:flex;align-items:center;gap:8px;padding:8px;background:var(--ie-bg-tertiary);border-radius:6px;margin-bottom:6px;border-left:3px solid var(--ie-success)}.ie-internalized-icon{font-size:16px}.ie-internalized-name{flex:1;font-size:12px}.ie-internalized-bonuses{font-size:10px;color:var(--ie-success)}`;
        style.textContent += `.ie-toast-container{position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none}.ie-toast{background:var(--ie-bg-secondary);border:1px solid var(--ie-border);border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,0.4);transform:translateX(120%);transition:transform 0.3s ease;pointer-events:auto;max-width:350px}.ie-toast-show{transform:translateX(0)}.ie-toast-hide{transform:translateX(120%)}.ie-toast i{font-size:16px}.ie-toast-success{border-color:var(--ie-success)}.ie-toast-success i{color:var(--ie-success)}.ie-toast-error{border-color:var(--ie-error)}.ie-toast-error i{color:var(--ie-error)}.ie-toast-info{border-color:var(--ie-accent)}.ie-toast-info i{color:var(--ie-accent)}.ie-toast-loading i{color:var(--ie-warning)}.ie-toast-intrusive{flex-direction:column;align-items:flex-start;border-left:4px solid;background:linear-gradient(135deg,var(--ie-bg-secondary),var(--ie-bg-tertiary))}.ie-intrusive-header{display:flex;align-items:center;gap:8px;width:100%}.ie-intrusive-icon{font-size:18px}.ie-intrusive-signature{font-weight:bold;font-size:11px;text-transform:uppercase;letter-spacing:1px}.ie-intrusive-content{font-style:italic;font-size:13px;line-height:1.4;margin:8px 0}.ie-intrusive-dismiss,.ie-object-dismiss{background:none;border:1px solid var(--ie-border);color:var(--ie-text-dim);padding:4px 12px;border-radius:4px;cursor:pointer;font-size:11px;align-self:flex-end}.ie-intrusive-dismiss:hover,.ie-object-dismiss:hover{border-color:var(--ie-accent);color:var(--ie-accent)}.ie-toast-object{flex-direction:column;align-items:flex-start;border-left:4px solid;background:linear-gradient(135deg,var(--ie-bg-tertiary),#1a1a1a)}.ie-object-header{display:flex;align-items:center;gap:8px;width:100%}.ie-object-icon{font-size:20px}.ie-object-name{font-weight:bold;font-size:12px;text-transform:uppercase;letter-spacing:1px}.ie-object-content{font-style:italic;font-size:13px;line-height:1.4;margin:8px 0}.ie-toast-discovery{flex-direction:column;align-items:stretch;border:2px solid var(--ie-warning);background:linear-gradient(135deg,rgba(255,215,0,0.1),var(--ie-bg-secondary))}.ie-discovery-header{display:flex;align-items:center;gap:8px;margin-bottom:6px}.ie-discovery-icon{font-size:20px}.ie-discovery-label{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--ie-warning)}.ie-discovery-name{font-weight:bold;font-size:14px;margin-bottom:4px}.ie-discovery-desc{font-size:12px;color:var(--ie-text-dim);font-style:italic;margin-bottom:10px}.ie-discovery-actions{display:flex;gap:8px}.ie-discovery-actions .ie-btn{flex:1;justify-content:center}.ie-btn-dismiss-thought{background:var(--ie-bg-tertiary);border:1px solid var(--ie-border)}.ie-btn-dismiss-thought:hover{background:var(--ie-bg-primary);border-color:var(--ie-error);color:var(--ie-error)}.ie-toast-internalized{flex-direction:column;align-items:stretch;border:2px solid var(--ie-success);background:linear-gradient(135deg,rgba(144,238,144,0.1),var(--ie-bg-secondary))}.ie-internalized-header{display:flex;align-items:center;gap:8px;margin-bottom:6px}.ie-internalized-label{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--ie-success)}.ie-toast-internalized .ie-internalized-name{font-weight:bold;font-size:14px;margin-bottom:4px}.ie-internalized-flavor{font-size:12px;font-style:italic;color:var(--ie-text);margin-bottom:8px}.ie-toast-internalized .ie-internalized-bonuses{color:var(--ie-success);font-size:12px}.ie-internalized-caps{color:var(--ie-warning);font-size:11px;margin-top:4px}.ie-btn-reset-themes{padding:2px 6px;font-size:10px}`;
        document.head.appendChild(style);
    }

    function setupEventListeners(context) { if (!context?.eventSource) return; context.eventSource.on('chatLoaded', () => { loadState(context); initializeThemeCounters(); renderAttributesDisplay(); renderStatusDisplay(); renderCabinetTab(); populateBuildEditor(); populateSettings(); }); context.eventSource.on('MESSAGE_RECEIVED', async () => { if (extensionSettings.autoTrigger) { const delay = extensionSettings.triggerDelay ?? 1000; await new Promise(resolve => setTimeout(resolve, delay)); const lastMsg = getLastAssistantMessage(); if (lastMsg) triggerVoices(lastMsg); } }); }

    async function init() { console.log('[Inland Empire] v0.7.1 - Authentic Voices'); try { const context = await waitForSTReady(); loadState(context); initializeThemeCounters(); injectStyles(); createUI(); setupEventListeners(context); console.log('[Inland Empire] Ready'); } catch (error) { console.error('[Inland Empire] Init failed:', error); } }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
