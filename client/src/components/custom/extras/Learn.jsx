import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import planeAnimationData from "../../../../public/PlaneAnimation.json";
import roadmapAnimationData from "../../../../public/RoadmapAnimation.json";
import followAnimationData from "../../../../public/FolowAnimation.json";
import structureAnimationData from "../../../../public/StructureAnimation.json";
import timeAnimationData from "../../../../public/TimeAnimation.json";
import calenderAnimationData from "../../../../public/CalenderAnimation.json";
import planeEndAnimation from "../../../../public/PlaneEndAnimation.json";

import Lottie from "lottie-react";

const Learn = () => {
  const [emblaApi, setEmblaApi] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const onboardingData = [
    {
      type: "animation",
      data: planeAnimationData,
      heading: "Welcome to Mehtab",
      description:
        "Discover how Mehtab transforms learning with its structured approach, designed to make your educational journey clear and enjoyable.",
    },
    {
      type: "animation",
      data: roadmapAnimationData,

      heading: "Explore Roadmaps",
      description:
        "Choose from a variety of roadmaps tailored to your interests and goals. Each roadmap provides a clear path to mastering new skills.",
    },
    {
      type: "animation",
      data: followAnimationData,
      heading: "Follow the Roadmap",
      description:
        "Start with foundational concepts and progressively delve deeper. Each step in the roadmap guides you to learn from trusted external sources.",
    },
    {
      type: "animation",
      data: structureAnimationData,
      heading: "Structured Learning",
      description:
        "Our platform links you to valuable external sources outside the course. Follow the structured learning path to ensure comprehensive understanding.",
    },
    {
      type: "animation",
      data: calenderAnimationData,
      heading: "Learn at Your Own Pace",
      description:
        "Progress through the roadmaps at your own speed. Take the time you need on each section, ensuring a deep understanding of the material.",
    },
    {
      type: "animation",
      data: timeAnimationData,
      heading: "Timely Assessments",
      description:
        "You will be given assignemnts and assesents to put your skills to the test and check your practical knowledge.",
    },
    {
      heading: "Ready to Start",
      description:
        "You’re all set to begin your learning journey. Dive in, stay dedicated, and provide feedback to help us improve your experience.",
      type: "animation",
      data: planeEndAnimation,
    },
  ];

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Carousel
        className="mx-auto h-3/4 w-full max-w-4xl"
        opts={{ loop: false }}
        setApi={setEmblaApi}
      >
        <CarouselContent>
          {onboardingData.map((item, index) => (
            <CarouselItem className='select-none' key={index}>
              <div className="p-6 text-center">
                <Card className="mx-auto w-full max-w-3xl">
                  <CardContent className="p-8">
                    {item.type === "animation" ? (
                      <Lottie
                        animationData={item.data}
                        className="mb-6 h-64 w-full object-cover"
                        loop={true}
                      />
                    ) : null}
                    <h2 className="mb-4 text-2xl font-semibold">
                      {item.heading}
                    </h2>
                    <p className="text-base text-gray-700">
                      {item.description}
                    </p>
                  </CardContent>
                  {index + 1 === onboardingData.length ? (
                    <Link to="/">
                      <Button className="mb-4 font-semibold">
                        Start Learning
                      </Button>
                    </Link>
                  ) : null}
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-6 flex justify-center">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`mx-2 h-3 w-3 rounded-full transition-all duration-300 ease-in-out ${
                currentIndex === index
                  ? "h-4 w-4 scale-150 bg-orange-500"
                  : "bg-gray-400"
              }`}
            />
          ))}
        </div>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default Learn;
