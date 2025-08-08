'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import defaultImg from '@/assets/default.jpg';
import styles from './profile.module.scss';
import { Button } from '../../components/button/button.jsx';
import { Card } from '../../components/card/card.jsx';
import Timetable from '../../components/timetable/Timetable.jsx'; // <-- 1. IMPORT
import { MdLogout, MdEdit } from 'react-icons/md';
import { auth } from '../utils/firebase.js';

const Profile = () => {
  const { user: authUser, token } = useAuth();
  const [user, setUser] = useState(null);
  const [timetable, setTimetable] = useState([]); // <-- 2. ADD TIMETABLE STATE
  const [timetableLoading, setTimetableLoading] = useState(true); // <-- 2. ADD LOADING STATE
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setHasMounted(true);
    if (authUser?.id && token) {
      fetchUser(authUser.id);
      fetchTimetable(authUser.id); // <-- 3. CALL FETCH TIMETABLE
    }
  }, [authUser, token]);

  const fetchUser = async (id) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`
      );
      setUser(res.data.msg);
      setFormData(res.data.msg);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  // <-- 4. CREATE FETCH TIMETABLE FUNCTION
  const fetchTimetable = async (id) => {
    setTimetableLoading(true);
    try {
      // Assuming the endpoint is /users/:id/timetable
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/timetable`
      );
      setTimetable(res.data.msg);
      console.log('Fetched timetable:', res.data.msg);
    } catch (err) {
      console.error('Failed to fetch timetable:', err);
      setTimetable([]); // Set to empty array on error
    } finally {
      setTimetableLoading(false);
    }
  };


  const openEdit = () => setIsEditing(true);
  const cancelEdit = () => {
    setIsEditing(false);
    setPassword('');
    setMessage('');
    setFormData(user);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const payload = { ...formData };
      if (password.length > 0) {
        if (password.length < 6) {
          setMessage('Password must be at least 6 characters.');
          setSaving(false);
          return;
        }
        payload.newPassword = password;
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
        payload
      );

      setUser(res.data.msg);
      setIsEditing(false);
      setPassword('');
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      setMessage(err?.response?.data?.msg || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!hasMounted || !user) return null; // Or a loading spinner

  return (
    <div className={styles.profileDashboard}>
      <div className={styles.profileHeader}>
        <div className={styles.headerNav}>
          <Link href="/" className={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileLeft}>
          <div className={styles.profilePictureSection}>
            <div className={styles.avatar}>
              <Image
                src={auth.currentUser?.photoURL || defaultImg}
                alt="avatar"
                width={180}
                height={180}
                className={styles.profileAvatar}
              />
            </div>
          </div>

          <div className={styles.actionButtons}>
            <Button click="Logout" Icon={MdLogout} />
          </div>
        </div>

        <div className={styles.profileRight}>
          <div className={styles.userInfoCard}>
            <div className={styles.infoList}>
              <Card title="Scholar ID" studentData={user.RollNo} variant="dark"/>
              <Card title="Name" studentData={user.name} variant="dark" />
              <Card title="Branch" studentData={user.Branch} variant="dark" />
              <Card title="Institute Email" studentData={user.email} variant="dark" />
              <Card title="Role" studentData={user.role} variant="dark" />
            </div>
            <Button click="Edit Profile" Icon={MdEdit} onClick={openEdit} />
          </div>
        </div>
      </div>

      {/* --- 5. RENDER THE TIMETABLE COMPONENT --- */}
      <div className={styles.timetableContainer}>
        {timetableLoading ? (
          <p>Loading timetable...</p>
        ) : (
          <Timetable data={timetable} />
        )}
      </div>
      {/* --- END OF TIMETABLE SECTION --- */}


      {isEditing && (
        <div className={styles.modalOverlay} onClick={cancelEdit}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Edit Profile</h2>
            {message && <p className={styles.message}>{message}</p>}
            {['scholarId', 'name', 'branch', 'email'].map((field) => (
              <div key={field} className={styles.inputGroup}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  className={styles.editInput}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className={styles.inputGroup}>
              <label>New Password (optional)</label>
              <input
                className={styles.editInput}
                type="password"
                name="newPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={saveEdit}
                className={styles.saveBtn}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={cancelEdit} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;