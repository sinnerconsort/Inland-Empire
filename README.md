# Inland Empire 🧠

A SillyTavern extension that adds **Disco Elysium-style internal voices** to your roleplay sessions. Your character's psyche comes alive with skill-based commentary that **reacts to itself** - voices argue, agree, interrupt, and build off each other just like in the game.

## ✨ What's New in v0.8.0 - Investigation System

**Your surroundings now speak!** A new "Slay the Princess" inspired investigation system with dynamic narrators, skill reactors, and AI-generated object voices.

### 🔍 Investigation System
- **Narrator Selection** - Context-aware skill picks the narrator (crime scene → Visual Calculus, bar → Electrochemistry)
- **Skill Checks** - Narrator reliability based on dice rolls (failed checks = biased/unreliable narration)
- **Skill Reactors** - 2-4 other skills comment on the scene
- **Dynamic Object Voices** - AI finds interesting objects in YOUR scene and gives them personality
  - No more pattern matching! Objects are contextual: "THE MOLDY PIZZA SLICE", "THE FLICKERING STREETLIGHT"
  - 35% RNG chance per investigation (configurable)

### 🎭 Enhanced POV System
- **Scene Perspective Notes** - New setting to help voices convert third-person scene text
- Handles complex scenarios like "Scene written from Kim's POV watching Harry"
- Proper pronoun conversion: when scene says "him" about your character → "you"

### 🔌 Global API for Companion Extensions
- `window.InlandEmpire` exposes skill queries and modifier registration
- Other extensions can push stat modifiers (equipment, consumables, etc.)
- Event system for skill checks, modifier changes
- Ready for Inventory/Equipment companion extension!

---

## 🗄️ Thought Cabinet (v0.7.0)

**Your psyche has depth!** Discover thoughts through gameplay, research them over time, and internalize them for permanent bonuses.

### Features
- **20 unique thoughts** inspired by Disco Elysium
- **3 thought slots** (expandable)
- **Discovery system** - thoughts unlock based on themes, statuses, and events
- **Research phase** - thoughts take time to process (with temporary penalties!)
- **Internalization** - permanent skill bonuses and raised skill caps

### 📊 Theme Tracker
- 12 themes tracked in the background: Death, Love, Violence, Mystery, Substances, Failure, Identity, Authority, Paranoia, Philosophy, Money, Supernatural
- Themes accumulate as you play, unlocking new thoughts
- View your top themes in the Cabinet tab

### 💭 Example Thoughts

| Thought | Research Penalty | Internalized Bonus |
|---------|-----------------|-------------------|
| *Volumetric Shit Compressor* | -1 Logic | +2 Conceptualization, +1 Logic cap |
| *Hobocop* | -1 Authority | +2 Shivers, +1 Shivers cap |
| *Bringing of the Law* | -1 Empathy, -1 Suggestion | +3 Authority, +2 Authority cap |
| *Kingdom of Conscience* | -2 Electrochemistry | +2 Volition, +2 Volition cap |

---

## Core Features

### 🎭 24 Skills + 2 Ancient Voices
All 24 skills from Disco Elysium organized into four attributes (Intellect, Psyche, Physique, Motorics), plus primal "Limbic System" and "Reptilian Brain" voices that emerge during extreme states.

### 🎲 Dice Check System
2d6 skill checks with difficulty based on context:
- **Boxcars (12)** - Critical success, profound insight
- **Snake Eyes (2)** - Critical failure, spectacularly wrong
- Failed checks mean unreliable/biased information

### 📊 Status Effects
12 status effects that boost/debuff skills and affect voice selection:
- Intoxicated, Wounded, Exhausted, Caffeinated
- Heartbroken, Paranoid, Inspired, Dissociating
- And more...

### 🎯 Skill Caps
- Skills have learning caps based on attributes
- Internalized thoughts can **raise caps** for specific skills
- Research penalties temporarily **lower** skills while thinking

### ⚡ Cascade System
Skills react to each other! When one skill speaks, rivals may interrupt to argue, allies may support, and the conversation flows naturally.

---

## Installation

1. Open SillyTavern
2. Go to **Extensions** → **Install Extension**
3. Paste the GitHub URL or install from zip
4. Enable "Inland Empire" in the extensions list

## Setup

### API Configuration
1. Open the **Psyche Panel** (click the brain icon 🧠)
2. Go to the **Settings** tab (⚙️)
3. Enter your API details (OpenAI-compatible endpoint)
4. Save Settings

### POV Configuration
1. Go to **POV & Character** in Settings
2. Set your character name and pronouns
3. Add **Character Context** (who "you" is)
4. Add **Scene Perspective Notes** if your scenes are written from another character's POV

### Using the Investigation System
1. Click the **magnifying glass** FAB (🔍)
2. Or use the quick-scan button for immediate results
3. A narrator skill describes the scene through their lens
4. Other skills react beneath
5. Sometimes an object in the scene speaks!

### Using the Thought Cabinet
1. Go to the **Cabinet** tab (📦)
2. Watch themes accumulate as you play
3. When a thought is discovered, choose to **Research** or **Dismiss**
4. Research takes several messages to complete
5. Once internalized, bonuses are permanent!

---

## Global API (For Developers)

Other extensions can interact with Inland Empire:

```javascript
// Check if loaded
if (window.InlandEmpire) {
    // Read skill levels
    const level = window.InlandEmpire.getEffectiveSkillLevel('rhetoric');
    
    // Push modifiers (equipment, etc.)
    window.InlandEmpire.registerModifier('my_item', 'inland_empire', +2);
    window.InlandEmpire.removeModifierSource('my_item');
    
    // Roll checks
    const result = window.InlandEmpire.rollCheck('suggestion', 12);
}

// Listen for events
document.addEventListener('ie:skill-check', (e) => {
    const { skillId, success, isBoxcars } = e.detail;
});
```

See `companion-extension-example.js` for full documentation.

---

## Version History

- **v0.8.0** - 🔍 **INVESTIGATION SYSTEM** - Dynamic narrators, AI-generated object voices, enhanced POV, Global API
- **v0.7.0** - 🗄️ Thought Cabinet - Theme tracking, thought discovery, research, internalization, skill caps
- **v0.6.0** - Intrusive thoughts, object voices, expanded toasts
- **v0.5.0** - Persona profiles, status effects saved
- **v0.4.0** - Reactive chorus mode, cascade system
- **v0.3.x** - Various fixes and improvements
- **v0.2.x** - POV control, status effects, chat injection
- **v0.1.0** - Initial release

---

## File Structure

```
inland-empire/
├── index.js           # Main entry, UI, event handling, Global API
├── styles.css         # All styling (3700+ lines of DE aesthetic)
├── data/
│   ├── skills.js      # 24 skills + ancient voices
│   ├── statuses.js    # Status effects
│   ├── thoughts.js    # Thought cabinet content
│   └── relationships.js # Skill dynamics & cascades
└── systems/
    ├── state.js       # Settings, builds, profiles
    ├── generation.js  # Voice generation & prompts
    ├── discovery.js   # Investigation system (v3)
    ├── cabinet.js     # Thought cabinet logic
    ├── dice.js        # 2d6 check system
    └── panel.js       # UI components
```

---

*"What is a man but the sum of his memories? We are the stories we tell ourselves."*
