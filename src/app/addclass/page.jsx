'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClassContext } from '../ClassContext';
import style from './addclass.module.scss';

const ClassForm = () => {
    const [subject, setSubject] = useState('');
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');

    const { addClass } = useClassContext();
    const router = useRouter();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!subject || !day || !startTime || !endTime || !location) {
            alert('Please fill all required fields');
            return;
        }

        if (startTime >= endTime) {
            alert('End time must be after start time');
            return;
        }

        addClass({ subject, day, startTime, endTime, location, notes });
        // router.push('/schedule');
        router.push(`/discussion/${subject}`);

    };

    return (
        <div className={style.container}>
            <h1 className={style.h1}>Add Class</h1>
            <form onSubmit={handleSubmit}>
                <div className={style.row}>
                    <div className={style.column}>
                        <label className={style.label} htmlFor="subject">Subject Code</label>
                        <input
                            className={style.input}
                            type="text"
                            id="subject"
                            placeholder="e.g. EC 310"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div className={style.column}>
                        <label className={style.label} htmlFor="day">Day</label>
                        <select
                            id="day"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className={style.select}
                        >
                            <option value="">Select day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                        </select>
                    </div>
                </div>

                <div className={style.row}>
                    <div className={style.column}>
                        <label className={style.label} htmlFor="startTime">Start Time</label>
                        <select
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        >
                            <option value="">Select start time</option>
                            {Array.from({ length: 10 }, (_, i) => {
                                const hour = 8 + i;
                                const label = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                                const value = `${hour.toString().padStart(2, '0')}:00`;
                                return <option key={value} value={value}>{label}</option>;
                            })}
                        </select>
                    </div>

                    <div className={style.column}>
                        <label className={style.label} htmlFor="endTime">End Time</label>
                        <select
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        >
                            <option value="">Select end time</option>
                            {Array.from({ length: 10 }, (_, i) => {
                                const hour = 9 + i;
                                const label = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
                                const value = `${hour.toString().padStart(2, '0')}:00`;
                                return <option key={value} value={value}>{label}</option>;
                            })}
                        </select>
                        {startTime && endTime && startTime >= endTime && (
                            <p style={{ color: 'red', fontSize: '1.5rem', marginTop: '2px', marginBottom: '-11px' }}>
                                End time must be after start time.
                            </p>
                        )}
                    </div>
                </div>

                <label className={style.label} htmlFor="location">Venue</label>
                <input
                    className={style.input}
                    type="text"
                    id="location"
                    placeholder="e.g. G-307"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <label className={style.label} htmlFor="notes">Note</label>
                <textarea
                className={style.textarea}
                    id="notes"
                    placeholder="Any important details"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <div className={style.actions}>
                    <button type="button" className={style.cancel} onClick={() => router.push('/schedule')}>
                        Cancel
                    </button>
                    <button type="submit" className={style.submit}>Add Class</button>
                </div>
            </form>
        </div>
    );
};

export default ClassForm;
