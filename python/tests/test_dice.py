"""Basic tests for the dice engine."""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from dice import roll_2d6, roll_d6, roll_exploding, roll_advantage, roll_disadvantage, characteristic_modifier


def test_roll_d6_range():
    for _ in range(100):
        assert 1 <= roll_d6() <= 6


def test_roll_2d6_range():
    for _ in range(100):
        assert 2 <= roll_2d6() <= 12


def test_roll_exploding_at_least_2():
    for _ in range(100):
        assert roll_exploding() >= 2


def test_advantage_average_higher():
    std = sum(roll_2d6() for _ in range(1000))
    adv = sum(roll_advantage() for _ in range(1000))
    assert adv > std


def test_disadvantage_average_lower():
    std = sum(roll_2d6() for _ in range(1000))
    dis = sum(roll_disadvantage() for _ in range(1000))
    assert dis < std


def test_characteristic_modifier():
    assert characteristic_modifier(2) == -2
    assert characteristic_modifier(7) == 0
    assert characteristic_modifier(12) == 2
