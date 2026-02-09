import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import "@/styles/curtains.css";
import { easeInOut } from "motion";
import { deviceType } from "@/lib/utils";

function useWindowSize() {
  const [size, setSize] = useState({ width: undefined as number | undefined });
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

const BASE_DELAY = 2;

const Curtains = () => {
  const { width } = useWindowSize();
  const [device, setDevice] = useState<"mobile" | "desktop" | undefined>(
    deviceType(width)
  );

  useEffect(() => {
    setDevice(deviceType(width));
  }, [width]);

  return (
    <motion.div
      className={`curtain relative` + (device === undefined ? "bg-white" : "")}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.5, delay: BASE_DELAY + 1.8, ease: easeInOut }}
    >
      {device && (
        <motion.div
          className="loader absolute top-[45%] left-[35%] lg:top-1/2 lg:left-1/2  transform -translate-x-1/2 -translate-y-1/2 text-black z-10 uppercase font-mono tracking-wide text-xl font-medium"
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 0, x: 20 }}
          transition={{ duration: 1, delay: 1.5, ease: easeInOut }}
        >
          loading
        </motion.div>
      )}

      <div className="overlay min-h-screen w-full">
        {device &&
          Array(device === "mobile" ? 10 : 20)
            .fill("")
            .map((_, i) => (
              <motion.div
                key={i}
                className={`min-h-screen bg-white block-${i + 1} fixed`}
                initial={{ width: device === "mobile" ? "10.2%" : "5.1%" }}
                animate={{ width: "0%" }}
                transition={{
                  duration: 1,
                  delay: BASE_DELAY + i * 0.04,
                  ease: "easeIn",
                }}
              />
            ))}
      </div>
    </motion.div>
  );
};

export default Curtains;
