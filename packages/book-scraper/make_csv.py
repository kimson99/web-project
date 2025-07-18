import json
import csv
from pathlib import Path

# Create csv directory if it doesn't exist
csv_dir = Path('./data/csv')
csv_dir.mkdir(parents=True, exist_ok=True)

def make_book_csv():
    with open('./data/all.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    headers = ["id", "title", "description", "num_pages", "published_year"]
    
    with open('./data/csv/books.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL, escapechar='\\')
        writer.writerow(headers)
        
        for record in data:
            writer.writerow([
                record['id'],
                record['title'],
                record['description'],
                record.get('number_of_pages', 0),
                0
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