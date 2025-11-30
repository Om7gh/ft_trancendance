import { type JSX } from 'react';
import { Profile, SearchBar } from '../ui';
import Notification from './Notification';

export default function DashboardHeader(): JSX.Element {
  return (
    <header className="flex justify-end gap-5 items-center">
      <div className="max-w-96">
        <SearchBar />
      </div>
      <Notification />
      <Profile />
    </header>
  );
}
