import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

const TextSVGPair = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center"
    >
      {children}
    </motion.div>
  );
};

const TextFill = () => {
  const container = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="text-black font-reross text-xl w-[250vw] h-[60vh] items-center hidden lg:flex"
      ref={container}
    >
      <TextSVGPair>
        <motion.p className="pb-36">
          I build websites that look great and <br /> work even better.
        </motion.p>
        <span className="relative w-[200px] h-[200px] -2">
          <motion.svg
            viewBox="0 0 318 141"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-10 -left-5 bottom-0 right-0"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 1,
              }}
              d="M3 3C7.635 27.3831 43.479 73.14 149.775 61.1C256.071 49.06 297.755 106.717 305.305 137.05M305.305 137.05L281.1 124.45M305.305 137.05L315.09 118.85"
              stroke="#424242"
              strokeWidth={7}
              strokeLinecap="round"
            />
          </motion.svg>
        </span>
      </TextSVGPair>

      <TextSVGPair>
        <motion.p className="pt-36">
          Your ideas will shine with a design that <br /> stands out.
        </motion.p>
        <span className="relative w-[250px] h-[200px]">
          <svg
            viewBox="0 0 319 172"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 left-0 bottom-0 right-0 translate-y-5 translate-x-2"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 2,
              }}
              d="M3 169C31.5 139.667 110.6 89.5 199 123.5C287.4 157.5 301.83 58 298 4M298 4L278.5 24.5M298 4L316 24.5"
              stroke="#424242"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </TextSVGPair>

      <TextSVGPair>
        <motion.p className="pb-56 -translate-x-16">
          I'll make sure your website works perfectly <br />
          on every device.
        </motion.p>
        <span className="relative w-[100px]">
          <svg
            viewBox="0 0 117 257"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="-translate-x-32"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 2,
              }}
              d="M27.874 3.00003C-3.38115 69.9579 -29.9776 211.619 113.678 242.599M113.678 242.599L92.7342 253.818M113.678 242.599L102.187 216.442"
              stroke="#424242"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </TextSVGPair>

      <TextSVGPair>
        <motion.p className="pt-48 -translate-x-28">
          You'll get a developer who listens and delivers <br />
          exactly what you need.
        </motion.p>
        <span className="relative">
          <svg
            width="200"
            height="230"
            viewBox="0 0 205 232"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="-translate-x-28 -translate-y-16"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 1,
              }}
              d="M3 229.436C26.029 168.967 88.615 60.496 161.94 96.306C212.002 120.755 173.737 174.626 120.002 145.755C66.267 116.884 82.046 13.645 200.986 23.635M200.986 23.635L185.019 41.733M200.986 23.635L176.314 3"
              stroke="#424242"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </TextSVGPair>

      <TextSVGPair>
        <motion.p className="pb-[320px] -translate-x-24">
          I combine creativity and precision to <br />
          build something exceptional.
        </motion.p>
        <span className="relative">
          <svg
            width="318"
            height="141"
            viewBox="0 0 318 141"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-0 right-0 top-0 bottom-0 -translate-x-20 -translate-y-32"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 1,
              }}
              d="M3 3C7.635 27.3831 43.479 73.14 149.775 61.1C256.071 49.06 297.755 106.717 305.305 137.05M305.305 137.05L281.1 124.45M305.305 137.05L315.09 118.85"
              stroke="#424242"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </TextSVGPair>

      <TextSVGPair>
        <motion.p className="pt-14">
          Your project deserves a partner who truly cares like me.
        </motion.p>
        <span className="relative">
          <svg
            width="319"
            height="172"
            viewBox="0 0 319 172"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="-translate-y-16 translate-x-3"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 1,
              }}
              d="M3 169C31.5 139.667 110.6 89.5 199 123.5C287.4 157.5 301.83 58 298 4M298 4L278.5 24.5M298 4L316 24.5"
              stroke="#424242"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </TextSVGPair>

      <TextSVGPair>
        <motion.p className="pb-[350px] -translate-x-10">
          On time, on point—every project, every time.
        </motion.p>
        <span className="relative w-[250px]">
          <svg
            viewBox="0 0 309 199"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="-translate-x-20 -translate-y-16"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 1,
              }}
              d="M3 3C7.5 37.833 42.3 103.2 145.5 86C248.7 68.8 289.17 151.167 296.5 194.5M296.5 194.5L273 176.5M296.5 194.5L306 168.5"
              stroke="#424242"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </TextSVGPair>

      <TextSVGPair>
        <motion.p className="-translate-x-32 translate-y-10">
          Let's create a website that's both functional and unforgettable.
        </motion.p>
      </TextSVGPair>
    </div>
  );
};

export default TextFill;
