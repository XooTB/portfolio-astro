import React from "react";
import { Folder } from "lucide-react";
import { Accordion, AccordionTrigger, AccordionItem } from "@/components/ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  types: {
    name: string;
    filter: string;
  }[];
  topics: {
    name: string;
    filter: string;
  }[];
};

const Type = ({ types, topics }: Props) => {
  return (
    <div className="w-full flex gap-10 font-mono">
      <Accordion
        type="single"
        collapsible
        className="w-1/2"
        defaultValue="Blog"
      >
        <AccordionItem value="Blog" className="border-b-0">
          <AccordionTrigger className="flex justify-between gap-2">
            <div className="flex items-center gap-3 text-xs">
              <Folder size={18} /> Type
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-l border-dotted px-5">
            {types.map((type) => (
              <div className="flex items-center gap-2 pb-1" key={type.filter}>
                <Checkbox key={type.filter} value={type.filter} className="" />
                <p className="text-sm">{type.name}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        type="single"
        collapsible
        className="w-1/2"
        defaultValue="Topics"
      >
        <AccordionItem value="Topics" className="border-b-0 w-full">
          <AccordionTrigger className="flex justify-between gap-2">
            <div className="flex items-center gap-3 text-xs">
              <Folder size={18} /> Topic
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-l border-dotted px-5">
            {topics.map((type) => (
              <div className="flex items-center gap-2 pb-1" key={type.filter}>
                <Checkbox key={type.filter} value={type.filter} />
                <p className="text-sm">{type.name}</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Type;
