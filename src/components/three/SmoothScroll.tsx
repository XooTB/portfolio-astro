import { ReactLenis, useLenis } from "lenis/react";
import React from "react";

type Props = {
  children: React.ReactNode;
  root?: boolean;
};

const SmoothScroll = ({ children, root = false }: Props) => {
  const lenis = useLenis((state) => {});

  return (
    <ReactLenis root options={{ lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
