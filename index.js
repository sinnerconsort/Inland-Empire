/**
 * Inland Empire - Disco Elysium-style Internal Voices for SillyTavern
 * v0.7.0 - Thought Cabinet, Theme Tracking, Skill Caps
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
    // CORE DATA - ATTRIBUTES & SKILLS
    // ═══════════════════════════════════════════════════════════════

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
        pain_threshold: { id: 'pain_threshold', name: 'Pain Threshold', attribute: 'PHYSIQUE', color: '#DC143C', signature: 'PAIN THRESHOLD', personality: 'You are PAIN THRESHOLD, greeting pain as an old friend.', triggerConditions: ['pain', 'hurt', 'injury', 'wound', 'damage', 'suffer', 'agony', 'torture', 'broken', 'bleeding'] },
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
        ancient_reptilian_brain: { id: 'ancient_reptilian_brain', name: 'Ancient Reptilian Brain', color: '#2F4F4F', signature: 'ANCIENT REPTILIAN BRAIN', attribute: 'PRIMAL', personality: 'You are the ANCIENT REPTILIAN BRAIN. You speak in POETIC NIHILISM.', triggerConditions: ['survive', 'hunger', 'predator', 'prey', 'instinct', 'primal', 'ancient', 'drowning', 'sinking', 'deep', 'memory', 'past', 'forget'] },
        limbic_system: { id: 'limbic_system', name: 'Limbic System', color: '#FF4500', signature: 'LIMBIC SYSTEM', attribute: 'PRIMAL', personality: 'You are the LIMBIC SYSTEM - pure emotion. You SCREAM warnings.', triggerConditions: ['overwhelmed', 'breakdown', 'sobbing', 'screaming', 'euphoria', 'despair', 'emotion', 'memory', 'afraid', 'scared', 'hurt'] }
    };

    // ═══════════════════════════════════════════════════════════════
    // INTRUSIVE THOUGHTS
    // ═══════════════════════════════════════════════════════════════

    const INTRUSIVE_THOUGHTS = {
        logic: ["This doesn't add up. None of it adds up.", "There's a flaw in their reasoning. Find it.", "If A leads to B, and B leads to C... what leads to A?"],
        encyclopedia: ["Did you know that the human body contains enough iron to make a small nail?", "Historically speaking, this situation has precedent...", "Actually, that's a common misconception."],
        rhetoric: ["They're building to something. A point. An attack.", "Notice how they avoided the question entirely.", "Words are weapons. Choose yours carefully."],
        drama: ["They're performing. But for whose benefit?", "That smile doesn't reach their eyes.", "Everyone's wearing masks here. Including you."],
        conceptualization: ["There's a metaphor here, struggling to be born.", "The aesthetic implications alone...", "This could be art. This SHOULD be art."],
        visual_calculus: ["The angle is wrong. Something happened here.", "Trace the trajectory. Where does it lead?", "The geometry of the room tells a story."],
        volition: ["You can do this. You HAVE to do this.", "Don't give up. Not now. Not ever.", "One step at a time. Just one more step."],
        inland_empire: ["Something is watching. Not hostile. Just... watching.", "The walls remember things. Ask them.", "Reality is thin in this place."],
        empathy: ["They're hurting. Even if they won't show it.", "You know this feeling. You've felt it too.", "They need someone to understand. Will you?"],
        authority: ["You're in charge here. Act like it.", "They're testing you. Don't let them.", "Your voice. Deeper. More commanding. NOW."],
        suggestion: ["A gentle nudge in the right direction...", "Plant the seed. Let it grow.", "Charm is just manipulation with a smile."],
        esprit_de_corps: ["Your partner is thinking the same thing.", "We look out for our own.", "There's a code. Unspoken. Sacred."],
        endurance: ["Your body is screaming. Ignore it.", "Pain is temporary. Failure is forever.", "The flesh is weak. The will is not."],
        pain_threshold: ["That's going to hurt tomorrow. Good.", "Pain means you're still alive.", "Scars are just stories written on skin."],
        physical_instrument: ["You could break that with your bare hands.", "Violence is always an option. Remember that.", "Sometimes problems need to be... solved physically."],
        electrochemistry: ["God, you could use a drink right now.", "They're attractive. Very attractive.", "Just a taste. What's the harm?"],
        half_light: ["They're going to attack. Be ready.", "Something's wrong. Something's VERY wrong.", "That shadow moved. Did you see it move?"],
        shivers: ["The city breathes tonight.", "This place remembers. The stones remember.", "A chill. Not from the cold. From... elsewhere."],
        hand_eye_coordination: ["Steady hands. Steady breath.", "Don't rush. Let the movement flow.", "Your fingers know what to do."],
        perception: ["There. Did you see that?", "Something's different. What changed?", "The detail everyone else missed..."],
        reaction_speed: ["Move. NOW.", "Be ready. Something's about to happen.", "Your reflexes are your only friend here."],
        savoir_faire: ["Do it with style or don't do it at all.", "Make it look effortless.", "Boring solutions are for boring people."],
        interfacing: ["That mechanism has a weakness. Find it.", "The machine wants to help. Let it.", "There's always a way in."],
        composure: ["Don't let them see you sweat.", "Control your face. Control the situation.", "The mask stays on. Always."]
    };

    // ═══════════════════════════════════════════════════════════════
    // OBJECT VOICES
    // ═══════════════════════════════════════════════════════════════

    const OBJECT_VOICES = {
        tie: { name: 'THE TIE', icon: '👔', color: '#8B0000', patterns: [/\btie\b/i, /\bnecktie\b/i], affinitySkill: 'inland_empire', lines: ["Wear me. You'll look *powerful*.", "I could strangle someone, you know.", "They're laughing at your neck. Cover it. With ME."] },
        gun: { name: 'THE GUN', icon: '🔫', color: '#4A4A4A', patterns: [/\bgun\b/i, /\bpistol\b/i, /\brevolver\b/i, /\bfirearm\b/i], affinitySkill: 'half_light', lines: ["Still loaded. Still waiting.", "Point me at the problem. I'll solve it.", "Everyone respects me. EVERYONE."] },
        bottle: { name: 'THE BOTTLE', icon: '🍾', color: '#2E8B57', patterns: [/\bbottle\b/i, /\bwhiskey\b/i, /\bwine\b/i, /\bvodka\b/i, /\bbeer\b/i, /\balcohol\b/i], affinitySkill: 'electrochemistry', lines: ["One sip. Just to take the edge off.", "I miss you. We were so good together.", "The answer is at the bottom."] },
        mirror: { name: 'THE MIRROR', icon: '🪞', color: '#C0C0C0', patterns: [/\bmirror\b/i, /\breflection\b/i], affinitySkill: 'volition', lines: ["Look at yourself. LOOK.", "Who is that? Do you even know anymore?", "I show the truth. You just don't want to see it."] },
        photograph: { name: 'THE PHOTOGRAPH', icon: '📷', color: '#DEB887', patterns: [/\bphoto\b/i, /\bphotograph\b/i, /\bpicture\b/i], affinitySkill: 'empathy', lines: ["They were happy then. What happened?", "Frozen moments. Frozen time.", "Someone is missing from this picture."] },
        door: { name: 'THE DOOR', icon: '🚪', color: '#8B4513', patterns: [/\bdoor\b/i, /\bdoorway\b/i], affinitySkill: 'shivers', lines: ["What's on the other side?", "Some doors should stay closed.", "I am the threshold. Choose."] },
        money: { name: 'THE MONEY', icon: '💵', color: '#228B22', patterns: [/\bmoney\b/i, /\bcash\b/i, /\bcoin\b/i, /\bwallet\b/i], affinitySkill: 'suggestion', lines: ["Everyone has a price. Even you.", "I open doors. I close mouths.", "Count me. Know your worth."] },
        bed: { name: 'THE BED', icon: '🛏️', color: '#4169E1', patterns: [/\bbed\b/i, /\bmattress\b/i], affinitySkill: 'endurance', lines: ["Just five more minutes. Forever.", "You don't sleep here. You hide here.", "Rest now. The world can wait."] },
        cigarette: { name: 'THE CIGARETTE', icon: '🚬', color: '#A0522D', patterns: [/\bcigarette\b/i, /\bsmoke\b/i, /\bsmoking\b/i], affinitySkill: 'electrochemistry', lines: ["Light me. Let me kill you slowly.", "We're old friends, you and I.", "Each breath a little death. Worth it."] },
        clock: { name: 'THE CLOCK', icon: '🕐', color: '#DAA520', patterns: [/\bclock\b/i, /\btime\b/i, /\bwatch\b/i], affinitySkill: 'composure', lines: ["Tick. Tock. Running out.", "I count the seconds you waste.", "Every tick brings you closer to the end."] }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATUS EFFECTS
    // ═══════════════════════════════════════════════════════════════

    const STATUS_EFFECTS = {
        intoxicated: { id: 'intoxicated', name: 'Intoxicated', icon: '🍺', category: 'physical', boosts: ['electrochemistry', 'inland_empire', 'drama', 'suggestion'], debuffs: ['logic', 'hand_eye_coordination', 'reaction_speed', 'composure'], difficultyMod: 2, keywords: ['drunk', 'intoxicated', 'wasted', 'high', 'tipsy'], ancientVoice: null, intrusiveBoost: ['electrochemistry', 'inland_empire'] },
        wounded: { id: 'wounded', name: 'Wounded', icon: '🩸', category: 'physical', boosts: ['pain_threshold', 'endurance', 'half_light'], debuffs: ['composure', 'savoir_faire', 'hand_eye_coordination'], difficultyMod: 2, keywords: ['hurt', 'wounded', 'injured', 'bleeding', 'pain'], ancientVoice: null, intrusiveBoost: ['pain_threshold', 'half_light'] },
        exhausted: { id: 'exhausted', name: 'Exhausted', icon: '😴', category: 'physical', boosts: ['volition', 'inland_empire'], debuffs: ['reaction_speed', 'perception', 'logic'], difficultyMod: 2, keywords: ['tired', 'exhausted', 'sleepy', 'drowsy', 'fatigued'], ancientVoice: null, intrusiveBoost: ['inland_empire', 'endurance'] },
        starving: { id: 'starving', name: 'Starving', icon: '🍽️', category: 'physical', boosts: ['electrochemistry', 'perception'], debuffs: ['logic', 'composure', 'volition'], difficultyMod: 1, keywords: ['hungry', 'starving', 'famished'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['electrochemistry'] },
        dying: { id: 'dying', name: 'Dying', icon: '💀', category: 'physical', boosts: ['pain_threshold', 'inland_empire', 'shivers'], debuffs: ['logic', 'rhetoric', 'authority'], difficultyMod: 4, keywords: ['dying', 'death', 'fading'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['inland_empire', 'shivers'] },
        paranoid: { id: 'paranoid', name: 'Paranoid', icon: '👁️', category: 'mental', boosts: ['half_light', 'perception', 'shivers'], debuffs: ['empathy', 'suggestion', 'composure'], difficultyMod: 1, keywords: ['paranoid', 'suspicious', 'watching', 'followed'], ancientVoice: null, intrusiveBoost: ['half_light', 'perception'] },
        aroused: { id: 'aroused', name: 'Aroused', icon: '💋', category: 'mental', boosts: ['electrochemistry', 'suggestion', 'empathy', 'drama'], debuffs: ['logic', 'volition', 'composure'], difficultyMod: 2, keywords: ['aroused', 'desire', 'attraction', 'lust'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['electrochemistry', 'suggestion'] },
        enraged: { id: 'enraged', name: 'Enraged', icon: '😤', category: 'mental', boosts: ['authority', 'physical_instrument', 'half_light'], debuffs: ['empathy', 'composure', 'logic'], difficultyMod: 2, keywords: ['angry', 'furious', 'rage', 'mad'], ancientVoice: 'limbic_system', intrusiveBoost: ['half_light', 'authority', 'physical_instrument'] },
        terrified: { id: 'terrified', name: 'Terrified', icon: '😨', category: 'mental', boosts: ['half_light', 'shivers', 'reaction_speed', 'perception'], debuffs: ['authority', 'composure', 'rhetoric'], difficultyMod: 2, keywords: ['scared', 'afraid', 'terrified', 'fear'], ancientVoice: 'ancient_reptilian_brain', intrusiveBoost: ['half_light', 'shivers'] },
        confident: { id: 'confident', name: 'Confident', icon: '😎', category: 'mental', boosts: ['authority', 'savoir_faire', 'rhetoric', 'suggestion'], debuffs: ['inland_empire', 'empathy'], difficultyMod: -1, keywords: ['confident', 'bold', 'assured', 'swagger'], ancientVoice: null, intrusiveBoost: ['authority', 'savoir_faire'] },
        grieving: { id: 'grieving', name: 'Grieving', icon: '😢', category: 'mental', boosts: ['empathy', 'inland_empire', 'shivers', 'volition'], debuffs: ['authority', 'electrochemistry', 'savoir_faire'], difficultyMod: 2, keywords: ['grief', 'loss', 'mourning', 'tears'], ancientVoice: 'limbic_system', intrusiveBoost: ['empathy', 'inland_empire'] },
        manic: { id: 'manic', name: 'Manic', icon: '⚡', category: 'mental', boosts: ['electrochemistry', 'reaction_speed', 'conceptualization', 'inland_empire'], debuffs: ['composure', 'logic', 'volition'], difficultyMod: 1, keywords: ['manic', 'hyper', 'racing', 'unstoppable'], ancientVoice: 'limbic_system', intrusiveBoost: ['electrochemistry', 'conceptualization'] },
        dissociated: { id: 'dissociated', name: 'Dissociated', icon: '🌫️', category: 'mental', boosts: ['inland_empire', 'shivers', 'pain_threshold'], debuffs: ['perception', 'reaction_speed', 'empathy'], difficultyMod: 2, keywords: ['dissociate', 'unreal', 'floating', 'numb'], ancientVoice: null, intrusiveBoost: ['inland_empire', 'shivers'] }
    };

    // ═══════════════════════════════════════════════════════════════
    // v0.7.0 NEW: THEMES FOR THOUGHT CABINET
    // ═══════════════════════════════════════════════════════════════

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

    // ═══════════════════════════════════════════════════════════════
    // v0.7.0 NEW: THOUGHT DEFINITIONS
    // ═══════════════════════════════════════════════════════════════

    const THOUGHTS = {
        volumetric_shit_compressor: {
            id: 'volumetric_shit_compressor', name: 'Volumetric Shit Compressor', icon: '💩', category: 'philosophy',
            description: 'What if you compressed all your failures into a singularity?',
            discoveryConditions: { themes: { failure: 5, philosophy: 3 } },
            researchTime: 6, researchPenalty: { logic: -1 },
            internalizedBonus: { conceptualization: 2 }, capModifier: { logic: 1 },
            flavorText: 'You have created a black hole of self-criticism. It is beautiful.'
        },
        hobocop: {
            id: 'hobocop', name: 'Hobocop', icon: '🥫', category: 'identity',
            description: 'A different kind of law enforcement. For the people, by the people.',
            discoveryConditions: { themes: { money: 5, authority: 3 } },
            researchTime: 8, researchPenalty: { authority: -1 },
            internalizedBonus: { shivers: 2 }, capModifier: { shivers: 1 },
            flavorText: 'You patrol the margins. The forgotten places. Someone has to.'
        },
        bringing_of_the_law: {
            id: 'bringing_of_the_law', name: 'Bringing of the Law', icon: '⚖️', category: 'authority',
            description: 'The law is not just words. It is FORCE.',
            discoveryConditions: { criticalSuccess: 'authority' },
            researchTime: 10, researchPenalty: { empathy: -1, suggestion: -1 },
            internalizedBonus: { authority: 3 }, capModifier: { authority: 2 },
            flavorText: 'You ARE the law. And the law... is VIOLENCE.'
        },
        kingdom_of_conscience: {
            id: 'kingdom_of_conscience', name: 'Kingdom of Conscience', icon: '👑', category: 'philosophy',
            description: 'What if morality was the only kingdom worth ruling?',
            discoveryConditions: { themes: { philosophy: 6 }, minSkill: { volition: 4 } },
            researchTime: 12, researchPenalty: { electrochemistry: -2 },
            internalizedBonus: { volition: 2 }, capModifier: { volition: 2 },
            flavorText: 'Pleasure fades. Conscience endures. You have chosen your kingdom.'
        },
        motorway_south: {
            id: 'motorway_south', name: 'Motorway South', icon: '🛣️', category: 'escape',
            description: 'There is always a road out. Always a direction away.',
            discoveryConditions: { themes: { failure: 4, identity: 3 } },
            researchTime: 7, researchPenalty: { esprit_de_corps: -1 },
            internalizedBonus: { composure: 2 }, capModifier: { composure: 1 },
            flavorText: 'You can see it now. The road that leads away from everything.'
        },
        anti_object_task_force: {
            id: 'anti_object_task_force', name: 'Anti-Object Task Force', icon: '🚫', category: 'mental',
            description: 'The objects speak too much. It is time to silence them.',
            discoveryConditions: { objectCount: 5 },
            researchTime: 6, researchPenalty: { inland_empire: -1 },
            internalizedBonus: { logic: 1, composure: 1 }, capModifier: { logic: 1 },
            flavorText: 'Objects are just objects. They cannot speak. They never could.',
            specialEffect: 'objectVoiceReduction'
        },
        cop_of_the_apocalypse: {
            id: 'cop_of_the_apocalypse', name: 'Cop of the Apocalypse', icon: '🔥', category: 'identity',
            description: 'When the world ends, someone still needs to enforce the law.',
            discoveryConditions: { themes: { death: 6, authority: 4 } },
            researchTime: 14, researchPenalty: { empathy: -2 },
            internalizedBonus: { half_light: 2, authority: 1 }, capModifier: { half_light: 1 },
            flavorText: 'The badge still means something. Even at the end of all things.'
        },
        caustic_echo: {
            id: 'caustic_echo', name: 'Caustic Echo', icon: '🗣️', category: 'social',
            description: 'Your words burn. Learn to aim them.',
            discoveryConditions: { criticalSuccess: 'rhetoric' },
            researchTime: 8, researchPenalty: { suggestion: -1 },
            internalizedBonus: { rhetoric: 2 }, capModifier: { rhetoric: 1 },
            flavorText: 'Every word a weapon. Every sentence a scar.'
        },
        waste_land_of_reality: {
            id: 'waste_land_of_reality', name: 'Waste Land of Reality', icon: '🏜️', category: 'philosophy',
            description: 'Reality is a desert. Your mind is an oasis.',
            discoveryConditions: { themes: { supernatural: 4 }, status: 'dissociated' },
            researchTime: 10, researchPenalty: { perception: -1 },
            internalizedBonus: { inland_empire: 2 }, capModifier: { inland_empire: 1 },
            flavorText: 'The real is not real. The unreal... is home.'
        },
        lovers_lament: {
            id: 'lovers_lament', name: "Lover's Lament", icon: '💔', category: 'emotion',
            description: 'Love lost is still love. Pain is proof of connection.',
            discoveryConditions: { themes: { love: 5, failure: 3 } },
            researchTime: 9, researchPenalty: { composure: -1 },
            internalizedBonus: { empathy: 2 }, capModifier: { empathy: 1 },
            flavorText: 'You loved. You lost. You are still capable of both.'
        },
        finger_on_the_eject_button: {
            id: 'finger_on_the_eject_button', name: 'Finger on the Eject Button', icon: '🔘', category: 'survival',
            description: 'Always have an exit strategy. Always be ready to leave.',
            discoveryConditions: { themes: { paranoia: 4, violence: 3 } },
            researchTime: 6, researchPenalty: { authority: -1 },
            internalizedBonus: { reaction_speed: 2 }, capModifier: { reaction_speed: 1 },
            flavorText: 'You can feel it. The moment everything goes wrong. And you will be ready.'
        },
        actual_art_degree: {
            id: 'actual_art_degree', name: 'Actual Art Degree', icon: '🎨', category: 'identity',
            description: 'You went to art school. This explains everything.',
            discoveryConditions: { themes: { philosophy: 3 }, minSkill: { conceptualization: 5 } },
            researchTime: 8, researchPenalty: { logic: -1 },
            internalizedBonus: { conceptualization: 2, drama: 1 }, capModifier: { conceptualization: 1 },
            flavorText: 'Four years of theory. A lifetime of seeing patterns no one else sees.'
        },
        jamais_vu: {
            id: 'jamais_vu', name: 'Jamais Vu', icon: '❓', category: 'mental',
            description: 'The familiar becomes strange. Nothing feels real.',
            discoveryConditions: { themes: { identity: 5 }, status: 'dissociated' },
            researchTime: 11, researchPenalty: { empathy: -1 },
            internalizedBonus: { shivers: 1, inland_empire: 1 }, capModifier: { perception: 1 },
            flavorText: 'You have seen this before. And yet... it is all new.'
        },
        the_bow_collector: {
            id: 'the_bow_collector', name: 'The Bow Collector', icon: '🎀', category: 'obsession',
            description: 'Small beautiful things. Collected. Treasured. Understood.',
            discoveryConditions: { themes: { mystery: 4 }, minSkill: { perception: 4 } },
            researchTime: 7, researchPenalty: { physical_instrument: -1 },
            internalizedBonus: { perception: 2 }, capModifier: { perception: 1 },
            flavorText: 'In the details, you find meaning. In the small, you find the infinite.'
        },
        regular_law_official: {
            id: 'regular_law_official', name: 'Regular Law Official', icon: '📋', category: 'identity',
            description: 'Just doing your job. Nothing special. Nothing memorable.',
            discoveryConditions: { themes: { authority: 3 }, messageCount: 50 },
            researchTime: 5, researchPenalty: { drama: -1 },
            internalizedBonus: { composure: 1, esprit_de_corps: 1 }, capModifier: { esprit_de_corps: 1 },
            flavorText: 'You clock in. You clock out. You enforce the law. Simple.'
        },
        some_kind_of_superstar: {
            id: 'some_kind_of_superstar', name: 'Some Kind of Superstar', icon: '⭐', category: 'identity',
            description: 'You are destined for greatness. Everyone can see it.',
            discoveryConditions: { criticalSuccess: 'savoir_faire' },
            researchTime: 9, researchPenalty: { empathy: -1 },
            internalizedBonus: { savoir_faire: 2, drama: 1 }, capModifier: { savoir_faire: 1 },
            flavorText: 'The spotlight finds you. It always has. It always will.'
        },
        wompty_dompty_dom_centre: {
            id: 'wompty_dompty_dom_centre', name: 'Wompty-Dompty-Dom Centre', icon: '🏢', category: 'philosophy',
            description: 'The center of everything. Or nothing. Hard to tell.',
            discoveryConditions: { themes: { philosophy: 5, supernatural: 3 } },
            researchTime: 13, researchPenalty: { logic: -2 },
            internalizedBonus: { encyclopedia: 2 }, capModifier: { encyclopedia: 1 },
            flavorText: 'You have found the center. It wobbles. It womps. It dominates.'
        },
        detective_arriving_on_the_scene: {
            id: 'detective_arriving_on_the_scene', name: 'Detective Arriving on the Scene', icon: '🚔', category: 'identity',
            description: 'First impressions matter. Especially for detectives.',
            discoveryConditions: { firstDiscovery: true },
            researchTime: 4, researchPenalty: { inland_empire: -1 },
            internalizedBonus: { visual_calculus: 1, perception: 1 }, capModifier: { visual_calculus: 1 },
            flavorText: 'You have arrived. The investigation can now begin.'
        },
        the_fifteenth_indotribe: {
            id: 'the_fifteenth_indotribe', name: 'The Fifteenth Indotribe', icon: '🏴', category: 'philosophy',
            description: 'A tribe of one. A nation of the self.',
            discoveryConditions: { themes: { identity: 6, philosophy: 4 } },
            researchTime: 15, researchPenalty: { esprit_de_corps: -2 },
            internalizedBonus: { volition: 1, conceptualization: 1 }, capModifier: { volition: 1 },
            flavorText: 'You belong to no nation. You ARE a nation. Population: you.'
        },
        apricot_chewing_gum_enthusiast: {
            id: 'apricot_chewing_gum_enthusiast', name: 'Apricot Chewing Gum Enthusiast', icon: '🍑', category: 'obsession',
            description: 'The specific pleasure of apricot. Chewed thoughtfully.',
            discoveryConditions: { themes: { substance: 3 }, minSkill: { electrochemistry: 4 } },
            researchTime: 5, researchPenalty: { authority: -1 },
            internalizedBonus: { electrochemistry: 1, suggestion: 1 }, capModifier: { electrochemistry: 1 },
            flavorText: 'Sweet. Fruity. Perfectly legal. The perfect vice.'
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // STATE VARIABLES
    // ═══════════════════════════════════════════════════════════════

    let activeStatuses = new Set();
    let currentBuild = null;
    let savedProfiles = {};
    let recentIntrusiveThoughts = [];
    let lastObjectVoice = null;

    // v0.7.0: Theme & Thought Cabinet state
    let themeCounters = {};
    let thoughtCabinet = { slots: 3, maxSlots: 12, discovered: [], researching: {}, internalized: [], dismissed: [] };
    let discoveryContext = { messageCount: 0, objectsSeen: new Set(), criticalSuccesses: {}, criticalFailures: {}, ancientVoiceTriggered: false, firstDiscoveryDone: false };

    const DEFAULT_SETTINGS = {
        enabled: true, showDiceRolls: true, showFailedChecks: true,
        voicesPerMessage: { min: 1, max: 4 },
        apiEndpoint: '', apiKey: '', model: 'glm-4-plus', maxTokens: 300, temperature: 0.9,
        povStyle: 'second', characterName: '', characterPronouns: 'they', characterContext: '',
        autoDetectStatus: false, autoTrigger: false, triggerDelay: 1000,
        fabPositionTop: 140, fabPositionLeft: 10,
        intrusiveEnabled: true, intrusiveChance: 0.15, intrusiveInChat: true,
        objectVoicesEnabled: true, objectVoiceChance: 0.4,
        // v0.7.0 settings
        thoughtDiscoveryEnabled: true, showThemeTracker: true, autoDiscoverThoughts: true
    };

    const DEFAULT_ATTRIBUTE_POINTS = { INTELLECT: 3, PSYCHE: 3, PHYSIQUE: 3, MOTORICS: 3 };
    let extensionSettings = { ...DEFAULT_SETTINGS };

    // ═══════════════════════════════════════════════════════════════
    // v0.7.0: THEME TRACKING SYSTEM
    // ═══════════════════════════════════════════════════════════════

    function initializeThemeCounters() {
        for (const themeId of Object.keys(THEMES)) {
            if (!(themeId in themeCounters)) themeCounters[themeId] = 0;
        }
    }

    function trackThemesInMessage(text) {
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

    function getTopThemes(count = 5) {
        return Object.entries(themeCounters)
            .filter(([, v]) => v > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(([id, count]) => ({ ...THEMES[id], count }));
    }

    function resetThemeCounters() {
        for (const key of Object.keys(themeCounters)) themeCounters[key] = 0;
    }

    // ═══════════════════════════════════════════════════════════════
    // v0.7.0: THOUGHT DISCOVERY SYSTEM
    // ═══════════════════════════════════════════════════════════════

    function meetsDiscoveryConditions(thought) {
        const cond = thought.discoveryConditions;
        if (!cond) return false;

        // Already discovered, researching, internalized, or dismissed
        if (thoughtCabinet.discovered.includes(thought.id) ||
            thoughtCabinet.researching[thought.id] ||
            thoughtCabinet.internalized.includes(thought.id) ||
            thoughtCabinet.dismissed.includes(thought.id)) return false;

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
        if (cond.criticalSuccess && !discoveryContext.criticalSuccesses[cond.criticalSuccess]) return false;

        // Critical failure on specific skill
        if (cond.criticalFailure && !discoveryContext.criticalFailures[cond.criticalFailure]) return false;

        // Object count
        if (cond.objectCount && discoveryContext.objectsSeen.size < cond.objectCount) return false;

        // Message count
        if (cond.messageCount && discoveryContext.messageCount < cond.messageCount) return false;

        // Ancient voice triggered
        if (cond.ancientVoice && !discoveryContext.ancientVoiceTriggered) return false;

        // First discovery (only one thought has this)
        if (cond.firstDiscovery && discoveryContext.firstDiscoveryDone) return false;

        return true;
    }

    function checkThoughtDiscovery() {
        if (!extensionSettings.thoughtDiscoveryEnabled || !extensionSettings.autoDiscoverThoughts) return [];
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

    function startResearch(thoughtId) {
        const thought = THOUGHTS[thoughtId];
        if (!thought) return false;
        const researchingCount = Object.keys(thoughtCabinet.researching).length;
        if (researchingCount >= thoughtCabinet.slots) return false;
        const idx = thoughtCabinet.discovered.indexOf(thoughtId);
        if (idx === -1) return false;
        thoughtCabinet.discovered.splice(idx, 1);
        thoughtCabinet.researching[thoughtId] = { progress: 0, started: Date.now() };
        saveState(getSTContext());
        return true;
    }

    function abandonResearch(thoughtId) {
        if (!thoughtCabinet.researching[thoughtId]) return false;
        delete thoughtCabinet.researching[thoughtId];
        thoughtCabinet.discovered.push(thoughtId);
        saveState(getSTContext());
        return true;
    }

    function advanceResearch(messageText = '') {
        const completed = [];
        for (const [thoughtId, research] of Object.entries(thoughtCabinet.researching)) {
            const thought = THOUGHTS[thoughtId];
            if (!thought) continue;
            let progressGain = 1;
            // Bonus for relevant keywords in message
            const themeId = thought.category;
            if (THEMES[themeId]) {
                const matches = THEMES[themeId].keywords.filter(kw => messageText.toLowerCase().includes(kw));
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

    function internalizeThought(thoughtId) {
        const thought = THOUGHTS[thoughtId];
        if (!thought || !thoughtCabinet.researching[thoughtId]) return null;
        delete thoughtCabinet.researching[thoughtId];
        thoughtCabinet.internalized.push(thoughtId);

        // Apply bonuses to current build
        if (thought.internalizedBonus && currentBuild) {
            for (const [skillId, bonus] of Object.entries(thought.internalizedBonus)) {
                currentBuild.skillLevels[skillId] = Math.min(10, (currentBuild.skillLevels[skillId] || 1) + bonus);
            }
        }

        // Apply cap modifiers
        if (thought.capModifier && currentBuild) {
            for (const [skillId, bonus] of Object.entries(thought.capModifier)) {
                if (!currentBuild.skillCaps[skillId]) currentBuild.skillCaps[skillId] = { starting: 4, learning: 7 };
                currentBuild.skillCaps[skillId].learning = Math.min(10, currentBuild.skillCaps[skillId].learning + bonus);
            }
        }

        saveState(getSTContext());
        return thought;
    }

    function dismissThought(thoughtId) {
        const idx = thoughtCabinet.discovered.indexOf(thoughtId);
        if (idx === -1) return false;
        thoughtCabinet.discovered.splice(idx, 1);
        thoughtCabinet.dismissed.push(thoughtId);
        saveState(getSTContext());
        return true;
    }

    function getResearchPenalties() {
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

    function getSkillCap(skillId) {
        if (!currentBuild?.skillCaps?.[skillId]) return 6;
        return Math.min(10, currentBuild.skillCaps[skillId].learning);
    }

    function hasSpecialEffect(effectName) {
        return thoughtCabinet.internalized.some(id => THOUGHTS[id]?.specialEffect === effectName);
    }

    // ═══════════════════════════════════════════════════════════════
    // BUILD & PROFILE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

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
            activeStatuses: Array.from(activeStatuses),
            thoughtCabinet: JSON.parse(JSON.stringify(thoughtCabinet)),
            themeCounters: { ...themeCounters }
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
        if (profile.thoughtCabinet) thoughtCabinet = JSON.parse(JSON.stringify(profile.thoughtCabinet));
        if (profile.themeCounters) themeCounters = { ...profile.themeCounters };
        saveState(getSTContext());
        return true;
    }

    function deleteProfile(profileId) { if (savedProfiles[profileId]) { delete savedProfiles[profileId]; saveState(getSTContext()); return true; } return false; }

    // ═══════════════════════════════════════════════════════════════
    // STATUS & SKILL FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

    function toggleStatus(statusId) {
        if (activeStatuses.has(statusId)) activeStatuses.delete(statusId);
        else activeStatuses.add(statusId);
        saveState(getSTContext());
        renderStatusDisplay();
    }

    function getSkillModifier(skillId) {
        let modifier = 0;
        // Status effects
        for (const statusId of activeStatuses) {
            const status = STATUS_EFFECTS[statusId];
            if (!status) continue;
            if (status.boosts.includes(skillId)) modifier += 1;
            if (status.debuffs.includes(skillId)) modifier -= 1;
        }
        // v0.7.0: Research penalties
        const penalties = getResearchPenalties();
        if (penalties[skillId]) modifier += penalties[skillId];
        return modifier;
    }

    function getEffectiveSkillLevel(skillId) {
        return Math.max(1, Math.min(getSkillCap(skillId), getSkillLevel(skillId) + getSkillModifier(skillId)));
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

    function getBoostedIntrusiveSkills() {
        const boosted = new Set();
        for (const statusId of activeStatuses) {
            const status = STATUS_EFFECTS[statusId];
            if (status?.intrusiveBoost) status.intrusiveBoost.forEach(s => boosted.add(s));
        }
        return boosted;
    }

    // ═══════════════════════════════════════════════════════════════
    // DICE SYSTEM
    // ═══════════════════════════════════════════════════════════════

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

    // ═══════════════════════════════════════════════════════════════
    // STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════

    function saveState(context) {
        const state = {
            settings: extensionSettings, currentBuild, activeStatuses: Array.from(activeStatuses), savedProfiles,
            themeCounters, thoughtCabinet, discoveryContext: { ...discoveryContext, objectsSeen: Array.from(discoveryContext.objectsSeen) }
        };
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
                themeCounters = state.themeCounters || {};
                thoughtCabinet = state.thoughtCabinet || { slots: 3, maxSlots: 12, discovered: [], researching: {}, internalized: [], dismissed: [] };
                if (state.discoveryContext) {
                    discoveryContext = { ...state.discoveryContext, objectsSeen: new Set(state.discoveryContext.objectsSeen || []) };
                }
            } else { initializeDefaultBuild(); }
        } catch (e) { console.error('[Inland Empire] Failed to load state:', e); initializeDefaultBuild(); }
    }

    // ═══════════════════════════════════════════════════════════════
    // INTRUSIVE THOUGHTS & OBJECT VOICES
    // ═══════════════════════════════════════════════════════════════

    function getIntrusiveThought(messageText = '') {
        if (!extensionSettings.intrusiveEnabled) return null;
        const boostedSkills = getBoostedIntrusiveSkills();
        const allSkillIds = Object.keys(INTRUSIVE_THOUGHTS);
        const weightedSkills = allSkillIds.map(skillId => {
            let weight = getEffectiveSkillLevel(skillId);
            if (boostedSkills.has(skillId)) weight += 3;
            const skill = SKILLS[skillId];
            if (skill && messageText) {
                const matches = skill.triggerConditions.filter(kw => messageText.toLowerCase().includes(kw.toLowerCase()));
                weight += matches.length * 2;
            }
            return { skillId, weight };
        }).filter(s => s.weight > 0);
        const totalWeight = weightedSkills.reduce((sum, s) => sum + s.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedSkill = null;
        for (const { skillId, weight } of weightedSkills) {
            random -= weight;
            if (random <= 0) { selectedSkill = skillId; break; }
        }
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

    function detectObjects(text) {
        if (!extensionSettings.objectVoicesEnabled) return [];
        // v0.7.0: Check for anti-object thought
        if (hasSpecialEffect('objectVoiceReduction') && Math.random() < 0.85) return [];
        const detected = [];
        for (const [objectId, obj] of Object.entries(OBJECT_VOICES)) {
            for (const pattern of obj.patterns) {
                if (pattern.test(text)) { detected.push({ id: objectId, ...obj }); break; }
            }
        }
        return detected;
    }

    function getObjectVoice(objectId) {
        const obj = OBJECT_VOICES[objectId];
        if (!obj) return null;
        if (lastObjectVoice === objectId && Math.random() > 0.3) return null;
        lastObjectVoice = objectId;
        discoveryContext.objectsSeen.add(objectId);
        const line = obj.lines[Math.floor(Math.random() * obj.lines.length)];
        return { objectId, name: obj.name, icon: obj.icon, color: obj.color, content: line, affinitySkill: obj.affinitySkill, isObject: true };
    }

    async function processIntrusiveThoughts(messageText) {
        const results = { intrusive: null, objects: [] };
        let intrusiveChance = extensionSettings.intrusiveChance || 0.15;
        if (activeStatuses.size > 0) intrusiveChance += activeStatuses.size * 0.05;
        if (Math.random() < intrusiveChance) results.intrusive = getIntrusiveThought(messageText);
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
    // TOAST SYSTEM
    // ═══════════════════════════════════════════════════════════════

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

    function showIntrusiveToast(thought, duration = 5000) {
        const container = createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'ie-toast ie-toast-intrusive';
        toast.style.borderColor = thought.color;
        toast.innerHTML = `<div class="ie-intrusive-header"><span class="ie-intrusive-icon">🧠</span><span class="ie-intrusive-signature" style="color: ${thought.color}">${thought.signature}</span></div><div class="ie-intrusive-content">"${thought.content}"</div><button class="ie-intrusive-dismiss">dismiss</button>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('ie-toast-show'));
        toast.querySelector('.ie-intrusive-dismiss')?.addEventListener('click', () => { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); });
        setTimeout(() => { if (toast.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }, duration);
        return toast;
    }

    function showObjectToast(objectVoice, duration = 6000) {
        const container = createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'ie-toast ie-toast-object';
        toast.style.borderColor = objectVoice.color;
        toast.innerHTML = `<div class="ie-object-header"><span class="ie-object-icon">${objectVoice.icon}</span><span class="ie-object-name" style="color: ${objectVoice.color}">${objectVoice.name}</span></div><div class="ie-object-content">"${objectVoice.content}"</div><button class="ie-object-dismiss">dismiss</button>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('ie-toast-show'));
        toast.querySelector('.ie-object-dismiss')?.addEventListener('click', () => { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); });
        setTimeout(() => { if (toast.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }, duration);
        return toast;
    }

    function showDiscoveryToast(thought) {
        const container = createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'ie-toast ie-toast-discovery';
        toast.innerHTML = `<div class="ie-discovery-header"><span class="ie-discovery-icon">💭</span><span class="ie-discovery-label">THOUGHT DISCOVERED</span></div><div class="ie-discovery-name">${thought.icon} ${thought.name}</div><div class="ie-discovery-desc">${thought.description}</div><div class="ie-discovery-actions"><button class="ie-btn ie-btn-research" data-thought="${thought.id}">RESEARCH</button><button class="ie-btn ie-btn-dismiss-thought" data-thought="${thought.id}">DISMISS</button></div>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('ie-toast-show'));
        toast.querySelector('.ie-btn-research')?.addEventListener('click', () => {
            if (startResearch(thought.id)) {
                showToast(`Researching: ${thought.name}`, 'success', 2000);
                renderCabinetTab();
            } else {
                showToast('No research slots available!', 'error', 2000);
            }
            toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300);
        });
        toast.querySelector('.ie-btn-dismiss-thought')?.addEventListener('click', () => {
            dismissThought(thought.id);
            toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300);
        });
        return toast;
    }

    function showInternalizedToast(thought) {
        const container = createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'ie-toast ie-toast-internalized';
        const bonusText = thought.internalizedBonus ? Object.entries(thought.internalizedBonus).map(([s, v]) => `+${v} ${SKILLS[s]?.name || s}`).join(', ') : '';
        const capText = thought.capModifier ? Object.entries(thought.capModifier).map(([s, v]) => `+${v} ${SKILLS[s]?.name || s} cap`).join(', ') : '';
        toast.innerHTML = `<div class="ie-internalized-header"><span class="ie-internalized-icon">✨</span><span class="ie-internalized-label">THOUGHT INTERNALIZED</span></div><div class="ie-internalized-name">${thought.icon} ${thought.name}</div><div class="ie-internalized-flavor">${thought.flavorText}</div>${bonusText ? `<div class="ie-internalized-bonuses">${bonusText}</div>` : ''}${capText ? `<div class="ie-internalized-caps">${capText}</div>` : ''}`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('ie-toast-show'));
        setTimeout(() => { if (toast.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }, 8000);
        return toast;
    }

    function hideToast(toast) { if (toast?.parentNode) { toast.classList.remove('ie-toast-show'); toast.classList.add('ie-toast-hide'); setTimeout(() => toast.remove(), 300); } }

    // ═══════════════════════════════════════════════════════════════
    // RELEVANCE & VOICE SELECTION
    // ═══════════════════════════════════════════════════════════════

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
                    discoveryContext.ancientVoiceTriggered = true;
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

    // ═══════════════════════════════════════════════════════════════
    // VOICE GENERATION
    // ═══════════════════════════════════════════════════════════════

    async function generateVoices(selectedSkills, context, intrusiveData = null) {
        const voiceData = selectedSkills.map(selected => {
            let checkResult = null;
            if (!selected.isAncient) {
                const checkDecision = determineCheckDifficulty(selected, context);
                if (checkDecision.shouldCheck) {
                    checkResult = rollSkillCheck(getEffectiveSkillLevel(selected.skillId), checkDecision.difficulty);
                    // v0.7.0: Track critical successes/failures for thought discovery
                    if (checkResult.isBoxcars) discoveryContext.criticalSuccesses[selected.skillId] = true;
                    if (checkResult.isSnakeEyes) discoveryContext.criticalFailures[selected.skillId] = true;
                }
            }
            const skill = selected.isAncient ? ANCIENT_VOICES[selected.skillId] : SKILLS[selected.skillId];
            return { ...selected, skill, checkResult, effectiveLevel: selected.isAncient ? 6 : getEffectiveSkillLevel(selected.skillId) };
        });
        const chorusPrompt = buildChorusPrompt(voiceData, context, intrusiveData);
        try {
            const response = await callAPI(chorusPrompt.system, chorusPrompt.user);
            return parseChorusResponse(response, voiceData);
        } catch (error) {
            console.error('[Inland Empire] Chorus generation failed:', error);
            return voiceData.map(v => ({ skillId: v.skillId, skillName: v.skill.name, signature: v.skill.signature, color: v.skill.color, content: '*static*', checkResult: v.checkResult, isAncient: v.isAncient, success: false }));
        }
    }

    function buildChorusPrompt(voiceData, context, intrusiveData = null) {
        const povStyle = extensionSettings.povStyle || 'second';
        const charName = extensionSettings.characterName || '';
        const pronouns = extensionSettings.characterPronouns || 'they';
        const characterContext = extensionSettings.characterContext || '';
        let povInstruction = povStyle === 'third' ? `Write in THIRD PERSON about ${charName || 'the character'}. Use "${charName || pronouns}" - NEVER "you".` : povStyle === 'first' ? `Write in FIRST PERSON. Use "I/me/my" - NEVER "you".` : `Write in SECOND PERSON. Address the character as "you".`;
        let contextSection = characterContext.trim() ? `\nCHARACTER CONTEXT:\n${characterContext}\n` : '';
        let statusContext = activeStatuses.size > 0 ? `\nCurrent state: ${[...activeStatuses].map(id => STATUS_EFFECTS[id]?.name).filter(Boolean).join(', ')}.` : '';
        let intrusiveContext = '';
        if (intrusiveData) {
            if (intrusiveData.intrusive) intrusiveContext += `\nINTRUSIVE THOUGHT (${intrusiveData.intrusive.signature}): "${intrusiveData.intrusive.content}"\nOther voices may react to this.`;
            if (intrusiveData.objects?.length > 0) intrusiveContext += `\nOBJECTS SPEAKING:\n${intrusiveData.objects.map(o => `${o.name}: "${o.content}"`).join('\n')}`;
        }
        const voiceDescriptions = voiceData.map(v => {
            let checkInfo = v.checkResult ? (v.checkResult.isBoxcars ? ' [CRITICAL SUCCESS]' : v.checkResult.isSnakeEyes ? ' [CRITICAL FAILURE]' : v.checkResult.success ? ' [Success]' : ' [Failed]') : v.isAncient ? ' [PRIMAL]' : ' [Passive]';
            return `${v.skill.signature}${checkInfo}: ${v.skill.personality}`;
        }).join('\n\n');
        const systemPrompt = `You generate internal mental voices for a roleplayer, inspired by Disco Elysium.\n\nTHE VOICES SPEAKING:\n${voiceDescriptions}\n\nRULES:\n1. ${povInstruction}\n2. Voices REACT to each other - argue, agree, interrupt\n3. Format EXACTLY as: SKILL_NAME - dialogue\n4. Keep each line 1-2 sentences\n5. Failed checks = uncertain/wrong. Critical success = profound. Critical failure = hilariously wrong\n6. Ancient/Primal voices speak in fragments\n7. Total: 4-12 voice lines\n${contextSection}${statusContext}${intrusiveContext}\n\nOutput ONLY voice dialogue. No narration.`;
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

    // ═══════════════════════════════════════════════════════════════
    // UI FUNCTIONS
    // ═══════════════════════════════════════════════════════════════

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
        if (tabName === 'cabinet') renderCabinetTab();
    }

    // v0.7.0: Cabinet Tab Rendering
    function renderCabinetTab() {
        const container = document.getElementById('ie-cabinet-content');
        if (!container) return;

        // Slots display
        const slotsUsed = Object.keys(thoughtCabinet.researching).length;
        let slotsHtml = `<div class="ie-section ie-cabinet-slots"><div class="ie-section-header"><span>Research Slots</span><span class="ie-slots-display">${slotsUsed}/${thoughtCabinet.slots}</span></div><div class="ie-slots-visual">`;
        for (let i = 0; i < thoughtCabinet.slots; i++) {
            const occupied = i < slotsUsed;
            slotsHtml += `<div class="ie-slot ${occupied ? 'ie-slot-occupied' : 'ie-slot-empty'}">${occupied ? '💭' : '+'}</div>`;
        }
        slotsHtml += `</div></div>`;

        // Theme tracker
        const topThemes = getTopThemes(5);
        let themesHtml = `<div class="ie-section ie-theme-tracker"><div class="ie-section-header"><span>Theme Tracker</span><button class="ie-btn ie-btn-sm ie-btn-reset-themes" title="Reset"><i class="fa-solid fa-eraser"></i></button></div><div class="ie-themes-grid">`;
        if (topThemes.length === 0) {
            themesHtml += `<div class="ie-empty-state"><i class="fa-solid fa-chart-line"></i><span>No themes tracked yet</span></div>`;
        } else {
            for (const theme of topThemes) {
                themesHtml += `<div class="ie-theme-item"><span class="ie-theme-icon">${theme.icon}</span><span class="ie-theme-name">${theme.name}</span><span class="ie-theme-count">${theme.count}</span></div>`;
            }
        }
        themesHtml += `</div></div>`;

        // Researching
        let researchingHtml = `<div class="ie-section ie-researching-section"><div class="ie-section-header"><span>Researching</span></div><div class="ie-researching-list">`;
        const researchingIds = Object.keys(thoughtCabinet.researching);
        if (researchingIds.length === 0) {
            researchingHtml += `<div class="ie-empty-state"><i class="fa-solid fa-flask"></i><span>No thoughts being researched</span></div>`;
        } else {
            for (const thoughtId of researchingIds) {
                const thought = THOUGHTS[thoughtId];
                const research = thoughtCabinet.researching[thoughtId];
                const progress = Math.min(100, Math.round((research.progress / thought.researchTime) * 100));
                const penalties = thought.researchPenalty ? Object.entries(thought.researchPenalty).map(([s, v]) => `${v} ${SKILLS[s]?.signature || s}`).join(', ') : 'None';
                researchingHtml += `<div class="ie-research-card"><div class="ie-research-header"><span class="ie-research-icon">${thought.icon}</span><span class="ie-research-name">${thought.name}</span><button class="ie-btn ie-btn-sm ie-btn-abandon" data-thought="${thoughtId}" title="Abandon"><i class="fa-solid fa-times"></i></button></div><div class="ie-research-progress-bar"><div class="ie-research-progress-fill" style="width: ${progress}%"></div></div><div class="ie-research-info"><span>${research.progress}/${thought.researchTime}</span><span class="ie-research-penalties">${penalties}</span></div></div>`;
            }
        }
        researchingHtml += `</div></div>`;

        // Discovered
        let discoveredHtml = `<div class="ie-section ie-discovered-section"><div class="ie-section-header"><span>Discovered</span></div><div class="ie-discovered-list">`;
        if (thoughtCabinet.discovered.length === 0) {
            discoveredHtml += `<div class="ie-empty-state"><i class="fa-solid fa-lightbulb"></i><span>No discovered thoughts</span></div>`;
        } else {
            for (const thoughtId of thoughtCabinet.discovered) {
                const thought = THOUGHTS[thoughtId];
                if (!thought) continue;
                discoveredHtml += `<div class="ie-discovered-card"><div class="ie-discovered-header"><span class="ie-discovered-icon">${thought.icon}</span><span class="ie-discovered-name">${thought.name}</span></div><div class="ie-discovered-desc">${thought.description}</div><div class="ie-discovered-actions"><button class="ie-btn ie-btn-sm ie-btn-research" data-thought="${thoughtId}">Research</button><button class="ie-btn ie-btn-sm ie-btn-dismiss-thought" data-thought="${thoughtId}">Dismiss</button></div></div>`;
            }
        }
        discoveredHtml += `</div></div>`;

        // Internalized
        let internalizedHtml = `<div class="ie-section ie-internalized-section"><div class="ie-section-header"><span>Internalized</span></div><div class="ie-internalized-list">`;
        if (thoughtCabinet.internalized.length === 0) {
            internalizedHtml += `<div class="ie-empty-state"><i class="fa-solid fa-gem"></i><span>No internalized thoughts</span></div>`;
        } else {
            for (const thoughtId of thoughtCabinet.internalized) {
                const thought = THOUGHTS[thoughtId];
                if (!thought) continue;
                const bonusText = thought.internalizedBonus ? Object.entries(thought.internalizedBonus).map(([s, v]) => `+${v} ${SKILLS[s]?.signature || s}`).join(' ') : '';
                internalizedHtml += `<div class="ie-internalized-card"><span class="ie-internalized-icon">${thought.icon}</span><span class="ie-internalized-name">${thought.name}</span>${bonusText ? `<span class="ie-internalized-bonuses">${bonusText}</span>` : ''}</div>`;
            }
        }
        internalizedHtml += `</div></div>`;

        container.innerHTML = slotsHtml + themesHtml + researchingHtml + discoveredHtml + internalizedHtml;

        // Event listeners
        container.querySelector('.ie-btn-reset-themes')?.addEventListener('click', () => { resetThemeCounters(); renderCabinetTab(); showToast('Themes reset', 'info', 2000); });
        container.querySelectorAll('.ie-btn-abandon').forEach(btn => btn.addEventListener('click', () => { abandonResearch(btn.dataset.thought); renderCabinetTab(); }));
        container.querySelectorAll('.ie-btn-research').forEach(btn => btn.addEventListener('click', () => {
            if (startResearch(btn.dataset.thought)) { showToast('Research started!', 'success', 2000); renderCabinetTab(); }
            else showToast('No slots available!', 'error', 2000);
        }));
        container.querySelectorAll('.ie-btn-dismiss-thought').forEach(btn => btn.addEventListener('click', () => { dismissThought(btn.dataset.thought); renderCabinetTab(); }));
    }

    function renderProfilesList() {
        const container = document.getElementById('ie-profiles-list');
        if (!container) return;
        const profiles = Object.values(savedProfiles);
        if (profiles.length === 0) { container.innerHTML = '<div class="ie-empty-state"><i class="fa-solid fa-user-slash"></i><span>No saved profiles</span></div>'; return; }
        container.innerHTML = profiles.map(profile => `<div class="ie-profile-card" data-profile-id="${profile.id}"><div class="ie-profile-info"><span class="ie-profile-name">${profile.name}</span><span class="ie-profile-details">${profile.characterName || 'No character'}</span></div><div class="ie-profile-actions"><button class="ie-btn-icon ie-btn-load" data-action="load" title="Load"><i class="fa-solid fa-download"></i></button><button class="ie-btn-icon ie-btn-remove" data-action="delete" title="Delete"><i class="fa-solid fa-trash"></i></button></div></div>`).join('');
        container.querySelectorAll('.ie-profile-card').forEach(card => {
            const profileId = card.dataset.profileId;
            card.querySelector('[data-action="load"]')?.addEventListener('click', () => { if (loadProfile(profileId)) { showToast(`Loaded: ${savedProfiles[profileId].name}`, 'success', 2000); renderAttributesDisplay(); populateSettings(); populateBuildEditor(); renderStatusDisplay(); renderCabinetTab(); } });
            card.querySelector('[data-action="delete"]')?.addEventListener('click', () => { if (confirm(`Delete "${savedProfiles[profileId].name}"?`)) { deleteProfile(profileId); renderProfilesList(); showToast('Profile deleted', 'info', 2000); } });
        });
    }

    function populateBuildEditor() {
        const container = document.getElementById('ie-attributes-editor');
        if (!container) return;
        const attrPoints = getAttributePoints();
        container.innerHTML = Object.entries(ATTRIBUTES).map(([id, attr]) => `<div class="ie-attribute-row" data-attribute="${id}"><div class="ie-attribute-label" style="color: ${attr.color}"><span class="ie-attr-name">${attr.name}</span><span class="ie-attr-value" id="ie-build-${id}-value">${attrPoints[id] || 3}</span></div><input type="range" class="ie-attribute-slider" id="ie-build-${id}" min="1" max="6" value="${attrPoints[id] || 3}" data-attribute="${id}" /></div>`).join('');
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
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
        const setChecked = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
        setVal('ie-api-endpoint', s.apiEndpoint || '');
        setVal('ie-api-key', s.apiKey || '');
        setVal('ie-model', s.model || 'glm-4-plus');
        setVal('ie-temperature', s.temperature || 0.9);
        setVal('ie-max-tokens', s.maxTokens || 300);
        setVal('ie-min-voices', s.minVoices || s.voicesPerMessage?.min || 1);
        setVal('ie-max-voices', s.maxVoices || s.voicesPerMessage?.max || 4);
        setVal('ie-trigger-delay', s.triggerDelay ?? 1000);
        setVal('ie-pov-style', s.povStyle || 'second');
        setVal('ie-character-name', s.characterName || '');
        setVal('ie-character-pronouns', s.characterPronouns || 'they');
        setVal('ie-intrusive-chance', Math.round((s.intrusiveChance || 0.15) * 100));
        setVal('ie-object-chance', Math.round((s.objectVoiceChance || 0.4) * 100));
        const charContext = document.getElementById('ie-character-context');
        if (charContext) charContext.value = s.characterContext || '';
        setChecked('ie-show-dice-rolls', s.showDiceRolls !== false);
        setChecked('ie-show-failed-checks', s.showFailedChecks !== false);
        setChecked('ie-auto-trigger', s.autoTrigger === true);
        setChecked('ie-auto-detect-status', s.autoDetectStatus === true);
        setChecked('ie-intrusive-enabled', s.intrusiveEnabled !== false);
        setChecked('ie-intrusive-in-chat', s.intrusiveInChat !== false);
        setChecked('ie-object-voices-enabled', s.objectVoicesEnabled !== false);
        setChecked('ie-thought-discovery-enabled', s.thoughtDiscoveryEnabled !== false);
        setChecked('ie-auto-discover-thoughts', s.autoDiscoverThoughts !== false);
        updateThirdPersonVisibility();
    }

    function updateThirdPersonVisibility() {
        const povStyle = document.getElementById('ie-pov-style')?.value;
        document.querySelectorAll('.ie-third-person-options').forEach(el => el.style.display = povStyle === 'third' ? 'block' : 'none');
    }

    function saveSettings() {
        const getVal = (id) => document.getElementById(id)?.value || '';
        const getNum = (id, def) => parseFloat(document.getElementById(id)?.value) || def;
        const getChecked = (id) => document.getElementById(id)?.checked;
        extensionSettings.apiEndpoint = getVal('ie-api-endpoint');
        extensionSettings.apiKey = getVal('ie-api-key');
        extensionSettings.model = getVal('ie-model') || 'glm-4-plus';
        extensionSettings.temperature = getNum('ie-temperature', 0.9);
        extensionSettings.maxTokens = parseInt(getVal('ie-max-tokens')) || 300;
        extensionSettings.minVoices = parseInt(getVal('ie-min-voices')) || 1;
        extensionSettings.maxVoices = parseInt(getVal('ie-max-voices')) || 4;
        extensionSettings.triggerDelay = parseInt(getVal('ie-trigger-delay')) ?? 1000;
        extensionSettings.showDiceRolls = getChecked('ie-show-dice-rolls') !== false;
        extensionSettings.showFailedChecks = getChecked('ie-show-failed-checks') !== false;
        extensionSettings.autoTrigger = getChecked('ie-auto-trigger') === true;
        extensionSettings.autoDetectStatus = getChecked('ie-auto-detect-status') === true;
        extensionSettings.povStyle = getVal('ie-pov-style') || 'second';
        extensionSettings.characterName = getVal('ie-character-name');
        extensionSettings.characterPronouns = getVal('ie-character-pronouns') || 'they';
        extensionSettings.characterContext = document.getElementById('ie-character-context')?.value || '';
        extensionSettings.intrusiveEnabled = getChecked('ie-intrusive-enabled') !== false;
        extensionSettings.intrusiveInChat = getChecked('ie-intrusive-in-chat') !== false;
        extensionSettings.intrusiveChance = (parseInt(getVal('ie-intrusive-chance')) || 15) / 100;
        extensionSettings.objectVoicesEnabled = getChecked('ie-object-voices-enabled') !== false;
        extensionSettings.objectVoiceChance = (parseInt(getVal('ie-object-chance')) || 40) / 100;
        extensionSettings.thoughtDiscoveryEnabled = getChecked('ie-thought-discovery-enabled') !== false;
        extensionSettings.autoDiscoverThoughts = getChecked('ie-auto-discover-thoughts') !== false;
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
        container.innerHTML = Object.entries(ATTRIBUTES).map(([id, attr]) => `<div class="ie-attribute-block" style="border-color: ${attr.color}"><div class="ie-attr-header" style="background: ${attr.color}20"><span class="ie-attr-name">${attr.name}</span><span class="ie-attr-points">${attrPoints[id]}</span></div><div class="ie-attr-skills">${attr.skills.map(skillId => {
            const skill = SKILLS[skillId], level = skillLevels[skillId], cap = getSkillCap(skillId), mod = getSkillModifier(skillId);
            const modClass = mod > 0 ? 'ie-skill-boosted' : mod < 0 ? 'ie-skill-debuffed' : '';
            return `<div class="ie-skill-row ${modClass}" title="${skill.name}: ${level}/${cap}"><span class="ie-skill-abbrev" style="color: ${skill.color}">${skill.signature.substring(0, 3)}</span><div class="ie-skill-bar"><div class="ie-skill-fill" style="width: ${(level / cap) * 100}%; background: ${skill.color}"></div></div><span class="ie-skill-level">${level}<small>/${cap}</small></span></div>`;
        }).join('')}</div></div>`).join('');
    }

    function renderStatusDisplay() {
        const container = document.getElementById('ie-status-grid');
        if (!container) return;
        const physical = Object.values(STATUS_EFFECTS).filter(s => s.category === 'physical');
        const mental = Object.values(STATUS_EFFECTS).filter(s => s.category === 'mental');
        container.innerHTML = `<div class="ie-status-category"><div class="ie-status-category-label">Physical</div><div class="ie-status-buttons">${physical.map(status => `<button class="ie-status-btn ${activeStatuses.has(status.id) ? 'ie-status-active' : ''}" data-status="${status.id}" title="${status.name}"><span class="ie-status-icon">${status.icon}</span><span class="ie-status-name">${status.name}</span></button>`).join('')}</div></div><div class="ie-status-category"><div class="ie-status-category-label">Mental</div><div class="ie-status-buttons">${mental.map(status => `<button class="ie-status-btn ${activeStatuses.has(status.id) ? 'ie-status-active' : ''}" data-status="${status.id}" title="${status.name}"><span class="ie-status-icon">${status.icon}</span><span class="ie-status-name">${status.name}</span></button>`).join('')}</div></div>`;
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
            const intrusiveClass = voice.isIntrusive ? 'ie-voice-intrusive' : '';
            const objectClass = voice.isObject ? 'ie-voice-object' : '';
            return `<div class="ie-voice-entry ${intrusiveClass} ${objectClass}" data-skill="${voice.skillId || voice.objectId}"><span class="ie-voice-signature" style="color: ${voice.color}">${voice.signature || voice.name}</span>${checkHtml}<span class="ie-voice-content"> - ${voice.content}</span></div>`;
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

    function injectVoicesIntoChat(voices, messageElement, intrusiveData = null) {
        if (!messageElement) return;
        const allVoices = [];
        if (intrusiveData?.intrusive && extensionSettings.intrusiveInChat) allVoices.push(intrusiveData.intrusive);
        if (intrusiveData?.objects && extensionSettings.intrusiveInChat) intrusiveData.objects.forEach(obj => allVoices.push({ signature: obj.name, color: obj.color, content: obj.content, isObject: true, icon: obj.icon }));
        if (voices?.length > 0) allVoices.push(...voices);
        if (allVoices.length === 0) return;
        const existingContainer = messageElement.querySelector('.ie-chat-voices');
        if (existingContainer) existingContainer.remove();
        const voiceContainer = document.createElement('div');
        voiceContainer.className = 'ie-chat-voices ie-chorus-bubble';
        if (allVoices.some(v => v.isAncient)) voiceContainer.classList.add('ie-has-ancient');
        if (allVoices.some(v => v.isObject)) voiceContainer.classList.add('ie-has-object');
        if (allVoices.some(v => v.isIntrusive)) voiceContainer.classList.add('ie-has-intrusive');
        const chorusLines = allVoices.map(voice => {
            let lineClass = 'ie-chorus-line';
            if (voice.isAncient) lineClass += ' ie-ancient-line';
            if (voice.isObject) lineClass += ' ie-object-line';
            if (voice.isIntrusive) lineClass += ' ie-intrusive-line';
            const icon = voice.icon ? `<span class="ie-line-icon">${voice.icon}</span>` : '';
            const name = voice.signature || voice.name;
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
            // v0.7.0: Track themes and message count
            trackThemesInMessage(messageContent);
            discoveryContext.messageCount++;

            // Auto-detect status
            if (extensionSettings.autoDetectStatus) {
                const detectedStatuses = detectStatusesFromText(messageContent);
                let newStatusAdded = false;
                detectedStatuses.forEach(statusId => { if (!activeStatuses.has(statusId)) { activeStatuses.add(statusId); newStatusAdded = true; } });
                if (newStatusAdded) { saveState(getSTContext()); renderStatusDisplay(); }
            }

            // Process intrusive thoughts and object voices
            const intrusiveData = await processIntrusiveThoughts(messageContent);
            if (intrusiveData.intrusive) showIntrusiveToast(intrusiveData.intrusive);
            for (const objVoice of intrusiveData.objects) setTimeout(() => showObjectToast(objVoice), 500 * intrusiveData.objects.indexOf(objVoice));

            // Generate main voices
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

            // Inject into chat
            const lastMessage = getLastMessageElement();
            if (lastMessage) {
                const filteredVoices = extensionSettings.showFailedChecks ? voices : voices.filter(v => !v.checkResult || v.checkResult.success);
                injectVoicesIntoChat(filteredVoices, lastMessage, intrusiveData);
            }

            // v0.7.0: Advance research and check for thought discovery
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

            // Save state after all updates
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
                    <div class="ie-section"><div class="ie-section-header"><span>Ancient Voices</span></div><div class="ie-ancient-voices-info"><div class="ie-ancient-voice-item"><span class="ie-ancient-icon">🦎</span><span class="ie-ancient-name">Ancient Reptilian Brain</span><span class="ie-ancient-triggers">Triggers: Dying, Starving, Terrified, Aroused</span></div><div class="ie-ancient-voice-item"><span class="ie-ancient-icon">❤️‍🔥</span><span class="ie-ancient-name">Limbic System</span><span class="ie-ancient-triggers">Triggers: Enraged, Grieving, Manic</span></div></div></div>
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
        settingsContainer.insertAdjacentHTML('beforeend', `<div id="inland-empire-extension-settings"><div class="inline-drawer"><div class="inline-drawer-toggle inline-drawer-header"><b><i class="fa-solid fa-brain"></i> Inland Empire</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div><div class="inline-drawer-content"><label class="checkbox_label" for="ie-extension-enabled"><input type="checkbox" id="ie-extension-enabled" ${extensionSettings.enabled ? 'checked' : ''} /><span>Enable Inland Empire</span></label><small>Disco Elysium-style internal voices with Thought Cabinet!</small><br><br><button id="ie-toggle-panel-btn" class="menu_button"><i class="fa-solid fa-eye"></i> Toggle Panel</button></div></div></div>`);
        document.getElementById('ie-extension-enabled')?.addEventListener('change', (e) => { extensionSettings.enabled = e.target.checked; saveState(getSTContext()); const fab = document.getElementById('inland-empire-fab'); const panel = document.getElementById('inland-empire-panel'); if (fab) fab.style.display = e.target.checked ? 'flex' : 'none'; if (panel && !e.target.checked) panel.classList.remove('ie-panel-open'); });
        document.getElementById('ie-toggle-panel-btn')?.addEventListener('click', togglePanel);
    }

    async function init() {
        console.log('[Inland Empire] Starting initialization v0.7.0...');
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

    window.InlandEmpire = { getSkillLevel, getAllSkillLevels, rollSkillCheck, getSkillCap, getEffectiveSkillLevel, SKILLS, ATTRIBUTES, THOUGHTS, THEMES, thoughtCabinet, themeCounters, startResearch, abandonResearch, internalizeThought, checkThoughtDiscovery };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    else setTimeout(init, 1000);
})();
