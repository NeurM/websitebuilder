import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-amber-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to BizBoost
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose your template to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Retail Template Card */}
          <Link to="/retail" className="block">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105">
              <div className="h-48 bg-purple-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">RetailReady</span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Retail Template</h2>
                <p className="text-gray-600">
                  Perfect for retail businesses looking to showcase their products and services.
                </p>
              </div>
            </div>
          </Link>

          {/* Expert Template Card */}
          <Link to="/expert" className="block">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105">
              <div className="h-48 bg-amber-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">LocalExpert</span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Expert Template</h2>
                <p className="text-gray-600">
                  Ideal for professionals and experts to showcase their services and expertise.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 