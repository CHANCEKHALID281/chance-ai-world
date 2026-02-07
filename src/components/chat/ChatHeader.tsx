import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import FishLogo from "@/components/ui/FishLogo";

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
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <FishLogo size="sm" className="text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground tracking-wide">NEEMO IB AI</span>
      </div>
    </header>
  );
};

export default ChatHeader;
