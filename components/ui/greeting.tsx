"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { cn } from "@/lib/utils";

interface GreetingProps {
  className?: string;
}

export function Greeting({ className }: GreetingProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");
  const supabase = createClient();

  useEffect(() => {
    // Get current time greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
      setEmoji("🌅");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
      setEmoji("☀️");
    } else {
      setGreeting("Good evening");
      setEmoji("🌙");
    }

    // Get user name
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Try to get display name, fall back to email username
        const displayName = session.user.user_metadata?.full_name || 
                           session.user.email?.split('@')[0] || 
                           'there';
        setUserName(displayName);
      }
    };

    getUser();
  }, [supabase]);

  const displayName = userName 
    ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
    : "there";

  return (
    <div className={cn(
      "flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-0",
      className
    )}>
      <span 
        className="text-xl sm:text-2xl lg:text-3xl flex-shrink-0" 
        role="img" 
        aria-label="greeting"
      >
        {emoji}
      </span>
      <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground truncate">
          {greeting}, {displayName}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
          Welcome to your fitness dashboard
        </p>
      </div>
    </div>
  );
}

// Alternative compact version - fully responsive
export function CompactGreeting({ className }: GreetingProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
      setEmoji("🌅");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
      setEmoji("☀️");
    } else {
      setGreeting("Good evening");
      setEmoji("🌙");
    }

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const displayName = session.user.user_metadata?.full_name || 
                           session.user.email?.split('@')[0] || 
                           'there';
        setUserName(displayName);
      }
    };

    getUser();
  }, [supabase]);

  const displayName = userName 
    ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
    : "there";

  return (
    <div className={cn(
      "flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 lg:mb-6 px-2 sm:px-0",
      className
    )}>
      <span className="text-lg sm:text-xl lg:text-2xl flex-shrink-0">
        {emoji}
      </span>
      <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-medium text-foreground truncate">
        {greeting}, {displayName}
      </h1>
    </div>
  );
}

// Minimal version - responsive
export function MinimalGreeting({ className }: GreetingProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const displayName = session.user.user_metadata?.full_name || 
                           session.user.email?.split('@')[0] || 
                           'there';
        setUserName(displayName);
      }
    };

    getUser();
  }, [supabase]);

  const displayName = userName 
    ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
    : "there";

  return (
    <h1 className={cn(
      "text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-0 truncate",
      className
    )}>
      <span className="mr-2">👋</span>
      Hello, {displayName}
    </h1>
  );
}

// Mobile-first version - optimized for small screens
export function MobileGreeting({ className }: GreetingProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");
  const [emoji, setEmoji] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Morning");
      setEmoji("🌅");
    } else if (hour < 17) {
      setGreeting("Afternoon");
      setEmoji("☀️");
    } else {
      setGreeting("Evening");
      setEmoji("🌙");
    }

    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const displayName = session.user.user_metadata?.full_name || 
                           session.user.email?.split('@')[0] || 
                           'there';
        setUserName(displayName);
      }
    };

    getUser();
  }, [supabase]);

  const displayName = userName 
    ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
    : "there";

  return (
    <div className={cn(
      "flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-4 sm:mb-6 px-4 sm:px-0",
      className
    )}>
      <div className="flex items-center gap-2">
        <span className="text-2xl sm:text-3xl" role="img" aria-label="greeting">
          {emoji}
        </span>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Good {greeting}
        </h1>
      </div>
      <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium pl-8 sm:pl-0">
        {displayName}
      </p>
    </div>
  );
}