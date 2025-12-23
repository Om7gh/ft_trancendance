import { HomeDashboard } from '@/components/layout';
import { Activation, SignIn, SignUp } from '@/components/ui';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import ProtectAuth from './ProtectAuth';
import ProtectDashboard from './ProtectDashboard';
import ResetPassword from '@/components/ui/auth/ResetPassword';
import TwoFactorActivation from '@/components/ui/auth/TwoFactorActivation';
import CompleteRegistre from '@/components/ui/auth/CompleteRegistre';
import ErrorPage from '@/components/ui/utils/ErrorPage';
import {
  Auth,
  Chat,
  Dashboard,
  Friends,
  Landing,
  Profile,
  Settings,
} from '@/pages';

import Chess from '@/pages/Chess';
import Customization from '@/pages/Customization';
import GamePortal from '@/pages/GamePortal';
import GameSettings from '@/pages/GameSettings';

import PongMain from '@/pong/PongMain';
import { PlayLocal } from '@/pong/playLocal/main.tsx';
import StartMenu from '@/pong/component/StartMenu.tsx';
import { PongRemote, RemoteOptions } from '@/pong/playRemote/main.tsx';
import PlayWithSomeOne from '@/pong/playRemote/playWithSomeOne.tsx';
import PlayTournament from '@/components/ui/game/PlayTournament';
import PlayWithFriend from '@/pong/playRemote/playWithFriend';

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: (
      <ProtectDashboard>
        <Dashboard />
      </ProtectDashboard>
    ),
    children: [
      {
        path: 'home',
        element: <HomeDashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'games',
        children: [
          {
            path: 'pingpong',
            element: <PongMain />,
            children: [
              { index: true, element: <StartMenu /> },
              { path: 'local', element: <PlayLocal /> },
              {
                path: 'remote',
                element: <PongRemote />,
                children: [
                  { path: 'someone', element: <PlayWithSomeOne /> },
                  {path: "invitefriend", element: <PlayWithFriend />},
                  { index: true, element: <RemoteOptions /> },
                ],
              },
            ],
          },
          {
            path: 'tournament',
            element: <PlayTournament />,
          },
          {
            path: 'customization',
            element: <Customization />,
          },
          {
            path: 'portal',
            element: <GamePortal />,
          },
          {
            path: 'settings',
            element: <GameSettings />,
          },
          {
            path: 'chess',
            element: <Chess />,
          },
          {
            index: true,
            element: <Navigate to="portal" replace />,
          },
        ],
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'friends',
        element: <Friends />,
      },
      {
        index: true,
        element: <Navigate to="home" replace />,
      },
    ],
  },
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/auth',
    element: (
      <ProtectAuth>
        <Auth />
      </ProtectAuth>
    ),
    children: [
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'complete-registration',
        element: <CompleteRegistre />,
      },
      {
        path: 'activation',
        element: <Activation />,
      },
      {
        path: 'verify-2fa',
        element: <TwoFactorActivation />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        index: true,
        element: <Navigate to="signin" replace />,
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export default router;
