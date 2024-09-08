import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { toast } from "react-hot-toast";
import { COMPLETE_SECTION, ME } from "@/queries";
import { Card, CardContent } from "@/components/ui/card";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ArrowLeftIcon,
  ArrowUpWideNarrowIcon,
  CircleArrowLeftIcon,
  CircleArrowRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "../extras/Loading";
import { ClipLoader } from "react-spinners";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

const Section = () => {
  const assessmentsTalk = `### **Assessment and Assignments for This Section**

  To ensure a comprehensive understanding of this section, you are required to complete all relevant assignments and assessments. Here's what you need to know:
  
  #### **Assignments**
  
  - After completing each section, visit the **[Assignments Page](#)** to find the specific assignments related to this roadmap.
  - The assignments are designed to reinforce your understanding of key concepts covered in this section.
  - Each assignment includes practical exercises and challenges that will help you apply what you've learned.
  
  #### **Passing Criteria**
  
  To successfully pass this section, you must:
  
  1. **Understand the Concepts Thoroughly**:
     - Review the **Learning Objectives** and ensure you grasp the fundamental ideas.
     - Engage with all the resources provided, including articles, videos, and interactive content.
  
  2. **Complete All In-Content Exercises**:
     - Exercises are embedded within each section to help you practice the concepts in real-time.
     - Make sure you complete them all to strengthen your understanding.
  
  3. **Finish All Related Assignments**:
     - Visit the **Assignments Page** and attempt the assignments after completing each section.
     - **Pro Tip**: If you find any assignment difficult, review the section again and revisit all the linked resources!
  
  #### **Tips for Success**
  
  - **Don’t Rush**: Take your time to digest the content before attempting the assignments.
  - **Review Regularly**: If you find gaps in your understanding, go back and revisit the section.
  - **Utilize All Resources**: Make sure you use all provided resources, including external articles, videos, and exercises.
  
  Happy Learning and Good Luck! `;

  const { roadmapId, sectionId } = useParams();
  const { data, loading } = useQuery(ME);

  const [section, setSection] = useState(null);
  const navigate = useNavigate();
  const [completeSection, { loading: enrollLoading }] = useMutation(
    COMPLETE_SECTION,
    {
      refetchQueries: [{ query: ME }],
    },
  );

  const moduleRefs = useRef([]);

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

      toast.success("Section completed. +10 points");
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

  const scrollToModule = (index) => {
    if (moduleRefs.current[index]) {
      moduleRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (loading || !data) {
    return <Loading />;
  }

  const renderers = {
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-blue-500"
      >
        {children}
      </a>
    ),
  };

  return (
    <div className="flex h-full w-screen flex-col bg-gray-100 bg-white p-4 md:w-full">
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
        <div className="grid grid-cols-1 gap-4 ">
          <div className="relative flex items-center justify-center">
            <LazyLoadImage
              src={section?.images[0]}
              alt={section?.title}
              className="w-full rounded-lg transition-opacity duration-500"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold">{section?.title}</h1>
            <h2 className="text-xl font-medium text-gray-700">
              {section?.description}
            </h2>
          </div>
        </div>
        <div className="mt-16 flex flex-col">
          <h1 className="mb-4 text-2xl font-bold">Modules</h1>
          <Carousel
            opts={{ loop: true }}
            plugins={[
              AutoScroll({
                playOnInit: true,
                stopOnMouseEnter: true,
                stopOnInteraction: false,
                speed: 0.5,
              }),
            ]}
            className="mx-auto w-full"
          >
            <CarouselContent className="w- ml-1">
              {section?.modules?.map((m, index) => (
                <CarouselItem
                  key={index}
                  className="select-none "
                >
                  <div className="p-1">
                    <Card key={index} className="w-full">
                      <CardContent className="space-y-2 p-4">
                        <h3 className="text-lg font-bold">{m.title}</h3>
                        <div className="flex w-full items-center justify-between">
                          <p className="text-gray-500 dark:text-gray-400">
                            {m.content.substring(0, 50)}...
                          </p>
                          <Button
                            variant={"outline"}
                            onClick={() => scrollToModule(index)}
                          >
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        {section?.modules.map((module, index) => (
          <div ref={(el) => (moduleRefs.current[index] = el)}>
            <h3 className="mb-4 mt-8 text-2xl font-semibold">{module.title}</h3>

            <Card key={index} className="mt-4 p-8">
              <ReactMarkdown components={renderers} className="prose">
                {module.content}
              </ReactMarkdown>
            </Card>
          </div>
        ))}{" "}
        <>
          <h3 className="mb-4 mt-4 text-2xl font-semibold">
            Assignemnts and Assesments
          </h3>

          <Card className="mt-4 p-8">
            <ReactMarkdown components={renderers} className="prose">
              {assessmentsTalk}
            </ReactMarkdown>
          </Card>
        </>
      </main>

      <div className="mb-12 mt-4 flex w-full justify-between px-2">
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
      <div className="border rounded-full absolute bottom-8 right-8"><ArrowUpWideNarrowIcon/></div>
    </div>
  );
};

export default Section;
