import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { UserProvider } from '../contexts/UserContext';
import { IonApp, IonContent } from '@ionic/react';

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <IonApp>
          <IonContent>
            {ui}
          </IonContent>
        </IonApp>
      </UserProvider>
    </QueryClientProvider>
  );
}