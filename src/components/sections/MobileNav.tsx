import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader className="text-left">
            <div className="font-mono tracking-tighter mb-8 flex flex-col items-start ">
              <h2 className="text-2xl font-medium">SAMIUL A.</h2>
              <p className="text-[10px] text-right">V_001</p>
            </div>
          </SheetHeader>
          <nav className="flex flex-col gap-6">
            <ul className="flex flex-col gap-6 font-mono tracking-tighter text-lg">
              <li
                className="transition-all duration-300 hover:translate-x-2"
                onClick={() => setIsOpen(false)}
              >
                <a href="#feed">Feed</a>
              </li>
              <li
                className="transition-all duration-300 hover:translate-x-2"
                onClick={() => setIsOpen(false)}
              >
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
