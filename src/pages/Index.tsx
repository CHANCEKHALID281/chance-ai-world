import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageCircle, Globe, Zap, ArrowRight, Brain } from "lucide-react";
import FishLogo from "@/components/ui/FishLogo";

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/2 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-glow">
              <FishLogo size="md" className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-wide">NEEMO IB AI</span>
          </div>
          <Button
            onClick={() => navigate(isLoggedIn ? "/chat" : "/auth")}
            className="bg-primary text-primary-foreground border-0 hover:bg-primary/90"
          >
            {isLoggedIn ? "Open Chat" : "Get Started"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-6 py-12">
        <div className="text-center max-w-4xl">
          <div className="w-32 h-32 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-8 shadow-glow animate-float">
            <FishLogo size="xl" className="text-primary-foreground" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-foreground">
            Meet <span className="text-gradient">NEEMO IB AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your intelligent assistant for everything. Ask questions in any language, get answers powered by world knowledge. Created by <strong className="text-foreground">ENG: Chance IRADUKUNDA</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate(isLoggedIn ? "/chat" : "/auth")}
              className="bg-primary text-primary-foreground h-14 px-8 text-lg shadow-glow hover:bg-primary/90 transition-opacity"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="h-14 px-8 text-lg border-border bg-card/50 backdrop-blur hover:bg-card"
            >
              {isLoggedIn ? "View Account" : "Sign Up Free"}
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Multilingual</h3>
              <p className="text-muted-foreground text-sm">
                Speaks Kinyarwanda, English, French, Kiswahili, and 100+ languages fluently.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">World Knowledge</h3>
              <p className="text-muted-foreground text-sm">
                Access to global information, history, science, culture, and current events.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-left">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">
                Instant responses powered by advanced AI technology.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-muted-foreground text-sm">
        <p>© 2024 NEEMO IB AI. Created by ENG: Chance IRADUKUNDA. Built for everyone, everywhere.</p>
      </footer>
    </div>
  );
};

export default Index;
