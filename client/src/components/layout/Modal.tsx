import React from 'react';
import { createPortal } from 'react-dom';
import { MdClose } from 'react-icons/md';

function Modal({
  children,
  onClose,
  type,
}: {
  children: React.ReactNode;
  onClose: () => void;
  type?: string;
}) {
  return createPortal(
    <div className="w-screen h-screen bg-slate-950/20 backdrop-blur-md fixed top-0 left-0 ">
      <div
        className={`fixed ${
          type !== 'notification' ? 'top-1/2 left-1/2' : 'top-1/4 left-1/2'
        } -translate-x-1/2 -translate-y-1/2 px-16 py-10 max-w-[40vmax] max-h-[40vmax] bg-slate-900 shadow-md shadow-slate-950 overflow-auto transition`}
      >
        <button
          onClick={onClose}
          className="bg-violet-500 fixed right-5 top-5 rounded-full p-1 text-xl text-violet-950 hover:scale-[1.1] duration-150 hover:bg-violet-600"
        >
          <MdClose />
        </button>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
