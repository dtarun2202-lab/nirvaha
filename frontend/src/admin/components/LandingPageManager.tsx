import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import BACKEND_CONFIG from '@/config/backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowUp, ArrowDown, Save, Eye, EyeOff, GripVertical } from 'lucide-react';

const API_URL = BACKEND_CONFIG.API_BASE_URL;

export interface LandingSection {
  id: string;
  name: string;
  visible: boolean;
}

const DEFAULT_SECTIONS: LandingSection[] = [
  { id: 'CommunityHero', name: 'Main Hero Section', visible: true },
  { id: 'TrustedStats', name: 'Trusted Stats Banner', visible: true },
  { id: 'GoldenShowcase', name: 'Golden Showcase (Paths)', visible: true },
  { id: 'WhatIsNirvaha', name: 'What Is Nirvaha', visible: true },
  { id: 'LibraryCarousel', name: 'Wisdom Library Carousel', visible: true },
  { id: 'AncientWisdomSection', name: 'Ancient Wisdom Journey', visible: true },
  { id: 'LeadershipHeroSection', name: 'Leadership & Guide', visible: true },
  { id: 'DifferentPathsSection', name: 'Different Paths', visible: true },
  { id: 'CertificationCoursesSection', name: 'Certification Courses', visible: true },
  { id: 'CollaboratorsSection', name: 'Collaborators / Partners', visible: true },
  { id: 'Contact', name: 'Contact Form', visible: true },
  { id: 'ClosingSection', name: 'Footer / Closing', visible: true }
];

export const LandingPageManager: React.FC = () => {
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/content/landing_page_config`);
      if (response.data && response.data.value && Array.isArray(response.data.value)) {
        setSections(response.data.value);
      } else {
        setSections(DEFAULT_SECTIONS); // Fallback to default if somehow empty
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // Doesn't exist yet, seed it with defaults
        setSections(DEFAULT_SECTIONS);
      } else {
        console.error('Error fetching landing page config:', error);
        toast.error('Failed to load landing page configuration');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${API_URL}/api/content/landing_page_config`, {
        value: sections,
        type: 'json',
        section: 'landing_page',
        description: 'Master configuration for landing page section order and visibility'
      });
      toast.success('Landing page configuration saved! Changes are live.');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = (id: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === id ? { ...section, visible: !section.visible } : section
      )
    );
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    setSections(newSections);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-gray-500 animate-pulse">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Landing Page Layout</h2>
          <p className="text-sm text-gray-500 mt-1">
            Toggle visibility and drag to reorder the sections shown on the public landing page.
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#1a5d47] hover:bg-[#144937] text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Sections</CardTitle>
          <CardDescription>Top-to-bottom order represents the flow of the actual webpage.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div 
                key={section.id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  section.visible 
                    ? 'bg-white border-gray-200 shadow-sm' 
                    : 'bg-gray-50 border-gray-200 opacity-75'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Order controls */}
                  <div className="flex flex-col gap-1 text-gray-400">
                    <button 
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="hover:text-[#1a5d47] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                      className="hover:text-[#1a5d47] disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <GripVertical className="w-5 h-5 text-gray-300 ml-2" />

                  <div className="ml-2">
                    <h3 className={`font-semibold text-base ${section.visible ? 'text-gray-900' : 'text-gray-500 line-through'}`}>
                      {section.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{section.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pr-4">
                  <div className="flex items-center gap-2">
                    {section.visible ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <Label htmlFor={`visible-${section.id}`} className="text-sm font-medium cursor-pointer w-16">
                      {section.visible ? 'Visible' : 'Hidden'}
                    </Label>
                  </div>
                  <Switch 
                    id={`visible-${section.id}`}
                    checked={section.visible} 
                    onCheckedChange={() => toggleVisibility(section.id)}
                    className="data-[state=checked]:bg-[#1a5d47]"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
