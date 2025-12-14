import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { 
  FileText, Plus, Edit2, Trash2, X, Save, Eye, EyeOff
} from 'lucide-react';

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content_type: '',
    prompt_template: '',
    icon: 'file-text',
    is_active: true
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/admin/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        description: template.description || '',
        content_type: template.content_type,
        prompt_template: template.prompt_template,
        icon: template.icon || 'file-text',
        is_active: template.is_active === 1
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        description: '',
        content_type: '',
        prompt_template: '',
        icon: 'file-text',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTemplate) {
        const response = await api.put(`/admin/templates/${editingTemplate.id}`, formData);
        setTemplates(templates.map(t => t.id === editingTemplate.id ? response.data : t));
        toast.success('Template updated');
      } else {
        const response = await api.post('/admin/templates', formData);
        setTemplates([response.data, ...templates]);
        toast.success('Template created');
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save template');
    }
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    try {
      await api.delete(`/admin/templates/${id}`);
      setTemplates(templates.filter(t => t.id !== id));
      toast.success('Template deleted');
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const toggleActive = async (template) => {
    try {
      const response = await api.put(`/admin/templates/${template.id}`, {
        ...template,
        is_active: template.is_active ? 0 : 1
      });
      setTemplates(templates.map(t => t.id === template.id ? response.data : t));
      toast.success(response.data.is_active ? 'Template activated' : 'Template deactivated');
    } catch (error) {
      toast.error('Failed to update template');
    }
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Templates</h1>
          <p className="text-gray-500 mt-1">{templates.length} templates</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-white rounded-xl p-5 shadow-sm border ${
              template.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleActive(template)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title={template.is_active ? 'Deactivate' : 'Activate'}
                >
                  {template.is_active ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => openModal(template)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">{template.description}</p>
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {template.content_type}
            </span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingTemplate ? 'Edit Template' : 'New Template'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <input
                  type="text"
                  value={formData.content_type}
                  onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., blog, social, email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt Template
                  <span className="text-gray-400 font-normal ml-2">Use {"{{variable}}"} for placeholders</span>
                </label>
                <textarea
                  value={formData.prompt_template}
                  onChange={(e) => setFormData({ ...formData, prompt_template: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={4}
                  placeholder="Write a {{content_type}} about {{topic}}..."
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplates;
