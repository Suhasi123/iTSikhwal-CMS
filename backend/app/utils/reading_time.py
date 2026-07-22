import math
import re


def calculate_reading_time(html_content: str) -> int:
    """
    Calculate estimated reading time in minutes.
    Assumes average reading speed of 200 words/minute.
    """

    text = re.sub(r"<[^>]+>", "", html_content)

    words = len(text.split())

    return max(1, math.ceil(words / 200))