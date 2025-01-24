import { useState } from 'react';
import { IonContent, IonPage, useIonToast, useIonLoading } from '@ionic/react';
import { supabase } from '../utils/supabaseClient';
import { useHistory, Link } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const history = useHistory();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await showLoading();
    try {
      const { error } = await supabase.auth.signIn(formData);
      if (error) throw error;
      
      history.push('/home');
    } catch (error: any) {
      await showToast({ 
        message: error.message,
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
    } finally {
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-black text-white">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-4xl font-bold text-center mb-2">Welcome Back</h2>
            <p className="text-center text-gray-400 text-lg">
              Sign in to your account
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="py-8 px-4 sm:px-10">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`appearance-none block w-full px-3 py-3 border ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className={`appearance-none block w-full px-3 py-3 border ${
                        errors.password ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg bg-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-emerald-500 hover:text-emerald-400">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-gray-400">Or</span>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm text-center">
                    <Link 
                      to="/register" 
                      className="font-medium text-emerald-500 hover:text-emerald-400"
                    >
                      Don't have an account? Sign up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};