import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, FileText, Mail, Share2, ShoppingBag, Video,
  Check, ArrowRight, Zap, Shield, Clock, Users
} from 'lucide-react';

const Landing = () => {
  const features = [
    { icon: FileText, title: 'Blog Posts', desc: 'Generate engaging blog articles in seconds' },
    { icon: Share2, title: 'Social Media', desc: 'Create viral posts for any platform' },
    { icon: Mail, title: 'Email Copy', desc: 'Write converting email campaigns' },
    { icon: ShoppingBag, title: 'Product Descriptions', desc: 'Compelling copy that sells' },
    { icon: Video, title: 'Video Scripts', desc: 'YouTube scripts that engage' },
    { icon: Sparkles, title: 'Custom Content', desc: 'Generate anything you need' },
  ];

  const benefits = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Generate content in seconds, not hours' },
    { icon: Shield, title: 'High Quality', desc: 'Powered by advanced GPT AI technology' },
    { icon: Clock, title: 'Save Time', desc: 'Focus on what matters, let AI write' },
    { icon: Users, title: 'For Everyone', desc: 'Easy to use, no technical skills needed' },
  ];

  const pricing = [
    { name: 'Starter', credits: 100, price: 'Free', features: ['100 generations', 'All templates', 'History access', 'Copy & download'] },
    { name: 'Pro', credits: 500, price: '$19', features: ['500 generations', 'All templates', 'Priority support', 'API access'], popular: true },
    { name: 'Business', credits: 2000, price: '$49', features: ['2000 generations', 'All templates', 'Priority support', 'API access', 'Team features'] },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">AI Content Generator</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Create Amazing Content<br />with AI in Seconds
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Generate blog posts, social media content, emails, and more using advanced AI technology. Save hours of writing time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
              View Demo
            </Link>
          </div>
          <p className="text-indigo-200 mt-4 text-sm">No credit card required • 100 free generations</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Generate Any Type of Content</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Choose from our pre-built templates or create custom content with your own prompts.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose AI Content Generator?</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-indigo-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">Start free, upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-indigo-600 shadow-lg' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mt-4">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== 'Free' && <span className="text-gray-500">/month</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-5 h-5 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.popular 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Amazing Content?</h2>
          <p className="text-indigo-100 mb-8">Join thousands of content creators using AI to save time and create better content.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">AI Content Generator</span>
            </div>
            <p className="text-gray-400 text-sm">© 2024 AI Content Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
