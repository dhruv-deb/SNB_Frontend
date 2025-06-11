'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import style from './signup.module.scss';

const SignupPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [scholarId, setScholarId] = useState('');
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const register = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!username || !email || !scholarId || !branch || !batch || !password || !passwordConfirm) {
      setError('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('The two passwords are not the same!');
      return;
    }

    // Reset form fields and error
    setUsername('');
    setEmail('');
    setScholarId('');
    setBranch('');
    setBatch('');
    setPassword('');
    setPasswordConfirm('');
    setError('');

    setTimeout(() => {
      router.push('/addclass');
    }, 1000);
  };

  return (
    <div className={style.container}>
      <h1>Sign Up</h1>
      <form className={style.smallForm}>
        {error && <div className={style.error}>{error}</div>}

        <label>Username *</label>
        <input
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

        <label>Scholar ID *</label>
        <input
          value={scholarId}
          onChange={(e) => setScholarId(e.target.value)}
          placeholder="e.g. 2214170"
        />

        <div className={style.row}>
          <div className={style.halfInput}>
            <label>Branch *</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className={style.select}
            >
              <option value="">Select branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EIE">EIE</option>
              <option value="EE">EE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </div>

          <div className={style.halfInput}>
            <label htmlFor="batch">Batch *</label>
            <select
              id="batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className={style.select}
            >
              <option value="">Select Batch</option>
              <option value="2022-2026">2022-2026</option>
              <option value="2023-2027">2023-2027</option>
              <option value="2024-2028">2024-2028</option>
              <option value="2025-2029">2025-2029</option>
            </select>
          </div>
        </div>

        <label>Password *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password *</label>
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <button type="submit" onClick={register}>
          Sign up
        </button>
      </form>

      <div className={style.loginMsg}>
        Already have an account? <Link href="/login">Login</Link>
      </div>
    </div>
  );
};

export default SignupPage;
