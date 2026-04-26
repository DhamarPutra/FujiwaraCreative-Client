import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';
import { Globe, LogOut, LogIn, PlusCircle, Key, Book } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../application/store';
import { logout } from '../../application/store/authSlice';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(nextLang);
    Cookies.set('lang', nextLang, { expires: 365 });
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          Fujiwara<span className="text-slate-900">Creative</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/store" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
            {t('nav.store')}
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin/products/add" className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center space-x-1">
              <PlusCircle className="w-4 h-4" />
              <span>Add Service</span>
            </Link>
          )}
          {user?.role === 'customer' && (
            <>
              <Link to="/developer" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1">
                <Key className="w-4 h-4" />
                <span>Key Access</span>
              </Link>
              <Link to="/docs/api" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center space-x-1">
                <Book className="w-4 h-4" />
                <span>Docs</span>
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-bold uppercase text-slate-700">
              {i18n.language}
            </span>
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4 border-l pl-4 border-slate-200">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900 leading-none">{user?.name}</span>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{user?.role}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-2 text-slate-600 font-bold hover:text-blue-600 transition-colors">
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </Link>
          )}
          
          <Link to="/store" className="btn-primary py-2 px-5 text-sm hidden sm:block">
            Store
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
