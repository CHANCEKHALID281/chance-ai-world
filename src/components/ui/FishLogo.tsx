import { cn } from "@/lib/utils";

interface FishLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const FishLogo = ({ className, size = "md" }: FishLogoProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full animate-swim"
      >
        {/* Fish body */}
        <ellipse
          cx="28"
          cy="32"
          rx="20"
          ry="14"
          className="fill-foreground"
        />
        
        {/* Fish tail */}
        <path
          d="M48 32 L62 20 L58 32 L62 44 Z"
          className="fill-foreground animate-tail-wag"
          style={{ transformOrigin: "48px 32px" }}
        />
        
        {/* Fish eye */}
        <circle cx="16" cy="30" r="4" className="fill-background" />
        <circle cx="15" cy="29" r="2" className="fill-foreground" />
        
        {/* Fish fin top */}
        <path
          d="M28 18 Q32 8 38 18"
          className="stroke-foreground fill-none"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Fish fin bottom */}
        <path
          d="M28 46 Q32 54 24 52"
          className="stroke-foreground fill-none"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Bubbles */}
        <circle cx="6" cy="24" r="2" className="fill-muted-foreground animate-bubble-1" />
        <circle cx="4" cy="32" r="1.5" className="fill-muted-foreground animate-bubble-2" />
        <circle cx="8" cy="38" r="1" className="fill-muted-foreground animate-bubble-3" />
      </svg>
    </div>
  );
};

export default FishLogo;
