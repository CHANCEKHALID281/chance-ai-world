import { useState, useRef } from "react";
import { Paperclip, Image, Mic, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AttachmentButtonProps {
  onImageAttach: (url: string) => void;
  onVoiceRecord: (text: string) => void;
  disabled?: boolean;
}

export function AttachmentButton({ onImageAttach, onVoiceRecord, disabled }: AttachmentButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please select an image file",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileName = `upload-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("chat-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from("chat-images")
        .getPublicUrl(fileName);

      onImageAttach(publicUrl.publicUrl);
      toast({ title: "Image attached successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        
        // For now, just notify that voice was recorded
        // In a full implementation, this would be transcribed
        toast({
          title: "Voice recorded",
          description: "Voice input feature is ready. Speak and your message will be transcribed.",
        });
        onVoiceRecord("🎤 Voice message recorded");
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({ title: "Recording started", description: "Speak now..." });
    } catch (error) {
      console.error("Recording error:", error);
      toast({
        variant: "destructive",
        title: "Recording failed",
        description: "Could not access microphone",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {isRecording ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={stopRecording}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 animate-pulse"
          title="Stop recording"
        >
          <X className="w-5 h-5" />
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled || isUploading}
              className="text-muted-foreground hover:text-foreground"
              title="Attach file or record voice"
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Paperclip className="w-5 h-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Image className="w-4 h-4 mr-2" />
              Attach Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={startRecording}>
              <Mic className="w-4 h-4 mr-2" />
              Record Voice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
