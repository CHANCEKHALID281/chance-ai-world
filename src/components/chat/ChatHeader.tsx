import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchMessages } from "./SearchMessages";
import { ProjectsSidebar } from "./ProjectsSidebar";
import fishLogo from "@/assets/fish-logo.png";

interface ChatHeaderProps {
  onClearChat: () => void;
  onSearch?: (query: string) => void;
  projects?: any[];
  conversations?: any[];
  currentConversationId?: string;
  onCreateProject?: (name: string) => Promise<any>;
  onSelectConversation?: (conversation: any) => void;
  onDeleteConversation?: (id: string) => void;
  onNewChat?: () => void;
}

const ChatHeader = ({ 
  onClearChat, 
  onSearch,
  projects = [],
  conversations = [],
  currentConversationId,
  onCreateProject,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
}: ChatHeaderProps) => {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        {onCreateProject && onSelectConversation && onDeleteConversation && onNewChat && (
          <ProjectsSidebar
            projects={projects}
            conversations={conversations}
            currentConversationId={currentConversationId}
            onCreateProject={onCreateProject}
            onSelectConversation={onSelectConversation}
            onDeleteConversation={onDeleteConversation}
            onNewChat={onNewChat}
          />
        )}
        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center overflow-hidden shadow-md border border-border">
          <img src={fishLogo} alt="CHANCE OPEN MIND AI" className="w-8 h-8 object-contain" />
        </div>
        <span className="font-bold text-foreground tracking-wide text-xl hidden sm:block">CHANCE OPEN MIND AI</span>
      </div>
      
      <div className="flex items-center gap-2">
        {onSearch && <SearchMessages onSearch={onSearch} />}
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearChat}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          title="New chat"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
