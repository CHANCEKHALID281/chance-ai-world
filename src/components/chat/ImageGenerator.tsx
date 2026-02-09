import { useState, useRef } from "react";
import { Wand2, Loader2, X, Upload, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface ImageGeneratorProps {
  onImageGenerated: (url: string, prompt: string) => void;
  disabled?: boolean;
}

export function ImageGenerator({ onImageGenerated, disabled }: ImageGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    const mode = activeTab === "edit" ? "edit" : "generate";
    if (mode === "edit" && !editImage) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please upload an image to edit",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          prompt,
          mode,
          imageUrl: mode === "edit" ? editImage : undefined,
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await resp.json();
      setGeneratedImage(data.imageUrl);
      toast({ 
        title: mode === "edit" ? "Image edited successfully!" : "Image generated successfully!" 
      });
    } catch (error: any) {
      console.error("Image generation error:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || "Failed to generate image",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage, prompt);
      setOpen(false);
      setPrompt("");
      setGeneratedImage(null);
      setEditImage(null);
    }
  };

  const resetState = () => {
    setGeneratedImage(null);
    setEditImage(null);
    setPrompt("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetState(); }}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground"
          title="Generate or Edit AI image"
        >
          <Wand2 className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">AI Image Studio</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              Edit Image
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Describe the image you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generateImage()}
                disabled={isGenerating}
                className="text-base"
              />
              <Button onClick={generateImage} disabled={isGenerating || !prompt.trim()}>
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            {!editImage ? (
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-base font-medium">Upload an image to edit</p>
                <p className="text-sm text-muted-foreground mt-1">Click to browse or drag and drop</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img src={editImage} alt="To edit" className="w-full h-auto max-h-48 object-contain" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => setEditImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Describe how to edit this image..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && generateImage()}
                    disabled={isGenerating}
                    className="text-base"
                  />
                  <Button onClick={generateImage} disabled={isGenerating || !prompt.trim()}>
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Edit"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {isGenerating && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-primary" />
              <p className="text-base text-muted-foreground">
                {activeTab === "edit" ? "Editing your image..." : "Creating your image..."}
              </p>
            </div>
          </div>
        )}

        {generatedImage && (
          <div className="space-y-4 mt-4">
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-auto"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setGeneratedImage(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Discard
              </Button>
              <Button 
                className="flex-1 gradient-primary text-white"
                onClick={handleUseImage}
              >
                Use in Chat
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
