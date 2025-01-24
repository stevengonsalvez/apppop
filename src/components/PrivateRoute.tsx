import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

interface PrivateRouteProps extends RouteProps {
  component?: React.ComponentType<any>;
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  children,
  ...rest
}) => {
  const user = supabase.auth.user();

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