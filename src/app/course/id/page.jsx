'use client';
import React, { useEffect, useState } from "react";
import styles from "./course.module.scss";


const SUBJECTS = ['Microprocessors', 'Web Technology', 'Wireless Communication', 'Information Thoery and Coding', 'Nueral Networks', 'Computer Networks', 'Data Structures', 'Operating Systems', 'DBMS', 'Software Engineering'];
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


const TimetableModal = ({ onClose, onSave }) => {
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');

  const handleSave = (e) => {
    e.preventDefault();
    if (day && startTime && endTime) {
      onSave({ day, startTime, endTime });
      onClose();
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Create a New Session</h2>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor="day">Day of the Week</label>
            <select id="day" value={day} onChange={(e) => setDay(e.target.value)}>
              {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="startTime">Start Time</label>
            <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endTime">End Time</label>
            <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
          <button type="submit" className={styles.saveButton}>Save Session Details</button>
        </form>
      </div>
    </div>
  );
};



export default function SchedulerPage() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null); 
  const [timetable, setTimetable] = useState([]); 

  
  useEffect(() => {
    setTimetable([]);
    setSessionDetails(null);
  }, [selectedSubject]);

  const handleSaveSessionDetails = (details) => {
    setSessionDetails(details);
    console.log('Saved session details:', details);
  };
  
  const handleDeleteSession = (sessionIdToDelete) => {
    setTimetable(prevTimetable => prevTimetable.filter(session => session.id !== sessionIdToDelete));
  };

  const handleGenerateOne = () => {
    if (!selectedSubject || !sessionDetails) {
      alert('Please select a subject and save session details first!');
      return;
    }
    const newSession = {
      id: Date.now(),
      course: selectedSubject,
      ...sessionDetails,
    };
    setTimetable(prev => [...prev, newSession]);
  };

  const handleGenerateAll = () => {
    if (!selectedSubject || !sessionDetails) {
      alert('Please select a subject and save session details first!');
      return;
    }
    const yearSchedule = [];
    for (let i = 0; i < 52; i++) {
      yearSchedule.push({
        id: Date.now() + i,
        course: selectedSubject,
        ...sessionDetails,
      });
    }
    setTimetable(prev => [...prev, ...yearSchedule]);
  };

  return (
    <div className={styles.pageContainer}>
      {isModalOpen && (
        <TimetableModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSessionDetails}
        />
      )}


      <aside className={styles.sidebar}>
        <h2>Subjects</h2>
        <ul>
          {SUBJECTS.map(subject => (
            <li
              key={subject}
              className={selectedSubject === subject ? styles.active : ''}
              onClick={() => setSelectedSubject(subject)}
            >
              {subject}
            </li>
          ))}
        </ul>
      </aside>


      <main className={styles.mainContent}>
        {!selectedSubject ? (
          <div className={styles.placeholder}>
            <h2>Welcome!</h2>
            <p>Please select a subject from the left to begin.</p>
          </div>
        ) : (
          <div>
           <h1><strong>SUBJECT :</strong> {selectedSubject}</h1>
            <p>Set Timetable to schedule sessions for this subject.</p>
            
            <div className={styles.actions}>
              <button onClick={() => setIsModalOpen(true)}>
                Make Timetable
              </button>
              <button onClick={handleGenerateOne} disabled={!sessionDetails}>
                Generate One Session
              </button>
              <button onClick={handleGenerateAll} disabled={!sessionDetails}>
                 Generate All Sessions (1 Year)
              </button>
            </div>

            {sessionDetails && (
              <div className={styles.infoBox}>
                <strong>Ready to generate:</strong> One session every {sessionDetails.day} from {sessionDetails.startTime} to {sessionDetails.endTime}.
              </div>
            )}

            {timetable.length > 0 && (
              <div className={styles.tableContainer}>
                <h3>Generated Timetable</h3>
                <table className={styles.timetable}>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Day</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map(session => (
                      <tr key={session.id}>
                        <td>{session.course}</td>
                        <td>{session.day}</td>
                        <td>{session.startTime}</td>
                        <td>{session.endTime}</td>
                        <td>
                          <button 
                            className={styles.deleteButton}
                            onClick={() => handleDeleteSession(session.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}






// 'use client';
// import React, { useEffect, useState, useCallback } from "react";
// import styles from "./course.module.scss";

// // This component is unchanged
// const TimetableModal = ({ onClose, onSave }) => { 
//     const [day, setDay] = useState('Monday');
//     const [startTime, setStartTime] = useState('09:00');
//     const [endTime, setEndTime] = useState('10:30');
//     const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//     const handleSave = (e) => {
//       e.preventDefault();
//       if (day && startTime && endTime) {
//         onSave({ day, startTime, endTime });
//         onClose();
//       } else {
//         alert('Please fill out all fields.');
//       }
//     };
  
//     return (
//       <div className={styles.modalOverlay}>
//         <div className={styles.modalContent}>
//           <button className={styles.closeButton} onClick={onClose}>&times;</button>
//           <h2>Create a New Session</h2>
//           <form onSubmit={handleSave}>
//             <div className={styles.formGroup}>
//               <label htmlFor="day">Day of the Week</label>
//               <select id="day" value={day} onChange={(e) => setDay(e.target.value)}>
//                 {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
//               </select>
//             </div>
//             <div className={styles.formGroup}>
//               <label htmlFor="startTime">Start Time</label>
//               <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
//             </div>
//             <div className={styles.formGroup}>
//               <label htmlFor="endTime">End Time</label>
//               <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
//             </div>
//             <button type="submit" className={styles.saveButton}>Save Session Details</button>
//           </form>
//         </div>
//       </div>
//     );
// };


// export default function SchedulerPage() {
//     const [subjects, setSubjects] = useState([]);
//     const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
//     const [error, setError] = useState(null);

//     const [selectedSubject, setSelectedSubject] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [sessionDetails, setSessionDetails] = useState(null);
//     const [timetable, setTimetable] = useState([]);
//     const [isTimetableLoading, setIsTimetableLoading] = useState(false);

//     // Fetch subjects on initial component mount
//     useEffect(() => {
//         const fetchSubjects = async () => {
//             try {
//                 // Replace with your actual API endpoint for subjects
//                 const response = await fetch('/api/subjects');
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 const data = await response.json();
//                 setSubjects(data);
//             } catch (err) {
//                 setError('Failed to fetch subjects. Please try again later.');
//                 console.error(err);
//             } finally {
//                 setIsLoadingSubjects(false);
//             }
//         };

//         fetchSubjects();
//     }, []);

//     // Memoized function to fetch the timetable for the selected subject
//     const fetchTimetable = useCallback(async () => {
//         if (!selectedSubject) return;

//         setIsTimetableLoading(true);
//         try {
//             // Replace with your actual API endpoint for fetching a timetable
//             const response = await fetch(`/api/timetable?subject=${encodeURIComponent(selectedSubject)}`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch timetable');
//             }
//             const data = await response.json();
//             setTimetable(data);
//         } catch (err) {
//             console.error(err);
//             // Optionally set a timetable-specific error state
//         } finally {
//             setIsTimetableLoading(false);
//         }
//     }, [selectedSubject]);


//     // Effect to fetch timetable when subject changes
//     useEffect(() => {
//         setSessionDetails(null); // Reset form details
//         fetchTimetable();
//     }, [selectedSubject, fetchTimetable]);

//     const handleSaveSessionDetails = (details) => {
//         setSessionDetails(details);
//     };
  
//     const handleDeleteSession = async (sessionIdToDelete) => {
//         try {
//             // Replace with your actual API endpoint for deleting a session
//             const response = await fetch(`/api/sessions/${sessionIdToDelete}`, {
//                 method: 'DELETE',
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete session');
//             }
//             // Re-fetch timetable to sync with the database
//             fetchTimetable(); 
//         } catch (err) {
//             alert('Error: Could not delete session.');
//             console.error(err);
//         }
//     };

//     const handleGenerate = async (endpoint, payload) => {
//         try {
//             const response = await fetch(endpoint, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(payload),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to generate session(s)');
//             }
//             // Re-fetch timetable to get the latest data from the server
//             fetchTimetable();
//         } catch (err) {
//             alert('Error: Could not generate session(s).');
//             console.error(err);
//         }
//     };

//     const handleGenerateOne = () => {
//         if (!selectedSubject || !sessionDetails) {
//             alert('Please select a subject and save session details first!');
//             return;
//         }
//         const payload = { course: selectedSubject, ...sessionDetails };
//         // Replace with your actual API endpoint for a single session
//         handleGenerate('/api/sessions/single', payload);
//     };

//     const handleGenerateAll = () => {
//         if (!selectedSubject || !sessionDetails) {
//             alert('Please select a subject and save session details first!');
//             return;
//         }
//         const payload = { course: selectedSubject, ...sessionDetails };
//         // Replace with your actual API endpoint for bulk sessions
//         handleGenerate('/api/sessions/bulk', payload);
//     };

//     return (
//         <div className={styles.pageContainer}>
//             {isModalOpen && (
//                 <TimetableModal
//                     onClose={() => setIsModalOpen(false)}
//                     onSave={handleSaveSessionDetails}
//                 />
//             )}

//             <aside className={styles.sidebar}>
//                 <h2>Subjects</h2>
//                 {isLoadingSubjects ? (
//                     <p>Loading Subjects...</p>
//                 ) : error ? (
//                     <p className={styles.errorText}>{error}</p>
//                 ) : (
//                     <ul>
//                         {subjects.map(subject => (
//                             <li
//                                 key={subject.id || subject.name} // Use a unique key from your backend data
//                                 className={selectedSubject === subject.name ? styles.active : ''}
//                                 onClick={() => setSelectedSubject(subject.name)}
//                             >
//                                 {subject.name}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </aside>

//             <main className={styles.mainContent}>
//                 {!selectedSubject ? (
//                     <div className={styles.placeholder}>
//                         <h2>Welcome! 👋</h2>
//                         <p>Please select a subject from the left to begin.</p>
//                     </div>
//                 ) : (
//                     <div>
//                         <h1><strong>SUBJECT:</strong> {selectedSubject}</h1>
//                         <p>Set Timetable to schedule sessions for this subject.</p>
                        
//                         <div className={styles.actions}>
//                             <button onClick={() => setIsModalOpen(true)}>Make Timetable</button>
//                             <button onClick={handleGenerateOne} disabled={!sessionDetails}>Generate One Session</button>
//                             <button onClick={handleGenerateAll} disabled={!sessionDetails}>Generate All Sessions (1 Year)</button>
//                         </div>

//                         {sessionDetails && (
//                             <div className={styles.infoBox}>
//                                 <strong>Ready to generate:</strong> One session every {sessionDetails.day} from {sessionDetails.startTime} to {sessionDetails.endTime}.
//                             </div>
//                         )}

//                         {isTimetableLoading ? (
//                             <p>Loading Timetable...</p>
//                         ) : timetable.length > 0 && (
//                             <div className={styles.tableContainer}>
//                                 <h3>Generated Timetable</h3>
//                                 <table className={styles.timetable}>
//                                     <thead>
//                                         <tr>
//                                             <th>Subject</th>
//                                             <th>Day</th>
//                                             <th>Start Time</th>
//                                             <th>End Time</th>
//                                             <th>Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {timetable.map(session => (
//                                             <tr key={session.id}>
//                                                 <td>{session.course}</td>
//                                                 <td>{session.day}</td>
//                                                 <td>{session.startTime}</td>
//                                                 <td>{session.endTime}</td>
//                                                 <td>
//                                                     <button 
//                                                         className={styles.deleteButton}
//                                                         onClick={() => handleDeleteSession(session.id)}
//                                                     >
//                                                         Delete
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </main>
//         </div>
//     );
// }