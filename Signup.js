import React, {useState, useContext} from 'react';
import axios from 'axios';
import AuthContext from '../utils/auth';

export default function Signup(){
  const [form,setForm] = useState({name:'',email:'',password:''});
  const {login} = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    try{
      await axios.post('/api/auth/signup', form);
      // auto-login
      const res = await axios.post('/api/auth/login', {email: form.email, password: form.password});
      login(res.data.token, res.data.user);
    }catch(err){
      alert(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
