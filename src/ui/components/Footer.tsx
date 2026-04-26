import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-white font-bold text-xl mb-4">Fujiwara Creative</p>
        <p className="mb-8">Premium Web Development, HAKI Services & IT Consulting</p>
        <div className="border-t border-slate-800 pt-8">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Fujiwara Creative. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
