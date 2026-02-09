import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";

type Props = {
  children?: React.ReactNode;
  delay?: number;
};

const textContent = [
  "I build websites that look great and work even better.",
  "Your ideas will shine with a design that stands out.",
  "I'll make sure your website works perfectly on every device.",
  "You'll get a developer who listens and delivers exactly what you need.",
  "I combine creativity and precision to build something exceptional.",
  "Your project deserves a partner who truly cares like me.",
  "On time, on point—every project, every time.",
  "Let's create a website that's both functional and unforgettable.",
];

const TextFade = ({ text }: { text: string }) => {
  const ref = useRef(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(true);
  const isInView = useInView(ref, { amount: 0.5, once: false });

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingDown(currentScrollY > lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <motion.p
      ref={ref}
      className="text-center text-2xl pt-[40vh]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        delay: isScrollingDown ? 1 : 0,
      }}
    >
      {text}
    </motion.p>
  );
};

const VerticalScroll = ({ children }: Props) => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0.799, 1], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0.799, 1], [0, -50]);

  return (
    <section
      ref={sectionRef}
      className="bg-white h-[430vh] lg:hidden text-black"
    >
      <div className="sticky top-20">
        <motion.h3
          style={{ opacity: titleOpacity, y: titleY }}
          className="font-mono text-center text-2xl z-10 bg-white/80 backdrop-blur-sm py-4"
        >
          Why Choose me?
        </motion.h3>
      </div>
      <div className="h-[400vh] font-reross px-10">
        {textContent.map((text, index) => (
          <TextFade key={index} text={text} />
        ))}
      </div>
    </section>
  );
};

export default VerticalScroll;
