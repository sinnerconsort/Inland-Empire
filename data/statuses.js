/**
 * Inland Empire - Status Effects Data
 * Physical and mental states that modify skills
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
        boosts: ['electrochemistry', 'inland_empire', 'drama', 'suggestion'],
        debuffs: ['logic', 'hand_eye_coordination', 'reaction_speed', 'composure'],
        difficultyMod: 2,
        keywords: ['drunk', 'intoxicated', 'wasted', 'high', 'tipsy', 'booze', 'liquor'],
        ancientVoice: null,
        intrusiveBoost: ['electrochemistry', 'inland_empire']
    },
    wounded: {
        id: 'wounded',
        name: 'Wounded',
        icon: '🩸',
        category: 'physical',
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
        boosts: ['electrochemistry', 'perception'],
        debuffs: ['logic', 'composure', 'volition'],
        difficultyMod: 1,
        keywords: ['hungry', 'starving', 'famished', 'food', 'eat'],
        ancientVoice: null,
        intrusiveBoost: ['electrochemistry']
    },
    dying: {
        id: 'dying',
        name: 'Dying',
        icon: '💀',
        category: 'physical',
        boosts: ['pain_threshold', 'inland_empire', 'shivers'],
        debuffs: ['logic', 'rhetoric', 'authority'],
        difficultyMod: 4,
        keywords: ['dying', 'death', 'fading', 'bleeding out', 'critical'],
        ancientVoice: 'ancient_reptilian_brain',
        intrusiveBoost: ['inland_empire', 'shivers']
    },

    // ═══════════════════════════════════════════════════════════════
    // MENTAL STATUS EFFECTS
    // ═══════════════════════════════════════════════════════════════
    paranoid: {
        id: 'paranoid',
        name: 'Paranoid',
        icon: '👁️',
        category: 'mental',
        boosts: ['half_light', 'perception', 'shivers'],
        debuffs: ['empathy', 'suggestion', 'composure'],
        difficultyMod: 1,
        keywords: ['paranoid', 'suspicious', 'watching', 'followed', 'conspiracy'],
        ancientVoice: null,
        intrusiveBoost: ['half_light', 'perception']
    },
    aroused: {
        id: 'aroused',
        name: 'Aroused',
        icon: '💋',
        category: 'mental',
        boosts: ['electrochemistry', 'suggestion', 'empathy', 'drama'],
        debuffs: ['logic', 'volition', 'composure'],
        difficultyMod: 2,
        keywords: ['aroused', 'desire', 'attraction', 'lust', 'seduction', 'beautiful'],
        ancientVoice: 'limbic_system',
        intrusiveBoost: ['electrochemistry', 'suggestion']
    },
    enraged: {
        id: 'enraged',
        name: 'Enraged',
        icon: '😤',
        category: 'mental',
        boosts: ['authority', 'physical_instrument', 'half_light'],
        debuffs: ['empathy', 'composure', 'logic'],
        difficultyMod: 2,
        keywords: ['angry', 'furious', 'rage', 'mad', 'pissed', 'infuriated'],
        ancientVoice: 'limbic_system',
        intrusiveBoost: ['half_light', 'authority', 'physical_instrument']
    },
    terrified: {
        id: 'terrified',
        name: 'Terrified',
        icon: '😨',
        category: 'mental',
        boosts: ['half_light', 'shivers', 'reaction_speed', 'perception'],
        debuffs: ['authority', 'composure', 'rhetoric'],
        difficultyMod: 2,
        keywords: ['scared', 'afraid', 'terrified', 'fear', 'panic', 'horror'],
        ancientVoice: 'ancient_reptilian_brain',
        intrusiveBoost: ['half_light', 'shivers']
    },
    confident: {
        id: 'confident',
        name: 'Confident',
        icon: '😎',
        category: 'mental',
        boosts: ['authority', 'savoir_faire', 'rhetoric', 'suggestion'],
        debuffs: ['inland_empire', 'empathy'],
        difficultyMod: -1,
        keywords: ['confident', 'bold', 'assured', 'swagger', 'certain', 'powerful'],
        ancientVoice: null,
        intrusiveBoost: ['authority', 'savoir_faire']
    },
    grieving: {
        id: 'grieving',
        name: 'Grieving',
        icon: '😢',
        category: 'mental',
        boosts: ['empathy', 'inland_empire', 'shivers', 'volition'],
        debuffs: ['authority', 'electrochemistry', 'savoir_faire'],
        difficultyMod: 2,
        keywords: ['grief', 'loss', 'mourning', 'tears', 'sad', 'crying', 'sob'],
        ancientVoice: 'limbic_system',
        intrusiveBoost: ['empathy', 'inland_empire']
    },
    manic: {
        id: 'manic',
        name: 'Manic',
        icon: '⚡',
        category: 'mental',
        boosts: ['electrochemistry', 'reaction_speed', 'conceptualization', 'inland_empire'],
        debuffs: ['composure', 'logic', 'volition'],
        difficultyMod: 1,
        keywords: ['manic', 'hyper', 'racing', 'unstoppable', 'wired', 'frantic'],
        ancientVoice: 'limbic_system',
        intrusiveBoost: ['electrochemistry', 'conceptualization']
    },
    dissociated: {
        id: 'dissociated',
        name: 'Dissociated',
        icon: '🌫️',
        category: 'mental',
        boosts: ['inland_empire', 'shivers', 'pain_threshold'],
        debuffs: ['perception', 'reaction_speed', 'empathy'],
        difficultyMod: 2,
        keywords: ['dissociate', 'unreal', 'floating', 'numb', 'detached', 'distant', 'unconscious', 'blackout'],
        ancientVoice: 'ancient_reptilian_brain',
        intrusiveBoost: ['inland_empire', 'shivers']
    }
};
