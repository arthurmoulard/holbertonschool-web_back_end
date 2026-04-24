#!/usr/bin/env python3
"""Module to insert a document into a collection"""


def insert_school(mongo_collection, **kwargs):
    """Insert a new document and return its _id"""
    doc = mongo_collection.insert_one(kwargs)
    return doc.inserted_id