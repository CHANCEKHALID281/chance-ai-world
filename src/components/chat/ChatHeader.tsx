import { Trash2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchMessages } from "./SearchMessages";
import { ProjectsSidebar } from "./ProjectsSidebar";
import { useAuth } from "@/hooks/useAuth";
import fishLogo from "@/assets/fish-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  const { user, signOut } = useAuth();

  const getUserInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email || "";
    if (name.includes("@")) {
      return name.charAt(0).toUpperCase();
    }
    return name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  };

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
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 gradient-accent">
                <AvatarFallback className="bg-transparent text-white font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">
                {user?.user_metadata?.full_name || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={signOut}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ChatHeader;
