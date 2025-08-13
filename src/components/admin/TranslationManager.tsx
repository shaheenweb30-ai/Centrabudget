import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDynamicTranslations } from '@/hooks/useDynamicTranslations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Globe, Save, RefreshCw } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

const sections = [
  { id: 'hero', name: 'Hero Section' },
  { id: 'empower', name: 'Empower Section' },
  { id: 'track-expenses', name: 'Track Expenses' },
  { id: 'send-money', name: 'Send Money' },
  { id: 'achieve-excellence', name: 'Achieve Excellence' },
  { id: 'integrations', name: 'Integrations' },
  { id: 'final-cta', name: 'Final CTA' },
];

export const TranslationManager = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [selectedSection, setSelectedSection] = useState('hero');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_color: '#500CB0',
    button_text_color: '#FFFFFF',
    title_color: '#1F2937',
    subtitle_color: '#666666',
    description_color: '#666666',
    image_url: '',
  });

  const {
    translations,
    isLoading,
    getTranslationBySection,
    updateTranslation,
    currentLanguage,
    updateTranslationMutation
  } = useDynamicTranslations();

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
    loadSectionData();
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    loadSectionData();
  };

  const loadSectionData = () => {
    const translation = getTranslationBySection(selectedSection);
    if (translation) {
      setFormData({
        title: translation.title || '',
        subtitle: translation.subtitle || '',
        description: translation.description || '',
        button_text: translation.button_text || '',
        button_color: translation.button_color || '#500CB0',
        button_text_color: translation.button_text_color || '#FFFFFF',
        title_color: translation.title_color || '#1F2937',
        subtitle_color: translation.subtitle_color || '#666666',
        description_color: translation.description_color || '#666666',
        image_url: translation.image_url || '',
      });
    } else {
      // Load fallback content
      setFormData({
        title: t(`home.${selectedSection}.title`),
        subtitle: t(`home.${selectedSection}.subtitle`),
        description: t(`home.${selectedSection}.description`),
        button_text: t(`home.${selectedSection}.cta`),
        button_color: '#500CB0',
        button_text_color: '#FFFFFF',
        title_color: '#1F2937',
        subtitle_color: '#666666',
        description_color: '#666666',
        image_url: '',
      });
    }
  };

  const handleSave = async () => {
    try {
      await updateTranslation(selectedSection, formData);
      toast({
        title: t('common.success'),
        description: 'Translation saved successfully',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to save translation',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    loadSectionData();
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Translation Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Language</Label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Section</Label>
              <Select value={selectedSection} onValueChange={handleSectionChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="content" className="w-full">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="styling" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title Color</Label>
                  <Input
                    type="color"
                    value={formData.title_color}
                    onChange={(e) => setFormData({ ...formData, title_color: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Subtitle Color</Label>
                  <Input
                    type="color"
                    value={formData.subtitle_color}
                    onChange={(e) => setFormData({ ...formData, subtitle_color: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Description Color</Label>
                  <Input
                    type="color"
                    value={formData.description_color}
                    onChange={(e) => setFormData({ ...formData, description_color: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Button Color</Label>
                  <Input
                    type="color"
                    value={formData.button_color}
                    onChange={(e) => setFormData({ ...formData, button_color: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Button Text Color</Label>
                  <Input
                    type="color"
                    value={formData.button_text_color}
                    onChange={(e) => setFormData({ ...formData, button_text_color: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Translation
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} disabled={updateTranslationMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {updateTranslationMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 