# Inland Empire 🧠

A SillyTavern extension that adds **Disco Elysium-style internal voices** to your roleplay sessions. Your character's psyche comes alive with skill-based commentary that **reacts to itself** - voices argue, agree, interrupt, and build off each other just like in the game.

## ✨ What's New in v0.7.0 - The Thought Cabinet

**Your psyche now has depth!** Discover thoughts through gameplay, research them over time, and internalize them for permanent bonuses.

### 🗄️ Thought Cabinet
- **20 unique thoughts** inspired by Disco Elysium
- **3 thought slots** (expandable)
- **Discovery system** - thoughts unlock based on themes, statuses, and events
- **Research phase** - thoughts take time to process (with temporary penalties!)
- **Internalization** - permanent skill bonuses and raised skill caps

### 📊 Theme Tracker
- 12 themes tracked in the background: Death, Love, Violence, Mystery, Substances, Failure, Identity, Authority, Paranoia, Philosophy, Money, Supernatural
- Themes accumulate as you play, unlocking new thoughts
- View your top themes in the Cabinet tab

### 🎯 Skill Caps
- Skills now have learning caps based on attributes
- Internalized thoughts can **raise caps** for specific skills
- Research penalties temporarily **lower** skills while thinking

## Features

### 🎭 24 Skills + 2 Ancient Voices
All 24 skills from Disco Elysium organized into four attributes, plus primal voices that emerge during extreme states.

### 🎲 Dice Check System
2d6 skill checks with difficulty based on context. Boxcars (12) for critical success, Snake Eyes (2) for critical failure.

### 📊 Status Effects
12 status effects that boost/debuff skills and affect voice selection.

### 🧠 Intrusive Thoughts
Random skill quips that fire during play, weighted by your build and current state.

### 👔 Object Voices
Items like THE TIE, THE GUN, THE BOTTLE speak when detected in the narrative.

### 💭 Example Thoughts

| Thought | Research Penalty | Internalized Bonus |
|---------|-----------------|-------------------|
| *Volumetric Shit Compressor* | -1 Logic | +2 Conceptualization, +1 Logic cap |
| *Hobocop* | -1 Authority | +2 Shivers, +1 Shivers cap |
| *Bringing of the Law* | -1 Empathy, -1 Suggestion | +3 Authority, +2 Authority cap |
| *Kingdom of Conscience* | -2 Electrochemistry | +2 Volition, +2 Volition cap |

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

### Using the Thought Cabinet
1. Go to the **Cabinet** tab (📦)
2. Watch themes accumulate as you play
3. When a thought is discovered, choose to **Research** or **Dismiss**
4. Research takes several messages to complete
5. Once internalized, bonuses are permanent!

## Thought Discovery

Thoughts unlock through various conditions:
- **Theme counts** - Accumulate enough of a theme
- **Theme combos** - Have multiple themes active together
- **Status effects** - Be intoxicated, wounded, etc.
- **Critical rolls** - Hit boxcars or snake eyes
- **Object encounters** - See enough objects speak
- **Ancient voices** - Trigger the primal brain

## Version History

- **v0.7.0** - 🗄️ **THOUGHT CABINET** - Theme tracking, thought discovery, research, internalization, skill caps!
- **v0.6.0** - Intrusive thoughts, object voices, expanded toasts
- **v0.5.0** - Persona profiles, status effects saved
- **v0.4.0** - Reactive chorus mode
- **v0.3.x** - Various fixes and improvements
- **v0.2.x** - POV control, status effects, chat injection
- **v0.1.0** - Initial release

---

*"What is a man but the sum of his memories? We are the stories we tell ourselves."*
