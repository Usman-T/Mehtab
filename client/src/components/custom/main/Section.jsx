import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Markdown from "react-markdown";
import { toast } from "react-hot-toast";

const ME = gql`
  query {
    me {
      progress {
        completedSections {
          title
          id
        }
        roadmap {
          id
          description
          image
          title
          sections {
            title
            content
            images
            description
            id
          }
        }
      }
    }
  }
`;

const Section = () => {
  const { roadmapId, sectionId } = useParams();
  const { data, loading } = useQuery(ME);
  const [section, setSection] = useState(null);

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
      } else {
        toast.error("Section not found");
      }
    } else {
      toast.error("Roadmap not found");
    }
  }, [loading, data, roadmapId, sectionId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={64} />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img
          src="/placeholder.svg"
          alt="Course Hero Image"
          className="h-full w-full object-cover object-center"
          width={1200}
          height={600}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-primary-foreground sm:text-6xl">
            {section?.title}
          </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <Markdown className="prose">{section?.content}</Markdown>
      </div>
    </div>
  );
};

export default Section;
