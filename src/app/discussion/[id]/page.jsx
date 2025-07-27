'use client';

import React, { useEffect, useState } from 'react';
import style from './discussion.module.scss';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const ClassDiscussion = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const userId = user?.id;
  const [discussion, setDiscussion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answerInputs, setAnswerInputs] = useState({});

  const fetchDiscussions = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/questions/course/${courseId}`
      );
      setQuestions(res.data.msg || []);
    } catch (err) {
      console.error('Failed to load questions', err);
    }
  };

  const handleQuestionPost = async () => {
    if (discussion.trim()) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/question`, {
          content: discussion.trim(),
          courseId,
          userId,
        });
        setDiscussion('');
        fetchDiscussions();
      } catch (err) {
        console.error('Failed to post question', err);
      }
    }
  };

  const handleAnswerPost = async (questionId) => {
    const content = answerInputs[questionId]?.trim();
    if (!content) return;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/answers`, {
        questionId,
        content,
        userId,
      });
      setAnswerInputs((prev) => ({ ...prev, [questionId]: '' }));
      fetchDiscussions();
    } catch (err) {
      console.error('Failed to post answer', err);
    }
  };

  useEffect(() => {
    if (courseId) fetchDiscussions();
  }, [courseId]);

  return (
    <div className={style.discussionPage}>
      <div className={style.discussionContainer}>
        <h1 className={style.heading}>Discussion</h1>

        <div className={style.inputSection}>
          <textarea
            value={discussion}
            onChange={(e) => setDiscussion(e.target.value)}
            placeholder="Ask a question..."
            className={style.textarea}
          />
          <button onClick={handleQuestionPost} className={style.postButton}>
            Post
          </button>
        </div>

        <div className={style.discussionList}>
          <div className={style.filter}>
            <h3>Posts</h3>
          </div>

          {questions.length === 0 ? (
            <p className={style.noPosts}>No discussions yet.</p>
          ) : (
            questions.map((q) => (
              <div key={q.id} className={style.questionBlock}>
                <div className={style.question}>
                  <strong>Q:</strong> {q.content}
                </div>

                <div className={style.answers}>
                  {q.answers.length === 0 ? (
                    <em>No answers yet.</em>
                  ) : (
                    q.answers.map((ans, idx) => (
                      <div key={idx} className={style.answer}>
                        <strong>↳</strong> {ans.content}
                      </div>
                    ))
                  )}
                </div>

                <div className={style.answerForm}>
                  <textarea
                    placeholder="Write your answer..."
                    value={answerInputs[q.id] || ''}
                    onChange={(e) =>
                      setAnswerInputs({
                        ...answerInputs,
                        [q.id]: e.target.value,
                      })
                    }
                    className={style.textarea}
                  />
                  <button
                    className={style.postButton}
                    onClick={() => handleAnswerPost(q.id)}
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDiscussion;
