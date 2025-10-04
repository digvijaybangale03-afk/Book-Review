import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../utils/auth';

export default function AddEditBook(){
  const {id} = useParams();
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [form, setForm] = useState({title:'',author:'',description:'',genre:'',year:''});

  useEffect(()=> {
    if(id){
      axios.get('/api/books/'+id).then(res=>{
        const b = res.data;
        setForm({title:b.title, author:b.author, description:b.description||'', genre:b.genre||'', year:b.year||''});
      }).catch(()=>{});
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try{
      if(id) await axios.put('/api/books/'+id, form);
      else await axios.post('/api/books', form);
      navigate('/');
    }catch(err){ alert(err.response?.data?.message || 'Error'); }
  };

  if(!user) return <p>Please login to add/edit books.</p>;

  return (
    <div>
      <h2>{id ? 'Edit' : 'Add'} Book</h2>
      <form onSubmit={submit}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required/>
        <input placeholder="Author" value={form.author} onChange={e=>setForm({...form, author:e.target.value})} required/>
        <input placeholder="Genre" value={form.genre} onChange={e=>setForm({...form, genre:e.target.value})}/>
        <input placeholder="Year" value={form.year} onChange={e=>setForm({...form, year:e.target.value})}/>
        <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
