import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";
import { COMPLETE_SECTION, ME } from "@/queries";
import { Card } from "@/components/ui/card";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  CircleArrowLeftIcon,
  CircleArrowRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "../extras/Loading";
import { ClipLoader } from "react-spinners";

const Section = () => {
  const { roadmapId, sectionId } = useParams();
  const { data, loading } = useQuery(ME);

  const [section, setSection] = useState(null);
  const [headings, setHeadings] = useState([]);
  const navigate = useNavigate();
  const [completeSection, { loading: enrollLoading }] = useMutation(
    COMPLETE_SECTION,
    {
      refetchQueries: [{ query: ME }],
    },
  );

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
    try {
      const completed = await completeSection({
        variables: { roadmapId: roadmapId, sectionId: sectionId },
      });

      toast.success("Section completed.");
      await handleNextSection();
    } catch (error) {
      console.log(error);
      if (error.message === "Section already completed") {
        return toast.error(error.message);
      } else {
        return toast.error("An error occurred");
      }
    }
  };

  if (loading || !data) {
    return <Loading />;
  }

  const renderers = {
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  };

  return (
    <div className="relative flex min-h-screen w-screen flex-col md:w-full">
      <div className="mx-8 my-4">
        <Button
          className="flex items-center justify-center space-x-1"
          variant={"outline"}
          onClick={() => navigate(`/study/${roadmapId}`)}
        >
          <ArrowLeftIcon className="" size={16} />
          <p>Back</p>
        </Button>
      </div>
      <main className="flex-grow p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative flex items-center justify-center">
            <LazyLoadImage
              src={section?.images[0]}
              alt={section?.title}
              className="w-full rounded-lg transition-opacity duration-500"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-medium text-gray-700">
              {section?.description}
            </h2>
          </div>
        </div>

        <div className="my-4 flex justify-between">
          <Button variant={"primary"} onClick={handlePrevSection}>
            <CircleArrowLeftIcon size={32} />
          </Button>
          <Button
            variant={"primary"}
            disabled={true}
            className="flex items-center space-x-2"
          >
            <span>Complete Section</span>
          </Button>
          <Button variant={"primary"} onClick={handleNextSection}>
            <CircleArrowRightIcon size={32} />
          </Button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <Card className="w-full overflow-hidden p-8">
            <ReactMarkdown components={renderers} className="prose">
              {section?.content}
            </ReactMarkdown>
          </Card>

          <Card className="w-full p-8 lg:w-1/4">
            <h2 className="mb-4 text-xl font-bold">Table of Contents</h2>
            <ul>
              {headings.map((heading, index) => (
                <li
                  key={index}
                  className={`cursor-pointer px-3 py-2 text-sm font-medium transition-colors ${
                    heading.level === 3 ? "ml-4 font-normal" : ""
                  } hover:bg-gray-200`}
                >
                  <ChevronDownIcon
                    className={`h-4 w-4 ${heading.level === 3 ? "opacity-0" : ""}`}
                  />
                  {heading.text}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
      <div className="mb-12 flex w-full justify-between px-2">
        <Button variant={"primary"} onClick={handlePrevSection}>
          <CircleArrowLeftIcon size={32} />
        </Button>
        <Button
          className="space-x-2 font-semibold"
          disabled={enrollLoading}
          onClick={() => handleCompleteSection()}
        >
          <p>Complete Section</p>
          {enrollLoading && <ClipLoader color="white" size={16} />}
        </Button>
        <Button variant={"primary"} onClick={handleNextSection}>
          <CircleArrowRightIcon size={32} />
        </Button>
      </div>
    </div>
  );
};

export default Section;
