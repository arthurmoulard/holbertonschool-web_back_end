#!/usr/bin/env python3

import csv
import math
from typing import List, Dict


class Server:

    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:

        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:

        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:

        indexed = self.indexed_dataset()
        assert index is not None and 0 <= index < len(indexed)

        data = []
        current_index = index

        while len(data) < page_size and current_index <= max(indexed.keys()):
            if current_index in indexed:
                data.append(indexed[current_index])
            current_index += 1

        return {
            "index": index,
            "data": data,
            "page_size": page_size,
            "next_index": current_index,
        }
