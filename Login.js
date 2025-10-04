import React, {useState, useContext} from 'react';
import axios from 'axios';
import AuthContext from '../utils/auth';

export default function Login(){
  const [form,setForm] = useState({email:'',password:''});
  const {login} = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('/api/auth/login', form);
      login(res.data.token, res.data.user);
    }catch(err){
      alert(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
