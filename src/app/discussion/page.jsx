// 'use client';

// import React, { useState ,useEffect} from 'react';
// import { useParams } from 'next/navigation';
// import { useClassContext } from '../ClassContext'; // Only import the hook
// import style from './discussion.module.scss';
// import { DiscussionCard } from '@/components/card/card';


// const ClassDiscussion = () => {
//   const [hasMounted, setHasMounted] = useState(false);
//   // const params = useParams();
//   // const classCode = params.classCode;
//   // const { classList } = useClassContext();
//   // const currentClass = classList.find(cls => cls.subject === classCode);
//   const currentClass={
//   subject: "CS101",
//   day: "Monday",
//   startTime: "09:00",
//   endTime: "10:00",
//   location: "Room G-201",
//   notes: "Introduction to programming in C. Bring your laptops."
// };

//   const [discussion, setDiscussion] = useState('');
//   const [discussionList, setDiscussionList] = useState([]);
//   const [user, setUser] = useState("Student");


//   useEffect(() => setHasMounted(true), []);
//     if (!hasMounted) return null;

//   const handlePost = () => {
//     if (discussion.trim()) {
//       setDiscussionList(prev => [...prev, discussion.trim()]);
//       setDiscussion('');
//     }
//   };

//   // if (!currentClass) {
//   //   return <div className={style.notFound}>Class not found</div>;
//   // }

//   // Dummy posts shown : Change on integrating backend
//   const dummyPosts = [
//     "What was the main topic discussed today?",
//     "When is the assignment due?",
//     "Why am i doing this?"
//   ];

//   let posts = [];

//   if (user === "Student") {
//     posts = [...dummyPosts, ...discussionList];
//   } else if (user === "Proff") {
//     posts = dummyPosts;
//   }

//   return (
//     <div className={style.discussionContainer}>
//       <h1 className={style.heading}>Discussion for {currentClass.subject}</h1>
//       <p><strong>Venue:</strong> {currentClass.location}</p>
//       <p><strong>Timing:</strong> {currentClass.startTime} - {currentClass.endTime}</p>

//       {user === "Student" && (
//         <div className={style.inputSection}>
//           <textarea
//             value={discussion}
//             onChange={(e) => setDiscussion(e.target.value)}
//             placeholder="Type what was taught in class..."
//             className={style.textarea}
//           />
//           <button onClick={handlePost} className={style.postButton}>Post</button>
//         </div>
//       )}

//       <div className={style.discussionList}>
//         <h3>Posts</h3>
//         {posts.length === 0 ? (
//           <p className={style.noPosts}>No discussions yet.</p>
//         ) : (
//           posts.map((post, idx) => (
//             <DiscussionCard 
//               key={idx}
//               discussionText={post}
//               loggedUser={user}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ClassDiscussion;

'use client';

import React, { useState, useEffect,useMemo} from 'react';
import { useParams } from 'next/navigation';
import { useClassContext } from '../ClassContext';
import style from './discussion.module.scss';
import { DiscussionCard } from '@/components/card/card';
import { DropdownButton } from '@/components/button/button';

const ClassDiscussion = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [discussion, setDiscussion] = useState('');
  const [discussionList, setDiscussionList] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState("Proff");

  
  const currentClass = {
    subject: "CS101",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    location: "Room G-201",
    notes: "Introduction to programming in C. Bring your laptops."
  };
  
 const dummyPosts = useMemo(() => [
  "What was the main topic discussed today?",
  "When is the assignment due?",
  "Why am I doing this?"
], []);
  const options = [
    { label: 'Latest' },
    { label: 'Oldest' },
    { label: 'Most Liked' },
    { label: 'Unanswered' },
  ];

  const handleSelect = (option) => {
    console.log('Selected option:', option.label);
  };

  useEffect(() => {
    setDiscussionList(dummyPosts);
  }, [dummyPosts]);
  
  useEffect(() => setHasMounted(true), []);
  if (!hasMounted) return null;
  const handlePost = () => {
    if (discussion.trim()) {
      const postText = discussion.trim();
      setDiscussionList(prev => [...prev, postText]);
      setMyPosts(prev => [...prev, postText]);
      setDiscussion('');
    }
  };

  const filteredPosts = filter === 'all' ? discussionList : myPosts;

  return (
    <div className={style.discussionPage}>
      <div className={style.sidebar}>
        <h3>Filter</h3>
        <button
          className={filter === 'all' ? style.activeTab : ''}
          onClick={() => setFilter('all')}
        >
          All Questions
        </button>
        {user === 'Student' && (
          <button
            className={filter === 'mine' ? style.activeTab : ''}
            onClick={() => setFilter('mine')}
          >
            My Questions
          </button>
        )}
      </div>

      <div className={style.discussionContainer}>
        <h1 className={style.heading}>Discussion for {currentClass.subject}</h1>
        <p><strong>Venue:</strong> {currentClass.location}</p>
        <p><strong>Timing:</strong> {currentClass.startTime} - {currentClass.endTime}</p>

        {user === 'Student' && (
          <div className={style.inputSection}>
            <textarea
              value={discussion}
              onChange={(e) => setDiscussion(e.target.value)}
              placeholder="Type what was taught in class..."
              className={style.textarea}
            />
            <button onClick={handlePost} className={style.postButton}>Post</button>
          </div>
        )}

        <div className={style.discussionList}>
          <div className={style.filter}>
            <h3>Posts</h3>
            <DropdownButton 
              options={options}
              onSelect={handleSelect}
              label="Sort By"  
              variant="default"
              />
          </div>
          {filteredPosts.length === 0 ? (
            <p className={style.noPosts}>No discussions yet.</p>
          ) : (
            filteredPosts.map((post, idx) => (
              <DiscussionCard
                key={idx}
                discussionText={post}
                loggedUser={user}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDiscussion;
