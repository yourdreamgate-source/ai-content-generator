import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  FileText, Mail, Share2, ShoppingBag, Megaphone, Search, 
  Video, Newspaper, ArrowRight, Sparkles
} from 'lucide-react';

const iconMap = {
  'file-text': FileText,
  'mail': Mail,
  'share-2': Share2,
  'shopping-bag': ShoppingBag,
  'megaphone': Megaphone,
  'search': Search,
  'video': Video,
  'newspaper': Newspaper,
};

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIcon = (iconName) => {
    const Icon = iconMap[iconName] || FileText;
    return Icon;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <p className="text-gray-500 mt-1">Choose a template to get started quickly</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Custom Generation Card */}
      <Link
        to="/app/generate"
        className="block bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Custom Generation</h3>
            <p className="text-indigo-100">Write your own prompt and generate any type of content</p>
          </div>
          <ArrowRight className="w-6 h-6" />
        </div>
      </Link>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const Icon = getIcon(template.icon);
          return (
            <Link
              key={template.id}
              to={`/app/generate/${template.id}`}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
              <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium">
                Use template
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No templates found</p>
        </div>
      )}
    </div>
  );
};

export default Templates;
