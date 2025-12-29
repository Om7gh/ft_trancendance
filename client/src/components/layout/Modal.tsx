import React, { useEffect } from 'react';
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
  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 w-screen h-screen bg-slate-950/50 backdrop-blur-md flex items-center justify-center px-4"
      onClick={closeModal}
      aria-hidden={false}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute lg:mx-auto md:mx-auto w-full max-w-2xl max-h-[80vh] overflow-auto  bg-slate-900 shadow-md shadow-slate-950 transition-all sm:mx-16
          ${type === 'notification' ? 'top-1/5' : null}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-xl text-violet-950 bg-violet-500 hover:bg-violet-600 hover:scale-105 transition-transform duration-150 z-500"
        >
          <MdClose />
        </button>

        <div className=''>{children}</div>
      </div>
    </div>,
    (typeof document !== 'undefined' && document.body) ||
      document.createElement('div')
  );
}

export default Modal;
