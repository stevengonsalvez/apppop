import React, { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { cookieManager, CONSENT_CATEGORIES } from '../utils/cookieManager';
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel, IonToggle, IonText } from '@ionic/react';
import { useLocation } from 'react-router-dom';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const [tempConsents, setTempConsents] = useState(cookieManager.getConsents());

  useEffect(() => {
    if (isOpen) {
      setTempConsents(cookieManager.getConsents());
    }
  }, [isOpen]);

  const handleSave = () => {
    Object.entries(tempConsents).forEach(([categoryId, value]) => {
      cookieManager.setConsent(categoryId, value);
    });
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cookie Preferences</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="space-y-6">
          {CONSENT_CATEGORIES.map(category => (
            <div key={category.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                {!category.required && (
                  <IonToggle
                    checked={tempConsents[category.id]}
                    onIonChange={e => setTempConsents(prev => ({
                      ...prev,
                      [category.id]: e.detail.checked
                    }))}
                  />
                )}
              </div>
              <p className="text-sm text-gray-300">{category.detailedDescription}</p>
              {category.required && (
                <p className="text-xs text-gray-400 mt-2">Required for website functionality</p>
              )}
            </div>
          ))}
        </div>
        <IonButton expand="block" onClick={handleSave} className="mt-6">
          Save Preferences
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export const CookieConsentBanner: React.FC = () => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isUnauthRoute = ['/login', '/signup', '/'].includes(location.pathname);
    const hasUnsetConsents = CONSENT_CATEGORIES.some(category => 
      !category.required && localStorage.getItem(`cookie_consent_${category.id}`) === null
    );
    
    setShowBanner(isUnauthRoute || hasUnsetConsents);
  }, [location.pathname]);

  const handleAcceptAll = () => {
    cookieManager.setAllConsent(true);
    setShowBanner(false);
  };

  const handleDeclineAll = () => {
    cookieManager.setAllConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Accept All"
        declineButtonText="Reject All"
        enableDeclineButton
        onAccept={handleAcceptAll}
        onDecline={handleDeclineAll}
        style={{ 
          background: '#2B373B',
          alignItems: 'center',
          gap: '10px',
          padding: '20px'
        }}
        buttonStyle={{ 
          background: '#10B981', 
          color: 'white', 
          fontSize: '13px',
          borderRadius: '4px',
          padding: '10px 20px'
        }}
        declineButtonStyle={{ 
          background: '#000000', 
          color: 'white',
          fontSize: '13px',
          borderRadius: '4px',
          padding: '10px 20px'
        }}
      >
        <div className="space-y-2">
          <p>This website uses cookies to enhance your experience.</p>
          <button
            onClick={() => setShowPreferences(true)}
            className="text-emerald-500 underline cursor-pointer"
          >
            Manage Preferences
          </button>
        </div>
      </CookieConsent>

      <PreferencesModal 
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </>
  );
};