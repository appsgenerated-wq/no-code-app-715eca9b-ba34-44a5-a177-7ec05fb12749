import React, { useState } from 'react';
import config from '../constants.js';
import { CakeIcon, UserPlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password);
    }
  };

  const handleDemoLogin = () => {
    onLogin('chef@flavorfind.com', 'password');
  }

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1495195129352-aeb362305e6e?q=80&w=2070')"}}></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4 text-blue-600">
                <CakeIcon className="h-12 w-12"/>
                <h1 className="text-5xl font-bold text-gray-900 ml-3">FlavorFind</h1>
            </div>
            <p className="mt-4 text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
              Discover, create, and share delicious recipes from around the world. Your next favorite meal is just a click away.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={handleDemoLogin}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                Try Chef Demo
              </button>
              <a 
                href={`${config.BACKEND_URL}/admin`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-900 transition-transform transform hover:scale-105"
              >
                Admin Panel
              </a>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
            <div className="flex border-b border-gray-200 mb-6">
              <button onClick={() => setIsLogin(true)} className={`w-1/2 py-3 font-semibold text-center transition-colors ${isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Sign In</button>
              <button onClick={() => setIsLogin(false)} className={`w-1/2 py-3 font-semibold text-center transition-colors ${!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Sign Up</button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
            <p className="text-gray-500 mb-6 text-center text-sm">{isLogin ? 'Sign in to continue your culinary journey.' : 'Join our community of chefs!'}</p>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {!isLogin && (
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Gordon Ramsay" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                {isLogin ? <ArrowRightOnRectangleIcon className='h-5 w-5 mr-2' /> : <UserPlusIcon className='h-5 w-5 mr-2' />}
                {isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
