import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Sparkles, FileText, History, TrendingUp, ArrowRight, 
  Zap, Star, Clock
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [recentGenerations, setRecentGenerations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [templatesRes, historyRes] = await Promise.all([
        api.get('/templates'),
        api.get('/content/history?limit=5')
      ]);
      setTemplates(templatesRes.data.slice(0, 4));
      setRecentGenerations(historyRes.data.generations);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Credits Available', value: user?.credits || 0, icon: Zap, color: 'bg-indigo-500' },
    { label: 'Templates', value: templates.length, icon: FileText, color: 'bg-purple-500' },
    { label: 'Generations', value: recentGenerations.length, icon: TrendingUp, color: 'bg-pink-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Ready to create some amazing content?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Start Creating Content</h2>
            <p className="text-indigo-100">Use AI to generate blog posts, social media content, emails, and more.</p>
          </div>
          <Link
            to="/app/generate"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Generate Now
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Templates */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Popular Templates</h2>
            <Link to="/app/templates" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {templates.map((template) => (
              <Link
                key={template.id}
                to={`/app/generate/${template.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{template.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Generations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Generations</h2>
            <Link to="/app/history" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          {recentGenerations.length > 0 ? (
            <div className="space-y-3">
              {recentGenerations.map((gen) => (
                <div
                  key={gen.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {gen.is_favorite ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <History className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 capitalize">{gen.content_type}</p>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{gen.prompt}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {new Date(gen.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No generations yet</p>
              <Link to="/app/generate" className="text-sm text-indigo-600 hover:underline mt-2 inline-block">
                Create your first content
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
