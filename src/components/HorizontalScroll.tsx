import { useRef } from "react";
import { motion, useTransform, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

type HorizontalScrollProps = {
  children: React.ReactNode;
  title: string;
  className?: string;
};

const HorizontalScroll = ({
  children,
  title,
  className,
}: HorizontalScrollProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-70%"]);

  return (
    <section
      ref={targetRef}
      className={cn(
        "relative h-[550vh] bg-[#F7F7F7] hidden lg:block",
        className
      )}
    >
      <div className="sticky top-0 h-screen">
        {title && (
          <p className="text-xl lg:text-5xl text-slate-800 font-bold capitalize text-center py-24">
            {title}
          </p>
        )}
        <div className="flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex gap-5 pl-20">
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HorizontalScroll;
