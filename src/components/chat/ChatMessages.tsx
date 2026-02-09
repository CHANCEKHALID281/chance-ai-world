import { User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import fishLogo from "@/assets/fish-logo.png";
import CodeBlock from "./CodeBlock";

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
          <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 shadow-glow animate-float overflow-hidden">
            <img src={fishLogo} alt="CHANCE OPEN MIND AI" className="w-20 h-20 object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Hello! I'm <span className="text-gradient">CHANCE OPEN MIND AI</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Ask me anything! I'm here to help you with questions, ideas, writing, coding, and more. I can also generate images for you!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-4 animate-fade-in",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.role === "assistant" && (
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
                <img src={fishLogo} alt="AI" className="w-8 h-8 object-contain" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-5 py-4",
                message.role === "user"
                  ? "gradient-primary text-white"
                  : "glass text-foreground"
              )}
            >
              {/* Display attached images */}
              {message.image_urls && message.image_urls.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {message.image_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Attachment ${index + 1}`}
                      className="max-w-full max-h-72 rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}
              
              {message.role === "assistant" ? (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-3 last:mb-0 text-base leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-base">{children}</li>,
                      h1: ({ children }) => <h1 className="text-2xl font-bold mb-3 mt-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-2">{children}</h3>,
                      code: ({ className, children }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match;
                        const code = String(children).replace(/\n$/, "");
                        
                        if (isInline) {
                          return (
                            <code className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-sm font-mono">
                              {children}
                            </code>
                          );
                        }
                        
                        return <CodeBlock language={match[1]} code={code} />;
                      },
                      pre: ({ children }) => <>{children}</>,
                      strong: ({ children }) => (
                        <strong className="font-bold text-accent">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-primary/90">{children}</em>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 italic my-3 text-muted-foreground">
                          {children}
                        </blockquote>
                      ),
                      img: ({ src, alt }) => (
                        <img src={src} alt={alt} className="max-w-full rounded-lg my-3 shadow-md" />
                      ),
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-base">{message.content}</p>
              )}
            </div>

            {message.role === "user" && (
              <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-4 justify-start animate-fade-in">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 overflow-hidden shadow-md">
              <img src={fishLogo} alt="AI" className="w-8 h-8 object-contain" />
            </div>
            <div className="glass rounded-2xl px-5 py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
