import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
type Props = {
  children: string;
  href?: string;
  className?: string;
};

const DURATION = 0.25;
const STAGGER = 0.025;

const Zoop = ({ children, href, className }: Props) => {
  const characters = children.split(/(?=(?:[\S\s]))/);

  return (
    <motion.a
      href={href}
      className={cn(
        "relative block overflow-hidden whitespace-nowrap text-xl uppercase",
        className
      )}
      style={{ lineHeight: 1 }}
      initial={"initial"}
      whileHover={"hovered"}
    >
      <div>
        {characters.map((char, i) => (
          <motion.span
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: DURATION,
              delay: STAGGER * i,
              ease: "easeInOut",
            }}
            key={i}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {characters.map((char, i) => (
          <motion.span
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: DURATION,
              delay: STAGGER * i,
              ease: "easeInOut",
            }}
            key={i}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </motion.a>
  );
};

export default Zoop;
