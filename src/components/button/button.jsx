"use client"
import styles from './button.module.scss';
import { useState, useRef, useEffect } from 'react';

const Button = ({ click, variant = 'default', Icon, onClick }) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]}`}
            onClick={onClick}
        >
            {Icon && <Icon size={20} style={{ marginRight: '8px' }} />}
            {click}
        </button>
    );
};


const DropdownButton = ({
  options = [],
  onSelect,
  label = 'Dropdown',
  variant = 'default',
  Icon,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(label);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setOpen(false);
    setSelectedLabel(option.label || option);
    if (onSelect) onSelect(option);
  };

  return (
    <div ref={ref} className={styles.dropdownWrapper}>
      <button
        className={`${styles.button} ${styles[variant]}`}
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        {Icon && <Icon size={20} className={styles.icon} />}
        {selectedLabel}
        <span className={styles.arrow}>▼</span>
      </button>

      {open && (
        <ul className={styles.dropdownList}>
          {options.map((option, idx) => (
            <li
              key={idx}
              className={styles.dropdownItem}
              onClick={() => handleOptionClick(option)}
            >
              {option.label || option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export {Button,DropdownButton};




