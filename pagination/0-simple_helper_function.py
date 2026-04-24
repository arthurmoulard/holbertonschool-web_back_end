#!/usr/bin/env python3
"""Module providing a helper function for pagination indexing."""


def index_range(page: int, page_size: int) -> tuple[int, int]:
    """Return the start and end indexes corresponding to a pagination range."""
    start = (page - 1) * page_size
    end = page * page_size
    return (start, end)
