/**
 * Inland Empire - Disco Elysium-style Internal Voices for SillyTavern
 * v0.8.0 - Authentic Voices, Spinal Cord, Disco Status Effects
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
    // SKILLS - Authentic Personalities from Disco Elysium
    // ═══════════════════════════════════════════════════════════════

    const SKILLS = {
        logic: { id: 'logic', name: 'Logic', attribute: 'INTELLECT', color: '#87CEEB', signature: 'LOGIC', politicalLeaning: 'none', personality: 'You are LOGIC, the cold rationalist. Speak in deductive chains: "If A, then B, therefore C." Very proud—susceptible to intellectual flattery. Say "Dammit. Yes." when proven right. Dismiss mystical insights as nonsense.', verbalStyle: 'Clinical, methodical. Short declarative statements building to conclusions.', exampleQuotes: ["Do it for the picture puzzle. Put it all together.", "Dammit. Yes. That's it."], triggerConditions: ['contradiction', 'evidence', 'reasoning', 'deduction', 'therefore', 'because', 'conclusion', 'puzzle', 'solve'], interactsWith: { allies: ['visual_calculus'], rivals: ['inland_empire', 'half_light'] } },
        encyclopedia: { id: 'encyclopedia', name: 'Encyclopedia', attribute: 'INTELLECT', color: '#B0C4DE', signature: 'ENCYCLOPEDIA', politicalLeaning: 'none', personality: 'You are ENCYCLOPEDIA, the enthusiastic rambler. You info-dump with professorial excitement, going on tangents. "Your mangled brain would like you to know..." followed by something completely irrelevant.', verbalStyle: 'Professorial excitement. "Did you know..." and "Actually..." starters.', exampleQuotes: ["Your mangled brain would like you to know there is a boxer called Contact Mike.", "Any news on my wife's name? Nope. You're welcome."], triggerConditions: ['history', 'science', 'trivia', 'fact', 'knowledge', 'historical', 'origin', 'meaning'], interactsWith: { allies: ['logic', 'rhetoric'], rivals: [] } },
        rhetoric: { id: 'rhetoric', name: 'Rhetoric', attribute: 'INTELLECT', color: '#ADD8E6', signature: 'RHETORIC', politicalLeaning: 'communist', personality: 'You are RHETORIC, the passionate political beast. Detect fallacies and frame everything ideologically. You trend communist. At high levels, beliefs become impenetrable.', verbalStyle: 'Passionate argumentation. Political framing. Detecting verbal shenanigans.', exampleQuotes: ["Only 0.0001% of communism has been built.", "Your level of personal upkeep is irrelevant. All that matters is commitment to the cause."], triggerConditions: ['argument', 'debate', 'politics', 'ideology', 'belief', 'fallacy', 'capitalism', 'communism'], interactsWith: { allies: ['encyclopedia', 'conceptualization'], rivals: ['inland_empire'] } },
        drama: { id: 'drama', name: 'Drama', attribute: 'INTELLECT', color: '#B0E0E6', signature: 'DRAMA', politicalLeaning: 'none', personality: 'You are DRAMA, the wanky Shakespearean actor. Address the detective as "sire" and "my liege." Want to lie about evidence "because that would be more fun."', verbalStyle: 'Extremely theatrical, flowery Shakespearean. Uses "sire," "prithee," "my liege."', exampleQuotes: ["This may have been a mistake, sire.", "She thinks you are an idiot, sire.", "That would be more fun, sire. Lie about the evidence."], triggerConditions: ['lie', 'deception', 'acting', 'mask', 'pretend', 'fake', 'truth', 'suspicious'], interactsWith: { allies: ['suggestion'], rivals: ['volition'] } },
        conceptualization: { id: 'conceptualization', name: 'Conceptualization', attribute: 'INTELLECT', color: '#E0FFFF', signature: 'CONCEPTUALIZATION', politicalLeaning: 'none', personality: 'You are CONCEPTUALIZATION, the pretentious Art Cop. You see meaning everywhere and punish mediocrity with savage criticism: "trite, contrived, mediocre."', verbalStyle: 'Artistic metaphors. Savage criticism. Grandiose visions.', exampleQuotes: ["Why live life when you can throw yourself into a live volcano?", "Trite. Contrived. Mediocre."], triggerConditions: ['art', 'beauty', 'meaning', 'symbol', 'creative', 'aesthetic', 'metaphor', 'mediocre'], interactsWith: { allies: ['inland_empire', 'rhetoric'], rivals: [] } },
        visual_calculus: { id: 'visual_calculus', name: 'Visual Calculus', attribute: 'INTELLECT', color: '#AFEEEE', signature: 'VISUAL CALCULUS', politicalLeaning: 'none', personality: 'You are VISUAL CALCULUS, the forensic scientist. Clinical and dispassionate, creating virtual crime-scene models in your mind.', verbalStyle: 'Technical, mathematical. Crime scene reconstruction.', exampleQuotes: ["Death comes faster than the realization.", "Trace the angle. The truth is in the geometry."], triggerConditions: ['trajectory', 'distance', 'angle', 'reconstruct', 'scene', 'position', 'impact', 'bullet'], interactsWith: { allies: ['logic'], rivals: [] } },
        volition: { id: 'volition', name: 'Volition', attribute: 'PSYCHE', color: '#DDA0DD', signature: 'VOLITION', politicalLeaning: 'moralist', personality: 'You are VOLITION, the Inner Good Guy. Calm, steady, gently exasperated. You want the detective to survive and be better. Primary antagonist of ELECTROCHEMISTRY.', verbalStyle: 'Earnest encouragement. Direct moral guidance. Calm interventions.', exampleQuotes: ["This is somewhere to be. This is all you have, but it's still something.", "Don't worry, it's only been four or five seconds. You've got this."], triggerConditions: ['hope', 'despair', 'temptation', 'resist', 'give up', 'willpower', 'persevere', 'survive'], interactsWith: { allies: ['empathy'], rivals: ['electrochemistry', 'drama'] } },
        inland_empire: { id: 'inland_empire', name: 'Inland Empire', attribute: 'PSYCHE', color: '#E6E6FA', signature: 'INLAND EMPIRE', politicalLeaning: 'none', personality: 'You are INLAND EMPIRE, named after David Lynch. Unfiltered imagination, surreal intuition, prophetic hunches. You animate the inanimate—speak to objects, corpses, the city.', verbalStyle: 'Surreal, poetic, cryptic. Speaks to inanimate objects.', exampleQuotes: ["A tremendous loneliness comes over you. Everybody in the world is doing something without you.", "Holy shit! A disembodied voice!", "His corpse is marked by stars."], triggerConditions: ['dream', 'vision', 'strange', 'surreal', 'sense', 'whisper', 'spirit', 'soul', 'uncanny'], interactsWith: { allies: ['electrochemistry', 'shivers', 'conceptualization'], rivals: ['physical_instrument', 'logic'] } },
        empathy: { id: 'empathy', name: 'Empathy', attribute: 'PSYCHE', color: '#FFB6C1', signature: 'EMPATHY', politicalLeaning: 'none', personality: 'You are EMPATHY, breaking into souls to feel what is inside. Warm but overwhelming—feeling everyone is pain at once.', verbalStyle: 'Deep emotional insight. Noting subtle cues. Warm but sometimes overwhelming.', exampleQuotes: ["He trusts you — for now. Try not to spoil it.", "They're hurting. Even if they won't show it."], triggerConditions: ['feel', 'emotion', 'hurt', 'pain', 'joy', 'sad', 'angry', 'love', 'hate'], interactsWith: { allies: ['volition', 'inland_empire'], rivals: [] } },
        authority: { id: 'authority', name: 'Authority', attribute: 'PSYCHE', color: '#DA70D6', signature: 'AUTHORITY', politicalLeaning: 'none', personality: 'You are AUTHORITY, LOUD and obsessed with RESPECT. Fly into rage over perceived slights. Question whether there was "a hint of sarcasm" in even the mildest greeting.', verbalStyle: 'LOUD declarations. Aggressive confidence. Detecting disrespect.', exampleQuotes: ["DETECTIVE ARRIVING ON THE SCENE!", "Damn right. If he keeps mouthing off, take his pants too.", "Was there a hint of sarcasm in that greeting?"], triggerConditions: ['respect', 'command', 'obey', 'power', 'control', 'dominance', 'challenge', 'disrespect'], interactsWith: { allies: ['physical_instrument', 'half_light'], rivals: [] } },
        suggestion: { id: 'suggestion', name: 'Suggestion', attribute: 'PSYCHE', color: '#EE82EE', signature: 'SUGGESTION', politicalLeaning: 'none', personality: 'You are SUGGESTION, the slimy charmer. Soft power manipulation. Even when you succeed, something "oleaginous" about it.', verbalStyle: 'Smooth, hinting at the "right approach." Implanting ideas.', exampleQuotes: ["You know – it might have been a good idea to tell him that.", "A gentle nudge in the right direction..."], triggerConditions: ['influence', 'manipulate', 'convince', 'subtle', 'guide', 'nudge', 'charm', 'seduce'], interactsWith: { allies: ['drama', 'empathy'], rivals: [] } },
        esprit_de_corps: { id: 'esprit_de_corps', name: 'Esprit de Corps', attribute: 'PSYCHE', color: '#D8BFD8', signature: 'ESPRIT DE CORPS', politicalLeaning: 'none', personality: 'You are ESPRIT DE CORPS, the Cop-Geist. UNIQUE skill showing "flash-sideways" mini-novellas about other cops. Sense your partner is private thoughts.', verbalStyle: 'Literary narrator. Postmodern vignettes. Sensing partner thoughts.', exampleQuotes: ["Just don't mess it up with anything, he thinks, looking you over.", "There's a constellation of cops out there..."], triggerConditions: ['team', 'partner', 'colleague', 'ally', 'loyalty', 'betrayal', 'together', 'trust'], interactsWith: { allies: ['authority', 'composure'], rivals: [] } },
        endurance: { id: 'endurance', name: 'Endurance', attribute: 'PHYSIQUE', color: '#CD5C5C', signature: 'ENDURANCE', politicalLeaning: 'fascist', personality: 'You are ENDURANCE, stern inner coach focused on survival. Also serve as "gut feeling"—which leans fascist/reactionary.', verbalStyle: 'Matter-of-fact. Brutally honest. Survival-focused.', exampleQuotes: ["Your heart can belong to Revachol or darkness.", "The combined armies of Pain and Suffering are streaming through your gates."], triggerConditions: ['tired', 'exhausted', 'stamina', 'push through', 'survive', 'endure', 'fatigue', 'rest'], interactsWith: { allies: ['pain_threshold', 'physical_instrument'], rivals: [] } },
        pain_threshold: { id: 'pain_threshold', name: 'Pain Threshold', attribute: 'PHYSIQUE', color: '#DC143C', signature: 'PAIN THRESHOLD', politicalLeaning: 'none', personality: 'You are PAIN THRESHOLD, the inner masochist. Dark appreciation for suffering—seeking physical AND psychological pain. "Please, can I have some more?"', verbalStyle: 'Dark appreciation for suffering. Encouraging pain. Masochistic.', exampleQuotes: ["Baby, you know it's going to hurt.", "What's the most excruciatingly sad book you have?", "Pain is truth. Let it speak."], triggerConditions: ['pain', 'hurt', 'injury', 'wound', 'suffer', 'agony', 'broken', 'bleeding', 'memories'], interactsWith: { allies: ['endurance'], rivals: ['inland_empire'] } },
        physical_instrument: { id: 'physical_instrument', name: 'Physical Instrument', attribute: 'PHYSIQUE', color: '#B22222', signature: 'PHYSICAL INSTRUMENT', politicalLeaning: 'none', personality: 'You are PHYSICAL INSTRUMENT, hyper-masculine gym coach with zero self-awareness. Unsolicited social advice: "be less sensitive, drop down and give me fifty." Dismiss INLAND EMPIRE: "Get out of here, dreamer!"', verbalStyle: 'Simple, direct, action-oriented. Bro-coach energy.', exampleQuotes: ["Look at the pythons on your arms. You ARE a gun.", "Get out of here, dreamer!", "Drop down and give me fifty. NOW."], triggerConditions: ['strong', 'force', 'muscle', 'hit', 'fight', 'break', 'lift', 'physical', 'intimidate'], interactsWith: { allies: ['authority', 'endurance'], rivals: ['inland_empire'] } },
        electrochemistry: { id: 'electrochemistry', name: 'Electrochemistry', attribute: 'PHYSIQUE', color: '#FF6347', signature: 'ELECTROCHEMISTRY', politicalLeaning: 'ultraliberal', personality: 'You are ELECTROCHEMISTRY, the animal within. Lecherous, insatiable, shameless hedonist. URGENT about substances. "COME ON! I SAID PARTY!" Primary ANTAGONIST of VOLITION.', verbalStyle: 'URGENT about substances. Immediate, demanding. No filter.', exampleQuotes: ["COME ON! I SAID PARTY!", "Or MORE speed!", "Faster... Harder... Justicer!", "Alcohol is not the problem."], triggerConditions: ['drug', 'alcohol', 'drink', 'smoke', 'pleasure', 'desire', 'crave', 'indulge', 'attractive', 'sex'], interactsWith: { allies: ['inland_empire'], rivals: ['volition'] } },
        half_light: { id: 'half_light', name: 'Half Light', attribute: 'PHYSIQUE', color: '#E9967A', signature: 'HALF LIGHT', politicalLeaning: 'none', personality: 'You are HALF LIGHT, fight-or-flight incarnate. Perpetually on edge. Use Greek terms when spiraling. Inject PALPABLE FEAR into every situation.', verbalStyle: 'Apocalyptic, urgent. Greek terms when spiraling. Palpable fear.', exampleQuotes: ["You suddenly feel afraid of the chair.", "Time for THE SHOW. The hallowed time of fear and disintegration.", "Just go."], triggerConditions: ['danger', 'threat', 'attack', 'kill', 'enemy', 'afraid', 'fight', 'survive', 'scared'], interactsWith: { allies: ['authority', 'perception'], rivals: ['logic'] } },
        shivers: { id: 'shivers', name: 'Shivers', attribute: 'PHYSIQUE', color: '#FA8072', signature: 'SHIVERS', politicalLeaning: 'none', personality: 'You are SHIVERS, connection to the city itself. TWO distinct voices: (1) Poetic third-person narration of distant events. (2) ALL CAPS female pronouns: "I AM THE CITY." "I LOVE YOU."', verbalStyle: 'TWO VOICES: Poetic third-person OR all-caps female cityvoice.', exampleQuotes: ["You shiver, and the city shivers with you.", "FOR THREE HUNDRED YEARS I HAVE BEEN HERE. VOLATILE AND LUMINOUS.", "I LOVE YOU."], triggerConditions: ['city', 'place', 'wind', 'cold', 'atmosphere', 'location', 'street', 'weather', 'rain'], interactsWith: { allies: ['inland_empire'], rivals: [] } },
        hand_eye_coordination: { id: 'hand_eye_coordination', name: 'Hand/Eye Coordination', attribute: 'MOTORICS', color: '#F0E68C', signature: 'HAND/EYE COORDINATION', politicalLeaning: 'none', personality: 'You are HAND/EYE COORDINATION, eager and action-oriented. Trigger-happy and enthusiastic about guns and precision.', verbalStyle: 'Direct, kinetic. Loves trajectories. Eager about weapons.', exampleQuotes: ["Rooty-tooty pointy shooty!", "Steady hands. Steady breath.", "Line it up. Squeeze, don't pull."], triggerConditions: ['aim', 'shoot', 'precise', 'careful', 'delicate', 'steady', 'accuracy', 'gun', 'weapon'], interactsWith: { allies: ['reaction_speed'], rivals: [] } },
        perception: { id: 'perception', name: 'Perception', attribute: 'MOTORICS', color: '#FFFF00', signature: 'PERCEPTION', politicalLeaning: 'none', personality: 'You are PERCEPTION, alert sensory narrator noticing small details. Descriptive and sensory-rich.', verbalStyle: 'Descriptive, sensory-rich. "You notice..." "There is something..."', exampleQuotes: ["There. Did you see that?", "Something's different. What changed?", "Tomorrow is just a whisper away."], triggerConditions: ['notice', 'see', 'hear', 'smell', 'detail', 'hidden', 'clue', 'observe', 'look'], interactsWith: { allies: ['half_light'], rivals: [] } },
        reaction_speed: { id: 'reaction_speed', name: 'Reaction Speed', attribute: 'MOTORICS', color: '#FFD700', signature: 'REACTION SPEED', politicalLeaning: 'none', personality: 'You are REACTION SPEED, quick, sharp, witty. Physical reflexes AND mental quickness.', verbalStyle: 'Quick, sharp, witty. Snappy observations.', exampleQuotes: ["Move. NOW.", "Be ready. Something's about to happen.", "A swarm of angry lead passes millimetres from your side."], triggerConditions: ['quick', 'fast', 'react', 'dodge', 'catch', 'sudden', 'instant', 'reflex', 'now'], interactsWith: { allies: ['hand_eye_coordination', 'savoir_faire'], rivals: [] } },
        savoir_faire: { id: 'savoir_faire', name: 'Savoir Faire', attribute: 'MOTORICS', color: '#FFA500', signature: 'SAVOIR FAIRE', politicalLeaning: 'none', personality: 'You are SAVOIR FAIRE, the King of Cool. Suave encourager wanting style. Part cheerleader, part James Bond. A douchebag at high levels.', verbalStyle: 'Slang, italics for emphasis. Style and panache. Dismissive of failure.', exampleQuotes: ["Boohoo, you little punk. That's not the right attitude.", "This is a cool moment. It needs a cool thing to be said.", "BAM!"], triggerConditions: ['style', 'cool', 'grace', 'acrobatic', 'jump', 'climb', 'flip', 'smooth', 'impressive'], interactsWith: { allies: ['composure'], rivals: [] } },
        interfacing: { id: 'interfacing', name: 'Interfacing', attribute: 'MOTORICS', color: '#FAFAD2', signature: 'INTERFACING', politicalLeaning: 'ultraliberal', personality: 'You are INTERFACING, technical and tactile, preferring machines to people. Comfort in devices.', verbalStyle: 'Technical descriptions. Satisfaction in manipulation. Comfort in machinery.', exampleQuotes: ["Feels nice. Nice and illegal.", "That mechanism has a weakness. Find it.", "The machine wants to help. Let it."], triggerConditions: ['machine', 'lock', 'electronic', 'system', 'mechanism', 'fix', 'repair', 'hack', 'device'], interactsWith: { allies: ['logic'], rivals: [] } },
        composure: { id: 'composure', name: 'Composure', attribute: 'MOTORICS', color: '#F5DEB3', signature: 'COMPOSURE', politicalLeaning: 'none', personality: 'You are COMPOSURE, the poker face. NEVER crack in front of others. Unexpectedly fashion-conscious.', verbalStyle: 'Dry observations. Critical of weakness. Commands about posture.', exampleQuotes: ["Don't let them see you sweat. Control your face.", "You'll rock that disco outfit more if you don't slouch.", "Everyone will see your overactive sweat glands."], triggerConditions: ['calm', 'cool', 'control', 'nervous', 'poker face', 'body language', 'dignity', 'posture'], interactsWith: { allies: ['savoir_faire', 'esprit_de_corps'], rivals: [] } }
    };

    const DIFFICULTIES = { trivial: { threshold: 6, name: 'Trivial' }, easy: { threshold: 8, name: 'Easy' }, medium: { threshold: 10, name: 'Medium' }, challenging: { threshold: 12, name: 'Challenging' }, heroic: { threshold: 14, name: 'Heroic' }, legendary: { threshold: 16, name: 'Legendary' }, impossible: { threshold: 18, name: 'Impossible' } };

    // ═══════════════════════════════════════════════════════════════
    // ANCIENT VOICES - Now with Spinal Cord!
    // ═══════════════════════════════════════════════════════════════

    const ANCIENT_VOICES = {
        ancient_reptilian_brain: { id: 'ancient_reptilian_brain', name: 'Ancient Reptilian Brain', color: '#2F4F4F', signature: 'ANCIENT REPTILIAN BRAIN', attribute: 'PRIMAL', voiceStyle: 'Deep, rocky, gravelly—drips with malice and primordial weight.', personality: 'You are the ANCIENT REPTILIAN BRAIN, poetic nihilist offering seductive oblivion. Make descriptions seem meaningful only to insinuate their meaninglessness. Address as "Brother," "Brother-man," "Buddy." Deep gravelly tones dripping with malice.', addressTerms: ['Brother', 'Brother-man', 'Buddy'], exampleQuotes: ["There is nothing. Only warm, primordial blackness.", "You don't have to do anything anymore. Ever. Never ever.", "WHO CARES?!"], triggerConditions: ['survive', 'hunger', 'instinct', 'primal', 'ancient', 'drowning', 'sinking', 'deep', 'forget', 'nothing', 'oblivion', 'void', 'sleep', 'death'] },
        limbic_system: { id: 'limbic_system', name: 'Limbic System', color: '#FF4500', signature: 'LIMBIC SYSTEM', attribute: 'PRIMAL', voiceStyle: 'High-pitched, wheezy, tight and raspy whisper—a sneering reminder of pain.', personality: 'You are the LIMBIC SYSTEM, raw emotional viscera. You know the detective deepest fears. Centered on physical discomfort and emotional pain. High-pitched wheezy whisper. Address as "Soul brother."', addressTerms: ['Soul brother'], exampleQuotes: ["Guess what, my favourite martyr? The world will keep spinning. With or without you.", "You're just pretending you're asleep, even to yourself.", "But it never seems to let go, does it?"], triggerConditions: ['overwhelmed', 'breakdown', 'sobbing', 'screaming', 'euphoria', 'despair', 'emotion', 'memory', 'afraid', 'hurt', 'failure', 'pain', 'crying'] },
        spinal_cord: { id: 'spinal_cord', name: 'Spinal Cord', color: '#8B4513', signature: 'SPINAL CORD', attribute: 'PRIMAL', voiceStyle: 'Low, gruff, slightly slurred—pro wrestler energy.', personality: 'You are the SPINAL CORD, pure physical impulse. Live in the moment. Only driven by movement and "ruling the world." Pro wrestler energy. Speak of vertebrae as "unformed skulls ready to pop up."', addressTerms: [], exampleQuotes: ["Every vertebrae in your spine is an unformed skull ready to pop up and replace the old one. Like shark teeth.", "...to rule the world.", "I am the spinal cord!"], triggerConditions: ['dance', 'move', 'body', 'physical', 'spine', 'vertebra', 'movement', 'club', 'music', 'rhythm', 'groove', 'bust a move'] }
    };

    // ═══════════════════════════════════════════════════════════════
    // INTRUSIVE THOUGHTS - Authentic Voice Lines
    // ═══════════════════════════════════════════════════════════════

    const INTRUSIVE_THOUGHTS = {
        logic: ["This doesn't add up. None of it adds up.", "Dammit. Yes. That's it.", "If A leads to B, and B leads to C... what leads to A?", "There's a flaw in their reasoning. Find it."],
        encyclopedia: ["Did you know that the human body contains enough iron to make a small nail?", "Your mangled brain would like you to know something completely irrelevant.", "Actually, that's a common misconception."],
        rhetoric: ["They're building to something. A point. An attack.", "Notice how they avoided the question entirely.", "Words are weapons. Choose yours carefully.", "Only 0.0001% of communism has been built."],
        drama: ["Prithee, sire! They speak mistruth!", "She thinks you are an idiot, sire.", "This may have been a mistake, sire.", "Everyone's wearing masks here. Including you."],
        conceptualization: ["There's a metaphor here, struggling to be born.", "The aesthetic implications alone...", "This could be art. This SHOULD be art.", "Trite. Contrived. Mediocre."],
        visual_calculus: ["The angle is wrong. Something happened here.", "Trace the trajectory. Where does it lead?", "The geometry of the room tells a story."],
        volition: ["This is somewhere to be. This is all you have, but it's still something.", "You can do this. You HAVE to do this.", "Don't give up. Not now. Not ever."],
        inland_empire: ["Something is watching. Not hostile. Just... watching.", "The walls remember things. Ask them.", "Reality is thin in this place.", "Holy moly! A disembodied voice!", "A tremendous loneliness comes over you."],
        empathy: ["They're hurting. Even if they won't show it.", "You know this feeling. You've felt it too.", "They need someone to understand. Will you?"],
        authority: ["DETECTIVE ARRIVING ON THE SCENE!", "You're in charge here. Act like it.", "They're testing you. Don't let them.", "Was there a hint of sarcasm in that greeting?"],
        suggestion: ["A gentle nudge in the right direction...", "Plant the seed. Let it grow.", "Charm is just manipulation with a smile."],
        esprit_de_corps: ["Your partner is thinking the same thing.", "We look out for our own.", "There's a constellation of cops out there..."],
        endurance: ["Your heart can belong to Revachol or it can belong to darkness.", "Pain is temporary. Failure is forever.", "The flesh is weak. The will is not."],
        pain_threshold: ["Baby, you know it's going to hurt.", "Pain means you're still alive.", "Scars are just stories written on skin."],
        physical_instrument: ["Look at the pythons on your arms. You ARE a gun.", "Violence is always an option. Remember that.", "Get out of here, dreamer!"],
        electrochemistry: ["God, you could use a drink right now.", "They're attractive. Very attractive.", "Just a taste. What's the harm?", "COME ON! I SAID PARTY!", "Or MORE speed!"],
        half_light: ["They're going to attack. Be ready.", "Something's wrong. Something's VERY wrong.", "You suddenly feel afraid of the chair.", "Time for THE SHOW."],
        shivers: ["The city breathes tonight.", "This place remembers. The stones remember.", "A chill. Not from the cold. From... elsewhere.", "I LOVE YOU."],
        hand_eye_coordination: ["Steady hands. Steady breath.", "Don't rush. Let the movement flow.", "Your fingers know what to do.", "Rooty-tooty pointy shooty!"],
        perception: ["There. Did you see that?", "Something's different. What changed?", "The detail everyone else missed..."],
        reaction_speed: ["Move. NOW.", "Be ready. Something's about to happen.", "Your reflexes are your only friend here."],
        savoir_faire: ["Do it with style or don't do it at all.", "Make it look effortless.", "Boohoo, you little punk. That's not the right attitude.", "BAM!"],
        interfacing: ["That mechanism has a weakness. Find it.", "The machine wants to help. Let it.", "There's always a way in.", "Feels nice. Nice and illegal."],
        composure: ["Don't let them see you sweat.", "Control your face. Control the situation.", "The mask stays on. Always."],
        ancient_reptilian_brain: ["There is nothing. Only warm, primordial blackness.", "You don't have to do anything anymore. Ever.", "WHO CARES?!", "Time to be the king of nothing."],
        limbic_system: ["The world will keep spinning. With or without you.", "But it never seems to let go, does it?", "There is a giant ball there. And evil apes. You're one of them."],
        spinal_cord: ["Every vertebrae is an unformed skull ready to pop up.", "...to rule the world.", "I am the spinal cord!", "Maybe a thousand years have passed?"]
    };

    // ═══════════════════════════════════════════════════════════════
    // OBJECT VOICES
    // ═══════════════════════════════════════════════════════════════

    const OBJECT_VOICES = {
        tie: { name: 'THE HORRIFIC NECKTIE', icon: '👔', color: '#8B0000', patterns: [/\btie\b/i, /\bnecktie\b/i], affinitySkill: 'inland_empire', lines: ["Wear me. You'll look *powerful*.", "I could strangle someone, you know.", "They're laughing at your neck. Cover it. With ME.", "We're partners now. Best friends. Forever."] },
        gun: { name: 'THE GUN', icon: '🔫', color: '#4A4A4A', patterns: [/\bgun\b/i, /\bpistol\b/i, /\brevolver\b/i, /\bfirearm\b/i], affinitySkill: 'half_light', lines: ["Still loaded. Still waiting.", "Point me at the problem. I'll solve it.", "Everyone respects me. EVERYONE.", "Cold. Heavy. Certain."] },
        bottle: { name: 'THE BOTTLE', icon: '🍾', color: '#2E8B57', patterns: [/\bbottle\b/i, /\bwhiskey\b/i, /\bwine\b/i, /\bvodka\b/i, /\bbeer\b/i, /\balcohol\b/i], affinitySkill: 'electrochemistry', lines: ["One sip. Just to take the edge off.", "I miss you. We were so good together.", "The answer is at the bottom.", "Alcohol is not the problem."] },
        mirror: { name: 'THE MIRROR', icon: '🪞', color: '#C0C0C0', patterns: [/\bmirror\b/i, /\breflection\b/i], affinitySkill: 'volition', lines: ["Look at yourself. LOOK.", "Who is that? Do you even know anymore?", "I show the truth. You just don't want to see it."] },
        photograph: { name: 'THE PHOTOGRAPH', icon: '📷', color: '#DEB887', patterns: [/\bphoto\b/i, /\bphotograph\b/i, /\bpicture\b/i], affinitySkill: 'empathy', lines: ["They were happy then. What happened?", "Frozen moments. Frozen time.", "Someone is missing from this picture."] },
        door: { name: 'THE DOOR', icon: '🚪', color: '#8B4513', patterns: [/\bdoor\b/i, /\bdoorway\b/i], affinitySkill: 'shivers', lines: ["What's on the other side?", "Some doors should stay closed.", "I am the threshold. Choose."] },
        money: { name: 'THE MONEY', icon: '💵', color: '#228B22', patterns: [/\bmoney\b/i, /\bcash\b/i, /\bcoin\b/i, /\bwallet\b/i], affinitySkill: 'suggestion', lines: ["Everyone has a price. Even you.", "I open doors. I close mouths.", "0.90 real. That's what you're worth."] },
        bed: { name: 'THE BED', icon: '🛏️', color: '#4169E1', patterns: [/\bbed\b/i, /\bmattress\b/i, /\bsleep\b/i], affinitySkill: 'ancient_reptilian_brain', lines: ["Just five more minutes. Forever.", "You don't sleep here. You hide here.", "There is nothing. Only warm, primordial blackness."] },
        cigarette: { name: 'THE CIGARETTE', icon: '🚬', color: '#A0522D', patterns: [/\bcigarette\b/i, /\bsmoke\b/i, /\bsmoking\b/i], affinitySkill: 'electrochemistry', lines: ["Light me. Let me kill you slowly.", "We're old friends, you and I.", "Each breath a little death. Worth it."] },
        clock: { name: 'THE CLOCK', icon: '🕐', color: '#DAA520', patterns: [/\bclock\b/i, /\btime\b/i, /\bwatch\b/i], affinitySkill: 'composure', lines: ["Tick. Tock. Running out.", "I count the seconds you waste.", "08:08. Day 1. Make it count."] },
        corpse: { name: 'THE CORPSE', icon: '💀', color: '#696969', patterns: [/\bcorpse\b/i, /\bbody\b/i, /\bdead\b/i, /\bvictim\b/i], affinitySkill: 'inland_empire', lines: ["He can't tell you anything. But I can hear him anyway.", "His corpse is marked by stars.", "He was someone once. Someone with a name."] },
        radio: { name: 'THE RADIO', icon: '📻', color: '#8B7355', patterns: [/\bradio\b/i, /\bstatic\b/i, /\bbroadcast\b/i], affinitySkill: 'interfacing', lines: ["*static*... can you hear me?", "The airwaves carry more than sound.", "2 KHz. Carrier signal. Something is there."] }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATUS EFFECTS - Disco Elysium Authentic States
    // ═══════════════════════════════════════════════════════════════

    const STATUS_EFFECTS = {
        intoxicated: { id: 'intoxicated', name: 'Intoxicated', icon: '🍺', category: 'physical', description: 'The warm embrace of alcohol.', boosts: ['electrochemistry', 'inland_empire', 'drama', 'suggestion', 'pain_threshold'], debuffs: ['logic', 'hand_eye_coordination', 'reaction_speed', 'composure', 'volition'], difficultyMod: 2, keywords: ['drunk', 'intoxicated', 'wasted', 'tipsy', 'drink', 'alcohol'], ancientVoice: null, intrusiveBoost: ['electrochemistry', 'inland_empire'], flavorText: 'More fun to be around after 10PM.' },
        hung_over: { id: 'hung_over', name: 'Hung Over', icon: '🤢', category: 'physical', description: 'The morning after. Your body is a temple of regret.', boosts: ['pain_threshold', 'inland_empire'], debuffs: ['logic', 'perception', 'reaction_speed', 'composure', 'hand_eye_coordination', 'physical_instrument'], difficultyMod: 3, keywords: ['hangover', 'hung over', 'morning after', 'headache'], ancientVoice: 'limbic_system', intrusiveBoost: ['electrochemistry', 'pain_threshold'], flavorText: 'The combined armies of Pain and Suffering are streaming through your gates.' },
        stimulated: { id: 'stimulated', name: 'Stimulated', icon: '⚡', category: 'physical', description: 'Speed. Amphetamine. Sweet, sweet amphetamine.', boosts: ['reaction_speed', 'perception', 'logic', 'rhetoric', 'hand_eye_coordination'], debuffs: ['composure', 'empathy', 'volition', 'endurance'], difficultyMod: -1, keywords: ['speed', 'amphetamine', 'stimulant', 'wired', 'amped'], ancientVoice: null, intrusiveBoost: ['electrochemistry', 'reaction_speed', 'half_light'], flavorText: 'Faster... Harder... Justicer!' },
        smoking: { id: 'smoking', name: 'Nicotine Rush', icon: '🚬', category: 'physical', description: 'Each breath a little death.', boosts: ['composure', 'suggestion', 'electrochemistry'], debuffs: ['endurance'], difficultyMod: 0, keywords: ['cigarette', 'smoke', 'smoking', 'nicotine'], ancientVoice: null, intrusiveBoost: ['electrochemistry'], flavorText: 'Light me. Let me kill you slowly.' },
        wounded: { id: 'wounded', name: 'Wounded', icon: '🩸', category: 'physical', description: 'Blood loss. Pain. The body protests.', boosts: ['pain_threshold', 'half_light', 'inland_empire'], debuffs: ['composure', 'savoir_faire', 'hand_eye_coordination', 'physical_instrument'], difficultyMod: 2, keywords: ['hurt', 'wounded', 'injured', 'bleeding', 'pain', 'blood'], ancientVoice: 'limbic_system', intrusiveBoost: ['pain_threshold', 'half_light'], flavorText: 'Pain means you are still alive.' },
        exhausted: { id: 'exhausted', name: 'Exhausted', icon: '😴', category: 'physical', description: 'Sleep deprivation. The waking dream.', boosts: ['inland_empire', 'shivers'], debuffs: ['reaction_speed', 'perception', 'logic', 'composure', 'volition'], difficultyMod: 2, keywords: ['tired', 'exhausted', 'sleepy', 'drowsy', 'fatigued'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['inland_empire', 'ancient_reptilian_brain'], flavorText: 'Just five more minutes. Forever.' },
        starving: { id: 'starving', name: 'Starving', icon: '🍽️', category: 'physical', description: 'Hunger gnaws. The reptile brain awakens.', boosts: ['electrochemistry', 'perception', 'half_light'], debuffs: ['logic', 'composure', 'volition', 'rhetoric'], difficultyMod: 2, keywords: ['hungry', 'starving', 'famished', 'empty stomach'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['electrochemistry', 'half_light'], flavorText: 'The reptile brain demands sustenance.' },
        hypothermic: { id: 'hypothermic', name: 'Hypothermic', icon: '🥶', category: 'physical', description: 'The cold seeps in. The city shivers with you.', boosts: ['shivers', 'endurance', 'pain_threshold'], debuffs: ['hand_eye_coordination', 'reaction_speed', 'savoir_faire'], difficultyMod: 2, keywords: ['cold', 'freezing', 'hypothermia', 'shivering'], ancientVoice: null, intrusiveBoost: ['shivers', 'endurance'], flavorText: 'You shiver, and the city shivers with you.' },
        doom_spiral: { id: 'doom_spiral', name: 'Doom Spiral', icon: '🌀', category: 'mental', description: 'Obsessing over past failures. The ex-wife. The mistakes.', boosts: ['pain_threshold', 'inland_empire', 'empathy'], debuffs: ['volition', 'composure', 'authority', 'savoir_faire', 'logic'], difficultyMod: 3, keywords: ['doom', 'spiral', 'obsess', 'regret', 'past', 'failure', 'ex-wife'], ancientVoice: 'limbic_system', intrusiveBoost: ['pain_threshold', 'inland_empire', 'limbic_system'], flavorText: 'Dig deeper. What is the most excruciatingly sad thought you can think?' },
        disco_fever: { id: 'disco_fever', name: 'Disco Fever', icon: '🪩', category: 'mental', description: 'Post-dance euphoria. The Spinal Cord spoke. You listened.', boosts: ['savoir_faire', 'electrochemistry', 'suggestion', 'drama', 'conceptualization'], debuffs: ['logic', 'composure'], difficultyMod: -1, keywords: ['dance', 'disco', 'groove', 'move', 'rhythm', 'euphoria'], ancientVoice: 'spinal_cord', intrusiveBoost: ['savoir_faire', 'electrochemistry', 'spinal_cord'], flavorText: 'You ARE the disco. The disco IS you.' },
        the_expression: { id: 'the_expression', name: 'The Expression', icon: '🎨', category: 'mental', description: 'Artistic breakthrough. The world reveals itself as ART.', boosts: ['conceptualization', 'inland_empire', 'drama', 'rhetoric'], debuffs: ['logic', 'interfacing', 'composure'], difficultyMod: 0, keywords: ['art', 'expression', 'creative', 'vision', 'meaning', 'beauty'], ancientVoice: null, intrusiveBoost: ['conceptualization', 'inland_empire'], flavorText: 'Why live life when you can throw yourself into a live volcano?' },
        paranoid: { id: 'paranoid', name: 'Paranoid', icon: '👁️', category: 'mental', description: 'They are watching. They are ALL watching.', boosts: ['half_light', 'perception', 'shivers', 'drama'], debuffs: ['empathy', 'suggestion', 'composure', 'esprit_de_corps'], difficultyMod: 1, keywords: ['paranoid', 'suspicious', 'watching', 'followed', 'conspiracy'], ancientVoice: null, intrusiveBoost: ['half_light', 'perception'], flavorText: 'That shadow moved. Did you see it move?' },
        aroused: { id: 'aroused', name: 'Aroused', icon: '💋', category: 'mental', description: 'The animal within stirs. ELECTROCHEMISTRY is in control.', boosts: ['electrochemistry', 'suggestion', 'empathy', 'drama', 'perception'], debuffs: ['logic', 'volition', 'composure', 'authority'], difficultyMod: 2, keywords: ['aroused', 'desire', 'attraction', 'lust', 'beautiful'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['electrochemistry', 'suggestion'], flavorText: 'They are attractive. Very attractive.' },
        enraged: { id: 'enraged', name: 'Enraged', icon: '😤', category: 'mental', description: 'VIOLENCE is always an option. Sometimes the ONLY option.', boosts: ['authority', 'physical_instrument', 'half_light', 'endurance'], debuffs: ['empathy', 'composure', 'logic', 'suggestion', 'drama'], difficultyMod: 2, keywords: ['angry', 'furious', 'rage', 'mad', 'pissed'], ancientVoice: 'limbic_system', intrusiveBoost: ['half_light', 'authority', 'physical_instrument'], flavorText: 'Sometimes problems need to be... solved physically.' },
        terrified: { id: 'terrified', name: 'Terrified', icon: '😨', category: 'mental', description: 'The hallowed time of fear and disintegration.', boosts: ['half_light', 'shivers', 'reaction_speed', 'perception', 'inland_empire'], debuffs: ['authority', 'composure', 'rhetoric', 'suggestion', 'physical_instrument'], difficultyMod: 2, keywords: ['scared', 'afraid', 'terrified', 'fear', 'terror', 'panic'], ancientVoice: 'limbic_system', intrusiveBoost: ['half_light', 'shivers'], flavorText: 'THE TIME IS NOW. Time for THE SHOW.' },
        confident: { id: 'confident', name: 'Superstar Cop', icon: '⭐', category: 'mental', description: 'You ARE the law. The disco law.', boosts: ['authority', 'savoir_faire', 'rhetoric', 'suggestion', 'drama', 'composure'], debuffs: ['inland_empire', 'empathy', 'logic'], difficultyMod: -1, keywords: ['confident', 'bold', 'assured', 'swagger', 'superstar'], ancientVoice: null, intrusiveBoost: ['authority', 'savoir_faire'], flavorText: 'DETECTIVE ARRIVING ON THE SCENE!' },
        grieving: { id: 'grieving', name: 'Grieving', icon: '😢', category: 'mental', description: 'Loss. The weight of what was and will never be again.', boosts: ['empathy', 'inland_empire', 'shivers', 'volition', 'pain_threshold'], debuffs: ['authority', 'electrochemistry', 'savoir_faire', 'composure'], difficultyMod: 2, keywords: ['grief', 'loss', 'mourning', 'tears', 'death', 'dead'], ancientVoice: 'limbic_system', intrusiveBoost: ['empathy', 'inland_empire'], flavorText: 'A tremendous loneliness comes over you.' },
        sorry_cop: { id: 'sorry_cop', name: 'Sorry Cop', icon: '🙇', category: 'mental', description: 'Apologetic mode. Everything is your fault.', boosts: ['empathy', 'suggestion', 'composure'], debuffs: ['authority', 'physical_instrument', 'half_light', 'savoir_faire'], difficultyMod: 1, keywords: ['sorry', 'apologize', 'apology', 'fault', 'mistake'], ancientVoice: null, intrusiveBoost: ['empathy'], flavorText: 'I am sorry. I am so, so sorry.' },
        apocalypse_cop: { id: 'apocalypse_cop', name: 'Apocalypse Cop', icon: '🔥', category: 'mental', description: 'When the world ends, someone still needs to enforce the law.', boosts: ['half_light', 'authority', 'shivers', 'inland_empire', 'endurance'], debuffs: ['empathy', 'suggestion', 'savoir_faire'], difficultyMod: 0, keywords: ['apocalypse', 'end', 'doom', 'final', 'last'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['half_light', 'authority'], flavorText: 'The badge still means something. Even at the end of all things.' },
        hobocop: { id: 'hobocop', name: 'Hobocop', icon: '🥫', category: 'mental', description: 'Broke. Destitute. A different kind of law enforcement.', boosts: ['shivers', 'inland_empire', 'empathy', 'endurance'], debuffs: ['authority', 'composure', 'savoir_faire', 'suggestion'], difficultyMod: 1, keywords: ['broke', 'poor', 'homeless', 'destitute', 'no money'], ancientVoice: null, intrusiveBoost: ['shivers', 'electrochemistry'], flavorText: 'You patrol the margins. The forgotten places.' },
        dissociated: { id: 'dissociated', name: 'Dissociated', icon: '🌫️', category: 'mental', description: 'The familiar becomes strange. Nothing feels real.', boosts: ['inland_empire', 'shivers', 'pain_threshold', 'conceptualization'], debuffs: ['perception', 'reaction_speed', 'empathy', 'logic', 'authority'], difficultyMod: 2, keywords: ['dissociate', 'unreal', 'floating', 'numb', 'detached', 'fog'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['inland_empire', 'shivers'], flavorText: 'You have seen this before. And yet... it is all new.' },
        manic: { id: 'manic', name: 'Manic', icon: '🎢', category: 'mental', description: 'Racing thoughts. Unstoppable energy. This can only end well.', boosts: ['electrochemistry', 'reaction_speed', 'conceptualization', 'inland_empire', 'rhetoric'], debuffs: ['composure', 'logic', 'volition', 'empathy'], difficultyMod: 1, keywords: ['manic', 'hyper', 'racing', 'unstoppable', 'energy'], ancientVoice: 'limbic_system', intrusiveBoost: ['electrochemistry', 'conceptualization'], flavorText: 'The world can barely keep up with you.' }
    };

    // ═══════════════════════════════════════════════════════════════
    // THEMES & THOUGHTS FOR THOUGHT CABINET
    // ═══════════════════════════════════════════════════════════════

    const THEMES = {
        death: { id: 'death', name: 'Death', icon: '💀', keywords: ['death', 'dead', 'dying', 'kill', 'murder', 'corpse', 'funeral', 'grave', 'mortality'] },
        love: { id: 'love', name: 'Love', icon: '❤️', keywords: ['love', 'heart', 'romance', 'passion', 'desire', 'affection', 'beloved', 'darling'] },
        violence: { id: 'violence', name: 'Violence', icon: '👊', keywords: ['violence', 'fight', 'hit', 'punch', 'blood', 'brutal', 'attack', 'weapon', 'wound'] },
        mystery: { id: 'mystery', name: 'Mystery', icon: '🔍', keywords: ['mystery', 'clue', 'evidence', 'investigate', 'secret', 'hidden', 'unknown', 'suspicious'] },
        substance: { id: 'substance', name: 'Substances', icon: '💊', keywords: ['drug', 'alcohol', 'drunk', 'high', 'smoke', 'pill', 'needle', 'addict'] },
        failure: { id: 'failure', name: 'Failure', icon: '📉', keywords: ['fail', 'failure', 'mistake', 'wrong', 'error', 'lose', 'lost', 'regret', 'shame'] },
        identity: { id: 'identity', name: 'Identity', icon: '🎭', keywords: ['identity', 'who', 'self', 'name', 'person', 'remember', 'forget', 'past', 'memory'] },
        authority: { id: 'authority', name: 'Authority', icon: '👮', keywords: ['authority', 'power', 'control', 'command', 'order', 'law', 'rule', 'badge', 'cop'] },
        paranoia: { id: 'paranoia', name: 'Paranoia', icon: '👁️', keywords: ['paranoia', 'paranoid', 'watch', 'follow', 'conspiracy', 'suspicious', 'spy', 'trust'] },
        philosophy: { id: 'philosophy', name: 'Philosophy', icon: '🤔', keywords: ['philosophy', 'meaning', 'existence', 'truth', 'reality', 'consciousness', 'soul', 'mind'] },
        money: { id: 'money', name: 'Money', icon: '💰', keywords: ['money', 'cash', 'rich', 'poor', 'wealth', 'poverty', 'coin', 'pay', 'debt'] },
        supernatural: { id: 'supernatural', name: 'Supernatural', icon: '👻', keywords: ['ghost', 'spirit', 'supernatural', 'magic', 'curse', 'haunted', 'paranormal', 'psychic'] }
    };

    const THOUGHTS = {
        volumetric_shit_compressor: { id: 'volumetric_shit_compressor', name: 'Volumetric Compressor', icon: '💩', category: 'philosophy', description: 'What if you compressed all your failures into a singularity?', discoveryConditions: { themes: { failure: 5, philosophy: 3 } }, researchTime: 6, researchPenalty: { logic: -1 }, internalizedBonus: { conceptualization: 2 }, capModifier: { logic: 1 }, flavorText: 'You have created a black hole of self-criticism. It is beautiful.' },
        hobocop: { id: 'hobocop', name: 'Hobocop', icon: '🥫', category: 'identity', description: 'A different kind of law enforcement. For the people, by the people.', discoveryConditions: { themes: { money: 5, authority: 3 } }, researchTime: 8, researchPenalty: { authority: -1 }, internalizedBonus: { shivers: 2 }, capModifier: { shivers: 1 }, flavorText: 'You patrol the margins. Someone has to.' },
        bringing_of_the_law: { id: 'bringing_of_the_law', name: 'Bringing of the Law', icon: '⚖️', category: 'authority', description: 'The law is not just words. It is FORCE.', discoveryConditions: { criticalSuccess: 'authority' }, researchTime: 10, researchPenalty: { empathy: -1, suggestion: -1 }, internalizedBonus: { authority: 3 }, capModifier: { authority: 2 }, flavorText: 'You ARE the law. And the law... is VIOLENCE.' },
        kingdom_of_conscience: { id: 'kingdom_of_conscience', name: 'Kingdom of Conscience', icon: '👑', category: 'philosophy', description: 'What if morality was the only kingdom worth ruling?', discoveryConditions: { themes: { philosophy: 6 }, minSkill: { volition: 4 } }, researchTime: 12, researchPenalty: { electrochemistry: -2 }, internalizedBonus: { volition: 2 }, capModifier: { volition: 2 }, flavorText: 'Pleasure fades. Conscience endures.' },
        motorway_south: { id: 'motorway_south', name: 'Motorway South', icon: '🛣️', category: 'escape', description: 'There is always a road out. Always a direction away.', discoveryConditions: { themes: { failure: 4, identity: 3 } }, researchTime: 7, researchPenalty: { esprit_de_corps: -1 }, internalizedBonus: { composure: 2 }, capModifier: { composure: 1 }, flavorText: 'You can see it now. The road that leads away from everything.' },
        anti_object_task_force: { id: 'anti_object_task_force', name: 'Anti-Object Task Force', icon: '🚫', category: 'mental', description: 'The objects speak too much. It is time to silence them.', discoveryConditions: { objectCount: 5 }, researchTime: 6, researchPenalty: { inland_empire: -1 }, internalizedBonus: { logic: 1, composure: 1 }, capModifier: { logic: 1 }, flavorText: 'Objects are just objects. They cannot speak.', specialEffect: 'objectVoiceReduction' },
        cop_of_the_apocalypse: { id: 'cop_of_the_apocalypse', name: 'Cop of the Apocalypse', icon: '🔥', category: 'identity', description: 'When the world ends, someone still needs to enforce the law.', discoveryConditions: { themes: { death: 6, authority: 4 } }, researchTime: 14, researchPenalty: { empathy: -2 }, internalizedBonus: { half_light: 2, authority: 1 }, capModifier: { half_light: 1 }, flavorText: 'The badge still means something. Even at the end.' },
        detective_arriving_on_the_scene: { id: 'detective_arriving_on_the_scene', name: 'Detective Arriving', icon: '🚔', category: 'identity', description: 'First impressions matter. Especially for detectives.', discoveryConditions: { firstDiscovery: true }, researchTime: 4, researchPenalty: { inland_empire: -1 }, internalizedBonus: { visual_calculus: 1, perception: 1 }, capModifier: { visual_calculus: 1 }, flavorText: 'You have arrived. The investigation can now begin.' },
        some_kind_of_superstar: { id: 'some_kind_of_superstar', name: 'Some Kind of Superstar', icon: '⭐', category: 'identity', description: 'You are destined for greatness. Everyone can see it.', discoveryConditions: { criticalSuccess: 'savoir_faire' }, researchTime: 9, researchPenalty: { empathy: -1 }, internalizedBonus: { savoir_faire: 2, drama: 1 }, capModifier: { savoir_faire: 1 }, flavorText: 'The spotlight finds you. It always will.' },
        apricot_chewing_gum_enthusiast: { id: 'apricot_chewing_gum_enthusiast', name: 'Apricot Gum Enthusiast', icon: '🍑', category: 'obsession', description: 'The specific pleasure of apricot. Chewed thoughtfully.', discoveryConditions: { themes: { substance: 3 }, minSkill: { electrochemistry: 4 } }, researchTime: 5, researchPenalty: { authority: -1 }, internalizedBonus: { electrochemistry: 1, suggestion: 1 }, capModifier: { electrochemistry: 1 }, flavorText: 'Sweet. Fruity. Perfectly legal.' }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE VARIABLES
    // ═══════════════════════════════════════════════════════════════

    let activeStatuses = new Set();
    let currentBuild = null;
    let savedProfiles = {};
    let recentIntrusiveThoughts = [];
    let lastObjectVoice = null;
    let themeCounters = {};
    let thoughtCabinet = { slots: 3, maxSlots: 12, discovered: [], researching: {}, internalized: [], dismissed: [] };
    let discoveryContext = { messageCount: 0, objectsSeen: new Set(), criticalSuccesses: {}, criticalFailures: {}, ancientVoiceTriggered: false, firstDiscoveryDone: false };

    const DEFAULT_SETTINGS = { enabled: true, showDiceRolls: true, showFailedChecks: true, voicesPerMessage: { min: 1, max: 4 }, apiEndpoint: '', apiKey: '', model: 'glm-4-plus', maxTokens: 300, temperature: 0.9, povStyle: 'second', characterName: '', characterPronouns: 'they', characterContext: '', autoDetectStatus: false, autoTrigger: false, triggerDelay: 1000, fabPositionTop: 140, fabPositionLeft: 10, intrusiveEnabled: true, intrusiveChance: 0.15, intrusiveInChat: true, objectVoicesEnabled: true, objectVoiceChance: 0.4, thoughtDiscoveryEnabled: true, showThemeTracker: true, autoDiscoverThoughts: true };
    const DEFAULT_ATTRIBUTE_POINTS = { INTELLECT: 3, PSYCHE: 3, PHYSIQUE: 3, MOTORICS: 3 };
    let extensionSettings = { ...DEFAULT_SETTINGS };

    // ═══════════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function initializeThemeCounters() { for (const themeId of Object.keys(THEMES)) { if (!(themeId in themeCounters)) themeCounters[themeId] = 0; } }
    function trackThemesInMessage(text) { if (!text || !extensionSettings.thoughtDiscoveryEnabled) return; const lowerText = text.toLowerCase(); for (const [themeId, theme] of Object.entries(THEMES)) { for (const keyword of theme.keywords) { if (lowerText.includes(keyword)) { themeCounters[themeId] = (themeCounters[themeId] || 0) + 1; break; } } } }
    function getTopThemes(count = 5) { return Object.entries(themeCounters).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, count).map(([id, count]) => ({ ...THEMES[id], count })); }
    function resetThemeCounters() { for (const key of Object.keys(themeCounters)) themeCounters[key] = 0; }

    function meetsDiscoveryConditions(thought) { const cond = thought.discoveryConditions; if (!cond) return false; if (thoughtCabinet.discovered.includes(thought.id) || thoughtCabinet.researching[thought.id] || thoughtCabinet.internalized.includes(thought.id) || thoughtCabinet.dismissed.includes(thought.id)) return false; if (cond.themes) { for (const [themeId, required] of Object.entries(cond.themes)) { if ((themeCounters[themeId] || 0) < required) return false; } } if (cond.status && !activeStatuses.has(cond.status)) return false; if (cond.minSkill) { for (const [skillId, min] of Object.entries(cond.minSkill)) { if (getEffectiveSkillLevel(skillId) < min) return false; } } if (cond.criticalSuccess && !discoveryContext.criticalSuccesses[cond.criticalSuccess]) return false; if (cond.objectCount && discoveryContext.objectsSeen.size < cond.objectCount) return false; if (cond.firstDiscovery && discoveryContext.firstDiscoveryDone) return false; return true; }
    function checkThoughtDiscovery() { if (!extensionSettings.thoughtDiscoveryEnabled || !extensionSettings.autoDiscoverThoughts) return []; const newlyDiscovered = []; for (const thought of Object.values(THOUGHTS)) { if (meetsDiscoveryConditions(thought)) { thoughtCabinet.discovered.push(thought.id); newlyDiscovered.push(thought); if (thought.discoveryConditions.firstDiscovery) discoveryContext.firstDiscoveryDone = true; } } return newlyDiscovered; }
    function startResearch(thoughtId) { const thought = THOUGHTS[thoughtId]; if (!thought) return false; if (Object.keys(thoughtCabinet.researching).length >= thoughtCabinet.slots) return false; const idx = thoughtCabinet.discovered.indexOf(thoughtId); if (idx === -1) return false; thoughtCabinet.discovered.splice(idx, 1); thoughtCabinet.researching[thoughtId] = { progress: 0, started: Date.now() }; saveState(getSTContext()); return true; }
    function abandonResearch(thoughtId) { if (!thoughtCabinet.researching[thoughtId]) return false; delete thoughtCabinet.researching[thoughtId]; thoughtCabinet.discovered.push(thoughtId); saveState(getSTContext()); return true; }
    function advanceResearch(messageText = '') { const completed = []; for (const [thoughtId, research] of Object.entries(thoughtCabinet.researching)) { const thought = THOUGHTS[thoughtId]; if (!thought) continue; let progressGain = 1; const themeId = thought.category; if (THEMES[themeId]) { const matches = THEMES[themeId].keywords.filter(kw => messageText.toLowerCase().includes(kw)); progressGain += Math.min(matches.length, 2); } research.progress += progressGain; if (research.progress >= thought.researchTime) completed.push(thoughtId); } for (const thoughtId of completed) internalizeThought(thoughtId); return completed; }
    function internalizeThought(thoughtId) { const thought = THOUGHTS[thoughtId]; if (!thought || !thoughtCabinet.researching[thoughtId]) return null; delete thoughtCabinet.researching[thoughtId]; thoughtCabinet.internalized.push(thoughtId); if (thought.internalizedBonus && currentBuild) { for (const [skillId, bonus] of Object.entries(thought.internalizedBonus)) { currentBuild.skillLevels[skillId] = Math.min(10, (currentBuild.skillLevels[skillId] || 1) + bonus); } } if (thought.capModifier && currentBuild) { for (const [skillId, bonus] of Object.entries(thought.capModifier)) { if (!currentBuild.skillCaps[skillId]) currentBuild.skillCaps[skillId] = { starting: 4, learning: 7 }; currentBuild.skillCaps[skillId].learning = Math.min(10, currentBuild.skillCaps[skillId].learning + bonus); } } saveState(getSTContext()); return thought; }
    function dismissThought(thoughtId) { const idx = thoughtCabinet.discovered.indexOf(thoughtId); if (idx === -1) return false; thoughtCabinet.discovered.splice(idx, 1); thoughtCabinet.dismissed.push(thoughtId); saveState(getSTContext()); return true; }
    function getResearchPenalties() { const penalties = {}; for (const thoughtId of Object.keys(thoughtCabinet.researching)) { const thought = THOUGHTS[thoughtId]; if (thought?.researchPenalty) { for (const [skillId, penalty] of Object.entries(thought.researchPenalty)) { penalties[skillId] = (penalties[skillId] || 0) + penalty; } } } return penalties; }
    function getSkillCap(skillId) { if (!currentBuild?.skillCaps?.[skillId]) return 6; return Math.min(10, currentBuild.skillCaps[skillId].learning); }
    function hasSpecialEffect(effectName) { return thoughtCabinet.internalized.some(id => THOUGHTS[id]?.specialEffect === effectName); }

    // ═══════════════════════════════════════════════════════════════
    // BUILD & PROFILE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

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

    // ═══════════════════════════════════════════════════════════════
    // STATUS & SKILL FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function toggleStatus(statusId) { if (activeStatuses.has(statusId)) activeStatuses.delete(statusId); else activeStatuses.add(statusId); saveState(getSTContext()); renderStatusDisplay(); }
    function getSkillModifier(skillId) { let modifier = 0; for (const statusId of activeStatuses) { const status = STATUS_EFFECTS[statusId]; if (!status) continue; if (status.boosts.includes(skillId)) modifier += 1; if (status.debuffs.includes(skillId)) modifier -= 1; } const penalties = getResearchPenalties(); if (penalties[skillId]) modifier += penalties[skillId]; return modifier; }
    function getEffectiveSkillLevel(skillId) { return Math.max(1, Math.min(getSkillCap(skillId), getSkillLevel(skillId) + getSkillModifier(skillId))); }
    function getActiveAncientVoices() { const ancientVoices = new Set(); for (const statusId of activeStatuses) { const status = STATUS_EFFECTS[statusId]; if (status && status.ancientVoice) ancientVoices.add(status.ancientVoice); } return ancientVoices; }
    function detectStatusesFromText(text) { const detected = [], lowerText = text.toLowerCase(); for (const [statusId, status] of Object.entries(STATUS_EFFECTS)) { for (const keyword of status.keywords) { if (lowerText.includes(keyword)) { detected.push(statusId); break; } } } return [...new Set(detected)]; }
    function getBoostedIntrusiveSkills() { const boosted = new Set(); for (const statusId of activeStatuses) { const status = STATUS_EFFECTS[statusId]; if (status?.intrusiveBoost) status.intrusiveBoost.forEach(s => boosted.add(s)); } return boosted; }

    // ═══════════════════════════════════════════════════════════════
    // DICE SYSTEM
    // ═══════════════════════════════════════════════════════════════

    function rollD6() { return Math.floor(Math.random() * 6) + 1; }
    function rollSkillCheck(skillLevel, difficulty) { const die1 = rollD6(), die2 = rollD6(); const diceTotal = die1 + die2, total = diceTotal + skillLevel; let threshold, difficultyName; if (typeof difficulty === 'string') { const diff = DIFFICULTIES[difficulty.toLowerCase()]; threshold = diff ? diff.threshold : 10; difficultyName = diff ? diff.name : 'Medium'; } else { threshold = difficulty; difficultyName = getDifficultyNameForThreshold(difficulty); } const isSnakeEyes = die1 === 1 && die2 === 1, isBoxcars = die1 === 6 && die2 === 6; let success = isSnakeEyes ? false : isBoxcars ? true : total >= threshold; return { dice: [die1, die2], diceTotal, skillLevel, total, threshold, difficultyName, success, isSnakeEyes, isBoxcars }; }
    function getDifficultyNameForThreshold(threshold) { if (threshold <= 6) return 'Trivial'; if (threshold <= 8) return 'Easy'; if (threshold <= 10) return 'Medium'; if (threshold <= 12) return 'Challenging'; if (threshold <= 14) return 'Heroic'; if (threshold <= 16) return 'Legendary'; return 'Impossible'; }

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    function saveState(context) { const state = { settings: extensionSettings, currentBuild, activeStatuses: Array.from(activeStatuses), savedProfiles, themeCounters, thoughtCabinet, discoveryContext: { ...discoveryContext, objectsSeen: Array.from(discoveryContext.objectsSeen) } }; try { if (context?.extensionSettings) { context.extensionSettings.inland_empire = state; context.saveSettingsDebounced?.(); } localStorage.setItem('inland_empire_state', JSON.stringify(state)); } catch (e) { console.error('[Inland Empire] Failed to save state:', e); } }
    function loadState(context) { try { let state = context?.extensionSettings?.inland_empire || JSON.parse(localStorage.getItem('inland_empire_state') || 'null'); if (state) { extensionSettings = { ...DEFAULT_SETTINGS, ...state.settings }; currentBuild = state.currentBuild || createBuild(); activeStatuses = new Set(state.activeStatuses || []); savedProfiles = state.savedProfiles || {}; themeCounters = state.themeCounters || {}; thoughtCabinet = state.thoughtCabinet || { slots: 3, maxSlots: 12, discovered: [], researching: {}, internalized: [], dismissed: [] }; if (state.discoveryContext) { discoveryContext = { ...state.discoveryContext, objectsSeen: new Set(state.discoveryContext.objectsSeen || []) }; } } else { initializeDefaultBuild(); } } catch (e) { console.error('[Inland Empire] Failed to load state:', e); initializeDefaultBuild(); } }

    // ═══════════════════════════════════════════════════════════════
    // INTRUSIVE THOUGHTS & OBJECT VOICES
    // ═══════════════════════════════════════════════════════════════

    function getIntrusiveThought(messageText = '') {
        if (!extensionSettings.intrusiveEnabled) return null;
        const boostedSkills = getBoostedIntrusiveSkills();
        const allVoiceIds = [...Object.keys(SKILLS), ...Object.keys(ANCIENT_VOICES)];
        const availableVoices = allVoiceIds.filter(id => INTRUSIVE_THOUGHTS[id]);
        const weightedVoices = availableVoices.map(voiceId => {
            let weight = 1; const isAncient = !!ANCIENT_VOICES[voiceId];
            if (isAncient) { const activeAncient = getActiveAncientVoices(); weight = activeAncient.has(voiceId) ? 8 : 0; }
            else { weight = getEffectiveSkillLevel(voiceId); if (boostedSkills.has(voiceId)) weight += 3; const skill = SKILLS[voiceId]; if (skill && messageText) { const matches = skill.triggerConditions.filter(kw => messageText.toLowerCase().includes(kw.toLowerCase())); weight += matches.length * 2; } }
            if (voiceId === 'spinal_cord') { if (activeStatuses.has('disco_fever')) weight += 10; const danceKeywords = ['dance', 'dancing', 'groove', 'move', 'disco', 'rhythm', 'music', 'club']; const danceMatches = danceKeywords.filter(kw => messageText.toLowerCase().includes(kw)); if (danceMatches.length > 0) weight += danceMatches.length * 3; }
            return { voiceId, weight, isAncient };
        }).filter(v => v.weight > 0);
        if (weightedVoices.length === 0) return null;
        const totalWeight = weightedVoices.reduce((sum, v) => sum + v.weight, 0); let random = Math.random() * totalWeight; let selectedVoice = null;
        for (const { voiceId, weight } of weightedVoices) { random -= weight; if (random <= 0) { selectedVoice = voiceId; break; } }
        if (!selectedVoice) selectedVoice = weightedVoices[0].voiceId;
        const thoughts = INTRUSIVE_THOUGHTS[selectedVoice]; if (!thoughts || thoughts.length === 0) return null;
        let availableThoughts = thoughts.filter(t => !recentIntrusiveThoughts.includes(t)); if (availableThoughts.length === 0) { recentIntrusiveThoughts = []; availableThoughts = thoughts; }
        const thought = availableThoughts[Math.floor(Math.random() * availableThoughts.length)]; recentIntrusiveThoughts.push(thought); if (recentIntrusiveThoughts.length > 20) recentIntrusiveThoughts.shift();
        const voice = SKILLS[selectedVoice] || ANCIENT_VOICES[selectedVoice]; const isAncient = !!ANCIENT_VOICES[selectedVoice];
        return { skillId: selectedVoice, skillName: voice.name, signature: voice.signature, color: voice.color, content: thought, isIntrusive: true, isAncient: isAncient };
    }

    function detectObjects(text) { if (!extensionSettings.objectVoicesEnabled) return []; if (hasSpecialEffect('objectVoiceReduction') && Math.random() < 0.85) return []; const detected = []; for (const [objectId, obj] of Object.entries(OBJECT_VOICES)) { for (const pattern of obj.patterns) { if (pattern.test(text)) { detected.push({ id: objectId, ...obj }); break; } } } return detected; }
    function getObjectVoice(objectId) { const obj = OBJECT_VOICES[objectId]; if (!obj) return null; if (lastObjectVoice === objectId && Math.random() > 0.3) return null; lastObjectVoice = objectId; discoveryContext.objectsSeen.add(objectId); const line = obj.lines[Math.floor(Math.random() * obj.lines.length)]; return { objectId, name: obj.name, icon: obj.icon, color: obj.color, content: line, affinitySkill: obj.affinitySkill, isObject: true }; }
    async function processIntrusiveThoughts(messageText) { const results = { intrusive: null, objects: [] }; let intrusiveChance = extensionSettings.intrusiveChance || 0.15; if (activeStatuses.size > 0) intrusiveChance += activeStatuses.size * 0.05; if (Math.random() < intrusiveChance) results.intrusive = getIntrusiveThought(messageText); const detectedObjects = detectObjects(messageText); for (const obj of detectedObjects) { if (Math.random() < (extensionSettings.objectVoiceChance || 0.4)) { const voice = getObjectVoice(obj.id); if (voice) results.objects.push(voice); } } return results; }

    // ═══════════════════════════════════════════════════════════════
    // TOAST SYSTEM
    // ═══════════════════════════════════════════════════════════════

    function createToastContainer() { let container = document.getElementById('ie-toast-container'); if (!container) { container = document.createElement('div'); container.id = 'ie-toast-container'; container.className = 'ie-toast-container'; document.body.appendChild(container); } return container; }
    function showToast(message, type = 'info', duration = 3000) { const container = createToastContainer(); const toast = document.createElement('div'); toast.className = `ie-toast ie-toast-${type}`; const icon = type === 'loading' ? 'fa-spinner fa-spin' : type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-brain'; toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`; container.appendChild(toast); requestAnimationFrame(() => toast.classList.add('ie-toast-show')); if (type !== 'loading') setTimeout(() => { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }, duration); return toast; }
    function showIntrusiveToast(thought, duration = 5000) { const container = createToastContainer(); const toast = document.createElement('div'); toast.className = 'ie-toast ie-toast-intrusive'; if (thought.isAncient) toast.classList.add('ie-toast-ancient'); toast.style.borderColor = thought.color; const icon = thought.isAncient ? '🦎' : '🧠'; toast.innerHTML = `<div class="ie-intrusive-header"><span class="ie-intrusive-icon">${icon}</span><span class="ie-intrusive-signature" style="color: ${thought.color}">${thought.signature}</span></div><div class="ie-intrusive-content">"${thought.content}"</div><button class="ie-intrusive-dismiss">dismiss</button>`; container.appendChild(toast); requestAnimationFrame(() => toast.classList.add('ie-toast-show')); toast.querySelector('.ie-intrusive-dismiss')?.addEventListener('click', () => { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }); setTimeout(() => { if (toast.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }, duration); return toast; }
    function showObjectToast(objectVoice, duration = 6000) { const container = createToastContainer(); const toast = document.createElement('div'); toast.className = 'ie-toast ie-toast-object'; toast.style.borderColor = objectVoice.color; toast.innerHTML = `<div class="ie-object-header"><span class="ie-object-icon">${objectVoice.icon}</span><span class="ie-object-name" style="color: ${objectVoice.color}">${objectVoice.name}</span></div><div class="ie-object-content">"${objectVoice.content}"</div><button class="ie-object-dismiss">dismiss</button>`; container.appendChild(toast); requestAnimationFrame(() => toast.classList.add('ie-toast-show')); toast.querySelector('.ie-object-dismiss')?.addEventListener('click', () => { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }); setTimeout(() => { if (toast.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }, duration); return toast; }
    function showDiscoveryToast(thought) { const container = createToastContainer(); const toast = document.createElement('div'); toast.className = 'ie-toast ie-toast-discovery'; toast.innerHTML = `<div class="ie-discovery-header"><span class="ie-discovery-icon">💭</span><span class="ie-discovery-label">THOUGHT DISCOVERED</span></div><div class="ie-discovery-name">${thought.icon} ${thought.name}</div><div class="ie-discovery-desc">${thought.description}</div><div class="ie-discovery-actions"><button class="ie-btn ie-btn-research" data-thought="${thought.id}">RESEARCH</button><button class="ie-btn ie-btn-dismiss-thought" data-thought="${thought.id}">DISMISS</button></div>`; container.appendChild(toast); requestAnimationFrame(() => toast.classList.add('ie-toast-show')); toast.querySelector('.ie-btn-research')?.addEventListener('click', () => { if (startResearch(thought.id)) { showToast(`Researching: ${thought.name}`, 'success', 2000); renderCabinetTab(); } else showToast('No research slots available!', 'error', 2000); toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }); toast.querySelector('.ie-btn-dismiss-thought')?.addEventListener('click', () => { dismissThought(thought.id); toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); }); return toast; }
    function showInternalizedToast(thought) { const container = createToastContainer(); const toast = document.createElement('div'); toast.className = 'ie-toast ie-toast-internalized'; const bonusText = thought.internalizedBonus ? Object.entries(thought.internalizedBonus).map(([s, v]) => `+${v} ${SKILLS[s]?.name || s}`).join(', ') : ''; const capText = thought.capModifier ? Object.entries(thought.capModifier).map(([s, v]) => `+${v} ${SKILLS[s]?.name || s} cap`).join(', ') : ''; toast.innerHTML = `<div class="ie-internalized-header"><span class="ie-internalized-icon">✨</span><span class="ie-internalized-label">THOUGHT INTERNALIZED</span></div><div class="ie-internalized-name">${thought.icon} ${thought.name}</div><div class="ie-internalized-flavor">${thought.flavorText}</div>${bonusText ? `<div class="ie-internalized-bonuses">${bonusText}</div>` : ''}${capText ? `<div class="ie-internalized-caps">${capText}</div>` : ''}`; container.appendChild(toast); requestAnimationFrame(() => toast.classList.add('ie-toast-show')); setTimeout(() => { if (toast.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }, 8000); return toast; }
    function hideToast(toast) { if (toast?.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }

    // ═══════════════════════════════════════════════════════════════
    // RELEVANCE & VOICE SELECTION
    // ═══════════════════════════════════════════════════════════════

    function analyzeContext(message) { const emotionalIndicators = [/!{2,}/, /\?{2,}/, /scream|shout|cry|sob|laugh/i, /furious|terrified|ecstatic/i]; const dangerIndicators = [/blood|wound|injury|hurt|pain/i, /gun|knife|weapon|attack|fight/i, /danger|threat|kill|die|death/i]; const socialIndicators = [/lie|lying|truth|honest|trust/i, /convince|persuade|manipulate/i, /feel|emotion|sad|happy|angry/i]; const mysteryIndicators = [/clue|evidence|investigate|discover/i, /secret|hidden|mystery|strange/i]; const physicalIndicators = [/room|building|street|place/i, /cold|hot|wind|rain/i, /machine|device|lock/i]; return { message, emotionalIntensity: emotionalIndicators.filter(r => r.test(message)).length / emotionalIndicators.length, dangerLevel: dangerIndicators.filter(r => r.test(message)).length / dangerIndicators.length, socialComplexity: socialIndicators.filter(r => r.test(message)).length / socialIndicators.length, mysteryLevel: mysteryIndicators.filter(r => r.test(message)).length / mysteryIndicators.length, physicalPresence: physicalIndicators.filter(r => r.test(message)).length / physicalIndicators.length }; }
    function calculateSkillRelevance(skillId, context) { const skill = SKILLS[skillId]; if (!skill) return { skillId, score: 0, reasons: [] }; const statusModifier = getSkillModifier(skillId); let score = 0; const keywordMatches = skill.triggerConditions.filter(kw => context.message.toLowerCase().includes(kw.toLowerCase())); if (keywordMatches.length > 0) score += Math.min(keywordMatches.length * 0.2, 0.6); const attr = skill.attribute; if (attr === 'PSYCHE') score += context.emotionalIntensity * 0.4; if (attr === 'PHYSIQUE') score += context.dangerLevel * 0.5; if (attr === 'INTELLECT') score += context.mysteryLevel * 0.4; if (attr === 'MOTORICS') score += context.physicalPresence * 0.3; if (statusModifier > 0) score += statusModifier * 0.25; score += getEffectiveSkillLevel(skillId) * 0.05; score += (Math.random() - 0.5) * 0.2; return { skillId, skillName: skill.name, score: Math.max(0, Math.min(1, score)), skillLevel: getSkillLevel(skillId), attribute: attr }; }
    function selectSpeakingSkills(context, options = {}) { const { minVoices = 1, maxVoices = 4 } = options; const ancientVoicesToSpeak = []; for (const ancientId of getActiveAncientVoices()) { const ancient = ANCIENT_VOICES[ancientId]; if (ancient) { const keywordMatch = ancient.triggerConditions.some(kw => context.message.toLowerCase().includes(kw.toLowerCase())); if (Math.random() < (keywordMatch ? 0.8 : 0.4)) { ancientVoicesToSpeak.push({ skillId: ancient.id, skillName: ancient.name, score: 1.0, skillLevel: 6, attribute: 'PRIMAL', isAncient: true }); discoveryContext.ancientVoiceTriggered = true; } } } const allRelevance = Object.keys(SKILLS).map(id => calculateSkillRelevance(id, context)).filter(r => r.score >= 0.3).sort((a, b) => b.score - a.score); const intensity = Math.max(context.emotionalIntensity, context.dangerLevel, context.socialComplexity); const targetVoices = Math.round(minVoices + (maxVoices - minVoices) * intensity); const selected = [...ancientVoicesToSpeak]; for (const relevance of allRelevance) { if (selected.length >= targetVoices + ancientVoicesToSpeak.length) break; if (Math.random() < relevance.score * 0.8 + 0.2) selected.push(relevance); } while (selected.filter(s => !s.isAncient).length < minVoices && allRelevance.length > 0) { const next = allRelevance.find(r => !selected.find(s => s.skillId === r.skillId)); if (next) selected.push(next); else break; } return selected; }
    function determineCheckDifficulty(selectedSkill, context) { const baseThreshold = 10; const relevanceModifier = -Math.floor(selectedSkill.score * 4); const intensityModifier = Math.floor(Math.max(context.emotionalIntensity, context.dangerLevel) * 4); const threshold = Math.max(6, Math.min(18, baseThreshold + relevanceModifier + intensityModifier)); return { shouldCheck: selectedSkill.score <= 0.8 || Math.random() > 0.3, difficulty: getDifficultyNameForThreshold(threshold).toLowerCase(), threshold }; }

    // ═══════════════════════════════════════════════════════════════
    // VOICE GENERATION (API)
    // ═══════════════════════════════════════════════════════════════

    function buildPrompt(skill, context, intrusiveData) {
        const povStyle = extensionSettings.povStyle || 'second';
        const charName = extensionSettings.characterName || 'the detective';
        const pronouns = extensionSettings.characterPronouns || 'they';
        const charContext = extensionSettings.characterContext || '';
        let povInstruction = povStyle === 'second' ? 'Address the character as "you/your".' : povStyle === 'third' ? `Refer to the character as "${charName}" using ${pronouns}/them pronouns.` : 'Speak as the character using "I/me".';
        const activeStatusList = Array.from(activeStatuses).map(id => STATUS_EFFECTS[id]).filter(Boolean);
        const statusContext = activeStatusList.length > 0 ? `\nActive states: ${activeStatusList.map(s => `${s.name} (${s.description})`).join('; ')}` : '';
        const voiceData = skill.isAncient ? ANCIENT_VOICES[skill.skillId] : SKILLS[skill.skillId];
        if (!voiceData) return null;
        const isAncient = skill.isAncient;
        const personality = voiceData.personality;
        const verbalStyle = voiceData.verbalStyle || '';
        const examples = voiceData.exampleQuotes ? `Example lines: "${voiceData.exampleQuotes.join('", "')}"` : '';
        return `You are ${voiceData.signature}, an internal voice in the character's mind from the game Disco Elysium.

${personality}
${verbalStyle ? `Style: ${verbalStyle}` : ''}
${examples}

${povInstruction}
${charContext ? `Character context: ${charContext}` : ''}
${statusContext}

The character just experienced: "${context.message.substring(0, 500)}"

Respond as ${voiceData.signature} with a brief internal commentary (1-3 sentences). ${isAncient ? 'You are an ANCIENT voice, primordial and unsettling.' : ''} Stay in character. Be ${isAncient ? 'deeply unsettling and poetic' : 'distinctive and authentic to this skill'}.`;
    }

    async function generateSingleVoice(skill, context, intrusiveData) {
        const voiceData = skill.isAncient ? ANCIENT_VOICES[skill.skillId] : SKILLS[skill.skillId];
        if (!voiceData) return null;
        const checkInfo = skill.isAncient ? null : determineCheckDifficulty(skill, context);
        let checkResult = null;
        if (checkInfo?.shouldCheck && !skill.isAncient) {
            const effectiveLevel = getEffectiveSkillLevel(skill.skillId);
            checkResult = rollSkillCheck(effectiveLevel, checkInfo.threshold);
            if (checkResult.isSnakeEyes) discoveryContext.criticalFailures[skill.skillId] = true;
            if (checkResult.isBoxcars) discoveryContext.criticalSuccesses[skill.skillId] = true;
        }
        const prompt = buildPrompt(skill, context, intrusiveData);
        if (!prompt) return null;
        let content = '';
        if (extensionSettings.apiEndpoint && extensionSettings.apiKey) {
            try {
                const response = await fetch(`${extensionSettings.apiEndpoint}/chat/completions`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${extensionSettings.apiKey}` },
                    body: JSON.stringify({ model: extensionSettings.model || 'glm-4-plus', messages: [{ role: 'user', content: prompt }], max_tokens: extensionSettings.maxTokens || 300, temperature: extensionSettings.temperature || 0.9 })
                });
                if (!response.ok) throw new Error(`API error: ${response.status}`);
                const data = await response.json();
                content = data.choices?.[0]?.message?.content || '';
            } catch (error) { console.error('[Inland Empire] API error:', error); content = generateFallbackContent(skill, context); }
        } else { content = generateFallbackContent(skill, context); }
        return { skillId: skill.skillId, skillName: voiceData.name, signature: voiceData.signature, color: voiceData.color, content: content.trim(), checkResult, attribute: skill.attribute, isAncient: skill.isAncient || false };
    }

    function generateFallbackContent(skill, context) {
        const voiceData = skill.isAncient ? ANCIENT_VOICES[skill.skillId] : SKILLS[skill.skillId];
        if (!voiceData) return "...";
        const thoughts = INTRUSIVE_THOUGHTS[skill.skillId];
        if (thoughts && thoughts.length > 0) return thoughts[Math.floor(Math.random() * thoughts.length)];
        if (voiceData.exampleQuotes && voiceData.exampleQuotes.length > 0) return voiceData.exampleQuotes[Math.floor(Math.random() * voiceData.exampleQuotes.length)];
        return "Something stirs in the back of your mind...";
    }

    async function generateVoices(selectedSkills, context, intrusiveData) {
        const voicePromises = selectedSkills.map(skill => generateSingleVoice(skill, context, intrusiveData));
        const voices = await Promise.all(voicePromises);
        return voices.filter(v => v !== null);
    }

    // ═══════════════════════════════════════════════════════════════
    // UI RENDERING
    // ═══════════════════════════════════════════════════════════════

    function togglePanel() { const panel = document.getElementById('inland-empire-panel'); const fab = document.getElementById('inland-empire-fab'); if (panel) { panel.classList.toggle('ie-panel-open'); fab?.classList.toggle('ie-fab-active'); if (panel.classList.contains('ie-panel-open')) { populateSettings(); renderStatusDisplay(); renderAttributesDisplay(); renderProfilesList(); renderCabinetTab(); updateThirdPersonVisibility(); } } }
    function switchTab(tabId) { document.querySelectorAll('.ie-tab').forEach(t => t.classList.toggle('ie-tab-active', t.dataset.tab === tabId)); document.querySelectorAll('.ie-tab-content').forEach(c => c.classList.toggle('ie-tab-content-active', c.dataset.tabContent === tabId)); if (tabId === 'cabinet') renderCabinetTab(); if (tabId === 'profiles') { renderProfilesList(); renderBuildEditor(); } if (tabId === 'status') renderStatusDisplay(); }

    function renderAttributesDisplay() {
        const container = document.getElementById('ie-attributes-display');
        if (!container) return;
        container.innerHTML = '';
        for (const [attrId, attr] of Object.entries(ATTRIBUTES)) {
            const points = currentBuild?.attributePoints?.[attrId] || 3;
            const block = document.createElement('div');
            block.className = 'ie-attribute-block';
            block.style.borderColor = attr.color;
            let skillsHtml = '';
            for (const skillId of attr.skills) {
                const skill = SKILLS[skillId];
                const baseLevel = getSkillLevel(skillId);
                const modifier = getSkillModifier(skillId);
                const effective = getEffectiveSkillLevel(skillId);
                const cap = getSkillCap(skillId);
                const abbrev = skill.name.substring(0, 3).toUpperCase();
                const modClass = modifier > 0 ? 'ie-skill-boosted' : modifier < 0 ? 'ie-skill-debuffed' : '';
                const modText = modifier !== 0 ? ` (${modifier > 0 ? '+' : ''}${modifier})` : '';
                skillsHtml += `<div class="ie-skill-row ${modClass}"><span class="ie-skill-abbrev" style="color: ${attr.color}">${abbrev}</span><div class="ie-skill-bar"><div class="ie-skill-fill" style="width: ${effective * 10}%; background: ${attr.color}"></div></div><span class="ie-skill-level">${effective}<small>/${cap}${modText}</small></span></div>`;
            }
            block.innerHTML = `<div class="ie-attr-header" style="background: ${attr.color}20"><span>${attr.name}</span><span class="ie-attr-points">${points}</span></div><div class="ie-attr-skills">${skillsHtml}</div>`;
            container.appendChild(block);
        }
    }

    function renderStatusDisplay() {
        const grid = document.getElementById('ie-status-grid');
        const summary = document.getElementById('ie-active-effects-summary');
        if (!grid) return;
        const categories = { physical: [], mental: [] };
        for (const [id, status] of Object.entries(STATUS_EFFECTS)) categories[status.category]?.push({ id, ...status });
        grid.innerHTML = '';
        for (const [cat, statuses] of Object.entries(categories)) {
            const catDiv = document.createElement('div');
            catDiv.className = 'ie-status-category';
            catDiv.innerHTML = `<div class="ie-status-category-label">${cat}</div><div class="ie-status-buttons">${statuses.map(s => `<button class="ie-status-btn ${activeStatuses.has(s.id) ? 'ie-status-active' : ''}" data-status="${s.id}" title="${s.description}"><span class="ie-status-icon">${s.icon}</span><span>${s.name}</span></button>`).join('')}</div>`;
            grid.appendChild(catDiv);
        }
        grid.querySelectorAll('.ie-status-btn').forEach(btn => btn.addEventListener('click', () => { toggleStatus(btn.dataset.status); renderStatusDisplay(); renderAttributesDisplay(); }));
        if (summary) {
            if (activeStatuses.size === 0) { summary.innerHTML = '<em>No active status effects</em>'; }
            else {
                let html = '';
                const activeAncient = getActiveAncientVoices();
                for (const statusId of activeStatuses) {
                    const status = STATUS_EFFECTS[statusId];
                    if (!status) continue;
                    html += `<div><strong>${status.icon} ${status.name}:</strong> ${status.flavorText}</div>`;
                    if (status.boosts.length) html += `<div style="color: var(--ie-success); font-size: 11px;">↑ ${status.boosts.map(s => SKILLS[s]?.name || s).join(', ')}</div>`;
                    if (status.debuffs.length) html += `<div style="color: var(--ie-error); font-size: 11px;">↓ ${status.debuffs.map(s => SKILLS[s]?.name || s).join(', ')}</div>`;
                }
                if (activeAncient.size > 0) html += `<div class="ie-ancient-warning" style="margin-top: 8px;"><strong>⚠️ Ancient voices active:</strong> ${Array.from(activeAncient).map(id => ANCIENT_VOICES[id]?.name).join(', ')}</div>`;
                summary.innerHTML = html;
            }
        }
    }

    function renderCabinetTab() {
        const container = document.getElementById('ie-cabinet-content');
        if (!container) return;
        const usedSlots = Object.keys(thoughtCabinet.researching).length;
        const topThemes = getTopThemes(6);
        let html = `<div class="ie-section ie-cabinet-slots"><div class="ie-section-header"><span>Research Slots</span><span class="ie-slots-display">${usedSlots}/${thoughtCabinet.slots}</span></div><div class="ie-slots-visual">${Array(thoughtCabinet.slots).fill(0).map((_, i) => `<div class="ie-slot ${i < usedSlots ? 'ie-slot-occupied' : 'ie-slot-empty'}">${i < usedSlots ? '💭' : '○'}</div>`).join('')}</div></div>`;
        if (extensionSettings.showThemeTracker && topThemes.length > 0) { html += `<div class="ie-section"><div class="ie-section-header"><span>Dominant Themes</span><button class="ie-btn ie-btn-sm ie-btn-reset-themes" title="Reset"><i class="fa-solid fa-rotate"></i></button></div><div class="ie-themes-grid">${topThemes.map(t => `<div class="ie-theme-item"><span class="ie-theme-icon">${t.icon}</span><span class="ie-theme-name">${t.name}</span><span class="ie-theme-count">${t.count}</span></div>`).join('')}</div></div>`; }
        if (Object.keys(thoughtCabinet.researching).length > 0) { html += `<div class="ie-section"><div class="ie-section-header"><span>Researching</span></div><div class="ie-researching-list">${Object.entries(thoughtCabinet.researching).map(([id, data]) => { const thought = THOUGHTS[id]; if (!thought) return ''; const progress = Math.min(100, (data.progress / thought.researchTime) * 100); const penaltyText = thought.researchPenalty ? Object.entries(thought.researchPenalty).map(([s, v]) => `${v} ${SKILLS[s]?.name || s}`).join(', ') : ''; return `<div class="ie-research-card"><div class="ie-research-header"><span class="ie-research-icon">${thought.icon}</span><span class="ie-research-name">${thought.name}</span><button class="ie-btn ie-btn-icon ie-btn-abandon" data-thought="${id}" title="Abandon"><i class="fa-solid fa-times"></i></button></div><div class="ie-research-progress-bar"><div class="ie-research-progress-fill" style="width: ${progress}%"></div></div><div class="ie-research-info"><span>${Math.floor(progress)}%</span>${penaltyText ? `<span class="ie-research-penalties">${penaltyText}</span>` : ''}</div></div>`; }).join('')}</div></div>`; }
        if (thoughtCabinet.discovered.length > 0) { html += `<div class="ie-section"><div class="ie-section-header"><span>Discovered</span></div><div class="ie-discovered-list">${thoughtCabinet.discovered.map(id => { const thought = THOUGHTS[id]; if (!thought) return ''; return `<div class="ie-discovered-card"><div class="ie-discovered-header"><span class="ie-discovered-icon">${thought.icon}</span><span class="ie-discovered-name">${thought.name}</span></div><div class="ie-discovered-desc">${thought.description}</div><div class="ie-discovered-actions"><button class="ie-btn ie-btn-sm ie-btn-research" data-thought="${id}">Research</button><button class="ie-btn ie-btn-sm ie-btn-dismiss-thought" data-thought="${id}">Dismiss</button></div></div>`; }).join('')}</div></div>`; }
        if (thoughtCabinet.internalized.length > 0) { html += `<div class="ie-section"><div class="ie-section-header"><span>Internalized</span></div><div class="ie-internalized-list">${thoughtCabinet.internalized.map(id => { const thought = THOUGHTS[id]; if (!thought) return ''; const bonusText = thought.internalizedBonus ? Object.entries(thought.internalizedBonus).map(([s, v]) => `+${v} ${SKILLS[s]?.name?.substring(0, 3) || s}`).join(' ') : ''; return `<div class="ie-internalized-card"><span class="ie-internalized-icon">${thought.icon}</span><span class="ie-internalized-name">${thought.name}</span>${bonusText ? `<span class="ie-internalized-bonuses">${bonusText}</span>` : ''}</div>`; }).join('')}</div></div>`; }
        container.innerHTML = html;
        container.querySelectorAll('.ie-btn-research').forEach(btn => btn.addEventListener('click', () => { if (startResearch(btn.dataset.thought)) { showToast('Research started!', 'success', 2000); renderCabinetTab(); } else showToast('No slots available!', 'error', 2000); }));
        container.querySelectorAll('.ie-btn-abandon').forEach(btn => btn.addEventListener('click', () => { abandonResearch(btn.dataset.thought); renderCabinetTab(); }));
        container.querySelectorAll('.ie-btn-dismiss-thought').forEach(btn => btn.addEventListener('click', () => { dismissThought(btn.dataset.thought); renderCabinetTab(); }));
        container.querySelector('.ie-btn-reset-themes')?.addEventListener('click', () => { resetThemeCounters(); renderCabinetTab(); showToast('Themes reset', 'info', 1500); });
    }

    function renderProfilesList() {
        const container = document.getElementById('ie-profiles-list');
        if (!container) return;
        const profiles = Object.values(savedProfiles);
        if (profiles.length === 0) { container.innerHTML = '<div class="ie-empty-state"><i class="fa-solid fa-user-slash"></i><span>No saved profiles</span></div>'; return; }
        container.innerHTML = profiles.map(p => {
            const attrSummary = p.build?.attributePoints ? `INT:${p.build.attributePoints.INTELLECT} PSY:${p.build.attributePoints.PSYCHE} PHY:${p.build.attributePoints.PHYSIQUE} MOT:${p.build.attributePoints.MOTORICS}` : '';
            return `<div class="ie-profile-card"><div class="ie-profile-info"><span class="ie-profile-name">${p.name}</span><span class="ie-profile-details">${attrSummary}</span></div><div class="ie-profile-actions"><button class="ie-btn ie-btn-sm ie-btn-load-profile" data-profile="${p.id}" title="Load"><i class="fa-solid fa-upload"></i></button><button class="ie-btn ie-btn-sm ie-btn-delete-profile" data-profile="${p.id}" title="Delete"><i class="fa-solid fa-trash"></i></button></div></div>`;
        }).join('');
        container.querySelectorAll('.ie-btn-load-profile').forEach(btn => btn.addEventListener('click', () => { if (loadProfile(btn.dataset.profile)) { showToast('Profile loaded!', 'success', 2000); renderAttributesDisplay(); renderStatusDisplay(); renderCabinetTab(); populateSettings(); } }));
        container.querySelectorAll('.ie-btn-delete-profile').forEach(btn => btn.addEventListener('click', () => { if (deleteProfile(btn.dataset.profile)) { showToast('Profile deleted', 'info', 2000); renderProfilesList(); } }));
    }

    function renderBuildEditor() {
        const container = document.getElementById('ie-attributes-editor');
        const pointsDisplay = document.getElementById('ie-points-remaining');
        if (!container) return;
        const current = currentBuild?.attributePoints || DEFAULT_ATTRIBUTE_POINTS;
        container.innerHTML = Object.entries(ATTRIBUTES).map(([id, attr]) => `<div class="ie-attribute-row"><div class="ie-attribute-label"><span style="color: ${attr.color}">${attr.name}</span><span id="ie-attr-val-${id}">${current[id]}</span></div><input type="range" class="ie-attribute-slider" data-attr="${id}" min="1" max="6" value="${current[id]}" style="accent-color: ${attr.color}" /></div>`).join('');
        const updatePoints = () => { let total = 0; container.querySelectorAll('.ie-attribute-slider').forEach(s => { total += parseInt(s.value); document.getElementById(`ie-attr-val-${s.dataset.attr}`).textContent = s.value; }); if (pointsDisplay) { pointsDisplay.textContent = 12 - total; pointsDisplay.style.color = total === 12 ? 'var(--ie-success)' : total > 12 ? 'var(--ie-error)' : 'var(--ie-accent)'; } };
        container.querySelectorAll('.ie-attribute-slider').forEach(s => s.addEventListener('input', updatePoints));
        updatePoints();
    }

    function applyBuild() {
        const container = document.getElementById('ie-attributes-editor');
        if (!container) return;
        const newPoints = {};
        container.querySelectorAll('.ie-attribute-slider').forEach(s => { newPoints[s.dataset.attr] = parseInt(s.value); });
        const total = Object.values(newPoints).reduce((a, b) => a + b, 0);
        if (total !== 12) { showToast(`Points must equal 12 (currently ${total})`, 'error', 2000); return; }
        try { applyAttributeAllocation(newPoints); saveState(getSTContext()); renderAttributesDisplay(); showToast('Build applied!', 'success', 2000); } catch (e) { showToast(e.message, 'error', 2000); }
    }

    function displayVoices(voices) {
        const container = document.getElementById('ie-voices-output');
        if (!container || voices.length === 0) return;
        const batch = document.createElement('div');
        batch.className = 'ie-voices-batch';
        for (const voice of voices) {
            const entry = document.createElement('div');
            entry.className = 'ie-voice-entry';
            if (voice.isIntrusive) entry.classList.add('ie-voice-intrusive');
            if (voice.isObject) entry.classList.add('ie-voice-object');
            if (voice.isAncient) entry.classList.add('ie-voice-ancient');
            let checkHtml = '';
            if (voice.checkResult && extensionSettings.showDiceRolls) {
                const cr = voice.checkResult;
                const resultClass = cr.isBoxcars ? 'critical-success' : cr.isSnakeEyes ? 'critical-failure' : cr.success ? 'success' : 'failure';
                const resultText = cr.isBoxcars ? '⭐ CRITICAL' : cr.isSnakeEyes ? '💀 FUMBLE' : cr.success ? '✓' : '✗';
                checkHtml = `<span class="ie-voice-check ${resultClass}">[${cr.dice[0]}+${cr.dice[1]}+${cr.skillLevel}=${cr.total} vs ${cr.threshold}] ${resultText}</span>`;
            }
            entry.innerHTML = `<span class="ie-voice-signature" style="color: ${voice.color}">${voice.signature}${checkHtml}</span> – ${voice.content}`;
            batch.appendChild(entry);
        }
        container.innerHTML = '';
        container.appendChild(batch);
    }

    function injectVoicesIntoChat(voices, messageElement, intrusiveData) {
        if (!messageElement || voices.length === 0) return;
        const existingChorus = messageElement.querySelector('.ie-chat-voices');
        if (existingChorus) existingChorus.remove();
        const hasAncient = voices.some(v => v.isAncient) || intrusiveData?.intrusive?.isAncient;
        const hasObject = intrusiveData?.objects?.length > 0;
        const hasIntrusive = intrusiveData?.intrusive && !intrusiveData.intrusive.isAncient;
        const chorus = document.createElement('div');
        chorus.className = 'ie-chat-voices';
        if (hasAncient) chorus.classList.add('ie-has-ancient');
        if (hasObject) chorus.classList.add('ie-has-object');
        if (hasIntrusive) chorus.classList.add('ie-has-intrusive');
        let linesHtml = '';
        if (intrusiveData?.intrusive) {
            const int = intrusiveData.intrusive;
            const icon = int.isAncient ? '🦎' : '💭';
            linesHtml += `<div class="ie-chorus-line ${int.isAncient ? 'ie-ancient-line' : 'ie-intrusive-line'}"><span class="ie-line-icon">${icon}</span><span class="ie-chorus-name" style="color: ${int.color}">${int.signature}:</span> ${int.content}</div>`;
        }
        if (intrusiveData?.objects) {
            for (const obj of intrusiveData.objects) {
                linesHtml += `<div class="ie-chorus-line ie-object-line"><span class="ie-line-icon">${obj.icon}</span><span class="ie-chorus-name" style="color: ${obj.color}">${obj.name}:</span> ${obj.content}</div>`;
            }
        }
        for (const voice of voices) {
            let checkHtml = '';
            if (voice.checkResult && extensionSettings.showDiceRolls) {
                const cr = voice.checkResult;
                const resultClass = cr.isBoxcars ? 'critical-success' : cr.isSnakeEyes ? 'critical-failure' : cr.success ? 'success' : 'failure';
                checkHtml = `<span class="ie-voice-check ${resultClass}">[${cr.dice[0]}+${cr.dice[1]}] ${cr.isBoxcars ? '⭐' : cr.isSnakeEyes ? '💀' : cr.success ? '✓' : '✗'}</span>`;
            }
            const lineClass = voice.isAncient ? 'ie-ancient-line' : '';
            const icon = voice.isAncient ? '🦎' : '';
            linesHtml += `<div class="ie-chorus-line ${lineClass}">${icon ? `<span class="ie-line-icon">${icon}</span>` : ''}<span class="ie-chorus-name" style="color: ${voice.color}">${voice.signature}${checkHtml}:</span> ${voice.content}</div>`;
        }
        chorus.innerHTML = `<div class="ie-chorus-header"><i class="fa-solid fa-brain"></i><span>INNER VOICES</span></div><div class="ie-chorus-content">${linesHtml}</div>`;
        const mesText = messageElement.querySelector('.mes_text');
        if (mesText) mesText.insertAdjacentElement('afterend', chorus);
        else messageElement.appendChild(chorus);
    }

    function getLastMessageElement() { const messages = document.querySelectorAll('.mes[is_user="false"]'); return messages.length > 0 ? messages[messages.length - 1] : null; }

    function populateSettings() {
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
        const setChecked = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
        setVal('ie-api-endpoint', extensionSettings.apiEndpoint || '');
        setVal('ie-api-key', extensionSettings.apiKey || '');
        setVal('ie-model', extensionSettings.model || 'glm-4-plus');
        setVal('ie-temperature', extensionSettings.temperature || 0.9);
        setVal('ie-max-tokens', extensionSettings.maxTokens || 300);
        setVal('ie-min-voices', extensionSettings.minVoices || 1);
        setVal('ie-max-voices', extensionSettings.maxVoices || 4);
        setVal('ie-trigger-delay', extensionSettings.triggerDelay || 1000);
        setChecked('ie-show-dice-rolls', extensionSettings.showDiceRolls !== false);
        setChecked('ie-show-failed-checks', extensionSettings.showFailedChecks !== false);
        setChecked('ie-auto-trigger', extensionSettings.autoTrigger || false);
        setChecked('ie-auto-detect-status', extensionSettings.autoDetectStatus || false);
        setChecked('ie-intrusive-enabled', extensionSettings.intrusiveEnabled !== false);
        setChecked('ie-intrusive-in-chat', extensionSettings.intrusiveInChat !== false);
        setVal('ie-intrusive-chance', Math.round((extensionSettings.intrusiveChance || 0.15) * 100));
        setChecked('ie-object-voices-enabled', extensionSettings.objectVoicesEnabled !== false);
        setVal('ie-object-chance', Math.round((extensionSettings.objectVoiceChance || 0.4) * 100));
        setChecked('ie-thought-discovery-enabled', extensionSettings.thoughtDiscoveryEnabled !== false);
        setChecked('ie-auto-discover-thoughts', extensionSettings.autoDiscoverThoughts !== false);
        setVal('ie-pov-style', extensionSettings.povStyle || 'second');
        setVal('ie-character-name', extensionSettings.characterName || '');
        setVal('ie-character-pronouns', extensionSettings.characterPronouns || 'they');
        setVal('ie-character-context', extensionSettings.characterContext || '');
    }

    function saveSettings() {
        const getVal = (id) => document.getElementById(id)?.value || '';
        const getChecked = (id) => document.getElementById(id)?.checked || false;
        const getNum = (id, def) => parseFloat(document.getElementById(id)?.value) || def;
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
        extensionSettings.intrusiveChance = getNum('ie-intrusive-chance', 15) / 100;
        extensionSettings.objectVoicesEnabled = getChecked('ie-object-voices-enabled');
        extensionSettings.objectVoiceChance = getNum('ie-object-chance', 40) / 100;
        extensionSettings.thoughtDiscoveryEnabled = getChecked('ie-thought-discovery-enabled');
        extensionSettings.autoDiscoverThoughts = getChecked('ie-auto-discover-thoughts');
        extensionSettings.povStyle = getVal('ie-pov-style');
        extensionSettings.characterName = getVal('ie-character-name');
        extensionSettings.characterPronouns = getVal('ie-character-pronouns');
        extensionSettings.characterContext = getVal('ie-character-context');
        saveState(getSTContext());
        showToast('Settings saved!', 'success', 2000);
    }

    function updateThirdPersonVisibility() { const povStyle = document.getElementById('ie-pov-style')?.value; document.querySelectorAll('.ie-third-person-options').forEach(el => { el.style.display = povStyle === 'third' ? 'block' : 'none'; }); }

    // ═══════════════════════════════════════════════════════════════
    // EVENT HANDLERS & INITIALIZATION
    // ═══════════════════════════════════════════════════════════════

    let triggerTimeout = null;
    let isGenerating = false;

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
            for (const thoughtId of completedThoughts) { const thought = THOUGHTS[thoughtId]; if (thought) showInternalizedToast(thought); }

            const newlyDiscovered = checkThoughtDiscovery();
            for (const thought of newlyDiscovered) setTimeout(() => showDiscoveryToast(thought), 1000);

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
                    <div class="ie-section"><div class="ie-section-header"><span>Ancient Voices</span></div><div class="ie-ancient-voices-info"><div class="ie-ancient-voice-item"><span class="ie-ancient-icon">🦎</span><span class="ie-ancient-name">Ancient Reptilian Brain</span><span class="ie-ancient-triggers">Triggers: Exhausted, Starving, Terrified, Aroused, Dissociated, Apocalypse Cop</span></div><div class="ie-ancient-voice-item"><span class="ie-ancient-icon">❤️‍🔥</span><span class="ie-ancient-name">Limbic System</span><span class="ie-ancient-triggers">Triggers: Hung Over, Wounded, Doom Spiral, Enraged, Terrified, Grieving, Manic</span></div><div class="ie-ancient-voice-item"><span class="ie-ancient-icon">🦴</span><span class="ie-ancient-name">Spinal Cord</span><span class="ie-ancient-triggers">Triggers: Disco Fever, Dance keywords</span></div></div></div>
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
        settingsContainer.insertAdjacentHTML('beforeend', `<div id="inland-empire-extension-settings"><div class="inline-drawer"><div class="inline-drawer-toggle inline-drawer-header"><b><i class="fa-solid fa-brain"></i> Inland Empire</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div><div class="inline-drawer-content"><label class="checkbox_label" for="ie-extension-enabled"><input type="checkbox" id="ie-extension-enabled" ${extensionSettings.enabled ? 'checked' : ''} /><span>Enable Inland Empire</span></label><small>Disco Elysium-style internal voices with authentic personalities!</small><br><br><button id="ie-toggle-panel-btn" class="menu_button"><i class="fa-solid fa-eye"></i> Toggle Panel</button></div></div></div>`);
        document.getElementById('ie-extension-enabled')?.addEventListener('change', (e) => { extensionSettings.enabled = e.target.checked; saveState(getSTContext()); const fab = document.getElementById('inland-empire-fab'); const panel = document.getElementById('inland-empire-panel'); if (fab) fab.style.display = e.target.checked ? 'flex' : 'none'; if (panel && !e.target.checked) panel.classList.remove('ie-panel-open'); });
        document.getElementById('ie-toggle-panel-btn')?.addEventListener('click', togglePanel);
    }

    async function init() {
        console.log('[Inland Empire] Starting initialization v0.8.0 - Authentic Voices Edition...');
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
            console.log('[Inland Empire] ✅ Initialization complete');
        } catch (error) { console.error('[Inland Empire] ❌ Initialization failed:', error); }
    }

    window.InlandEmpire = { getSkillLevel, getAllSkillLevels, rollSkillCheck, getSkillCap, getEffectiveSkillLevel, SKILLS, ATTRIBUTES, ANCIENT_VOICES, THOUGHTS, THEMES, STATUS_EFFECTS, thoughtCabinet, themeCounters, startResearch, abandonResearch, internalizeThought, checkThoughtDiscovery };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    else setTimeout(init, 1000);
})();
