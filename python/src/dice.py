"""Dice engine for Cepheus Engine / Mneme variant.

Supports:
- Standard 2d6
- Exploding dice (roll again on 6)
- Advantage / Disadvantage (roll extra dice, keep best/worst 2)
- Characteristic modifiers
"""

import random
from typing import List


def roll_d6() -> int:
    """Roll a single six-sided die."""
    return random.randint(1, 6)


def roll_2d6() -> int:
    """Roll 2d6."""
    return roll_d6() + roll_d6()


def roll_exploding() -> int:
    """Roll 2d6 with exploding sixes."""
    total = 0
    for _ in range(2):
        die = roll_d6()
        total += die
        while die == 6:
            die = roll_d6()
            total += die
    return total


def roll_advantage(level: int = 1) -> int:
    """Roll (2+level)d6, keep the two highest."""
    dice = sorted([roll_d6() for _ in range(2 + level)], reverse=True)
    return dice[0] + dice[1]


def roll_disadvantage(level: int = 1) -> int:
    """Roll (2+level)d6, keep the two lowest."""
    dice = sorted([roll_d6() for _ in range(2 + level)])
    return dice[0] + dice[1]


def characteristic_modifier(score: int) -> int:
    """Calculate CE characteristic modifier: (score / 3, round down) - 2."""
    return (score // 3) - 2


def roll_ability() -> int:
    """Roll 2d6 for a characteristic score."""
    return roll_2d6()


def roll_abilities() -> dict:
    """Roll all six abilities in order: STR, DEX, END, INT, EDU, SOC."""
    return {
        "str": roll_ability(),
        "dex": roll_ability(),
        "end": roll_ability(),
        "int": roll_ability(),
        "edu": roll_ability(),
        "soc": roll_exploding(),
    }


def roll_supernatural() -> int:
    """Roll supernatural ability: 2d6 - 17, exploding on 6s."""
    total = 0
    for _ in range(2):
        die = roll_d6()
        total += die
        while die == 6:
            die = roll_d6()
            total += die
    return total - 17


def roll_vs_target(target: int, dm: int = 0) -> tuple:
    """Roll 2d6 + DM vs target. Returns (roll, total, success, effect)."""
    roll = roll_2d6()
    total = roll + dm
    success = total >= target
    effect = total - target
    return roll, total, success, effect
