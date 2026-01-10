/**
 * Inland Empire - Thought Cabinet Data
 * Themes for tracking and Thoughts for discovery/research/internalization
 */

export const THEMES = {
    death: {
        id: 'death',
        name: 'Death',
        icon: '💀',
        keywords: ['death', 'dead', 'dying', 'kill', 'murder', 'corpse', 'funeral', 'grave', 'mortality', 'deceased', 'fatal', 'lethal', 'body', 'remains']
    },
    love: {
        id: 'love',
        name: 'Love',
        icon: '❤️',
        keywords: ['love', 'heart', 'romance', 'passion', 'desire', 'affection', 'beloved', 'darling', 'intimate', 'tender', 'devotion', 'relationship', 'partner']
    },
    violence: {
        id: 'violence',
        name: 'Violence',
        icon: '👊',
        keywords: ['violence', 'fight', 'hit', 'punch', 'blood', 'brutal', 'attack', 'weapon', 'wound', 'harm', 'hurt', 'aggressive', 'beat', 'strike']
    },
    mystery: {
        id: 'mystery',
        name: 'Mystery',
        icon: '🔍',
        keywords: ['mystery', 'clue', 'evidence', 'investigate', 'secret', 'hidden', 'unknown', 'suspicious', 'curious', 'strange', 'puzzle', 'case', 'detective']
    },
    substance: {
        id: 'substance',
        name: 'Substances',
        icon: '💊',
        keywords: ['drug', 'alcohol', 'drunk', 'high', 'smoke', 'pill', 'needle', 'addict', 'sober', 'intoxicated', 'withdrawal', 'bottle', 'drink']
    },
    failure: {
        id: 'failure',
        name: 'Failure',
        icon: '📉',
        keywords: ['fail', 'failure', 'mistake', 'wrong', 'error', 'lose', 'lost', 'regret', 'shame', 'disappoint', 'mess', 'screw', 'ruin', 'broken']
    },
    identity: {
        id: 'identity',
        name: 'Identity',
        icon: '🎭',
        keywords: ['identity', 'who', 'self', 'name', 'person', 'remember', 'forget', 'past', 'memory', 'amnesia', 'mirror', 'face', 'real']
    },
    authority: {
        id: 'authority',
        name: 'Authority',
        icon: '👮',
        keywords: ['authority', 'power', 'control', 'command', 'order', 'law', 'rule', 'badge', 'cop', 'police', 'respect', 'officer', 'detective']
    },
    paranoia: {
        id: 'paranoia',
        name: 'Paranoia',
        icon: '👁️',
        keywords: ['paranoia', 'paranoid', 'watch', 'follow', 'conspiracy', 'suspicious', 'spy', 'trust', 'betray', 'trap', 'danger', 'threat', 'enemy']
    },
    philosophy: {
        id: 'philosophy',
        name: 'Philosophy',
        icon: '🤔',
        keywords: ['philosophy', 'meaning', 'existence', 'truth', 'reality', 'consciousness', 'soul', 'mind', 'think', 'believe', 'question', 'purpose', 'why']
    },
    money: {
        id: 'money',
        name: 'Money',
        icon: '💰',
        keywords: ['money', 'cash', 'rich', 'poor', 'wealth', 'poverty', 'coin', 'pay', 'debt', 'afford', 'expensive', 'cheap', 'broke', 'cost']
    },
    supernatural: {
        id: 'supernatural',
        name: 'Supernatural',
        icon: '👻',
        keywords: ['ghost', 'spirit', 'supernatural', 'magic', 'curse', 'haunted', 'paranormal', 'psychic', 'vision', 'prophecy', 'omen', 'pale', 'strange']
    }
};

export const THOUGHTS = {
    volumetric_shit_compressor: {
        id: 'volumetric_shit_compressor',
        name: 'Volumetric Shit Compressor',
        icon: '💩',
        category: 'philosophy',
        description: 'What if you compressed all your failures into a singularity?',
        discoveryConditions: { themes: { failure: 5, philosophy: 3 } },
        researchTime: 6,
        researchPenalty: { logic: -1 },
        internalizedBonus: { conceptualization: 2 },
        capModifier: { logic: 1 },
        flavorText: 'You have created a black hole of self-criticism. It is beautiful.'
    },
    hobocop: {
        id: 'hobocop',
        name: 'Hobocop',
        icon: '🥫',
        category: 'identity',
        description: 'A different kind of law enforcement. For the people, by the people who have nothing.',
        discoveryConditions: { themes: { money: 5, authority: 3 } },
        researchTime: 8,
        researchPenalty: { authority: -1 },
        internalizedBonus: { shivers: 2 },
        capModifier: { shivers: 1 },
        flavorText: 'You patrol the margins. The forgotten places. Someone has to.'
    },
    bringing_of_the_law: {
        id: 'bringing_of_the_law',
        name: 'Bringing of the Law',
        icon: '⚖️',
        category: 'authority',
        description: 'The law is not just words. It is FORCE.',
        discoveryConditions: { criticalSuccess: 'authority' },
        researchTime: 10,
        researchPenalty: { empathy: -1, suggestion: -1 },
        internalizedBonus: { authority: 3 },
        capModifier: { authority: 2 },
        flavorText: 'You ARE the law. And the law... is VIOLENCE.'
    },
    kingdom_of_conscience: {
        id: 'kingdom_of_conscience',
        name: 'Kingdom of Conscience',
        icon: '👑',
        category: 'philosophy',
        description: 'What if morality was the only kingdom worth ruling?',
        discoveryConditions: { themes: { philosophy: 6 }, minSkill: { volition: 4 } },
        researchTime: 12,
        researchPenalty: { electrochemistry: -2 },
        internalizedBonus: { volition: 2 },
        capModifier: { volition: 2 },
        flavorText: 'Pleasure fades. Conscience endures. You have chosen your kingdom.'
    },
    motorway_south: {
        id: 'motorway_south',
        name: 'Motorway South',
        icon: '🛣️',
        category: 'escape',
        description: 'There is always a road out. Always a direction away from everything.',
        discoveryConditions: { themes: { failure: 4, identity: 3 } },
        researchTime: 7,
        researchPenalty: { esprit_de_corps: -1 },
        internalizedBonus: { composure: 2 },
        capModifier: { composure: 1 },
        flavorText: 'You can see it now. The road that leads away from everything.'
    },
    anti_object_task_force: {
        id: 'anti_object_task_force',
        name: 'Anti-Object Task Force',
        icon: '🚫',
        category: 'mental',
        description: 'The objects speak too much. It is time to silence them.',
        discoveryConditions: { objectCount: 5 },
        researchTime: 6,
        researchPenalty: { inland_empire: -1 },
        internalizedBonus: { logic: 1, composure: 1 },
        capModifier: { logic: 1 },
        flavorText: 'Objects are just objects. They cannot speak. They never could.',
        specialEffect: 'objectVoiceReduction'
    },
    cop_of_the_apocalypse: {
        id: 'cop_of_the_apocalypse',
        name: 'Cop of the Apocalypse',
        icon: '🔥',
        category: 'identity',
        description: 'When the world ends, someone still needs to enforce the law.',
        discoveryConditions: { themes: { death: 6, authority: 4 } },
        researchTime: 14,
        researchPenalty: { empathy: -2 },
        internalizedBonus: { half_light: 2, authority: 1 },
        capModifier: { half_light: 1 },
        flavorText: 'The badge still means something. Even at the end of all things.'
    },
    caustic_echo: {
        id: 'caustic_echo',
        name: 'Caustic Echo',
        icon: '🗣️',
        category: 'social',
        description: 'Your words burn. Learn to aim them.',
        discoveryConditions: { criticalSuccess: 'rhetoric' },
        researchTime: 8,
        researchPenalty: { suggestion: -1 },
        internalizedBonus: { rhetoric: 2 },
        capModifier: { rhetoric: 1 },
        flavorText: 'Every word a weapon. Every sentence a scar.'
    },
    waste_land_of_reality: {
        id: 'waste_land_of_reality',
        name: 'Waste Land of Reality',
        icon: '🏜️',
        category: 'philosophy',
        description: 'Reality is a desert. Your mind is an oasis.',
        discoveryConditions: { themes: { supernatural: 4 }, status: 'dissociated' },
        researchTime: 10,
        researchPenalty: { perception: -1 },
        internalizedBonus: { inland_empire: 2 },
        capModifier: { inland_empire: 1 },
        flavorText: 'The real is not real. The unreal... is home.'
    },
    lovers_lament: {
        id: 'lovers_lament',
        name: "Lover's Lament",
        icon: '💔',
        category: 'emotion',
        description: 'Love lost is still love. Pain is proof of connection.',
        discoveryConditions: { themes: { love: 5, failure: 3 } },
        researchTime: 9,
        researchPenalty: { composure: -1 },
        internalizedBonus: { empathy: 2 },
        capModifier: { empathy: 1 },
        flavorText: 'You loved. You lost. You are still capable of both.'
    },
    finger_on_the_eject_button: {
        id: 'finger_on_the_eject_button',
        name: 'Finger on the Eject Button',
        icon: '🔘',
        category: 'survival',
        description: 'Always have an exit strategy. Always be ready to leave.',
        discoveryConditions: { themes: { paranoia: 4, violence: 3 } },
        researchTime: 6,
        researchPenalty: { authority: -1 },
        internalizedBonus: { reaction_speed: 2 },
        capModifier: { reaction_speed: 1 },
        flavorText: 'You can feel it. The moment everything goes wrong. And you will be ready.'
    },
    actual_art_degree: {
        id: 'actual_art_degree',
        name: 'Actual Art Degree',
        icon: '🎨',
        category: 'identity',
        description: 'You went to art school. This explains everything.',
        discoveryConditions: { themes: { philosophy: 3 }, minSkill: { conceptualization: 5 } },
        researchTime: 8,
        researchPenalty: { logic: -1 },
        internalizedBonus: { conceptualization: 2, drama: 1 },
        capModifier: { conceptualization: 1 },
        flavorText: 'Four years of theory. A lifetime of seeing patterns no one else sees.'
    },
    jamais_vu: {
        id: 'jamais_vu',
        name: 'Jamais Vu',
        icon: '❓',
        category: 'mental',
        description: 'The familiar becomes strange. Nothing feels real.',
        discoveryConditions: { themes: { identity: 5 }, status: 'dissociated' },
        researchTime: 11,
        researchPenalty: { empathy: -1 },
        internalizedBonus: { shivers: 1, inland_empire: 1 },
        capModifier: { perception: 1 },
        flavorText: 'You have seen this before. And yet... it is all new.'
    },
    the_bow_collector: {
        id: 'the_bow_collector',
        name: 'The Bow Collector',
        icon: '🎀',
        category: 'obsession',
        description: 'Small beautiful things. Collected. Treasured. Understood.',
        discoveryConditions: { themes: { mystery: 4 }, minSkill: { perception: 4 } },
        researchTime: 7,
        researchPenalty: { physical_instrument: -1 },
        internalizedBonus: { perception: 2 },
        capModifier: { perception: 1 },
        flavorText: 'In the details, you find meaning. In the small, you find the infinite.'
    },
    regular_law_official: {
        id: 'regular_law_official',
        name: 'Regular Law Official',
        icon: '📋',
        category: 'identity',
        description: 'Just doing your job. Nothing special. Nothing memorable.',
        discoveryConditions: { themes: { authority: 3 }, messageCount: 50 },
        researchTime: 5,
        researchPenalty: { drama: -1 },
        internalizedBonus: { composure: 1, esprit_de_corps: 1 },
        capModifier: { esprit_de_corps: 1 },
        flavorText: 'You clock in. You clock out. You enforce the law. Simple.'
    },
    some_kind_of_superstar: {
        id: 'some_kind_of_superstar',
        name: 'Some Kind of Superstar',
        icon: '⭐',
        category: 'identity',
        description: 'You are destined for greatness. Everyone can see it.',
        discoveryConditions: { criticalSuccess: 'savoir_faire' },
        researchTime: 9,
        researchPenalty: { empathy: -1 },
        internalizedBonus: { savoir_faire: 2, drama: 1 },
        capModifier: { savoir_faire: 1 },
        flavorText: 'The spotlight finds you. It always has. It always will.'
    },
    wompty_dompty_dom_centre: {
        id: 'wompty_dompty_dom_centre',
        name: 'Wompty-Dompty-Dom Centre',
        icon: '🏢',
        category: 'philosophy',
        description: 'The center of everything. Or nothing. Hard to tell.',
        discoveryConditions: { themes: { philosophy: 5, supernatural: 3 } },
        researchTime: 13,
        researchPenalty: { logic: -2 },
        internalizedBonus: { encyclopedia: 2 },
        capModifier: { encyclopedia: 1 },
        flavorText: 'You have found the center. It wobbles. It womps. It dominates.'
    },
    detective_arriving_on_the_scene: {
        id: 'detective_arriving_on_the_scene',
        name: 'Detective Arriving on the Scene',
        icon: '🚔',
        category: 'identity',
        description: 'First impressions matter. Especially for detectives.',
        discoveryConditions: { firstDiscovery: true },
        researchTime: 4,
        researchPenalty: { inland_empire: -1 },
        internalizedBonus: { visual_calculus: 1, perception: 1 },
        capModifier: { visual_calculus: 1 },
        flavorText: 'You have arrived. The investigation can now begin.'
    },
    the_fifteenth_indotribe: {
        id: 'the_fifteenth_indotribe',
        name: 'The Fifteenth Indotribe',
        icon: '🏴',
        category: 'philosophy',
        description: 'A tribe of one. A nation of the self.',
        discoveryConditions: { themes: { identity: 6, philosophy: 4 } },
        researchTime: 15,
        researchPenalty: { esprit_de_corps: -2 },
        internalizedBonus: { volition: 1, conceptualization: 1 },
        capModifier: { volition: 1 },
        flavorText: 'You belong to no nation. You ARE a nation. Population: you.'
    },
    apricot_chewing_gum_enthusiast: {
        id: 'apricot_chewing_gum_enthusiast',
        name: 'Apricot Chewing Gum Enthusiast',
        icon: '🍑',
        category: 'obsession',
        description: 'The specific pleasure of apricot. Chewed thoughtfully.',
        discoveryConditions: { themes: { substance: 3 }, minSkill: { electrochemistry: 4 } },
        researchTime: 5,
        researchPenalty: { authority: -1 },
        internalizedBonus: { electrochemistry: 1, suggestion: 1 },
        capModifier: { electrochemistry: 1 },
        flavorText: 'Sweet. Fruity. Perfectly legal. The perfect vice.'
    }
};
