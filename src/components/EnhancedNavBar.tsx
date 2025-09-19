import React, { useState, useEffect } from "react";
import { Menu, X, Scale, FileText, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { NavbarLogo } from "./AnimatedLogo";
import { AudioSettings } from "./AudioSettings";
import { TTSSettings } from "./TTSSettings";
import { useAnimations } from "@/hooks/useAnimations";

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
    { icon: FileText, label: "Analyze", href: "#analyze", active: true },
    { icon: Shield, label: "Privacy", href: "#privacy", active: false },
    { icon: Sparkles, label: "Features", href: "#features", active: false },
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
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg
                    ${getAnimationClass("transition-all duration-200 ease-out")}
                    ${getAnimationClass("hover:scale-105 hover:shadow-md")}
                    ${
                      item.active
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }
                    ${getAnimationClass(
                      `animate-slide-in-right delay-${index * 100}`
                    )}
                  `}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}

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

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden mobile-menu overflow-hidden
            ${getAnimationClass("transition-all duration-300 ease-out")}
            ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="bg-background/95 backdrop-blur-md border-t border-border/50">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* Mobile Navigation Items */}
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    ${getAnimationClass("transition-all duration-200 ease-out")}
                    ${getAnimationClass("hover:scale-[1.02] active:scale-95")}
                    ${
                      item.active
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }
                    ${getAnimationClass(
                      `animate-fade-in-up delay-${index * 50}`
                    )}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}

              {/* Mobile Controls */}
              <div
                className={`
                flex items-center justify-between pt-4 mt-4 border-t border-border/50
                ${getAnimationClass("animate-fade-in-up delay-200")}
              `}
              >
                <span className="text-sm text-muted-foreground">Settings</span>
                <div className="flex items-center space-x-2">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className={`
            fixed inset-0 bg-background/50 backdrop-blur-sm z-40 md:hidden
            ${getAnimationClass("animate-fade-in")}
          `}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16" />
    </>
  );
};

// Navigation context for managing active states
export const useNavigation = () => {
  const [activeSection, setActiveSection] = useState("analyze");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["analyze", "privacy", "features"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { activeSection, setActiveSection };
};
