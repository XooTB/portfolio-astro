import React from "react";
import { motion } from "motion/react";

const FooterTitle = () => {
  const title = "SAMIUL ALIM";
  return (
    <div className="w-full flex justify-center items-center text-[22vw] font-bold font-bebas">
      {title.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

export default FooterTitle;
