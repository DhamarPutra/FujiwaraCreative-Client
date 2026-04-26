import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../application/store';
import { Key, Globe, Zap, Copy, Check, Eye, EyeOff, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const DeveloperSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Helmet>
        <title>Developer Settings - Fujiwara Creative</title>
      </Helmet>

      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Developer Settings</h1>
        <p className="text-slate-500">Manage your API access and integration details.</p>
      </div>

      <div className="grid gap-8">
        {/* API Key Section */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Key size={120} />
          </div>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Key size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Your API Key (HMAC Secret)</h2>
          </div>

          <p className="text-sm text-slate-500 mb-4">
            Use this secret key to sign your requests. <span className="text-red-500 font-bold underline">Never share this key with anyone.</span>
          </p>

          <div className="relative group">
            <div className="flex items-center space-x-2">
              <div className="flex-grow relative">
                <input
                  type={showKey ? "text" : "password"}
                  readOnly
                  value={user?.hmac_secret || 'No key generated'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                onClick={() => copyToClipboard(user?.hmac_secret || '')}
                className={`p-4 rounded-2xl flex items-center justify-center transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-slate-900">Allowed Website</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">Request from this domain will automatically bypass CORS.</p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium">
              {user?.website || 'Not configured'}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h3 className="font-bold text-slate-900">Webhook URL</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">We will send payment notifications to this URL.</p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium">
              {user?.webhook_url || 'Not configured'}
            </div>
          </div>
        </div>

        {/* Documentation Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-2xl flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen size={24} />
              <h3 className="text-2xl font-bold">API Documentation</h3>
            </div>
            <p className="text-blue-100 opacity-80">Learn how to integrate our services using Laravel Scramble.</p>
          </div>
          <Link 
            to="/docs/api" 
            className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-lg"
          >
            View Docs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettings;
