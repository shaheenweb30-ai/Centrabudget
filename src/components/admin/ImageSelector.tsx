import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Image as ImageIcon,
  Search,
  Star,
  Globe,
  Tag,
  Calendar,
  FileText,
  Check
} from "lucide-react";
import { useImages, type Image } from "@/hooks/useImages";
import { useUserRole } from "@/hooks/useUserRole";
import { format } from "date-fns";

interface ImageSelectorProps {
  selectedImageId?: string;
  onImageSelect: (image: Image | null) => void;
  placeholder?: string;
  className?: string;
}

const ImageSelector = ({ 
  selectedImageId, 
  onImageSelect, 
  placeholder = "Select an image...",
  className = ""
}: ImageSelectorProps) => {
  const { userRole } = useUserRole();
  const { images, isLoading, getImageById } = useImages();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Get selected image data
  const selectedImageQuery = getImageById(selectedImageId || '');
  const selectedImage = selectedImageQuery.data;

  // Filter images based on search
  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImageSelect = (image: Image) => {
    onImageSelect(image);
    setIsDialogOpen(false);
  };

  const handleClearSelection = () => {
    onImageSelect(null);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Check if user is admin
  if (userRole !== 'admin') {
    return (
      <div className={`p-4 border rounded-lg bg-muted ${className}`}>
        <p className="text-sm text-muted-foreground">Admin access required to select images</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Current Selection Display */}
      <div className="space-y-2">
        <Label>Selected Image</Label>
        {selectedImage ? (
          <div className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/50">
            <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
              <img
                src={selectedImage.file_url}
                alt={selectedImage.alt_text || selectedImage.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{selectedImage.name}</p>
              {selectedImage.description && (
                <p className="text-xs text-muted-foreground truncate">{selectedImage.description}</p>
              )}
              <div className="flex items-center space-x-2 mt-1">
                {selectedImage.is_featured && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {selectedImage.width && selectedImage.height && (
                  <span className="text-xs text-muted-foreground">
                    {selectedImage.width}×{selectedImage.height}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
            >
              Clear
            </Button>
          </div>
        ) : (
          <div className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{placeholder}</p>
          </div>
        )}
      </div>

      {/* Image Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mt-2">
            <ImageIcon className="w-4 h-4 mr-2" />
            {selectedImage ? 'Change Image' : 'Select Image'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search images by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-muted rounded-lg mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ))
              ) : filteredImages.length > 0 ? (
                filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className={`group cursor-pointer rounded-lg border-2 transition-all hover:border-primary ${
                      selectedImageId === image.id ? 'border-primary bg-primary/5' : 'border-muted'
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
                      <img
                        src={image.file_url}
                        alt={image.alt_text || image.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {selectedImageId === image.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="w-8 h-8 text-primary-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        {image.is_featured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="w-3 h-3" />
                          </Badge>
                        )}
                        {image.is_public ? (
                          <Badge variant="outline" className="text-xs">
                            <Globe className="w-3 h-3" />
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Private
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-3 space-y-2">
                      <div>
                        <p className="font-medium text-sm truncate">{image.name}</p>
                        {image.description && (
                          <p className="text-xs text-muted-foreground truncate">{image.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>{formatFileSize(image.file_size)}</span>
                        </div>
                        {image.width && image.height && (
                          <div className="flex items-center space-x-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>{image.width}×{image.height}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {image.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{image.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(image.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No images found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search terms' : 'Upload some images first'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageSelector;
