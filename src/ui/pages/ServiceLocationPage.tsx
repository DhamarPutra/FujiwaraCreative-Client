import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { locations, services } from '../../data/pseo-data';
import JsonLd from '../components/JsonLd';
import { CheckCircle, ArrowRight, MapPin, Star } from 'lucide-react';

const ServiceLocationPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Parse slug: {service}-in-{location}
  const parts = slug?.split('-in-') || [];
  const serviceSlug = parts[0];
  const locationSlug = parts[1];

  const service = services.find(s => s.slug === serviceSlug);
  const location = locations.find(l => l.slug === locationSlug);

  if (!service || !location) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  const pageTitle = `${service.name} in ${location.name} - Premium Services by Fujiwara Creative`;
  const pageDescription = `Looking for ${service.name} in ${location.name}? Fujiwara Creative provides professional ${service.name} services in ${location.name}, ${location.province}. Get started today!`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "Fujiwara Creative",
      "url": import.meta.env.VITE_URL || "http://localhost:5173"
    },
    "areaServed": {
      "@type": "City",
      "name": location.name
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.name,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service.name
          }
        }
      ]
    }
  };

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      
      <JsonLd data={serviceSchema} />

      {/* Hero Section */}
      <section className="bg-slate-900 py-20 lg:py-32 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 text-blue-400 mb-6 font-bold uppercase tracking-widest text-sm">
              <MapPin className="w-4 h-4" />
              <span>Serving {location.name}, {location.province}</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6">
              Expert <span className="text-blue-500">{service.name}</span> Solutions for Businesses in {location.name}
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              Elevate your digital presence and protect your assets with Fujiwara Creative's premium {service.name.toLowerCase()} services tailored for the {location.name} market.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/store" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
                View Pricing
              </Link>
              <button className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-all border border-slate-700">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose Our {service.name} in {location.name}?</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Fujiwara Creative has a proven track record of delivering high-quality results for clients in {location.name}. Our team of experts understands the local business landscape and provides solutions that drive real growth.
              </p>
              
              <div className="space-y-4">
                {[
                  `Local expertise in ${location.name} market`,
                  'Fast and transparent process',
                  'Competitive pricing for premium quality',
                  'Dedicated support team'
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-lg italic text-slate-700 mb-6">
                "Fujiwara Creative transformed our business in {location.name}. Their {service.name.toLowerCase()} team is world-class and extremely professional. Highly recommended!"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                  JS
                </div>
                <div>
                  <div className="font-bold text-slate-900">John Smith</div>
                  <div className="text-sm text-slate-500">CEO, {location.name} Tech Hub</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">Ready to start your {service.name} project in {location.name}?</h2>
          <Link to="/register" className="inline-flex items-center space-x-3 px-10 py-5 bg-white text-blue-600 rounded-2xl font-extrabold text-xl hover:bg-slate-50 transition-all shadow-2xl">
            <span>Get Started Now</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceLocationPage;
