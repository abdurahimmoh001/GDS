
import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';

interface AuthScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onSignIn, onSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      onSignUp();
    } else {
      onSignIn();
    }
  };

  const AuthForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            placeholder="••••••••"
            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800"
        >
          {isSignUp ? "Create My Free Account" : "Log In"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="text-center mb-8">
            <div className="bg-blue-600 p-3 rounded-lg inline-block">
                <LogoIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {isSignUp ? "The simple path to smarter research starts here." : "Good to see you again."}
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
                {isSignUp ? "Join safely in seconds. We handle the complexity so you don’t have to." : "Your clear, simple view of the markets is ready and waiting."}
            </p>
        </div>
        
        <AuthForm />

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none">
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;