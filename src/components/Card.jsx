import React from 'react'
import { Zap, TrendingUp, Shield } from 'lucide-react';

const Card = () => {

    const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: 'Lightning Fast',
      description: 'Generate short links instantly and share them across all your platforms in seconds.',
      iconBgColor: 'bg-blue-50'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-pink-600" />,
      title: 'Advanced Analytics',
      description: 'Track every click with detailed analytics and insights to optimize your campaigns.',
      iconBgColor: 'bg-pink-50'
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: 'Secure & Reliable',
      description: 'Your links are protected with enterprise-grade security and 99.9% uptime.',
      iconBgColor: 'bg-green-50'
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className={`w-12 h-12 ${feature.iconBgColor} rounded-lg flex items-center justify-center mb-4`}>
            {feature.icon}
          </div>
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}

export default Card