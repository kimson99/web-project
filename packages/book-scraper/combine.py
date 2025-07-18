import json
from pathlib import Path

def combine():
    result = []
    book_genre = []
    
    with open('./data/genres.json', 'r', encoding='utf-8') as f:
        genre_data = json.load(f)
    
    genre_map = {}
    for record in genre_data:
        genre_map[record['name']] = record['id']
    
    for genre in genre_map.keys():
        try:
            with open(f'./data/book-by-genre/{genre}.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            for record in data:
                result.append(record)
                book_genre.append({
                    'book_id': record['id'],
                    'genre_id': genre_map[genre]
            })
        except FileNotFoundError:
            print(f"File not found for genre: {genre}")
  
    with open('./data/all.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    with open('./data/book-genre.json', 'w', encoding='utf-8') as f:
        json.dump(book_genre, f, indent=2, ensure_ascii=False)
    
    print(f"Combined {len(result)} books")
    print(f"Created {len(book_genre)} book-genre relationships")

if __name__ == "__main__":
    combine() 