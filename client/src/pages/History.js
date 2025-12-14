import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  History as HistoryIcon, Star, Trash2, Copy, Check, 
  ChevronLeft, ChevronRight, Filter, Clock, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const History = () => {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filter, setFilter] = useState('all');
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [pagination.page, filter]);

  const fetchHistory = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 10
      });
      if (filter === 'favorites') {
        params.append('favorite', 'true');
      }
      
      const response = await api.get(`/content/history?${params}`);
      setGenerations(response.data.generations);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const response = await api.patch(`/content/${id}/favorite`);
      setGenerations(generations.map(g => 
        g.id === id ? { ...g, is_favorite: response.data.is_favorite ? 1 : 0 } : g
      ));
      if (selectedGeneration?.id === id) {
        setSelectedGeneration({ ...selectedGeneration, is_favorite: response.data.is_favorite ? 1 : 0 });
      }
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const deleteGeneration = async (id) => {
    if (!window.confirm('Are you sure you want to delete this generation?')) return;
    
    try {
      await api.delete(`/content/${id}`);
      setGenerations(generations.filter(g => g.id !== id));
      if (selectedGeneration?.id === id) {
        setSelectedGeneration(null);
      }
      toast.success('Generation deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="text-gray-500 mt-1">View your past generations</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPagination({ ...pagination, page: 1 });
            }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Generations</option>
            <option value="favorites">Favorites Only</option>
          </select>
        </div>
      </div>

      {generations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No generations yet</h3>
          <p className="text-gray-500">Your generated content will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-3">
            {generations.map((gen) => (
              <div
                key={gen.id}
                onClick={() => setSelectedGeneration(gen)}
                className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition-all ${
                  selectedGeneration?.id === gen.id 
                    ? 'border-indigo-300 ring-2 ring-indigo-100' 
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full capitalize">
                        {gen.content_type}
                      </span>
                      {gen.template_name && (
                        <span className="text-xs text-gray-400">{gen.template_name}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{gen.prompt}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {new Date(gen.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(gen.id); }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Star className={`w-4 h-4 ${gen.is_favorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteGeneration(gen.id); }}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Detail View */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-6">
            {selectedGeneration ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full capitalize">
                    {selectedGeneration.content_type}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(selectedGeneration.generated_content)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-gray-500" />}
                    </button>
                    <button
                      onClick={() => setSelectedGeneration(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Prompt</p>
                  <p className="text-sm text-gray-700">{selectedGeneration.prompt}</p>
                </div>

                <div className="prose prose-sm max-w-none max-h-[500px] overflow-auto">
                  <ReactMarkdown>{selectedGeneration.generated_content}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <HistoryIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select a generation to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
