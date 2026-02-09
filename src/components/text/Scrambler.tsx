import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type ScramblerProps = {
  children: string;
  className?: string;
  duration?: number;
};

const Scrambler = ({ children, className, duration = 2 }: ScramblerProps) => {
  const [scrambledText, setScrambledText] = useState<string[]>([]);
  const [isScrambling, setIsScrambling] = useState(true);
  const [revealIndex, setRevealIndex] = useState(-1);

  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?" + children;

  useEffect(() => {
    if (!isScrambling) {
      const revealInterval = setInterval(() => {
        setRevealIndex((prev) => {
          if (prev >= children.length - 1) {
            clearInterval(revealInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(revealInterval);
    }
  }, [isScrambling, children.length]);

  useEffect(() => {
    if (!isScrambling) return;

    const text = children.split("");
    let interval = setInterval(() => {
      const numToScramble = Math.floor(Math.random() * 2) + 1;
      const indices = new Set<number>();

      while (indices.size < numToScramble) {
        const randomIndex = Math.floor(Math.random() * text.length);
        if (text[randomIndex] !== " ") {
          indices.add(randomIndex);
        }
      }

      setScrambledText(
        text.map((char, index) => {
          if (char === " ") return "\u00A0";
          if (indices.has(index)) {
            return chars[Math.floor(Math.random() * chars.length)];
          }
          return scrambledText[index] || char;
        })
      );
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setIsScrambling(false);
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [children, duration, isScrambling, chars, scrambledText]);

  return (
    <div className={cn("flex flex-wrap", className)}>
      <AnimatePresence>
        {children.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 1 }}
            animate={{
              opacity: 1,
              display: "inline-block",
              color: "white",
            }}
            transition={{
              duration: 0.2,
            }}
          >
            {isScrambling || index > revealIndex
              ? scrambledText[index] || (char === " " ? "\u00A0" : char)
              : char === " "
              ? "\u00A0"
              : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Scrambler;
