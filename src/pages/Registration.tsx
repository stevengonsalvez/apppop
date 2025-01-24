import { IonContent, IonPage, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface RegistrationState {
  step: number;
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
  marketingConsent: boolean;
}

const initialState: RegistrationState = {
  step: 1,
  email: '',
  password: '',
  fullName: '',
  dateOfBirth: '',
  marketingConsent: false
};

export const RegistrationPage: React.FC = () => {
  const [state, setState] = useState<RegistrationState>(initialState);
  const [showToast] = useIonToast();

  const updateField = (field: keyof RegistrationState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { user, error: signUpError } = await supabase.auth.signUp({
        email: state.email,
        password: state.password
      }, {
        data: {
          full_name: state.fullName,
          date_of_birth: state.dateOfBirth,
          marketing_consent: state.marketingConsent
        }
      });

      if (signUpError) throw signUpError;

      await showToast({
        message: 'Registration successful! Please check your email to verify your account.',
        duration: 5000,
        color: 'success'
      });

    } catch (error: any) {
      await showToast({
        message: error.message,
        duration: 3000,
        color: 'danger'
      });
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Create Account</h2>
              <p className="text-sm text-gray-400">Enter your email and create a password</p>
            </div>

            <div className="space-y-4">
              <input
                type="email"
                value={state.email}
                onChange={e => updateField('email', e.target.value)}
                placeholder="Email address"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <input
                type="password"
                value={state.password}
                onChange={e => updateField('password', e.target.value)}
                placeholder="Password"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            <button
              onClick={() => updateField('step', 2)}
              className="w-full bg-emerald-600 text-white p-3 rounded-lg"
            >
              Continue
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Personal Details</h2>
              <p className="text-sm text-gray-400">Tell us about yourself</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={state.fullName}
                onChange={e => updateField('fullName', e.target.value)}
                placeholder="Full name"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
              <input
                type="date"
                value={state.dateOfBirth}
                onChange={e => updateField('dateOfBirth', e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => updateField('step', 1)}
                className="flex-1 border border-gray-700 text-white p-3 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => updateField('step', 3)}
                className="flex-1 bg-emerald-600 text-white p-3 rounded-lg"
              >
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Almost Done!</h2>
              <p className="text-sm text-gray-400">Review and complete registration</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={state.marketingConsent}
                  onChange={e => updateField('marketingConsent', e.target.checked)}
                  className="form-checkbox h-5 w-5 text-emerald-600"
                />
                <span className="text-white text-sm">
                  I agree to receive marketing communications
                </span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => updateField('step', 2)}
                className="flex-1 border border-gray-700 text-white p-3 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-emerald-600 text-white p-3 rounded-lg"
              >
                Complete Registration
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full space-y-8 p-4">
            <div className="relative mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-1/3 h-1 rounded ${
                      step <= state.step ? 'bg-emerald-500' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <div className="text-center text-sm text-gray-500">
                Step {state.step} of 3
              </div>
            </div>
            {renderStep()}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};