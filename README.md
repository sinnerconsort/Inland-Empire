# Inland Empire 🧠

A SillyTavern extension that adds **Disco Elysium-style internal voices** to your roleplay sessions. Your character's psyche comes alive with skill-based commentary that **reacts to itself** - voices argue, agree, interrupt, and build off each other just like in the game.

## ✨ What's New in v0.4.0 - Reactive Chorus Mode

**The voices now interact with each other!** Instead of each skill speaking in isolation, they form a reactive chorus:

```
COMPOSURE - Get a hold of yourself.
RHETORIC - Such a fucking embarrassment.
SAVOIR FAIRE - Remember when you did this in front of *everyone*?
RHETORIC - This has graduated from a cock carousel to a cock cascade.
AUTHORITY - A *colossal* cock-up.
DRAMA - A cockinalia.
INLAND EMPIRE - At the end of all things. The A-cock-alypse.
```

This creates authentic Disco Elysium-style internal monologues where your skills can:
- **Argue** with each other
- **Interrupt** mid-thought
- **Build** on each other's observations
- **Panic together** during crises
- **Gang up** on poor COMPOSURE

## Features

### 🎭 24 Skills + 2 Ancient Voices
All 24 skills from Disco Elysium organized into four attributes:

**INTELLECT** - Logic, Encyclopedia, Rhetoric, Drama, Conceptualization, Visual Calculus

**PSYCHE** - Volition, Inland Empire, Empathy, Authority, Suggestion, Esprit de Corps

**PHYSIQUE** - Endurance, Pain Threshold, Physical Instrument, Electrochemistry, Shivers, Half Light

**MOTORICS** - Hand/Eye Coordination, Perception, Reaction Speed, Savoir Faire, Interfacing, Composure

**PRIMAL** (Hidden) - Ancient Reptilian Brain, Limbic System (triggered by extreme states)

### 🎲 Dice Check System
- 2d6 skill checks with difficulty based on context
- Skill level affects success threshold
- **Boxcars (12)**: Critical success - brilliant insights
- **Snake Eyes (2)**: Critical failure - hilariously wrong
- Failed checks make voices uncertain or misguided
- Passive checks for observational skills

### 📊 Status Effects
12 status effects that boost/debuff skills and affect voice selection:

**Physical**: Intoxicated 🍺, Wounded 🩸, Exhausted 😴, Starving 🍽️, Dying 💀

**Mental**: Paranoid 👁️, Aroused 💋, Enraged 😤, Terrified 😨, Confident 😎, Grieving 😢, Manic ⚡, Dissociated 🌫️

### 🐍 Ancient Voices
Primal voices that emerge during extreme states:
- **Ancient Reptilian Brain**: Triggers on Dying, Starving, Terrified, Aroused
- **Limbic System**: Triggers on Enraged, Grieving, Manic

### ⚙️ Customization
- **POV Style**: Second person (you), Third person (name/they), First person (I)
- **Character Context**: Tell the voices who YOU are and who you're observing
- **Build System**: Allocate 12 attribute points to customize your psyche
- **Draggable Icon**: Position the brain icon anywhere on screen

## Installation

1. Open SillyTavern
2. Go to **Extensions** → **Install Extension**
3. Paste the GitHub URL or install from zip
4. Enable "Inland Empire" in the extensions list

## Setup

### API Configuration
The extension uses its own API connection (separate from your main ST API):

1. Open the **Psyche Panel** (click the brain icon 🧠)
2. Go to the **Settings** tab (⚙️)
3. Enter your API details:
   - **API Endpoint**: Your OpenAI-compatible endpoint (e.g., `https://api.openai.com/v1/` or `https://nano-gpt.com/api/v1/`)
   - **API Key**: Your API key
   - **Model**: Model name (e.g., `gpt-4o-mini`, `glm-4-plus`)
4. Adjust **Temperature** (0.8-1.0 recommended for creative chorus) and **Max Tokens** (500-800 for longer interactions)
5. Click **Save Settings**

### Character Context
For best results, tell the voices whose perspective they represent:

```
I am {{user}}, meeting {{char}} for the first time. 
{{char}} is an NPC I'm observing. 
These voices are MY internal thoughts about what I see.
```

This prevents the voices from accidentally speaking from the NPC's perspective.

## Usage

### Automatic Mode
Voices automatically trigger when the AI sends a message. They analyze the narrative and the relevant skills form a reactive chorus.

### Manual Mode
Click **"⚡ Consult Inner Voices"** to manually trigger voice generation on the last AI message.

### Status Effects
1. Go to the **Status** tab (💜)
2. Toggle status effects on/off
3. Active statuses affect which skills are boosted/debuffed
4. Extreme states trigger Ancient Voices

### Build Customization
1. Go to the **Build** tab (sliders icon)
2. Distribute 12 points across the four attributes
3. Click **Apply Build**
4. Skills start at their attribute level (1-6)

## Voice Display

Voices appear in a unified chorus bubble:
- In the **Psyche Panel** under "Inner Voices"
- **Injected into chat** below AI messages

Each voice line shows:
- Colored skill name
- The voice's commentary (possibly reacting to previous voices)

## Tips

- **Higher Max Tokens** gives voices more room to interact
- **Temperature 0.9-1.0** produces more creative exchanges
- **Status Effects** dramatically change the conversation tone
- **Drag the brain icon** to reposition it if it's in the way
- Failed checks make voices uncertain - they might contradict themselves or trail off

## Troubleshooting

**Voices not generating?**
- Check API configuration in Settings tab
- Verify your API key is valid
- Increase Max Tokens if responses seem cut off
- Check browser console for errors (F12)

**Icon disappeared?**
- Go to Extensions → Inland Empire → Toggle Panel Visibility
- Or click "Reset Icon Position" in Settings tab

**Wrong POV (voices speaking as NPC)?**
- Fill in Character Context explaining who YOU are
- Make sure POV Style matches your RP style

**Voices not interacting?**
- Some models handle multi-voice better than others
- GPT-4, Claude, GLM-4 work well
- Smaller models may produce more isolated responses

## Credits

- Inspired by **Disco Elysium** by ZA/UM
- Created for **SillyTavern**
- Extension by **Judas**

## Version History

- **v0.4.0** - 🎉 **REACTIVE CHORUS MODE** - Voices now interact with each other!
- **v0.3.4** - Draggable FAB, updated placeholders, README
- **v0.3.3** - FAB position fixes
- **v0.2.7** - Empty response fallbacks
- **v0.2.6** - Character context field
- **v0.2.5** - POV control (second/third/first person)
- **v0.2.4** - Status effects & Ancient Voices
- **v0.2.3** - Chat injection
- **v0.2.0** - Tabbed interface, status system
- **v0.1.0** - Initial release

---

*"What is a man but the sum of his memories? We are the stories we tell ourselves."*
