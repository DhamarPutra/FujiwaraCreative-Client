import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, ShieldCheck, Cpu } from 'lucide-react';
import JsonLd from '../components/JsonLd';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const siteUrl = import.meta.env.VITE_URL || 'http://localhost:5173';

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fujiwara Creative",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Fujiwara Creative provides expert web development, HAKI certification, and IT consulting services.",
    "sameAs": [
      "https://www.facebook.com/fujiwaracreative",
      "https://www.instagram.com/fujiwaracreative",
      "https://www.linkedin.com/company/fujiwaracreative"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fujiwara Creative",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/store?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Fujiwara Creative - Premium Web & HAKI Services</title>
        <meta name="description" content="Fujiwara Creative provides expert web development, HAKI certification, and IT consulting services." />
      </Helmet>

      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/store" className="btn-primary flex items-center space-x-2">
                <span>{t('hero.cta')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#about" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 transition-all">
                Learn More
              </a>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="w-[800px] h-[800px] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Core Expertise</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We bridge the gap between innovation and legal protection for your digital assets.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Code className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Web Development</h3>
              <p className="text-slate-600">Custom, high-performance web applications built with the latest technologies to scale your business.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">HAKI Certification</h3>
              <p className="text-slate-600">Protect your intellectual property. We help you secure copyright and trademarks for your creations.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">IT Consulting</h3>
              <p className="text-slate-600">Strategic guidance on digital transformation, infrastructure, and software architecture optimization.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
