import { memo, useEffect, useRef, useState } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import Modal from './Modal';
import Notify, { type NotificationType } from '../ui/utils/Notify';
import api from '@/services/clientHttpService';
import { Logo } from '@/assets';

function Notification() {
  const [openNotification, setOpenNotification] = useState(false);
  const [data, setData] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [counter, setCounter] = useState<number>(0);
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
    <div className='relative'>
      <span className="absolute -top-4 -right-2 bg-violet-950 text-violet-200 text-sm rounded-full w-5 h-5 flex items-center justify-center">
        {counter}
      </span>

      <IoIosNotificationsOutline
        className="text-4xl text-slate-950/80 border-4 rounded-full border-violet-600 bg-violet-400 cursor-pointer"
        onClick={handleToggleNotification}
      />
    </div>

    {openNotification && (
      <Modal onClose={() => setOpenNotification(false)} type="notification">
        <div className='w-full flex flex-col items-center mb-6 sticky top-0 left-0 bg-slate-950/50 backdrop-blur-lg p-6 z-5555'>
        <img src={Logo} alt="logo" className='w-24 h-24 text-center' />
        <p className='text-transparent bg-linear-to-r from-violet-500 to-neon bg-clip-text text-xl'>PingPop Notification</p>
        </div>
        {loading && <p>Loading...</p>}
        {!loading && error && (
          <p className="text-pink-500 text-xl text-center">{error}</p>
        )}
        {!loading && !error &&
          (data.length ? (
            data.map((notif) => (
              <Notify data={notif} key={notif.id} close={() => setOpenNotification(false)} />
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
