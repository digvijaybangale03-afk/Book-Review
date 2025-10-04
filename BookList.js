import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function BookList(){
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = async (p=1) => {
    const res = await axios.get('/api/books?page='+p);
    setBooks(res.data.books);
    setPage(res.data.page);
    setPages(res.data.pages);
  };

  useEffect(()=>{ load(); }, []);

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map(b=>(
          <li key={b._id}>
            <Link to={'/book/'+b._id}><strong>{b.title}</strong></Link> by {b.author} {b.avgRating ? `- ${b.avgRating}★ (${b.reviewsCount})` : ''}
          </li>
        ))}
      </ul>
      <div>
        Page {page} / {pages}
        {page>1 && <button onClick={()=>load(page-1)}>Prev</button>}
        {page<pages && <button onClick={()=>load(page+1)}>Next</button>}
      </div>
    </div>
  );
}
