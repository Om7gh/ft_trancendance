import { HomeDashboard } from '@/components/layout';
import { Activation, FinishRegister, SignIn, SignUp } from '@/components/ui';
import ResetPassword from '@/components/ui/auth/ResetPassword';
import TwoFactorActivation from '@/components/ui/auth/TwoFactorActivation';
import PlayTournament from '@/components/ui/game/PlayTournament';
import ErrorPage from '@/components/ui/utils/ErrorPage';
import { PlayLocal } from '@/playLocal/main';
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
import PingPong from '@/pages/PingPong';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import PongMain from '@/pages/PongMain';
import { PongRemote, RemoteOptions } from '@/playRemote/main';
import { PlayWithSomeOne } from '@/playRemote/playWithSomeOne';
import CreateUsername from '@/components/ui/auth/CreateUsername';
import AuthProtection from '@/components/ui/auth/AuthProtection';
import ProtectDashboard from './ProtectDashboard';

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: (
      // <AuthProtection>
        <Dashboard />
      // </AuthProtection>
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
              { path: 'local', element: <PlayLocal /> },
              { index: true, element: <PingPong /> },
              {
                path: 'remote',
                element: <PongRemote />,
                children: [
                  { path: 'someone', element: <PlayWithSomeOne /> },
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
      // <ProtectDashboard>
        <Auth />
      // </ProtectDashboard>
    ),
    children: [
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'choose-username',
        element: <CreateUsername />,
      },
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'complete-profile',
        element: <FinishRegister />,
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
