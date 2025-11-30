import { HomeDashboard } from '@/components/layout';
import { Activation, FinishRegister, SignIn, SignUp } from '@/components/ui';
import ResetPassword from '@/components/ui/auth/ResetPassword';
import TwoFactorActivation from '@/components/ui/auth/TwoFactorActivation';
import PlayTournament from '@/components/ui/game/PlayTournament';
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
import PingPong from '@/pages/PingPong';
import { settingHandler } from '@/pages/Settings';
import { createBrowserRouter, Navigate } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Dashboard />,
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
        action: settingHandler,
      },
      {
        path: 'games',
        children: [
          {
            path: 'pingpong',
            element: <PingPong />,
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
    element: <Auth />,
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
        path: 'avatar',
        element: <FinishRegister />,
      },
      {
        path: 'activation',
        element: <Activation />,
      },
      {
        path: '2-factor-activation',
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
