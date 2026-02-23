import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit2, Save, X, Plus, Upload } from 'lucide-react';

const API_URL = 'http://localhost:5000';

interface ContentItem {
  _id: string;
  key: string;
  type: string;
  value: string;
  section: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const ContentEditor: React.FC = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState({
    key: '',
    value: '',
    type: 'text',
    section: 'general',
    description: ''
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/content-admin/all`);
      setContents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('Failed to fetch content');
      setLoading(false);
    }
  };

  const handleEdit = (content: ContentItem) => {
    setEditingKey(content.key);
    setEditValue(content.value);
  };

  const handleSave = async (key: string) => {
    try {
      const content = contents.find(c => c.key === key);
      if (!content) return;

      await axios.put(`${API_URL}/api/content/${key}`, {
        value: editValue,
        type: content.type,
        section: content.section,
        description: content.description
      });

      setEditingKey(null);
      fetchContents();
      toast.success('Content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  const handleImageUpload = async (key: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', key);
      const content = contents.find(c => c.key === key);
      formData.append('section', content?.section || 'general');

      await axios.post(`${API_URL}/api/content/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      fetchContents();
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/content/${newContent.key}`, newContent);

      setShowAddForm(false);
      setNewContent({
        key: '',
        value: '',
        type: 'text',
        section: 'general',
        description: ''
      });
      fetchContents();
      toast.success('Content added successfully');
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('Failed to add content');
    }
  };

  const handleDelete = async (key: string) => {
    if (!window.confirm('Are you sure you want to delete this content?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/content/${key}`);
      fetchContents();
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const filteredContents = contents
    .filter(c => filter === 'all' || c.section === filter)
    .filter(c =>
      c.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.section.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sections = [...new Set(contents.map(c => c.section))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage all dynamic content across your application</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Content
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map(section => (
                  <SelectItem key={section} value={section}>{section}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredContents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No content found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContents.map(content => (
                <Card key={content._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{content.key}</CardTitle>
                        <CardDescription>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">
                            {content.section}
                          </span>
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {content.type}
                          </span>
                          {content.description && (
                            <p className="mt-2 text-sm">{content.description}</p>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {editingKey !== content.key && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(content)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(content.key)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingKey === content.key ? (
                      <div className="space-y-4">
                        {content.type === 'html' ? (
                          <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={4}
                            className="font-mono text-sm"
                          />
                        ) : (
                          <Input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                          />
                        )}
                        <div className="flex gap-2">
                          <Button onClick={() => handleSave(content.key)}>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button variant="outline" onClick={() => setEditingKey(null)}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {content.type === 'image' ? (
                          <div className="space-y-4">
                            <img
                              src={`${API_URL}${content.value}`}
                              alt={content.key}
                              className="max-w-sm rounded-lg border"
                            />
                            <div>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files?.[0]) {
                                    handleImageUpload(content.key, e.target.files[0]);
                                  }
                                }}
                                className="max-w-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-muted rounded-lg">
                            <code className="text-sm">{content.value}</code>
                          </div>
                        )}
                        <div className="mt-2 text-xs text-muted-foreground">
                          Last updated: {new Date(content.updatedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Content Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Content</CardTitle>
              <CardDescription>Create a new content entry</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddContent} className="space-y-4">
                <div>
                  <Label htmlFor="key">Key *</Label>
                  <Input
                    id="key"
                    type="text"
                    value={newContent.key}
                    onChange={(e) => setNewContent({ ...newContent, key: e.target.value })}
                    placeholder="e.g., homepage.hero.title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select
                    value={newContent.type}
                    onValueChange={(value) => setNewContent({ ...newContent, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="section">Section *</Label>
                  <Input
                    id="section"
                    type="text"
                    value={newContent.section}
                    onChange={(e) => setNewContent({ ...newContent, section: e.target.value })}
                    placeholder="e.g., homepage, about"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="value">Value *</Label>
                  {newContent.type === 'html' ? (
                    <Textarea
                      id="value"
                      value={newContent.value}
                      onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
                      rows={4}
                      required
                    />
                  ) : (
                    <Input
                      id="value"
                      type="text"
                      value={newContent.value}
                      onChange={(e) => setNewContent({ ...newContent, value: e.target.value })}
                      required
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    type="text"
                    value={newContent.description}
                    onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="submit">Add Content</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
