import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

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
            resources
            id
          }
        }
      }
    }
  }
`;

const Section = () => {
  const { data, loading } = useQuery(ME);
  const [section, setSection] = useState(null);
  const { roadmapId, sectionId } = useParams();

  useEffect(() => {
    if (!loading && data && !section) {
      const currentRoadmap = data.me.progress.find(
        (p) => p.roadmap.id === roadmapId,
      );

      if (currentRoadmap) {
        const currentSection = currentRoadmap.roadmap.sections.find(
          (section) => section.id === sectionId,
        );


        setSection(currentSection);
      }

      if (!currentRoadmap) {
        return toast.error("Section not found");
      }
    }
  }, [loading, data, sectionId, section]);

  if (loading || !section) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={64} />
      </div>
    );
  }

  return (
    <div>
      <ul>
        <li>{section.title}</li>
        <li>{section.content}</li>
        <li>{section.id}</li>
        <li>
          <ul>
            {section.resources.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Section;
