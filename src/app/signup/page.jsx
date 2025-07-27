'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';
import style from './signup.module.scss';

const SignupPage = () => {
  const router = useRouter();
  const { setUser, setToken } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [scholarId, setScholarId] = useState('');
  const [branch, setBranch] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const register = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !username ||
      !email ||
      !scholarId ||
      !branch ||
      !password ||
      !passwordConfirm ||
      !role
    ) {
      setError('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@([a-z]+\.)?nits\.ac\.in$/i;
    if (!emailRegex.test(email)) {
      setError(
        'Please use your official college email ending in @nits.ac.in or @<dept>.nits.ac.in'
      );
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

    try {
      const firebaseUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = firebaseUser.user.uid;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signUp`,
        {
          firebaseId: idToken,
          name: username,
          email,
          username,
          role: role, // default role
          RollNo: scholarId,
          Branch: branch,
        }
      );
      const newUser = res.data.msg.user;
      setUser(newUser);
      setToken(idToken);

      // Reset fields
      setUsername('');
      setEmail('');
      setScholarId('');
      setBranch('');
      setPassword('');
      setPasswordConfirm('');
      setError('');
      setRole('');

      setTimeout(() => {
        //   router.push("/");
        // }, 1000);
        if (newUser.role === 'Professor') {
          router.push('/course'); // Redirect professors to the courses page
        } else {
          router.push('/'); // Redirect students to the homepage
        }
      }, 1000);
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Something went wrong';
      setError(msg);
    }
  };

  return (
    <div className={style.centerWrapper}>
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
          </div>

          <div className={style.row}>
            <div className={style.halfInput}>
              <label>Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={style.select}
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Professor">Professor</option>
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

          <button
            type="submit"
            onClick={register}
            style={{ marginTop: '2rem' }}
          >
            Sign up
          </button>
        </form>

        <div className={style.loginMsg}>
          Already have an account? <Link href="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
