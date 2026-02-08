import { Send, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useEffect, useState } from "react";
import { AttachmentButton } from "./AttachmentButton";
import { ImageGenerator } from "./ImageGenerator";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (imageUrls?: string[]) => void;
  isLoading: boolean;
  hasConversation: boolean;
}

const ChatInput = ({ input, setInput, onSend, isLoading, hasConversation }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim() && attachedImages.length === 0) return;
    onSend(attachedImages.length > 0 ? attachedImages : undefined);
    setAttachedImages([]);
  };

  const handleImageAttach = (url: string) => {
    setAttachedImages(prev => [...prev, url]);
  };

  const handleVoiceRecord = (text: string) => {
    setInput(input + (input ? " " : "") + text);
  };

  const handleImageGenerated = (url: string, prompt: string) => {
    setAttachedImages(prev => [...prev, url]);
    if (!input.trim()) {
      setInput(`Generated image: ${prompt}`);
    }
  };

  const removeImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-border bg-background/80 backdrop-blur-lg p-4">
      <div className="max-w-3xl mx-auto">
        {/* Attached Images Preview */}
        {attachedImages.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {attachedImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Attached ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border border-border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="glass-strong rounded-2xl p-2 flex gap-2 items-end">
          <AttachmentButton
            onImageAttach={handleImageAttach}
            onVoiceRecord={handleVoiceRecord}
            disabled={isLoading}
          />
          <ImageGenerator
            onImageGenerated={handleImageGenerated}
            disabled={isLoading}
          />
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask CHANCE OPEN MIND AI anything..."
            className="flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={(!input.trim() && attachedImages.length === 0) || isLoading}
            className="w-11 h-11 rounded-xl gradient-primary text-white border-0 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          CHANCE OPEN MIND AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
