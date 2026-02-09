import React, { useRef } from "react";
import { useTransform, useScroll, motion } from "motion/react";
import type { MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

const images = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
];

const VerticalParallax = () => {
  const container = useRef(null);
  const mobileContainer = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: mobileScrollYProgress } = useScroll({
    target: mobileContainer,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 1000]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 700]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 1100]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 900]);

  const mobileY1 = useTransform(mobileScrollYProgress, [0, 1], [0, 400]);
  const mobileY2 = useTransform(mobileScrollYProgress, [0, 1], [0, 250]);

  return (
    <>
      <section className="min-h-[100px]"></section>
      <section ref={container} className="gallery hidden lg:flex">
        <Column images={images.slice(0, 3)} y={y1} />
        <Column images={images.slice(3, 6)} y={y2} />
        <Column images={images.slice(6, 9)} y={y3} />
        <Column images={images.slice(9, 12)} y={y4} />
      </section>
      <section
        ref={mobileContainer}
        className="flex flex-row gap-2 box-border overflow-hidden p-2 lg:hidden h-[100vh]"
      >
        <Column className="" images={images.slice(0, 3)} y={mobileY1} />
        <Column images={images.slice(3, 6)} y={mobileY2} />
      </section>
    </>
  );
};

const Column = ({
  images,
  y,
  className,
}: {
  images: string[];
  y?: MotionValue<number>;
  className?: string;
}) => {
  return (
    <motion.div className={cn("column", className)} style={{ y }}>
      {images.map((image, index) => (
        <div key={index} className="img-container">
          <img
            src={`/assets/images/parallax/${image}`}
            alt={`Parallax gallery image ${index + 1}`}
            className="image"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </motion.div>
  );
};

export default VerticalParallax;
