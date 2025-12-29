import { memo, useEffect, useRef, useState } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import Modal from './Modal';
import Notify, { type NotificationType } from '../ui/utils/Notify';
import api from '@/services/clientHttpService';
import { useNavigate } from 'react-router-dom';

function Notification() {
  const [openNotification, setOpenNotification] = useState(false);
  const [data, setData] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counter, setCounter] = useState<number>(0);
  const handledJoinMatchRef = useRef<Set<string>>(new Set());
  const [activeJoinMatch, setActiveJoinMatch] = useState<NotificationType | null>(null);
  const navigate = useNavigate()
  const lastSeenTotalRef = useRef<number>(0);
  const hasInitializedBaselineRef = useRef(false);
  useEffect(() => {
    let isMounted = true;
    async function fetchNotification() {
      try {
        const response = await api.get("/fetch");
        if (isMounted) {
          const newData: NotificationType[] = Array.isArray(response.data)
            ? response.data
            : [];
          if (!hasInitializedBaselineRef.current) {
            lastSeenTotalRef.current = newData.length;
            hasInitializedBaselineRef.current = true;
            setCounter(0);
          } else {
            const unread = Math.max(0, newData.length - lastSeenTotalRef.current);
            setCounter(unread);
          }
          setData(newData);
         const newJoinMatch = newData.find(
  (notif) =>
    notif.type === "joinMatch" &&
    !handledJoinMatchRef.current.has(notif.id)
);
console.log(newJoinMatch)
if (newJoinMatch) {
  handledJoinMatchRef.current.add(newJoinMatch.id);
  setActiveJoinMatch(newJoinMatch);
}
          setError("");
          setLoading(false);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.message || "Failed to fetch notifications");
          setLoading(false);
        }
      }
    }
    fetchNotification();
    const intervalId = setInterval(() => {
      fetchNotification();
    }, 5000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [])

  const handleToggleNotification = () => {
    setOpenNotification((prev) => {
      const next = !prev;
      if (next) {
        lastSeenTotalRef.current = data.length;
        hasInitializedBaselineRef.current = true;
        setCounter(0);
      }
      return next;
    });
  };

  return (
  <div className="relative">
    {activeJoinMatch && (
      <Modal onClose={() => setActiveJoinMatch(null)}>
        <div className="flex flex-col gap-5 items-center p-10 text-center">
          <h2 className="text-lg md:text-4xl bg-linear-0 from-violet-500 to-neon bg-clip-text text-transparent">
            Your tournament match is waiting!
          </h2>

          <button className="mt-6 px-8 py-3 bg-linear-to-r from-violet-500 to-neon text-white font-semibold text-xl md:text-2xl"
            onClick={() => navigate(`/dashboard/games/pingpong/remote/joinMatch?=${activeJoinMatch.sender.id}`)}
          >
            I'm ready
          </button>
        </div>
      </Modal>
    )}

    <div>
      <span className="absolute -top-2 -right-2 bg-violet-950 text-violet-200 text-sm rounded-full w-5 h-5 flex items-center justify-center">
        {counter}
      </span>

      <IoIosNotificationsOutline
        className="text-4xl text-slate-950/80 border-4 rounded-full border-violet-600 bg-violet-400 cursor-pointer"
        onClick={handleToggleNotification}
      />
    </div>

    {openNotification && (
      <Modal onClose={() => setOpenNotification(false)} type="notification">
        {loading && <p>Loading...</p>}
        {!loading && error && (
          <p className="text-pink-500 text-xl text-center">{error}</p>
        )}
        {!loading && !error &&
          (data.length ? (
            data.map((notif) => (
              <Notify data={notif} key={notif.id} />
            ))
          ) : (
            <p className="text-violet-200 text-xl text-center">
              No Notification available yet
            </p>
          ))}
      </Modal>
    )}
  </div>
);

}

export default memo(Notification);
