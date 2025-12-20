import { useState } from 'react';
import { IoIosNotificationsOutline } from 'react-icons/io';
import Modal from './Modal';

function Notification() {
  const [openNotification, setOpenNotification] = useState(false);
  return (
    <div className="relative">
      <IoIosNotificationsOutline
        className="text-4xl text-slate-950/80 border-4 rounded-full border-violet-600 bg-violet-400 cursor-pointer"
        onClick={() => setOpenNotification(!openNotification)}
      />
      {openNotification && (
        <Modal onClose={() => setOpenNotification(false)} type="notification">
          <div className='text-white'>notification</div>
        </Modal>
      )}
    </div>
  );
}

export default Notification;
