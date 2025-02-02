import React, { useEffect, useState } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import { CircularProgress, Box } from '@mui/material';

interface PrivateRouteProps extends RouteProps {
  component?: React.ComponentType<any>;
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  children,
  ...rest
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Route
      {...rest}
      render={props => {
        if (!user) {
          return <Redirect to="/login" />;
        }

        if (Component) {
          return <Component {...props} />;
        }

        return children;
      }}
    />
  );
};

export default PrivateRoute;