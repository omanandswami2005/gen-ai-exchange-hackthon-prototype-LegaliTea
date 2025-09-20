import React, { useState, useEffect } from "react";
import { Menu, X, Scale, FileText, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { NavbarLogo } from "./AnimatedLogo";
import { AudioSettings } from "./AudioSettings";
import { TTSSettings } from "./TTSSettings";
import { useAnimations } from "@/hooks/useAnimations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EnhancedNavBarProps {
  className?: string;
}

export const EnhancedNavBar: React.FC<EnhancedNavBarProps> = ({
  className = "",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getAnimationClass } = useAnimations();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".mobile-menu") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "Analyze", href: "#", icon: FileText },
    {
      name: "Privacy",
      href: "#",
      icon: Shield,
      dialogContent: {
        title: "Privacy Policy",
        description: "This is our privacy policy.",
      },
    },
    {
      name: "Features",
      href: "#",
      icon: Sparkles,
      dialogContent: {
        title: "Features",
        description: "These are our features.",
      },
    },
    {
      name: "Legal",
      href: "#",
      icon: Scale,
      dialogContent: {
        title: "Legal Information",
        description: "This is our legal information.",
      },
    },
  ];

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 
          ${getAnimationClass("transition-all duration-300 ease-out")}
          ${
            isScrolled
              ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50"
              : "bg-background/80 backdrop-blur-sm"
          }
          ${className}
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <NavbarLogo className={getAnimationClass("animate-fade-in")} />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) =>
                item.dialogContent ? (
                  <Dialog key={item.name}>
                    <DialogTrigger asChild>
                      <a
                        href={item.href}
                        className={`
                          flex items-center space-x-2 px-4 py-2 rounded-lg
                          ${getAnimationClass("transition-all duration-200 ease-out")}
                          ${getAnimationClass("hover:scale-105 hover:shadow-md")}
                          text-muted-foreground hover:text-foreground hover:bg-accent/50
                        `}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </a>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{item.dialogContent.title}</DialogTitle>
                        <DialogDescription>
                          {item.dialogContent.description}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg
                      ${getAnimationClass("transition-all duration-200 ease-out")}
                      ${getAnimationClass("hover:scale-105 hover:shadow-md")}
                      text-muted-foreground hover:text-foreground hover:bg-accent/50
                      ${getAnimationClass(
                        `animate-slide-in-right delay-${index * 100}`
                      )}
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                )
              )}

              {/* Divider */}
              <div className="h-6 w-px bg-border mx-2" />
            </div>

            {/* Controls Section */}
            <div className="flex items-center space-x-2">
              <div
                className={`hidden sm:flex items-center space-x-2 ${getAnimationClass(
                  "animate-fade-in delay-300"
                )}`}
              >
                <AudioSettings />
                <TTSSettings />
                <LanguageSelector />
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className={`
                  md:hidden mobile-menu-button
                  ${getAnimationClass("hover:scale-110 active:scale-95")}
                  transition-all duration-200
                `}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="grid gap-4">
              {navItems.map((item) =>
                item.dialogContent ? (
                  <Dialog key={item.name}>
                    <DialogTrigger asChild>
                      <a
                        href={item.href}
                        className="flex items-center space-x-3 p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </a>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{item.dialogContent.title}</DialogTitle>
                        <DialogDescription>
                          {item.dialogContent.description}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
