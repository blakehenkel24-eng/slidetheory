"use client";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSupabase } from "../app/app/providers";
import { User, LogOut, History, Settings, ChevronDown, Sparkles } from "lucide-react";

interface HeaderProps {
  onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const { user, supabase } = useSupabase();

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-900 tracking-tight">SlideTheory</span>
            <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600 border border-blue-100">
              Beta
            </span>
          </div>
        </a>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 h-9 px-2"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                    {user.email?.[0].toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate text-sm font-medium">
                    {user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-slate-200 shadow-lg">
                <div className="px-3 py-2 text-sm text-slate-500 border-b border-slate-100">
                  <div className="font-medium text-slate-900 truncate">{user.email}</div>
                </div>
                <DropdownMenuItem className="text-slate-700 focus:bg-slate-50 focus:text-slate-900 cursor-pointer py-2">
                  <History className="mr-2 h-4 w-4 text-slate-400" />
                  My Slides
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-700 focus:bg-slate-50 focus:text-slate-900 cursor-pointer py-2">
                  <Settings className="mr-2 h-4 w-4 text-slate-400" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer py-2"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              onClick={onLoginClick}
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 h-9"
            >
              <User className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
