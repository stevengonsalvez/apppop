import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonInput,
  IonToggle,
  useIonToast,
} from '@ionic/react';
import { saveOutline, personCircleOutline, mailOutline, notificationsOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { supabase } from '../utils/supabaseClient';
import { cookieManager } from '../utils/cookieManager';

const ProfilePage: React.FC = () => {
  const { profile, user, updateUserInContext } = useUserContext();
  const [showToast] = useIonToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    full_name: profile?.full_name || '',
    date_of_birth: profile?.date_of_birth || '',
    marketing_email: profile?.marketing_email || false,
    marketing_notifications: profile?.marketing_notifications || false,
  });

  const handleSignOut = async () => {
    cookieManager.clearAllConsents();
    await supabase.auth.signOut();
  };

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.full_name,
          date_of_birth: editedProfile.date_of_birth,
          marketing_email: editedProfile.marketing_email,
          marketing_notifications: editedProfile.marketing_notifications,
        })
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      updateUserInContext({
        ...profile,
        ...editedProfile,
      });

      await showToast({
        message: 'Profile updated successfully!',
        duration: 2000,
        color: 'success',
      });

      setIsEditing(false);
    } catch (error: any) {
      await showToast({
        message: error.message,
        duration: 2000,
        color: 'danger',
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Profile</IonTitle>
          <IonButtons slot="end">
            {!isEditing ? (
              <IonButton onClick={() => setIsEditing(true)}>Edit</IonButton>
            ) : (
              <IonButton onClick={handleSave}>
                <IonIcon icon={saveOutline} slot="start" />
                Save
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
              <IonIcon 
                icon={personCircleOutline} 
                className="w-full h-full text-gray-400"
              />
            </div>
            {isEditing ? (
              <IonInput
                value={editedProfile.full_name}
                onIonChange={e => setEditedProfile(prev => ({ 
                  ...prev, 
                  full_name: e.detail.value! 
                }))}
                className="text-xl text-center mt-4"
                placeholder="Enter your name"
              />
            ) : (
              <h2 className="text-xl font-semibold mt-4">
                {profile?.full_name || 'Set your name'}
              </h2>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <IonIcon icon={mailOutline} />
                <span>Email</span>
              </div>
              <p className="text-white">{user?.email}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <IonIcon icon={notificationsOutline} />
                <span>Marketing Preferences</span>
              </div>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <label className="flex items-center justify-between">
                      <span className="text-white">Email Updates</span>
                      <IonToggle
                        checked={editedProfile.marketing_email}
                        onIonChange={e => setEditedProfile(prev => ({
                          ...prev,
                          marketing_email: e.detail.checked
                        }))}
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-white">Push Notifications</span>
                      <IonToggle
                        checked={editedProfile.marketing_notifications}
                        onIonChange={e => setEditedProfile(prev => ({
                          ...prev,
                          marketing_notifications: e.detail.checked
                        }))}
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <p className="text-white">
                      Email Updates: {profile?.marketing_email ? 'Enabled' : 'Disabled'}
                    </p>
                    <p className="text-white">
                      Push Notifications: {profile?.marketing_notifications ? 'Enabled' : 'Disabled'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <IonButton
            expand="block"
            color="medium"
            onClick={handleSignOut}
            className="mt-6"
          >
            Sign Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;