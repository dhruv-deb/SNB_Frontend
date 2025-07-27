
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/app/utils/apiClient';
import styles from './courses.module.scss';



const AddCourseModal = ({ onClose, onSave, professorId }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !code) {
      alert('Course Name and Code are required.');
      return;
    }
    try {
      const courseData = {
        name,
        code,
        description,
        professorId,
        credits: credits ? parseInt(credits, 10) : null,
        semester: semester ? parseInt(semester, 10) : null,
        year: year ? parseInt(year, 10) : null,
      };
      await onSave(courseData);
      onClose();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Create a New Course</h2>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Course Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="code">Course Code</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="credits">Credits</label>
              <input
                id="credits"
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="semester">Semester</label>
              <input
                id="semester"
                type="number"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="year">Year</label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className={styles.saveButton}>
            Save Course
          </button>
        </form>
      </div>
    </div>
  );
};

const TimetableModal = ({ onClose, onSave }) => {
  const DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');

  const handleSave = (e) => {
    e.preventDefault();
    if (day && startTime && endTime) {
      onSave({ dayOfWeek: day, startTime, endTime });
      onClose();
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Create a New Timetable Slot</h2>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor="day">Day of the Week</label>
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.saveButton}>
            Save Session Details
          </button>
        </form>
      </div>
    </div>
  );
};



const ProfessorLayout = ({ user }) => {
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const router = useRouter();

  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [timetable, setTimetable] = useState([]);

  const fetchMyCourses = useCallback(
    async (selectCourseId = null) => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/courses');
        const allCourses = response.data.msg || []; 
        const professorCourses = allCourses.filter(
          (c) => c.professorId === user.id
        );
        setMyCourses(professorCourses);

        if (selectCourseId) {
          const updatedCourse = professorCourses.find(
            (c) => c.id === selectCourseId
          );
          setSelectedCourse(updatedCourse);
        }
      } catch (error) {
        console.error("Error loading professor's courses:", error);
        alert(error.response?.data?.message || 'Could not load your courses.');
      } finally {
        setIsLoading(false);
      }
    },
    [user.id]
  );

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  useEffect(() => {
    if (selectedCourse) {
      setTimetable(selectedCourse.timetable || []);
    }
  }, [selectedCourse]);

  const handleAddCourse = async (courseData) => {
    await apiClient.post('/courses', courseData);
    fetchMyCourses();
  };

  const handleDeleteCourse = async (courseId) => {
    if (
      window.confirm('Are you sure you want to permanently delete this course?')
    ) {
      try {
        await apiClient.delete(`/courses/${courseId}`);
        if (selectedCourse?.id === courseId) setSelectedCourse(null);
        fetchMyCourses();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  const handleSaveTimetable = async (timetableData) => {
    if (!selectedCourse) return;
    try {
      await apiClient.post('/timetables', {
        ...timetableData,
        courseId: selectedCourse.id,
      });
      fetchMyCourses(selectedCourse.id);
    } catch (error) {
      alert(
        `Error saving timetable: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleDeleteTimetable = async (timetableId) => {
    if (!selectedCourse) return;
    try {
      await apiClient.delete(`/timetables/${timetableId}`);
      fetchMyCourses(selectedCourse.id);
    } catch (error) {
      alert(
        `Error deleting timetable: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleGenerateOneSession = () => {
    alert('Generating one session... (implement logic)');
  };
  const handleGenerateAllSessions = () => {
    alert('Generating all sessions for a year... (implement logic)');
  };

  return (
    <div className={styles.pageContainer}>
      {isAddCourseModalOpen && (
        <AddCourseModal
          onClose={() => setIsAddCourseModalOpen(false)}
          onSave={handleAddCourse}
          professorId={user.id}
        />
      )}
      {isTimetableModalOpen && (
        <TimetableModal
          onClose={() => setIsTimetableModalOpen(false)}
          onSave={handleSaveTimetable}
        />
      )}

      <aside className={styles.sidebar}>
        <h2>My Courses</h2>
        <button
          className={styles.addCourseButton}
          onClick={() => setIsAddCourseModalOpen(true)}
        >
          + Add New Course
        </button>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {myCourses.map((course) => (
              <li
                key={course.id}
                className={
                  selectedCourse?.id === course.id ? styles.active : ''
                }
                onClick={() => setSelectedCourse(course)}
              >
                {course.name}
              </li>
            ))}
          </ul>
        )}
      </aside>
      <main className={styles.mainContent}>
        {!selectedCourse ? (
          <div className={styles.placeholder}>
            <h2>Professor Dashboard</h2>
            <p>
              Select a course from the left to see its details or add a new one.
            </p>
          </div>
        ) : (
          <div>
            <h1>
              <strong>COURSE:</strong> {selectedCourse.name}
            </h1>
            <div className={styles.courseDetailsGrid}>
              <p>
                <strong>Description:</strong>{' '}
                {selectedCourse.description || 'No description available.'}
              </p>
              <p>
                <strong>Course Code:</strong> {selectedCourse.code || 'N/A'}
              </p>
              <p>
                <strong>Credits:</strong> {selectedCourse.credits ?? 'N/A'}
              </p>
              <p>
                <strong>Semester:</strong> {selectedCourse.semester ?? 'N/A'}
              </p>
              <p>
                <strong>Year:</strong> {selectedCourse.year ?? 'N/A'}
              </p>
            </div>
            <div className={styles.actions}>
              <button
                onClick={() => router.push(`/course/${selectedCourse.id}`)}
              >
                View Full Dashboard
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteCourse(selectedCourse.id)}
              >
                Delete Course
              </button>
            </div>

            <hr className={styles.divider} />

            <h2>Timetable & Sessions</h2>
            <p>Set a recurring weekly schedule for this course.</p>
            <div className={styles.actions}>
              <button className={styles.timetable} onClick={() => setIsTimetableModalOpen(true)}>
                Add to Timetable
              </button>
              <div className={styles.generate}>
                <button className={styles.generateOne} onClick={handleGenerateOneSession}>
                    Generate One Session
                </button>
                <button className={styles.generateAll} onClick={handleGenerateAllSessions}>
                    Generate All Sessions
                </button>
              </div>
            </div>

            {timetable.length > 0 && (
              <div className={styles.tableContainer}>
                <h3>Scheduled Timetable</h3>
                <table className={styles.timetable}>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map((slot) => (
                      <tr key={slot.id}>
                        <td>{slot.dayOfWeek}</td>
                        <td>{slot.startTime}</td>
                        <td>{slot.endTime}</td>
                        <td>
                          <button
                            className={styles.deleteButtonSmall}
                            onClick={() => handleDeleteTimetable(slot.id)}
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
};

const StudentLayout = ({ user }) => {
  const [view, setView] = useState('available');
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(
    () => new Set((user.courses || []).map((e) => e.courseId))
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchAllCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/courses');
      setAllCourses(response.data.msg || []); 
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert(error.response?.data?.message || 'Could not load courses.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  const handleEnroll = async (courseId) => {
    try {
      await apiClient.post('/enrollments', { courseId, userId: user.id });
      setEnrolledIds((prev) => new Set(prev).add(courseId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll');
    }
  };

  const availableCourses = allCourses.filter((c) => !enrolledIds.has(c.id));
  const enrolledCourses = allCourses.filter((c) => enrolledIds.has(c.id));
  const coursesToDisplay =
    view === 'available' ? availableCourses : enrolledCourses;

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.sidebar}>
        <h2>Navigation</h2>
        <ul>
          <li
            className={view === 'available' ? styles.active : ''}
            onClick={() => setView('available')}
          >
            Available Courses
          </li>
          <li
            className={view === 'enrolled' ? styles.active : ''}
            onClick={() => setView('enrolled')}
          >
            My Courses
          </li>
        </ul>
      </aside>
      <main className={styles.mainContent}>
        <h1>
          {view === 'available' ? 'Available Courses' : 'My Enrolled Courses'}
        </h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.courseList}>
            {coursesToDisplay.length > 0 ? (
              coursesToDisplay.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.courseInfo}>
                    <h3>{course.name}</h3>
                    <p>
                      {course.code} - Taught by{' '}
                      {course.professor?.name || 'N/A'}
                    </p>
                  </div>
                  <div className={styles.courseActions}>
                    {view === 'available' ? (
                      <button
                        className={styles.buttonSuccess}
                        onClick={() => handleEnroll(course.id)}
                      >
                        Enroll
                      </button>
                    ) : (
                      <button
                        className={styles.buttonDark}
                        onClick={() => router.push(`/discussion/${course.id}`)}
                      >
                        Discussion
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.placeholder}>
                No courses to display in this section.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};


export default function CoursesPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  if (!token) {
    return <div className={styles.pageLoader}>Loading Dashboard...</div>;
  }

  if (!user) {
    router.push('/login');
    return <div className={styles.pageLoader}>Redirecting to login...</div>;
  }

  return user.role === 'Professor' ? (
    <ProfessorLayout user={user} />
  ) : (
    <StudentLayout user={user} />
  );
}
