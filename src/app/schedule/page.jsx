'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import { useClassContext } from '../ClassContext';
import style from './schedule.module.scss';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Dashboard = () => {
  const router = useRouter();
  const { classList, removeClass } = useClassContext();
  const [selectedDay, setSelectedDay] = useState('Monday');

  const classesForDay = classList.filter((cls) => cls.day === selectedDay);

  return (
    <div className={style.dashboard}>
      <h1 className={style.title}>Weekly Schedule</h1>
      <p className={style.subtitle}>View your classes for the entire week</p>

      {/* Tabs */}
      <div className={style.tabs}>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={selectedDay === day ? `${style.active}` : ''}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Class List */}
      <div className={style.classList}>
        {classesForDay.length === 0 ? (
          <p className={style.noClasses}>
            No classes scheduled for {selectedDay}. Enjoy your day!
          </p>
        ) : (
          classesForDay.map((cls, idx) => (
            <div key={idx} className={style.classCard}>
              <div className={style.classInfo}>
                <p>Class Code : {cls.subject}</p>
                <p>
                  Timing : {cls.startTime} - {cls.endTime}
                </p>
                <p>Venue : {cls.location}</p>
                <p>Note : {cls.notes}</p>
              </div>
              <button
                onClick={() => router.push(`/class/${cls.subject}`)}
                className={style.viewBtn}
              >
                View class
              </button>
              <button
                onClick={() => removeClass(cls)}
                className={style.deleteBtn}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => router.push('/addclass')}
        className={style.addButton}
      >
        Add New Class
      </button>
    </div>
  );
};

export default Dashboard;
