import React from "react";
import { Button, ButtonProps } from "./button";
import { useAnimations, useRipple } from "@/hooks/useAnimations";
import { useAudioFeedback } from "@/services/audioFeedback";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  animation?: "scale" | "lift" | "glow" | "ripple" | "bounce";
  loading?: boolean;
  success?: boolean;
  error?: boolean;
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      className,
      animation = "scale",
      loading = false,
      success = false,
      error = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { getAnimationClass } = useAnimations();
    const { ripples, addRipple } = useRipple();
    const { playClick, playSuccess, playError } = useAudioFeedback();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (animation === "ripple") {
        addRipple(event);
      }

      // Play appropriate sound
      if (success) {
        playSuccess();
      } else if (error) {
        playError();
      } else {
        playClick();
      }

      onClick?.(event);
    };

    const getAnimationClasses = () => {
      const baseClasses = getAnimationClass(
        "transition-all duration-200 ease-out"
      );

      if (loading) {
        return cn(baseClasses, "animate-pulse cursor-not-allowed opacity-70");
      }

      if (success) {
        return cn(
          baseClasses,
          "bg-green-500 hover:bg-green-600 animate-bounce-gentle"
        );
      }

      if (error) {
        return cn(baseClasses, "bg-red-500 hover:bg-red-600 animate-pulse");
      }

      switch (animation) {
        case "scale":
          return cn(
            baseClasses,
            getAnimationClass("hover:scale-105 active:scale-95"),
            "transform"
          );

        case "lift":
          return cn(
            baseClasses,
            getAnimationClass("hover:-translate-y-1 hover:shadow-lg"),
            "transform"
          );

        case "glow":
          return cn(
            baseClasses,
            getAnimationClass("hover:shadow-lg hover:shadow-primary/25")
          );

        case "bounce":
          return cn(
            baseClasses,
            getAnimationClass("hover:animate-bounce-gentle")
          );

        case "ripple":
          return cn(
            baseClasses,
            "relative overflow-hidden",
            getAnimationClass("hover:scale-[1.02] active:scale-95")
          );

        default:
          return baseClasses;
      }
    };

    return (
      <Button
        ref={ref}
        className={cn(getAnimationClasses(), className)}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        {/* Ripple Effects */}
        {animation === "ripple" &&
          ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
              style={{
                left: ripple.x - 10,
                top: ripple.y - 10,
                width: 20,
                height: 20,
              }}
            />
          ))}

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Success Checkmark */}
        {success && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        {/* Error X */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}

        <span
          className={cn(
            "transition-opacity duration-200",
            loading || success || error ? "opacity-0" : "opacity-100"
          )}
        >
          {children}
        </span>
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
