import React from "react";
import { Canvas } from "@react-three/fiber";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  className?: string;
  children?: React.ReactNode;
};

const CanvasComponent = ({ id, className, children }: Props) => {
  return (
    <div id={id} className={cn("", className)}>
      <Canvas className="bg-[var(--color-bg)]">{children}</Canvas>
    </div>
  );
};

export default CanvasComponent;
