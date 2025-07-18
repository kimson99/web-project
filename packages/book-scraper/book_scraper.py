import json
import uuid
import asyncio
import aiohttp
from pathlib import Path

BASE_URL = "http://openlibrary.org"

async def fetch_genre(genre_label, session):
    genre = genre_label.replace(" ", "_").lower()
    
    url = f"{BASE_URL}/search.json?q=subject_key:{genre}+language:eng&fields=key,title,author_key,author_name,number_of_pages_median,cover_edition_key,editions,editions.key,editions.title,editions.subtitle,editions.cover_i,editions.isbn,description&sort=rating desc&limit=10&offset=0"
    
    async with session.get(url) as response:
        if not response.ok:
            print(f"Error: {response.status}")
            raise Exception("Failed to fetch")
        
        result = await response.json()
        docs = result.get('docs', [])
        print(f"Numbers of record: {len(docs)}")
        
        books = []
        for work in docs:
            editions = work.get('editions', {}).get('docs', [])
            first_edition = editions[0] if editions else {}
            
            isbn_list = first_edition.get('isbn', [])
            isbn10 = isbn_list[1] if len(isbn_list) > 1 else ""
            isbn13 = isbn_list[0] if len(isbn_list) > 0 else ""
            
            new_book = {
                'id': str(uuid.uuid4()),
                'key': work.get('key', ''),
                'title': work.get('title', ''),
                'isbn10': isbn10,
                'isbn13': isbn13,
                'description': first_edition.get('description', ''),
                'author_key': work.get('author_key', []),
                'author_name': work.get('author_name', []),
                'number_of_pages': work.get('number_of_pages_median', 0),
                'first_publish_year': work.get('first_publish_year', ''),
                'cover_edition_key': work.get('cover_edition_key', ''),
            }
            books.append(new_book)
        
        data_dir = Path(__file__).parent / "data/book-by-genre"
        data_dir.mkdir(exist_ok=True)
        
        output_file = data_dir / f"{genre_label}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(books, f, indent=2, ensure_ascii=False)
        
        print(f"Saved {len(books)} books to {output_file}")

async def main():
    with open('./data/genres.json', 'r') as f:
        genres_data = json.load(f)
    
    genres = [genre['name'] for genre in genres_data]

    async with aiohttp.ClientSession() as session:
        await fetch_genre("Adventure", session)
      
        # for genre in genres:
        #     await fetch_genre(genre, session)
        #     await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main()) 