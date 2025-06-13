import React, { useState } from 'react';
import API from '../utils/api';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post('/auth/register', form);
    saveToken(res.data.token);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Register</h2>
      <input className="input" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input className="input" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="btn">Register</button>
    </form>
  );
}
