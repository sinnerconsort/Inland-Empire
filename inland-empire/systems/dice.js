/**
 * Inland Empire - Dice System
 * 2d6 skill checks with critical success/failure
 */

import { DIFFICULTIES } from '../data/skills.js';

export function rollD6() {
    return Math.floor(Math.random() * 6) + 1;
}

export function getDifficultyNameForThreshold(threshold) {
    if (threshold <= 6) return 'Trivial';
    if (threshold <= 8) return 'Easy';
    if (threshold <= 10) return 'Medium';
    if (threshold <= 12) return 'Challenging';
    if (threshold <= 14) return 'Heroic';
    if (threshold <= 16) return 'Legendary';
    return 'Impossible';
}

export function rollSkillCheck(skillLevel, difficulty) {
    const die1 = rollD6();
    const die2 = rollD6();
    const diceTotal = die1 + die2;
    const total = diceTotal + skillLevel;

    let threshold, difficultyName;

    if (typeof difficulty === 'string') {
        const diff = DIFFICULTIES[difficulty.toLowerCase()];
        threshold = diff ? diff.threshold : 10;
        difficultyName = diff ? diff.name : 'Medium';
    } else {
        threshold = difficulty;
        difficultyName = getDifficultyNameForThreshold(difficulty);
    }

    // Snake eyes (1,1) always fail, Boxcars (6,6) always succeed
    const isSnakeEyes = die1 === 1 && die2 === 1;
    const isBoxcars = die1 === 6 && die2 === 6;

    let success;
    if (isSnakeEyes) {
        success = false;
    } else if (isBoxcars) {
        success = true;
    } else {
        success = total >= threshold;
    }

    return {
        dice: [die1, die2],
        diceTotal,
        skillLevel,
        total,
        threshold,
        difficultyName,
        success,
        isSnakeEyes,
        isBoxcars
    };
}

/**
 * Determine check difficulty based on skill relevance and context intensity
 */
export function determineCheckDifficulty(selectedSkill, context) {
    const baseThreshold = 10;

    // Higher relevance = easier check
    const relevanceModifier = -Math.floor(selectedSkill.score * 4);

    // Higher intensity = harder check
    const intensityModifier = Math.floor(
        Math.max(context.emotionalIntensity, context.dangerLevel) * 4
    );

    const threshold = Math.max(6, Math.min(18, baseThreshold + relevanceModifier + intensityModifier));

    return {
        shouldCheck: selectedSkill.score <= 0.8 || Math.random() > 0.3,
        difficulty: getDifficultyNameForThreshold(threshold).toLowerCase(),
        threshold
    };
}
