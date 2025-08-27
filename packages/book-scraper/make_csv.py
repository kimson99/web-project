import json
import csv
import re
from pathlib import Path

# Create csv directory if it doesn't exist
csv_dir = Path('./data/csv')
csv_dir.mkdir(parents=True, exist_ok=True)

def sanitize_text(s: str, mode: str = "escape") -> str:
    if s is None:
        return ""
    # Normalize to str
    if not isinstance(s, str):
        s = str(s)

    # First, normalize Windows CRLF to a single marker
    # (this avoids producing "\\r\\n" when escaping both separately)
    s = s.replace("\r\n", "\n").replace("\r", "\n")

    if mode == "escape":
        # Turn line breaks into visible \n
        s = s.replace("\n", r"\n")
    elif mode == "space":
        # Flatten by turning any line break into a space
        s = s.replace("\n", " ")
    elif mode == "keep":
        # Keep real newlines (works for Excel/pandas readers, but breaks line tools)
        return s
    else:
        raise ValueError("mode must be 'escape', 'space', or 'keep'")

    # Optionally scrub other ASCII control chars (except tab if you need it)
    s = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F]", " ", s)
    return s

def make_book_csv():
    with open('./data/all.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    headers = ["id", "title", "description", "num_pages", "published_year", "ol_cover_key"]
    
    with open('./data/csv/books.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL, escapechar='\\')
        writer.writerow(headers)
        
        for record in data:
            writer.writerow([
                record['id'],
                record['title'][0:255],
                sanitize_text(record['description'])[0:5000],
                record.get('number_of_pages', 0),
                record.get('first_publish_year', "0"),
                record.get('cover_edition_key')
            ])

def make_book_genre_csv():
    with open('./data/book-genre.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    headers = ["book_id", "genre_id"]
    
    with open('./data/csv/book-genre.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL, escapechar='\\')
        writer.writerow(headers)
        
        for record in data:
            writer.writerow([record['book_id'], record['genre_id']])

def make_author_csv():
    with open('./data/authors.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    headers = ["id", "external_id", "name"]
    
    with open('./data/csv/authors.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL, escapechar='\\')
        writer.writerow(headers)
        
        for record in data:
            writer.writerow([record['id'], record['external_id'], record['name']])

def make_author_book_csv():
    with open('./data/author-book.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    headers = ["book_id", "author_id"]
    
    with open('./data/csv/author-book.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL, escapechar='\\')
        writer.writerow(headers)
        
        for record in data:
            writer.writerow([record['book_id'], record['author_id']])

def make_genre_csv():
    with open('./data/genres.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    headers = ["id", "name"]
    
    with open('./data/csv/genre.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL, escapechar='\\')
        writer.writerow(headers)
        
        for record in data:
            writer.writerow([record['id'], record['name']])

if __name__ == "__main__":
    make_book_csv()
    make_book_genre_csv()
    make_author_csv()
    make_author_book_csv()
    make_genre_csv()
    print("All CSV files created successfully!") 