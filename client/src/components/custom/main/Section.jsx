import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Markdown from "react-markdown";
import { toast } from "react-hot-toast";
import { COMPLETE_SECTION, ME } from "@/queries";
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
  const navigate = useNavigate();
  const [completeSection] = useMutation(COMPLETE_SECTION);

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

  const handleNextSection = () => {
    navigateToSection(1);
  };

  const handlePrevSection = () => {
    navigateToSection(-1);
  };

  const navigateToSection = (direction) => {
    const currentRoadmap = data.me.progress.find(
      (p) => p.roadmap.id === roadmapId,
    );
    const sections = currentRoadmap.roadmap.sections;
    const currentSectionIndex = sections.findIndex((s) => s.id === sectionId);
    const newIndex =
      (currentSectionIndex + direction + sections.length) % sections.length;
    navigate(`/study/${currentRoadmap.roadmap.id}/${sections[newIndex].id}`);
  };

  const handleCompleteSection = async () => {
    console.log({roadmapId, sectionId})
    try {
      await completeSection({ variable: { roadmapId: roadmapId,sectionId: sectionId } });

      toast.success("Section completed.");
      navigateToSection(1);
    } catch (error) {
      console.log(error);
      if (error.message === "Section already completed") {
        return toast.error(error.message);
      } else {
        return toast.error("An error occured");
      }
    }
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
      <div className="flex w-full justify-between px-2">
        <Button variant={"primary"} onClick={handlePrevSection}>
          <CircleArrowLeftIcon size={32} />
        </Button>
        <Button disabled>Complete Section</Button>
        <Button variant={"primary"} onClick={handleNextSection}>
          <CircleArrowRightIcon size={32} />
        </Button>
      </div>
      <div className="container mx-auto flex flex-col-reverse gap-8 px-4 py-12 lg:flex-row">
        <Card className="w-full overflow-hidden p-8 lg:w-3/4">
          <Markdown className="prose w-full break-words">
            {section?.content}
          </Markdown>
        </Card>

        <div className="h-1/4 md:w-1/2">
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
      <div className="mb-12 flex w-full justify-between px-2">
        <Button variant={"primary"} onClick={handlePrevSection}>
          <CircleArrowLeftIcon size={32} />
        </Button>
        <Button onClick={() => handleCompleteSection()}>
          Complete Section
        </Button>
        <Button variant={"primary"} onClick={handleNextSection}>
          <CircleArrowRightIcon size={32} />
        </Button>
      </div>
    </div>
  );
};

export default Section;
