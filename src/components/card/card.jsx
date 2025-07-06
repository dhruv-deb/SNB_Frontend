import Image from 'next/image';

import styles from './card.module.scss';
import { useState,useEffect } from 'react';
import defaultImg from '@/assets/default.jpg';
import { FaThumbsUp, FaThumbsDown, FaTrash } from 'react-icons/fa';


const Card = ({ title, studentData, variant = 'light' }) => {
    return (
        <div className={`${styles.infoItem} ${styles[variant]}`}>
            <span className={styles.infoLabel}>{title}</span>
            <span className={styles.infoValue}>{studentData}</span>
        </div>
    );
};

const DiscussionCard = ({ profilePhoto, discussionText, loggedUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user] = useState(loggedUser);
    const [answer, setAnswer] = useState('');
    const [previousAnswer, setPreviousAnswer] = useState(['Default answer']);
    const [anslabel,setAnsLabel]=useState(false)
    const [upvote, setUpVote] = useState(0);
    const [downvote, setDownVote] = useState(0);

    useEffect(() => {
    setAnsLabel(previousAnswer.length > 0);
    }, [previousAnswer]);

    const handleSubmit = () => {
        if (answer.trim()) {
            setPreviousAnswer(prev => [...prev, answer]); // push to DB
            setAnswer('');
        }
    };

    const handleDelete = (idx) => {
        setPreviousAnswer(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className={styles.discussionCard}>
            <div className={styles.discussionHeader}>
                <div className={styles.headerProfileInfo}>
                    <Image
                        src={profilePhoto || defaultImg}
                        alt="User"
                        width={40}
                        height={40}
                        className={styles.profilePhoto}
                    />
                    <span className={styles.profileName}>User Name</span>
                </div>
                <div className={`${anslabel ? styles.answered : styles.notAnswered}`}>
                    {anslabel ? 'Answered' : 'Not Answered'}
                </div>

            </div>
            <div className={styles.discussionContent}>
                <p>{discussionText}</p>
            </div>
            <div className={styles.discussionActions}>
                <div className={styles.likeButton}>
                    <button className={styles.smallButton}
                    onClick={() => setUpVote(prev => prev + 1)}>

                        <FaThumbsUp size={10} style={{ marginRight: '8px' }} />
                        {upvote}</button>
                    <button className={styles.smallButton}
                    onClick={() => setDownVote(prev => prev + 1)}>
                        <FaThumbsDown size={10} style={{ marginRight: '8px' }} />
                        {downvote}</button>
                </div>
                {user === "Student" && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={styles.smallButton}
                    >
                        View Answer
                    </button>
                )}
                {user === "Proff" && (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={styles.smallButton}
                    >
                        Answer
                    </button>
                )}
            </div>

            {isOpen && user === "Student" && (
                <div className={styles.answerContent}>
                    <div className={styles.discussionHeader}>
                        <Image
                            src={profilePhoto}
                            alt="Proff"
                            width={40}
                            height={40}
                            className={styles.profilePhoto}
                        />
                        <span className={styles.profileName}>Proff Name</span>
                    </div>
                    {/* <p>{discussionText}</p> */}
                    <p>The answer imorted from backend</p>
                </div>
            )}

            {isOpen && user === "Proff" && (
                <div className={styles.answerContent}>
                    <div className={styles.proffAnswerInput}>
                        {previousAnswer.map((ans, idx) => (
                            <div className={styles.previousAnswer} key={idx}>
                                <span>{ans}</span>
                                 <FaTrash
                                    className={styles.deleteIcon}
                                    onClick={() => handleDelete(idx)}
                                    role="button"
                                />
                            </div>
                        ))}
                        <textarea
                            className={styles.proffTextBox}
                            placeholder="Type your answer here.."
                            value={answer}
                            onChange={e => setAnswer(e.target.value)}
                        />
                        <div className={styles.proffButtonRow}>
                            <button className={styles.proffAttachButton}>Attach</button>
                            <button
                                className={styles.proffSubmitButton}
                                onClick={handleSubmit}
                                type="button"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { Card, DiscussionCard };
