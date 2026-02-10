import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import ChatHeader from "@/components/chat/ChatHeader";
import { useConversation, type Message } from "@/hooks/useConversation";

const Chat = () => {
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    setMessages,
    projects,
    addMessage,
    updateMessage,
    searchMessages,
    createProject,
    deleteConversation,
    clearChat,
    createConversation,
  } = useConversation();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (imageUrls?: string[]) => {
    if (!input.trim() && (!imageUrls || imageUrls.length === 0)) return;
    if (isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      image_urls: imageUrls,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await addMessage({
      role: "user",
      content: input,
      image_urls: imageUrls,
    });

    let assistantContent = "";
    const assistantId = crypto.randomUUID();

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Add thinking placeholder
      setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "", isThinking: true }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev =>
                prev.map(m => (m.id === assistantId ? { ...m, content: assistantContent, isThinking: false } : m))
              );
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (assistantContent) {
        await addMessage({
          role: "assistant",
          content: assistantContent,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to get response from CHANCE OPEN MIND AI",
      });
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    const results = await searchMessages(query);
    if (results && results.length > 0) {
      toast({
        title: `Found ${results.length} message(s)`,
        description: "Showing search results",
      });
    }
  };

  const handleNewChat = () => {
    clearChat();
  };

  const handleSelectConversation = (conv: any) => {
    setCurrentConversation(conv);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <ChatHeader
        onClearChat={handleNewChat}
        onSearch={handleSearch}
        projects={projects}
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        onCreateProject={createProject}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={deleteConversation}
        onNewChat={handleNewChat}
      />

      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        isLoading={isLoading}
        hasConversation={messages.length > 0}
      />
    </div>
  );
};

export default Chat;
