'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { auth } from '../../utils/firebase';

export default function SessionsTable({ params }) {
  const { id } = params;
  const courseId = id;
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/sessions/${courseId}`;
        const res = await axios.get(apiUrl);
        setSessions(res.data.msg?.Sessions || []);
      } catch (err) {
        console.error('API Fetch Error:', err);
        toast.error(err.response?.data?.msg || 'Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchSessions();
    }
  }, [courseId]);

  const cancelSession = async (sessionId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('You must be logged in to cancel a session.');
        return;
      }
      
      const token = await user.getIdToken();
      
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/cancel`,
        { courseId },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Session cancelled successfully');
      setSessions(currentSessions =>
        currentSessions.map(session =>
          session.id === sessionId ? { ...session, isCanceled: true } : session
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to cancel session');
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Class Sessions</h2>
      
      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions found for this course.</p>
      ) : (
        <table className="w-full border border-collapse border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const isPast = dayjs(session.date).isBefore(dayjs(), 'day');
              const status = session.isCanceled
                ? 'Cancelled'
                : isPast
                  ? 'Completed'
                  : 'Scheduled';

              return (
                <tr key={session.id}>
                  <td className="p-2 border">
                    {dayjs(session.date).format('DD MMM YYYY')}
                  </td>
                  <td
                    className={`border p-2 font-semibold ${
                      status === 'Completed'
                        ? 'text-green-600'
                        : status === 'Cancelled'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                    }`}
                  >
                    {status}
                  </td>
                  <td className="p-2 text-center border">
                    {status === 'Scheduled' ? (
                      <button
                        className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => cancelSession(session.id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className={`px-3 py-1 rounded text-white ${
                          status === 'Completed'
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        }`}
                        disabled
                      >
                        {status}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
