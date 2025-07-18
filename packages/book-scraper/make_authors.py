import json
import uuid
from pathlib import Path

def make_author_list():
    print("Making authors list...")
    authors = []
    author_book = []
    author_map = {}
    
    with open('./data/all.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for record in data:
        author_keys = record.get('author_key', [])
        author_names = record.get('author_name', [])
        
        for i in range(len(author_keys)):
            key = author_keys[i]
            if key is not None and key not in author_map:
                author_id = str(uuid.uuid4())
                author_map[key] = {
                    'id': author_id,
                    'name': author_names[i] if i < len(author_names) else ''
                }
                author_book.append({
                    'author_id': author_id,
                    'book_id': record['id']
                })
            else:
                if key in author_map:
                    val = author_map[key]
                    author_book.append({
                        'author_id': val['id'],
                        'book_id': record['id']
                    })
    
    # Convert author_map to result list
    for key, val in author_map.items():
        authors.append({
            'id': val['id'],
            'external_id': key,
            'name': val['name']
        })
    
    with open('./data/authors.json', 'w', encoding='utf-8') as f:
        json.dump(authors, f, indent=2, ensure_ascii=False)
    
    with open('./data/author-book.json', 'w', encoding='utf-8') as f:
        json.dump(author_book, f, indent=2, ensure_ascii=False)
    
    print("Authors list created, number of records:", len(authors))

if __name__ == "__main__":
    make_author_list() 