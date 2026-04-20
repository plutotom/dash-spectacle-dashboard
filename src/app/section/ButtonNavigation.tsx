"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Image as ImageIcon,
  Menu,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useCallback, useEffect } from "react";

interface NavButtonsProps {
  mobile?: boolean;
  isOnDashboard: boolean;
  isAdmin?: boolean;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
  isIdle?: boolean;
}

const NavButtons = ({
  mobile = false,
  isOnDashboard,
  isAdmin,
  onNavigate,
  onSignOut,
  isIdle = false,
}: NavButtonsProps) => (
  <div
    className={`flex ${mobile ? "flex-col gap-3" : "gap-2"} transition-all duration-1000 ${
      isIdle ? "opacity-0 pointer-events-none" : "opacity-100"
    }`}
  >
    {!isOnDashboard && (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onNavigate("/dashboard")}
        className={`bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-105 ${
          mobile ? "w-full justify-start" : ""
        }`}
      >
        <LayoutDashboard className="w-4 h-4 mr-2" />
        Dashboard
      </Button>
    )}
    {isAdmin && (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onNavigate("/users")}
        className={`bg-teal-600/30 hover:bg-teal-600/40 text-teal-100 border border-teal-500/30 shadow-lg backdrop-blur-md transition-all hover:scale-105 ${
          mobile ? "w-full justify-start" : ""
        }`}
      >
        <Shield className="w-4 h-4 mr-2" />
        Manage Users
      </Button>
    )}

    <Button
      variant="secondary"
      size="sm"
      onClick={() => onNavigate("/gallery")}
      className={`bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-105 ${
        mobile ? "w-full justify-start" : ""
      }`}
    >
      <ImageIcon className="w-4 h-4 mr-2" />
      Gallery
    </Button>
    <Button
      variant="secondary"
      size="sm"
      onClick={() => onNavigate("/profile")}
      className={`bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-105 ${
        mobile ? "w-full justify-start" : ""
      }`}
    >
      <User className="w-4 h-4 mr-2" />
      Profile
    </Button>
    <Button
      variant="secondary"
      size="sm"
      onClick={onSignOut}
      className={`bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg backdrop-blur-md transition-all hover:scale-105 ${
        mobile ? "w-full justify-start" : ""
      }`}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  </div>
);

export default function ButtonNavigation() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useQuery(api.profile.isAdmin);
  const isOnDashboard = pathname === "/dashboard";
  const [open, setOpen] = useState(false);

  // Idle detection
  const [isIdle, setIsIdle] = useState(false);

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
  }, []);

  useEffect(() => {
    let idleTimeout: NodeJS.Timeout;

    const handleActivity = () => {
      resetIdleTimer();
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => setIsIdle(true), 10000); // 10 seconds per user change, revert to 20s if needed
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Start the idle timer
    idleTimeout = setTimeout(() => setIsIdle(true), 10000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearTimeout(idleTimeout);
    };
  }, [resetIdleTimer]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
    setOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.push("/signin")}
        className={`bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg backdrop-blur-md transition-all duration-1000 hover:scale-105 ${
          isIdle ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        Sign In
      </Button>
    );
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-2">
        <NavButtons
          isOnDashboard={isOnDashboard}
          isAdmin={isAdmin}
          onNavigate={handleNavigation}
          onSignOut={handleSignOut}
          isIdle={isIdle}
        />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-lg backdrop-blur-md"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[240px] bg-slate-900/95 border-white/10 text-white"
          >
            <SheetHeader>
              <SheetTitle className="text-white text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-3 mt-6">
              <NavButtons
                mobile
                isOnDashboard={isOnDashboard}
                isAdmin={isAdmin}
                onNavigate={handleNavigation}
                onSignOut={handleSignOut}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
