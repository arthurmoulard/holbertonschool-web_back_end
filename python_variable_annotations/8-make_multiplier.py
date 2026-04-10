#!/usr/bin/env python3
"""Write a type-annotated function make_multiplier that takes a float
multiplier as argument and returns a function that multiplies
a float by multiplier."""
from typing import Callable


def make_multiplier(multiplier: float) -> Callable[[float], float]:
    """Return a tuple with k and the square of v"""
    def multiply_float(n: float):
        return n * multiplier

    return multiply_float