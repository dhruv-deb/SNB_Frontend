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
import { MdLogout, MdEdit, MdDelete, MdLock } from 'react-icons/md';

const Profile = () => {
  const { user: authUser, token } = useAuth();
  const [user, setUser] = useState(null);
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
    }
  }, [authUser, token]);

  const fetchUser = async (id) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.msg);
      setFormData(res.data.msg);
    } catch (err) {
      console.error('Failed to fetch user:', err);
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

      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  if (!hasMounted || !user) return null;

  return (
    <div className={styles.profileDashboard}>
      <div className={styles.profileHeader}>
        <div className={styles.headerNav}>
          <Link href="/" className={styles.backLink}>← Back to Home</Link>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileLeft}>
          <div className={styles.profilePictureSection}>
            <div className={styles.avatar}>
              <Image
                src={defaultImg}
                alt="avatar"
                width={180}
                height={180}
                className={styles.profileAvatar}
              />
            </div>
            <Button click="Edit" Icon={MdEdit} />
          </div>

          <div className={styles.actionButtons}>
            <Button click="Change Password" Icon={MdLock} onClick={openEdit} />
            <Button click="Delete Account" variant="delete" Icon={MdDelete} />
            <Button click="Logout" Icon={MdLogout} />
          </div>
        </div>

        <div className={styles.profileRight}>
          <div className={styles.userInfoCard}>
            <div className={styles.infoList}>
              <Card title="Scholar ID" studentData={user.scholarId} variant="dark" />
              <Card title="Name" studentData={user.name} variant="dark" />
              <Card title="Branch" studentData={user.branch} variant="dark" />
              <Card title="Institute Email" studentData={user.email} variant="dark" />
            </div>
            <Button click="Edit Profile" Icon={MdEdit} onClick={openEdit} />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className={styles.modalOverlay} onClick={cancelEdit}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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
              <button onClick={saveEdit} className={styles.saveBtn} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={cancelEdit} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
