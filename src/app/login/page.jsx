'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import style from './login.module.scss';

const LoginPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;

    if (!username || !email || !password) {
      setMessage('All fields are required.');
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    // Simulate login
    localStorage.setItem('userLoggedIn', 'true');

    setTimeout(() => {
      router.push('/addclass');
    }, 500);
  };

  return (
    <div className={style.container}>
      <h1>Login</h1>
      <form className={style.smallForm} onSubmit={handleLogin}>
        {message && <div className={style.message}>{message}</div>}

        <label>Username *</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. Sam"
        />

        <label>Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. samarjitroy025@gmail.com"
        />

        <label>Password *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      <div className={style.signupMsg}>
        Don't have an account? <Link href="/signup">Sign up</Link>
      </div>
    </div>
  );
};

export default LoginPage;
