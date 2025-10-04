import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../utils/auth';

export default function BookDetails(){
  const {id} = useParams();
  const [book, setBook] = useState(null);
  const {user} = useContext(AuthContext);
  const [form, setForm] = useState({rating:5, reviewText:''});

  const load = async ()=> {
    const res = await axios.get('/api/books/'+id);
    setBook(res.data);
  };
  useEffect(()=>{ load(); }, [id]);

  const addReview = async (e) => {
    e.preventDefault();
    try{
      await axios.post('/api/reviews', {bookId: id, ...form});
      setForm({rating:5, reviewText:''});
      load();
    }catch(err){ alert(err.response?.data?.message || 'Error'); }
  };

  return book ? (
    <div>
      <h2>{book.title}</h2>
      <p>By {book.author} - {book.genre} ({book.year})</p>
      <p>{book.description}</p>
      <p>Average: {book.avgRating || 'N/A'}</p>
      <h3>Reviews</h3>
      <ul>
        {book.reviews.map(r=>(
          <li key={r._id}><strong>{r.userId?.name}</strong>: {r.rating}★ - {r.reviewText}</li>
        ))}
      </ul>
      {user && (
        <form onSubmit={addReview}>
          <h4>Add Review</h4>
          <label>Rating:
            <select value={form.rating} onChange={e=>setForm({...form, rating: Number(e.target.value)})}>
              {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <br/>
          <textarea placeholder="Text" value={form.reviewText} onChange={e=>setForm({...form, reviewText: e.target.value})}/>
          <br/>
          <button type="submit">Post Review</button>
        </form>
      )}
      {!user && <p><Link to="/login">Login</Link> to add reviews.</p>}
    </div>
  ) : <div>Loading...</div>;
}
