import React from "react";
import Scrambler from "@/components/text/Scrambler";
import CanvasComponent from "@/components/three/CanvasComponent";
import Zoop from "@/components/text/Zoop";
import ImageAbberation from "@/components/three/ImageAbberation";

const Hero = () => {
  return (
    <div className="w-full min-h-screen flex flex-col-reverse lg:flex-row justify-center items-center text-3xl font-semibold px-5 pt-22 lg:px-20 z-10">
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <Scrambler className="font-mono text-xl lg:text-3xl" duration={9}>
          Hey! I'm
        </Scrambler>
        <Zoop className={`hover:cursor-pointer font-mono text-5xl lg:text-8xl`}>
          Samiul
        </Zoop>
        <Zoop className="text-xl lg:text-2xl hover:cursor-pointer font-mono">
          And I do stuff for fun...
        </Zoop>
      </div>

      <div className="hero-canvas-container">
        <CanvasComponent className="hero-canvas">
          <ImageAbberation imageSrc="/assets/images/cat_portrait.png" />
        </CanvasComponent>
      </div>
    </div>
  );
};

export default Hero;
