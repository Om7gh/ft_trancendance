import { useEffect, useState } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import Modal from './Modal';
import Notify, { type NotificationType } from '../ui/utils/Notify';
import api from '@/services/clientHttpService';

function Notification() {
  const [openNotification, setOpenNotification] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchNotification() {
      try {
        const response = await api.get("/fetch");
        if (isMounted) {
          setData(response.data);
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
    }, 10000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [])


  console.log(data);

  return (
    <div className="relative">
      <IoIosNotificationsOutline
        className="text-4xl text-slate-950/80 border-4 rounded-full border-violet-600 bg-violet-400 cursor-pointer"
        onClick={() => setOpenNotification(!openNotification)}
      />
      {openNotification && (
        <Modal onClose={() => setOpenNotification(false)} type="notification">
          {loading && <p>Loading...</p>}
          {!loading && error && <p className='text-pink-500 text-xl text-center'>{error}</p>}
          {!loading && !error && (data.length ? <>
            {data.map((notif : NotificationType, i: number) => (
              <Notify data={notif} key={i} />
            ))}
          </> : <p className='text-violet-200 text-xl text-center'>No Notification available yet</p>)}
        </Modal>
      )}
    </div>
  );
}

export default Notification;
