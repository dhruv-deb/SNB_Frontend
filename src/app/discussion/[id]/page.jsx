'use client';

import React, { useEffect, useState } from 'react';
import style from './discussion.module.scss';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { FiTrash } from 'react-icons/fi';

const ClassDiscussion = ({ params }) => {
  const { id } = params;
  const { user } = useAuth();
  const userId = user?.id;
  const [discussion, setDiscussion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answerInputs, setAnswerInputs] = useState({});

  console.log(questions);


  const fetchDiscussions = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/questions/course/${id}`
      );
      setQuestions(res.data.msg || []);
    } catch (err) {
      console.error('Failed to load questions', err);
    }
  };

  const handleQuestionPost = async () => {
    if (discussion.trim()) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/questions`, {
          content: discussion.trim(),
          courseId: id,
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
  const handleDeleteQuestion = async (questionId) => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`);
    fetchDiscussions();
  } catch (err) {
    console.error('Failed to delete question', err);
  }
};

const handleDeleteAnswer = async (answerId) => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/answers/${answerId}`);
    fetchDiscussions();
  } catch (err) {
    console.error('Failed to delete answer', err);
  }
};

  useEffect(() => {
    if (id) fetchDiscussions();
  }, [id, fetchDiscussions]);

  return (
    <div className={style.discussionPage}>
      <div className={style.discussionContainer}>
        <h1 className={style.heading}>DISCUSSION</h1>

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
  <div className={style.qContent}>
    <p><strong>Q:</strong> {q.content}</p>
  </div>
  <div className={style.meta}>
    <span className={style.username}>~{q.user.name}</span>
    {user?.id === q.user.id && (
      <button
        className={style.deleteButton}
        onClick={() => handleDeleteQuestion(q.id)}
        title="Delete question"
      >
       <FiTrash />
      </button>
    )}
  </div>
</div>

<div className={style.answers}>
  {q.answers.length === 0 ? (
    <em>No answers yet.</em>
  ) : (
    q.answers.map((ans) => (
      <div key={ans.id} className={style.answer}>
        <div className={style.aContent}>
          <p><strong>A:</strong> {ans.content}</p>
        </div>
        <div className={style.meta}>
          <span className={style.username}>~{ans.user.name}</span>
          {user?.id === ans.user.id && (
            <button
              className={style.deleteButton}
              onClick={() => handleDeleteAnswer(ans.id)}
              title="Delete answer"
            >
             <FiTrash />
            </button>
          )}
        </div>
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
