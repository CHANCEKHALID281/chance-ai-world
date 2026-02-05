import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const ChatHeader = ({ sidebarOpen, onToggleSidebar }: ChatHeaderProps) => {
  return (
    <header className="h-14 border-b border-border flex items-center px-4 bg-background/80 backdrop-blur-lg">
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-2"
        >
          <Menu className="w-5 h-5" />
        </Button>
      )}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg gradient-hero flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-semibold text-gradient">Chance AI</span>
      </div>
    </header>
  );
};

export default ChatHeader;
