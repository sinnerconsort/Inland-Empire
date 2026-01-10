/**
 * Inland Empire - Status Effects Data
 * Physical and mental states that modify skills
 * Disco Elysium flavored
 */

export const STATUS_EFFECTS = {
    // ═══════════════════════════════════════════════════════════════
    // PHYSICAL STATUS EFFECTS
    // ═══════════════════════════════════════════════════════════════
    intoxicated: {
        id: 'intoxicated',
        name: 'Intoxicated',
        icon: '🍺',
        category: 'physical',
        description: 'The world softens at the edges. Everything makes more sense now.',
        boosts: ['electrochemistry', 'inland_empire', 'drama', 'suggestion'],
        debuffs: ['logic', 'hand_eye_coordination', 'reaction_speed', 'composure'],
        difficultyMod: 2,
        keywords: ['drunk', 'intoxicated', 'wasted', 'high', 'tipsy', 'booze', 'liquor', 'alcohol'],
        ancientVoice: null,
        intrusiveBoost: ['electrochemistry', 'inland_empire']
    },
    hung_over: {
        id: 'hung_over',
        name: 'Hung Over',
        icon: '🤢',
        category: 'physical',
        description: 'The morning after. Your body remembers what your mind forgot.',
        boosts: ['pain_threshold', 'inland_empire'],
        debuffs: ['perception', 'reaction_speed', 'composure', 'authority'],
        difficultyMod: 2,
        keywords: ['hangover', 'hung over', 'headache', 'nauseous', 'morning after'],
        ancientVoice: null,
        intrusiveBoost: ['pain_threshold', 'electrochemistry']
    },
    stimulated: {
        id: 'stimulated',
        name: 'Stimulated',
        icon: '⚡',
        category: 'physical',
        description: 'Your neurons fire like a city grid at rush hour. Everything is FAST.',
        boosts: ['reaction_speed', 'perception', 'logic', 'visual_calculus'],
        debuffs: ['composure', 'empathy', 'inland_empire'],
        difficultyMod: -1,
        keywords: ['stimulant', 'speed', 'amphetamine', 'wired', 'pyrholidon', 'uppers'],
        ancientVoice: null,
        intrusiveBoost: ['electrochemistry', 'reaction_speed']
    },
    nicotine_rush: {
        id: 'nicotine_rush',
        name: 'Nicotine Rush',
        icon: '🚬',
        category: 'physical',
        description: 'A small death, a small resurrection. The smoke fills the void.',
        boosts: ['composure', 'volition', 'conceptualization'],
        debuffs: ['endurance'],
        difficultyMod: 0,
        keywords: ['cigarette', 'smoke', 'smoking', 'nicotine', 'tobacco'],
        ancientVoice: null,
        intrusiveBoost: ['electrochemistry', 'composure']
    },
    wounded: {
        id: 'wounded',
        name: 'Wounded',
        icon: '🩸',
        category: 'physical',
        description: 'Pain is just information. Your body is screaming it.',
        boosts: ['pain_threshold', 'endurance', 'half_light'],
        debuffs: ['composure', 'savoir_faire', 'hand_eye_coordination'],
        difficultyMod: 2,
        keywords: ['hurt', 'wounded', 'injured', 'bleeding', 'pain', 'cut', 'bruise'],
        ancientVoice: null,
        intrusiveBoost: ['pain_threshold', 'half_light']
    },
    exhausted: {
        id: 'exhausted',
        name: 'Exhausted',
        icon: '😴',
        category: 'physical',
        description: 'The weight of existence presses down. Rest is a distant memory.',
        boosts: ['volition', 'inland_empire'],
        debuffs: ['reaction_speed', 'perception', 'logic'],
        difficultyMod: 2,
        keywords: ['tired', 'exhausted', 'sleepy', 'drowsy', 'fatigued', 'weary'],
        ancientVoice: null,
        intrusiveBoost: ['inland_empire', 'endurance']
    },
    starving: {
        id: 'starving',
        name: 'Starving',
        icon: '🍽️',
        category: 'physical',
        description: 'The body demands. The stomach is a void that echoes.',
        boosts: ['electrochemistry', 'perception'],
        debuffs: ['logic', 'composure', 'volition'],
        difficultyMod: 1,
        keywords: ['hungry', 'starving', 'famished', 'food', 'eat'],
        ancientVoice: null,
        intrusiveBoost: ['electrochemistry']
    },
    hypothermic: {
        id: 'hypothermic',
        name: 'Hypothermic',
        icon: '🥶',
        category: 'physical',
        description: 'The cold seeps into your bones. Martinaise winter shows no mercy.',
        boosts: ['shivers', 'pain_threshold', 'inland_empire'],
        debuffs: ['hand_eye_coordination', 'reaction_speed', 'interfacing'],
        difficultyMod: 2,
        keywords: ['cold', 'freezing', 'hypothermia', 'shivering', 'frost', 'winter'],
        ancientVoice: null,
        intrusiveBoost: ['shivers', 'inland_empire']
    },
    dying: {
        id: 'dying',
        name: 'Dying',
        icon: '💀',
        category: 'physical',
        description: 'The final curtain approaches. The ancient parts of you stir.',
        boosts: ['pain_threshold', 'inland_empire', 'shivers'],
        debuffs: ['logic', 'rhetoric', 'authority'],
        difficultyMod: 4,
        keywords: ['dying', 'death', 'fading', 'bleeding out', 'critical'],
        ancientVoice: 'ancient_reptilian_brain',
        intrusiveBoost: ['inland_empire', 'shivers']
    },

    // ═══════════════════════════════════════════════════════════════
    // MENTAL STATUS EFFECTS (Disco Elysium Flavored)
    // ═══════════════════════════════════════════════════════════════
    tequila_sunset: {
        id: 'tequila_sunset',
        name: 'Tequila Sunset',
        icon: '🌅',
        category: 'mental',
        description: 'The bender takes hold. You are electric and unstoppable and definitely making good decisions.',
        boosts: ['electrochemistry', 'reaction_speed', 'conceptualization', 'inland_empire', 'drama'],
        debuffs: ['composure', 'logic', 'volition', 'authority'],
        difficultyMod: 1,
        keywords: ['manic', 'hyper', 'racing', 'unstoppable', 'wired', 'frantic', 'bender'],
        ancientVoice: 'limbic_system',
        intrusiveBoost: ['electrochemistry', 'conceptualization', 'drama']
    },
    the_pale: {
        id: 'the_pale',
        name: 'The Pale',
        icon: '🌫️',
        category: 'mental',
        description: 'Reality dissolves. The void between worlds seeps into your consciousness. The ancient voices wake.',
        boosts: ['inland_empire', 'shivers', 'pain_threshold', 'conceptualization'],
        debuffs: ['perception', 'reaction_speed', 'empathy', 'logic', 'authority'],
        difficultyMod: 3,
        keywords: ['dissociate', 'unreal', 'floating', 'numb', 'detached', 'distant', 'unconscious', 'blackout', 'void', 'pale'],
        ancientVoice: 'both',
        intrusiveBoost: ['inland_empire', 'shivers', 'conceptualization']
    },
    homo_sexual_underground: {
        id: 'homo_sexual_underground',
        name: 'Homo-Sexual Underground',
        icon: '💜',
        category: 'mental',
        description: 'The obsessive spiral of desire. Who are you? Who do you want? Does it matter?',
        boosts: ['electrochemistry', 'suggestion', 'empathy', 'drama', 'inland_empire'],
        debuffs: ['logic', 'volition', 'composure', 'authority'],
        difficultyMod: 2,
        keywords: ['aroused', 'desire', 'attraction', 'lust', 'seduction', 'beautiful', 'sexuality', 'obsess'],
        ancientVoice: 'limbic_system',
        intrusiveBoost: ['electrochemistry', 'suggestion', 'inland_empire']
    },
    jamrock_shuffle: {
        id: 'jamrock_shuffle',
        name: 'Jamrock Shuffle',
        icon: '🎲',
        category: 'mental',
        description: 'Trust the gut. The streets taught you things no book ever could.',
        boosts: ['shivers', 'perception', 'reaction_speed', 'savoir_faire', 'half_light'],
        debuffs: ['logic', 'encyclopedia', 'rhetoric'],
        difficultyMod: -1,
        keywords: ['luck', 'instinct', 'gut', 'street', 'shuffle', 'gamble', 'chance'],
        ancientVoice: null,
        intrusiveBoost: ['shivers', 'perception', 'half_light']
    },
    paranoid: {
        id: 'paranoid',
        name: 'Paranoid',
        icon: '👁️',
        category: 'mental',
        description: 'They are watching. They are always watching. Trust no one.',
        boosts: ['half_light', 'perception', 'shivers'],
        debuffs: ['empathy', 'suggestion', 'composure'],
        difficultyMod: 1,
        keywords: ['paranoid', 'suspicious', 'watching', 'followed', 'conspiracy'],
        ancientVoice: null,
        intrusiveBoost: ['half_light', 'perception']
    },
    terrified: {
        id: 'terrified',
        name: 'Terrified',
        icon: '😨',
        category: 'mental',
        description: 'Fear grips your ancient brain. Fight or flight. There is no think.',
        boosts: ['half_light', 'shivers', 'reaction_speed', 'perception'],
        debuffs: ['authority', 'composure', 'rhetoric'],
        difficultyMod: 2,
        keywords: ['scared', 'afraid', 'terrified', 'fear', 'panic', 'horror'],
        ancientVoice: 'ancient_reptilian_brain',
        intrusiveBoost: ['half_light', 'shivers']
    },
    enraged: {
        id: 'enraged',
        name: 'Enraged',
        icon: '😤',
        category: 'mental',
        description: 'The fire in your blood. Violence simmers just beneath the surface.',
        boosts: ['authority', 'physical_instrument', 'half_light', 'endurance'],
        debuffs: ['empathy', 'composure', 'logic', 'suggestion'],
        difficultyMod: 2,
        keywords: ['angry', 'furious', 'rage', 'mad', 'pissed', 'infuriated'],
        ancientVoice: 'limbic_system',
        intrusiveBoost: ['half_light', 'authority', 'physical_instrument']
    },
    the_expression: {
        id: 'the_expression',
        name: 'The Expression',
        icon: '😢',
        category: 'mental',
        description: 'Grief made manifest. The face you make when the world breaks you.',
        boosts: ['empathy', 'inland_empire', 'shivers', 'volition', 'drama'],
        debuffs: ['authority', 'electrochemistry', 'savoir_faire', 'composure'],
        difficultyMod: 2,
        keywords: ['grief', 'loss', 'mourning', 'tears', 'sad', 'crying', 'sob', 'heartbreak'],
        ancientVoice: 'limbic_system',
        intrusiveBoost: ['empathy', 'inland_empire', 'drama']
    },
    the_innocence: {
        id: 'the_innocence',
        name: 'The Innocence',
        icon: '🦋',
        category: 'mental',
        description: 'A moment of pure wonder. The child you were, before the world happened to you.',
        boosts: ['inland_empire', 'empathy', 'perception', 'shivers', 'conceptualization'],
        debuffs: ['authority', 'half_light', 'rhetoric'],
        difficultyMod: -1,
        keywords: ['innocent', 'wonder', 'child', 'pure', 'phasmid', 'miracle', 'beautiful'],
        ancientVoice: null,
        intrusiveBoost: ['inland_empire', 'empathy', 'conceptualization']
    },

    // ═══════════════════════════════════════════════════════════════
    // COP ARCHETYPES (Mutually Exclusive Identity States)
    // ═══════════════════════════════════════════════════════════════
    apocalypse_cop: {
        id: 'apocalypse_cop',
        name: 'Apocalypse Cop',
        icon: '🔥',
        category: 'archetype',
        description: 'The badge still means something. Even at the end of all things.',
        boosts: ['half_light', 'authority', 'shivers', 'inland_empire', 'endurance'],
        debuffs: ['empathy', 'suggestion', 'savoir_faire'],
        difficultyMod: 0,
        keywords: ['apocalypse', 'end times', 'doom', 'final', 'revelation'],
        ancientVoice: 'ancient_reptilian_brain',
        intrusiveBoost: ['half_light', 'shivers', 'inland_empire'],
        exclusive: 'archetype'
    },
    sorry_cop: {
        id: 'sorry_cop',
        name: 'Sorry Cop',
        icon: '🙏',
        category: 'archetype',
        description: 'You apologize. For everything. For existing. It somehow works.',
        boosts: ['empathy', 'suggestion', 'drama', 'volition'],
        debuffs: ['authority', 'physical_instrument', 'half_light'],
        difficultyMod: 0,
        keywords: ['sorry', 'apologize', 'forgive', 'humble', 'pathetic', 'please'],
        ancientVoice: null,
        intrusiveBoost: ['empathy', 'drama', 'suggestion'],
        exclusive: 'archetype'
    },
    superstar_cop: {
        id: 'superstar_cop',
        name: 'Superstar Cop',
        icon: '⭐',
        category: 'archetype',
        description: 'You are the LAW. You are DISCO. You are absolutely insufferable.',
        boosts: ['authority', 'savoir_faire', 'rhetoric', 'drama', 'electrochemistry'],
        debuffs: ['empathy', 'logic', 'composure'],
        difficultyMod: -1,
        keywords: ['superstar', 'disco', 'fame', 'celebrity', 'amazing', 'incredible'],
        ancientVoice: null,
        intrusiveBoost: ['authority', 'drama', 'savoir_faire'],
        exclusive: 'archetype'
    },
    hobocop: {
        id: 'hobocop',
        name: 'Hobocop',
        icon: '🗑️',
        category: 'archetype',
        description: 'You patrol the margins. The forgotten places. The people no one else sees.',
        boosts: ['shivers', 'inland_empire', 'empathy', 'endurance', 'perception'],
        debuffs: ['authority', 'composure', 'savoir_faire', 'suggestion'],
        difficultyMod: 1,
        keywords: ['hobo', 'vagrant', 'homeless', 'outcast', 'forgotten', 'streets'],
        ancientVoice: null,
        intrusiveBoost: ['shivers', 'inland_empire', 'empathy'],
        exclusive: 'archetype'
    },
    boring_cop: {
        id: 'boring_cop',
        name: 'Boring Cop',
        icon: '📋',
        category: 'archetype',
        description: 'By the book. Professional. Utterly, devastatingly competent.',
        boosts: ['logic', 'encyclopedia', 'composure', 'volition', 'perception'],
        debuffs: ['drama', 'inland_empire', 'electrochemistry', 'conceptualization'],
        difficultyMod: -1,
        keywords: ['boring', 'professional', 'competent', 'proper', 'correct', 'procedure'],
        ancientVoice: null,
        intrusiveBoost: ['logic', 'composure', 'volition'],
        exclusive: 'archetype'
    },
    art_cop: {
        id: 'art_cop',
        name: 'Art Cop',
        icon: '🎨',
        category: 'archetype',
        description: 'You see the beauty in everything. Even crime scenes. Especially crime scenes.',
        boosts: ['conceptualization', 'inland_empire', 'drama', 'visual_calculus', 'empathy'],
        debuffs: ['authority', 'physical_instrument', 'logic'],
        difficultyMod: 0,
        keywords: ['art', 'beauty', 'aesthetic', 'creative', 'vision', 'artistic'],
        ancientVoice: null,
        intrusiveBoost: ['conceptualization', 'drama', 'inland_empire'],
        exclusive: 'archetype'
    }
};

// Helper to get archetype statuses (for mutual exclusivity)
export const ARCHETYPE_IDS = Object.entries(STATUS_EFFECTS)
    .filter(([_, status]) => status.category === 'archetype')
    .map(([id, _]) => id);

// Statuses that trigger BOTH ancient voices
export const DUAL_ANCIENT_TRIGGERS = ['the_pale'];
