import { Square, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, useAnimate } from "motion/react";
import { Button } from "@/components/ui/button";

interface PostProps {
  feed: {
    date: string;
    author: string;
    title: string;
    topics: string[];
    type: string;
    summary: string;
  };
}

const blogs = ["blog", "article", "tutorial"];

const Post = ({ feed }: PostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (isExpanded) {
      animate(scope.current, { height: 250 }, { duration: 0.4 });
    } else {
      animate(scope.current, { height: 58 }, { duration: 0.4 });
    }
  }, [isExpanded]);

  return (
    <motion.div
      initial={{ height: 58 }}
      ref={scope}
      className="border-b overflow-clip"
    >
      <div
        className="w-full flex flex-col lg:flex-row items-start flex-1 lg:items-center justify-start font-mono h-14 hover:cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className="w-3/12 lg:w-1/6 flex items-center gap-1 font-extralight text-[10px] lg:text-xs pt-2">
          <Square size={8} fill="white" /> {feed.date}
        </p>
        <div className="flex w-full lg:w-4/6 items-center justify-between">
          <p className="w-11/12 lg:w-full text-lg lg:text-3xl line-clamp-1">
            {feed.title}
          </p>
          <div className="lg:hidden">
            <p className="hover:cursor-pointer hover:bg-white hover:text-black hover:rounded-md transition-all">
              {isExpanded ? (
                <Minus size={18} onClick={() => setIsExpanded(!isExpanded)} />
              ) : (
                <Plus size={18} onClick={() => setIsExpanded(!isExpanded)} />
              )}
            </p>
          </div>
        </div>
        <div className="hidden lg:flex w-1/6 justify-between items-center">
          <p className="text-[9px]">
            <span className="border px-2 py-1 rounded-md border-dotted uppercase">
              {feed.type}
            </span>
          </p>
          <p className="hover:cursor-pointer hover:bg-white hover:text-black hover:rounded-md transition-all">
            {isExpanded ? (
              <Minus size={18} onClick={() => setIsExpanded(!isExpanded)} />
            ) : (
              <Plus size={18} onClick={() => setIsExpanded(!isExpanded)} />
            )}
          </p>
        </div>
      </div>
      <div className="w-full border-b py-4 flex flex-col gap-5 flex-1 px-1 text-base font-mono overflow-clip">
        <div className="w-full flex flex-col lg:flex-row items-start">
          <div className="w-full lg:w-5/6 flex items-start lg:items-center">
            <label className="uppercase w-1/6 font-thin text-xs lg:text-base">
              Summary:
            </label>
            <p className="w-full lg:w-4/6 text-xs lg:text-lg line-clamp-2 lg:line-clamp-3 pl-3 lg:pl-8">
              {feed.summary}
            </p>
          </div>

          <div className="w-full lg:w-1/6 flex items-start lg:items-center pt-2 lg:pt-0">
            <label className="w-1/6 lg:w-auto uppercase font-thin text-xs lg:text-sm">
              Author:
            </label>
            <p className="w-full lg:w-auto text-xs lg:text-lg pl-3">
              {feed.author}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-1 uppercase items-center ">
          <label className="w-1/6 font-thin text-xs lg:text-sm">Topics:</label>
          <p className="flex gap-2 pl-3 lg:pl-0">
            {feed.topics.map((topic, i) => (
              <span
                key={i}
                className="border px-1 py-[2px] lg:px-2 lg:py-1 rounded-sm text-[10px] lg:text-xs border-dotted hover:bg-white hover:text-black hover:cursor-pointer"
              >
                {topic}
              </span>
            ))}
          </p>
        </div>
        <Button variant={"ghost"} className="border">
          {blogs.includes(feed.type.toLowerCase())
            ? "Read More"
            : "Check It Out!"}
        </Button>
      </div>
    </motion.div>
  );
};

export default Post;
