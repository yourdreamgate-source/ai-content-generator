import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Sparkles, Copy, Download, RefreshCw, Star, Check,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Generate = () => {
  const { templateId } = useParams();
  const { user, updateCredits } = useAuth();
  const [template, setTemplate] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [parameters, setParameters] = useState({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const response = await api.get(`/templates/${templateId}`);
      setTemplate(response.data);
      // Extract parameters from template
      const matches = response.data.prompt_template.match(/{{(\w+)}}/g) || [];
      const params = {};
      matches.forEach(match => {
        const key = match.replace(/{{|}}/g, '');
        params[key] = '';
      });
      setParameters(params);
    } catch (error) {
      console.error('Failed to fetch template:', error);
    }
  };

  const handleGenerate = async () => {
    if (user.credits <= 0) {
      toast.error('No credits remaining. Please contact admin.');
      return;
    }

    if (!templateId && !prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (templateId && Object.values(parameters).some(v => !v.trim())) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    setGeneratedContent('');

    try {
      const response = await api.post('/content/generate', {
        templateId: templateId || null,
        prompt: templateId ? Object.values(parameters).join(' - ') : prompt,
        contentType: template?.content_type || 'custom',
        parameters
      });

      setGeneratedContent(response.data.content);
      updateCredits(response.data.creditsRemaining);
      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-content-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {template ? template.name : 'Generate Content'}
        </h1>
        <p className="text-gray-500 mt-1">
          {template ? template.description : 'Create any type of content with AI'}
        </p>
      </div>

      {/* Credits Warning */}
      {user?.credits <= 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            You have {user.credits} credits remaining. Contact admin for more credits.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">Input</h2>
          
          {template ? (
            <div className="space-y-4">
              {Object.keys(parameters).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  {key === 'topic' || key === 'features' || key === 'purpose' ? (
                    <textarea
                      value={parameters[key]}
                      onChange={(e) => setParameters({ ...parameters, [key]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder={`Enter ${key.replace(/_/g, ' ')}...`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={parameters[key]}
                      onChange={(e) => setParameters({ ...parameters, [key]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder={`Enter ${key.replace(/_/g, ' ')}...`}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={8}
              placeholder="Describe what content you want to generate...&#10;&#10;Example: Write a blog post about the benefits of remote work for software developers. Include tips for staying productive and maintaining work-life balance."
            />
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || user?.credits <= 0}
            className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Content (1 credit)
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Generated Content</h2>
            {generatedContent && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
          </div>

          <div className="min-h-[300px] bg-gray-50 rounded-xl p-4 overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="spinner mb-4"></div>
                <p className="text-gray-500">Generating your content...</p>
              </div>
            ) : generatedContent ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{generatedContent}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <Sparkles className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500">Your generated content will appear here</p>
                <p className="text-sm text-gray-400 mt-1">Fill in the form and click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
