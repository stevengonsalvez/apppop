import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { personCircleOutline, homeOutline, settingsOutline } from 'ionicons/icons';
import { supabase } from './utils/supabaseClient';

import '@ionic/react/css/ionic.bundle.css';
import './theme/variables.css';

import { LoginPage } from './pages/Login';
import { RegistrationPage } from './pages/Registration';
import ProfilePage from './pages/Profile';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserProvider } from './contexts/UserContext';
import PrivateRoute from './components/PrivateRoute';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { cookieManager } from './utils/cookieManager';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

setupIonicReact();

const AuthenticatedApp: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <PrivateRoute exact path="/home">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Welcome to the Template App</h1>
          <p className="mt-2 text-gray-300">This is your starting point. Customize this page as needed.</p>
        </div>
      </PrivateRoute>
      <PrivateRoute exact path="/profile">
        <ProfilePage />
      </PrivateRoute>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </IonRouterOutlet>

    <IonTabBar slot="bottom" className="border-t border-gray-800">
      <IonTabButton tab="home" href="/home">
        <IonIcon icon={homeOutline} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/profile">
        <IonIcon icon={personCircleOutline} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const AppContent: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    cookieManager.initializeDefaultConsents();

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <UserProvider>
      {!session ? (
        <IonRouterOutlet>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/register">
            <RegistrationPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      ) : (
        <AuthenticatedApp />
      )}
    </UserProvider>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <IonReactRouter>
          <AppContent />
          <CookieConsentBanner />
        </IonReactRouter>
      </IonApp>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;