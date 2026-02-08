import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_urls?: string[];
  created_at?: string;
};

export type Conversation = {
  id: string;
  title: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  is_template: boolean;
  share_id: string | null;
  created_at: string;
  updated_at: string;
};

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
    loadProjects();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    } else {
      setMessages([]);
    }
  }, [currentConversation?.id]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setConversations(data as Conversation[]);
    }
    setLoading(false);
  };

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setProjects(data as Project[]);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data.map(m => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        image_urls: m.image_urls || [],
        created_at: m.created_at,
      })));
    }
  };

  const createConversation = async (title?: string, projectId?: string) => {
    const { data, error } = await supabase
      .from("chat_conversations")
      .insert({ 
        title: title || "New Chat", 
        project_id: projectId || null 
      })
      .select()
      .single();

    if (!error && data) {
      const newConvo = data as Conversation;
      setConversations(prev => [newConvo, ...prev]);
      setCurrentConversation(newConvo);
      setMessages([]);
      return newConvo;
    }
    return null;
  };

  const addMessage = async (message: Omit<Message, "id" | "created_at">) => {
    let convoId = currentConversation?.id;

    // Create conversation if none exists
    if (!convoId) {
      const newConvo = await createConversation();
      if (!newConvo) return null;
      convoId = newConvo.id;
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: convoId,
        role: message.role,
        content: message.content,
        image_urls: message.image_urls || [],
      })
      .select()
      .single();

    if (!error && data) {
      const newMessage: Message = {
        id: data.id,
        role: data.role as "user" | "assistant",
        content: data.content,
        image_urls: data.image_urls || [],
        created_at: data.created_at,
      };
      setMessages(prev => [...prev, newMessage]);

      // Update conversation title if first user message
      if (message.role === "user" && messages.length === 0) {
        const title = message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "");
        await supabase
          .from("chat_conversations")
          .update({ title })
          .eq("id", convoId);
        
        setConversations(prev => 
          prev.map(c => c.id === convoId ? { ...c, title } : c)
        );
        if (currentConversation) {
          setCurrentConversation({ ...currentConversation, title });
        }
      }

      return newMessage;
    }
    return null;
  };

  const updateMessage = async (id: string, content: string) => {
    await supabase
      .from("chat_messages")
      .update({ content })
      .eq("id", id);

    setMessages(prev => 
      prev.map(m => m.id === id ? { ...m, content } : m)
    );
  };

  const searchMessages = async (query: string) => {
    if (!query.trim()) {
      if (currentConversation) {
        loadMessages(currentConversation.id);
      }
      return;
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .textSearch("content", query)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map(m => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        image_urls: m.image_urls || [],
        created_at: m.created_at,
        conversation_id: m.conversation_id,
      }));
    }
    return [];
  };

  const createProject = async (name: string, description?: string) => {
    const { data, error } = await supabase
      .from("projects")
      .insert({ name, description })
      .select()
      .single();

    if (!error && data) {
      const newProject = data as Project;
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    }
    return null;
  };

  const deleteConversation = async (id: string) => {
    await supabase.from("chat_conversations").delete().eq("id", id);
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
      setMessages([]);
    }
  };

  const clearChat = () => {
    setCurrentConversation(null);
    setMessages([]);
  };

  return {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    setMessages,
    projects,
    loading,
    createConversation,
    addMessage,
    updateMessage,
    searchMessages,
    createProject,
    deleteConversation,
    clearChat,
    loadConversations,
  };
}
