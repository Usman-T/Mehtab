import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Markdown from "react-markdown";
import { toast } from "react-hot-toast";
import { ME } from "@/queries";
import { Card } from "@/components/ui/card";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ChevronDownIcon,
  CircleArrowLeftIcon,
  CircleArrowRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Section = () => {
  const { roadmapId, sectionId } = useParams();
  const { data, loading } = useQuery(ME);
  const [section, setSection] = useState(null);
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (loading || !data) return;

    const currentRoadmap = data.me.progress.find(
      (p) => p.roadmap.id === roadmapId,
    );

    if (currentRoadmap) {
      const currentSection = currentRoadmap.roadmap.sections.find(
        (section) => section.id === sectionId,
      );

      if (currentSection) {
        setSection(currentSection);
        extractHeadings(currentSection.content);
      } else {
        toast.error("Section not found");
      }
    } else {
      toast.error("Roadmap not found");
    }
  }, [loading, data, roadmapId, sectionId]);

  const extractHeadings = (content) => {
    const lines = content.split("\n");
    const extractedHeadings = lines
      .filter((line) => line.startsWith("## ") || line.startsWith("### "))
      .map((line) => {
        const level = line.startsWith("## ") ? 2 : 3;
        return {
          level,
          text: line.replace(/^###?\s/, ""),
        };
      });
    setHeadings(extractedHeadings);
  };

  if (loading || !data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={64} />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-screen flex-col md:w-full">
      <div className="mx-auto p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative mx-auto flex w-full items-center justify-center">
            <LazyLoadImage
              src={section?.images[0]}
              alt={section?.title}
              className="aspect-video w-full rounded-lg transition duration-500 ease-in-out"
              style={{ filter: "blur(20px)", transition: "filter 0.5s ease" }}
              loading="lazy"
              onLoad={(e) => (e.target.style.filter = "blur(0px)")}
            />
          </div>
          <div className="flex flex-col space-y-4 px-4 py-2">
            <h1 className="text-4xl font-bold">{section?.title}</h1>
            <h2 className="font-medium text-slate-700">
              {section?.description}
            </h2>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-col-reverse gap-8 px-4 py-12 lg:flex-row">
        <Card className="w-full overflow-hidden p-8 lg:w-3/4">
          <Markdown className="prose w-full break-words">
            {section?.content}
          </Markdown>
        </Card>

        <div className="h-1/4">
          <div className="flex w-full justify-between px-2 pb-4">
            <Button variant={"primary"} className="w">
              <CircleArrowLeftIcon size={32} />
            </Button>
            <Button variant={"primary"} className="w">
              <CircleArrowRightIcon size={32} />
            </Button>
          </div>
          <Card className="w-full overflow-hidden p-8">
            <h2 className="mb-4 text-xl font-bold">Table of Contents</h2>
            <ul className="">
              {headings.map((heading, index) => (
                <li
                  key={index}
                  className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ml-${heading.level === 3 ? "4 font-normal" : "0"}`}
                >
                  <ChevronDownIcon
                    className={`h-4 w-4 ${heading.level === 3 ? "opacity-0" : ""} `}
                  />
                  {heading.text}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Section;
