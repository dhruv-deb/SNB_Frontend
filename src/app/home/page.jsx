'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import style from './home.module.scss';
import Image from 'next/image';
import landingImg from '../assets/landing.png';

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userStatus = localStorage.getItem('userLoggedIn');
    setIsLoggedIn(userStatus === 'true');
  }, []);

  const handleNavigate = (path) => {
    setLoading(true);
    setTimeout(() => {
      router.push(path);
    }, 300);
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push('/addclass');
    } else {
      alert('Please log in first!');
    }
  };

  return (
    <div className={style.container}>
      <Image src={landingImg} alt="Landing" className={style.landingImage} />
      <h1 className={style.title}>Welcome to Class Compass</h1>
      <div className={style.buttonGroup}>
        <button
          className={style.primaryButton}
          onClick={handleGetStarted}
          disabled={loading}
        >
          Get Started
        </button>
        <button
          className={style.secondaryButton}
          onClick={() => handleNavigate('/login')}
          disabled={loading}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;
