import { Sparkles, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import fishLogo from "@/assets/fish-logo.png";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image_urls?: string[];
};

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages = ({ messages, isLoading, messagesEndRef }: ChatMessagesProps) => {
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 shadow-glow animate-float overflow-hidden">
            <img src={fishLogo} alt="CHANCE OPEN MIND AI" className="w-16 h-16 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Hello! I'm <span className="text-gradient">CHANCE OPEN MIND AI</span>
          </h2>
          <p className="text-muted-foreground">
            Ask me anything! I'm here to help you with questions, ideas, writing, coding, and more. I can also generate images for you!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 animate-fade-in",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src={fishLogo} alt="AI" className="w-6 h-6 object-contain" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "gradient-primary text-white"
                  : "glass text-foreground"
              )}
            >
              {/* Display attached images */}
              {message.image_urls && message.image_urls.length > 0 && (
                <div className="flex gap-2 mb-2 flex-wrap">
                  {message.image_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Attachment ${index + 1}`}
                      className="max-w-full max-h-64 rounded-lg"
                    />
                  ))}
                </div>
              )}
              
              {message.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({ children }) => (
                        <code className="bg-background/50 px-1.5 py-0.5 rounded text-sm">
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-background/50 p-3 rounded-lg overflow-x-auto text-sm my-2">
                          {children}
                        </pre>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-accent">{children}</strong>
                      ),
                      img: ({ src, alt }) => (
                        <img src={src} alt={alt} className="max-w-full rounded-lg my-2" />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-4 justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={fishLogo} alt="AI" className="w-6 h-6 object-contain" />
            </div>
            <div className="glass rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
