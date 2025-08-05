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
      "flex items-center gap-3 mb-8",
      className
    )}>
      <span className="text-2xl" role="img" aria-label="greeting">
        {emoji}
      </span>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {greeting}, {displayName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome to your fitness dashboard
        </p>
      </div>
    </div>
  );
}

// Alternative compact version
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
      "flex items-center gap-2 mb-6",
      className
    )}>
      <span className="text-xl">{emoji}</span>
      <h1 className="text-xl font-medium text-foreground">
        {greeting}, {displayName}
      </h1>
    </div>
  );
}

// Minimal version
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
      "text-2xl font-semibold text-foreground mb-8",
      className
    )}>
      👋 Hello, {displayName}
    </h1>
  );
}