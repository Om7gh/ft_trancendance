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

import PongMain from '@/pong/PongMain';
import { PlayLocal } from '@/pong/playLocal/main.tsx';
import StartMenu from '@/pong/component/StartMenu.tsx';
import { PongRemote, RemoteOptions } from '@/pong/playRemote/main.tsx';
import PlayWithSomeOne from '@/pong/playRemote/playWithSomeOne.tsx';
import PlayTournament from '@/components/ui/game/PlayTournament';
import JoinMatch from '@/pong/playRemote/joinMatch';
import SettingsPortal from '@/components/ui/settings/SettingsPortal';
import AccountSettings from '@/components/ui/settings/AccountSettings';

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
        element: <ProtectDashboard>
          <HomeDashboard /> 
        </ProtectDashboard> ,
      },
      {
        path: 'profile/:username',
        element: <Profile />,
      },
      {
        path: 'settings',
         element: <ProtectDashboard>
          <Settings />,
        </ProtectDashboard> ,
        children: [
          {
            path: 'account',
            element: <ProtectDashboard>
          <AccountSettings />,
        </ProtectDashboard> ,
          },
          {
            path: 'game',
            element: <ProtectDashboard>
          <Customization />,
        </ProtectDashboard> ,
          },
           {
            path: 'portal',
            element: <ProtectDashboard>
          <SettingsPortal />,
        </ProtectDashboard> ,
          },
          {
            index: true,
            element: <Navigate to="portal" replace />
          },
        ],
      },
      {
        path: 'games',
        children: [
          {
            path: 'pingpong',
            element: <ProtectDashboard>
          <PongMain />,
        </ProtectDashboard> ,
            children: [
              { index: true, element: <ProtectDashboard>
          <StartMenu />,
        </ProtectDashboard> , },
              { path: 'local', element: <ProtectDashboard>
          <PlayLocal />,
        </ProtectDashboard> , },
              {
                path: 'remote',
                element: <ProtectDashboard>
          <PongRemote />,
        </ProtectDashboard> ,
                children: [
                  { path: 'someone', element: <ProtectDashboard>
          <PlayWithSomeOne />,
        </ProtectDashboard> , },
                  { path: 'joinMatch', element: <ProtectDashboard>
          <JoinMatch />,
        </ProtectDashboard> , },
                  { index: true, element: <ProtectDashboard>
          <RemoteOptions />,
        </ProtectDashboard> ,},
                ],
              },
            ],
          },
          {
            path: 'tournament',
            element: <ProtectDashboard>
          <PlayTournament />,
        </ProtectDashboard> ,
          },
          {
            path: 'portal',
            element: <ProtectDashboard>
          <GamePortal />,
        </ProtectDashboard> ,
          },
          {
            path: 'chess',
             element: <ProtectDashboard>
          <Chess />,
        </ProtectDashboard> ,
          },
          {
            index: true,
            element: <Navigate to="portal" replace />,
          },
        ],
      },
      {
        path: 'chat',
         element: <ProtectDashboard>
          <Chat />,
        </ProtectDashboard> ,
      },
      {
        path: 'friends',
         element: <ProtectDashboard>
          <Friends />,
        </ProtectDashboard> ,
      },
      {
        index: true,
        element: <Navigate to="games" replace />,
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
     
        element:<ProtectAuth>
                  <SignUp />
                </ProtectAuth> ,
      },
      {
        path: 'signin',
        element: <ProtectAuth>
                  <SignIn />
                </ProtectAuth> ,
      },
      {
        path: 'complete-registration',
        element: <ProtectAuth>
                  <CompleteRegistre />
                </ProtectAuth>
      },
      {
        path: 'activation',
        element:  <ProtectAuth>
                   <Activation />
                  </ProtectAuth>,
      },
      {
        path: 'verify-2fa',
        element: <ProtectAuth>
                   <TwoFactorActivation />
                  </ProtectAuth>,
      },
      {
        path: 'reset-password',
        element: <ProtectAuth>
                   <ResetPassword />
                  </ProtectAuth>,
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
