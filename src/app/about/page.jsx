// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
'use client';
import { FaUserCircle } from 'react-icons/fa';
import style from './about.module.scss';
import { useRouter } from 'next/navigation';
import aboutImg from '../../assets/about.png';

const About = () => {
  const router = useRouter();
  
    const handleNavigate = (path) => {
      router.push(path);
    };
  
  {/* Top Navigation Bar with Profile Icon */ }

  return (
    <div className={style.container}>
      <div className={style.topNav}>
        <div className={style.logoSpace}></div> {/* for spacing or logo if needed */}
        <div className={style.profileIcon} onClick={() => handleNavigate('/profile')}>
          <FaUserCircle size={30} />
        </div>
      </div>
      <h1 className={style.title}>About Us</h1>
      <img src={aboutImg} alt="About" className={style.aboutImage} />

      <p className={style.paragraph}>
        <strong>Class Compass</strong> is a centralized classroom scheduling
        assistant designed to simplify and streamline scheduling tasks. Tailored
        for both students and faculty, it enables users to view real-time class
        schedules, updates, and cancellations. With its intuitive interface,
        Class Compass ensures seamless coordination, improved communication, and
        a more organized academic experience for everyone involved.
      </p>

      <p className={style.paragraph}>
        <strong>Benefits for Students:</strong> Class Compass helps students
        stay on top of their academic schedules by providing real-time updates
        on class timings, locations, and cancellations. Say goodbye to confusion
        or last-minute surprises—manage your day reliably and avoid missing
        important sessions or changes announced by professors.
      </p>

      <p className={style.paragraph}>
        <strong>Benefits for Professors/Faculty:</strong> Faculty members can
        effortlessly update class statuses, timings, and notifications, keeping
        students informed with minimal effort. Whether rescheduling a lecture or
        canceling a session, Class Compass streamlines communication, saves
        time, and ensures everyone is on the same page—making classroom
        management more efficient and transparent.
      </p>
    </div>
  );
};

export default About;
