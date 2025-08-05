"use client";

import { Home, BarChart3, User, Plus, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { createClient } from "@/lib/client";
import { LogoutButton } from "./logout-button";

const DATA = {
  navbar: [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/add-measurement", icon: Plus, label: "Add Data" },
    { href: "/profile", icon: User, label: "Profile" },
  ],
  settings: [
    { href: "/settings", icon: Settings, label: "Settings" },
  ],
};

export function NavigationDock() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <TooltipProvider>
        <Dock direction="middle" fixed>
          {/* Main Navigation Items */}
          {DATA.navbar.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full transition-colors",
                      isActive(item.href) 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          <Separator orientation="vertical" className="h-full" />

          {/* Settings Section */}
          {DATA.settings.map((item) => (
            <DockIcon key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-12 rounded-full transition-colors",
                      isActive(item.href) 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="size-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            </DockIcon>
          ))}

          <Separator orientation="vertical" className="h-full py-2" />

          {/* Logout Button */}
          <DockIcon>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  )}
                >
                  <LogOut className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        </Dock>
      </TooltipProvider>
    </div>
  );
}

// Simpler version without tooltips for better performance
export function SimpleNavigationDock() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <Dock direction="middle" fixed>
        {DATA.navbar.map((item) => (
          <DockIcon key={item.label}>
            <Link
              href={item.href}
              aria-label={item.label}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "size-12 rounded-full transition-colors",
                isActive(item.href) 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="size-4" />
            </Link>
          </DockIcon>
        ))}

        <Separator orientation="vertical" className="h-full" />

        <DockIcon>
          <Link
            href="/settings"
            aria-label="Settings"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "size-12 rounded-full transition-colors",
              isActive("/settings") 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Settings className="size-4" />
          </Link>
        </DockIcon>

        

        <Separator orientation="vertical" className="h-full py-2" />

        <DockIcon>
          <LogoutButton />
        </DockIcon>
      </Dock>
    </div>
  );
}