"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const ClassContext = createContext(undefined);

export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) throw new Error('useClassContext must be used within ClassProvider');
  return context;
};

export const ClassProvider = ({ children }) => {
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('classList');
    if (stored) {
      setClassList(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('classList', JSON.stringify(classList));
  }, [classList]);

  const addClass = (cls) => {
    setClassList((prev) => [...prev, cls]);
  };

  const removeClass = (cls) => {
    setClassList((prev) =>
      prev.filter(
        (c) =>
          !(
            c.subject === cls.subject &&
            c.day === cls.day &&
            c.startTime === cls.startTime &&
            c.endTime === cls.endTime
          )
      )
    );
  };

  return (
    <ClassContext.Provider value={{ classList, addClass, removeClass }}>
      {children}
    </ClassContext.Provider>
  );
};
