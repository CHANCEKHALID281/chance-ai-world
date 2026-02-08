import { useState } from "react";
import { FolderOpen, Plus, MessageSquare, Share2, Trash2, X, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string | null;
  is_template: boolean;
  share_id: string | null;
}

interface Conversation {
  id: string;
  title: string | null;
  project_id: string | null;
}

interface ProjectsSidebarProps {
  projects: Project[];
  conversations: Conversation[];
  currentConversationId?: string;
  onCreateProject: (name: string, description?: string) => Promise<any>;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
}

export function ProjectsSidebar({
  projects,
  conversations,
  currentConversationId,
  onCreateProject,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
}: ProjectsSidebarProps) {
  const [open, setOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    setIsCreating(true);
    try {
      await onCreateProject(newProjectName.trim());
      setNewProjectName("");
      toast({ title: "Project created!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to create project" });
    }
    setIsCreating(false);
  };

  const handleShare = (shareId: string | null) => {
    if (shareId) {
      const url = `${window.location.origin}/share/${shareId}`;
      navigator.clipboard.writeText(url);
      toast({ title: "Share link copied!" });
    }
  };

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const unorganizedConversations = conversations.filter(c => !c.project_id);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          title="Projects & Chats"
        >
          <FolderOpen className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle>Projects & Chats</SheetTitle>
        </SheetHeader>
        
        <div className="p-4 border-b border-border">
          <Button onClick={onNewChat} className="w-full mb-3">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          
          <div className="flex gap-2">
            <Input
              placeholder="New project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
            />
            <Button 
              size="icon" 
              onClick={handleCreateProject}
              disabled={isCreating || !newProjectName.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
          <div className="p-2">
            {/* Projects */}
            {projects.map(project => (
              <div key={project.id} className="mb-2">
                <button
                  onClick={() => toggleProject(project.id)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-accent text-left"
                >
                  {expandedProjects.has(project.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <FolderOpen className="w-4 h-4 text-primary" />
                  <span className="flex-1 truncate text-sm font-medium">{project.name}</span>
                  {project.share_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(project.share_id);
                      }}
                    >
                      <Share2 className="w-3 h-3" />
                    </Button>
                  )}
                </button>
                
                {expandedProjects.has(project.id) && (
                  <div className="ml-6 space-y-1">
                    {conversations
                      .filter(c => c.project_id === project.id)
                      .map(conv => (
                        <ConversationItem
                          key={conv.id}
                          conversation={conv}
                          isActive={conv.id === currentConversationId}
                          onSelect={() => {
                            onSelectConversation(conv);
                            setOpen(false);
                          }}
                          onDelete={() => onDeleteConversation(conv.id)}
                        />
                      ))}
                  </div>
                )}
              </div>
            ))}

            {/* Unorganized Chats */}
            {unorganizedConversations.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground px-2 mb-2">Recent Chats</p>
                <div className="space-y-1">
                  {unorganizedConversations.map(conv => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={conv.id === currentConversationId}
                      onSelect={() => {
                        onSelectConversation(conv);
                        setOpen(false);
                      }}
                      onDelete={() => onDeleteConversation(conv.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
}: {
  conversation: { id: string; title: string | null };
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 p-2 rounded-lg cursor-pointer",
        isActive ? "bg-primary/10 text-primary" : "hover:bg-accent"
      )}
      onClick={onSelect}
    >
      <MessageSquare className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 truncate text-sm">{conversation.title || "New Chat"}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="w-3 h-3 text-destructive" />
      </Button>
    </div>
  );
}
