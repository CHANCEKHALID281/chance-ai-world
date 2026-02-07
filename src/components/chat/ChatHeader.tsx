import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import fishLogo from "@/assets/fish-logo.png";

interface ChatHeaderProps {
  onClearChat: () => void;
}

const ChatHeader = ({ onClearChat }: ChatHeaderProps) => {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
          <img src={fishLogo} alt="NEEMO IB AI" className="w-8 h-8 object-contain" />
        </div>
        <span className="font-bold text-foreground tracking-wide text-lg">NEEMO IB AI</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClearChat}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        title="Clear chat"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </header>
  );
};

export default ChatHeader;
