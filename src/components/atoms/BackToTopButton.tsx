import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
  return (
    <Button variant={"ghost"} className="hover:bg-transparent hover:text-indigo-400" onClick={scrollToTop}>
      Back to top <ArrowUp />
    </Button>
  )
}
