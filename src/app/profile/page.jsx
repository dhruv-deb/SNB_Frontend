

'use client';
import { useState,useEffect  } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import defaultImg from '@/assets/default.jpg';
import styles from './profile.module.scss';
import {Button} from '../../components/button/button.jsx';
import { Card } from '../../components/card/card.jsx';
import { MdLogout, MdEdit, MdDelete, MdLock } from 'react-icons/md';

const Profile = () => {
  const [hasMounted, setHasMounted] = useState(false);
  


  const [user, setUser] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    scholarId: "SCH2022001",
    branch: "Computer Science Engineering",
    batch: "2022-2026",
    avatar: defaultImg
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  useEffect(() => setHasMounted(true), []);
  if (!hasMounted) return null;

  

  
  const openEdit = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const saveEdit = () => {
    setUser(formData);
    setIsEditing(false);

  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.profileDashboard}>
      <div className={styles.profileHeader}>
        <div className={styles.headerNav}>
          <Link href="/" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileLeft}>
          <div className={styles.profilePictureSection}>
            <div className={styles.avatar}>
              <Image
                src={user.avatar}
                alt="avatar"
                width={180}
                height={180}
                className={styles.profileAvatar}
              />
            </div>
            <Button click="Edit" Icon={MdEdit} />
          </div>

          <div className={styles.actionButtons}>
            <Button click="Change Password" Icon={MdLock}/>
            <Button click="Delete Account" variant="delete" Icon={MdDelete}/>
              <Button click="Logout" Icon={MdLogout}/>
          </div>
        </div>

        <div className={styles.profileRight}>
          <div className={styles.userInfoCard}>
            <div className={styles.infoList}>
               <Card title="Scholarid" studentData={user.scholarId} variant="dark" />
               <Card title="Name" studentData={user.name} variant="dark" />
              <Card title="Branch" studentData={user.branch} variant="dark" />
              <Card title="Batch" studentData={user.batch} variant="dark" />
               <Card title="Institute Email" studentData={user.email} variant="dark" />
              
             </div>
            <Button click="Edit Credentials" Icon={MdEdit} onClick={openEdit} />
          </div>
        </div>
      </div>

      {isEditing && (
        <div className={styles.modalOverlay} onClick={cancelEdit}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Edit Credentials</h2>
            {['scholarId', 'name', 'branch', 'batch', 'email'].map(field => (
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
            <div className={styles.modalActions}>
              <button onClick={saveEdit} className={styles.saveBtn}>Save</button>
              <button onClick={cancelEdit} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
