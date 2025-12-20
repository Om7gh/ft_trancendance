import { type ReactNode } from 'react';

interface DashboardWrapperProps {
  children: ReactNode;
  isVisible: boolean;
  title?: string;
  icon: ReactNode;
}

export default function DashboardWrapper({
  children,
  isVisible,
  title,
  icon,
}: DashboardWrapperProps) {
  if (!isVisible) return null;

  return (
    <div className="space-y-6 animate-fadeIn ">
      <div className="flex items-center gap-5">
        <div className="text-2xl text-slate-100 bg-slate-900/50 p-2 ">
          {icon}
        </div>
        {title && (
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-neon bg-clip-text text-transparent">
            {title}
          </h2>
        )}
      </div>
      {children}
    </div>
  );
}
