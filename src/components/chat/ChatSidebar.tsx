import { Plus, MessageSquare, Trash2, LogOut, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FishLogo from "@/components/ui/FishLogo";

type Conversation = {
  id: string;
  title: string;
  created_at: string;
};

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  userName: string;
  onSignOut: () => void;
}

const ChatSidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isOpen,
  onToggle,
  userName,
  onSignOut,
}: ChatSidebarProps) => {
  return (
    <div
      className={cn(
        "h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isOpen ? "w-72" : "w-0 overflow-hidden"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <FishLogo size="sm" className="text-primary-foreground" />
            </div>
            <span className="font-bold text-sidebar-foreground tracking-wide">NEEMO IB AI</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <Button
          onClick={onNewChat}
          className="w-full bg-primary text-primary-foreground border-0 hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No conversations yet
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                "group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all",
                currentConversationId === conv.id
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              )}
              onClick={() => onSelectConversation(conv.id)}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 truncate text-sm">{conv.title}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-foreground text-sm font-medium flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-sidebar-foreground truncate">{userName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSignOut}
            className="text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
