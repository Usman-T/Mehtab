import { useRef } from "react";
import {
  ArrowRightIcon,
  DraftingCompassIcon,
  LightbulbIcon,
  LogOutIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { CardContent, Card } from "@/components/ui/card";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useQuery } from "@apollo/client";
import { ALL_ROADMAPS } from "@/queries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

const Landing = () => {
  const coursesRef = useRef(null);
  const navigate = useNavigate();

  const result = useQuery(ALL_ROADMAPS);

  if (result.loading || !result.data) {
    return (
      <div className="absolute top-0 w-full">
        <div className="relative flex h-screen flex-col items-center justify-center">
          <div className="animate-spin">
            <div className="flex flex-col md:flex-row">
              <LightbulbIcon className="h-16 w-16 text-gray-900" />
            </div>
          </div>

          <p className="mt-8 text-center text-gray-500">
            Hang tight, <br /> we're getting everything ready for you!
          </p>
          <div className="absolute bottom-4 w-full text-sm text-gray-500">
            <div className="flex flex-col items-center justify-center text-center"></div>
          </div>
        </div>
      </div>
    );
  }

  const scrollToCourses = () => {
    coursesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative overflow-x-hidden">
      <div className="absolute top-0 flex h-16 w-screen items-center justify-between bg-white px-4">
        <div className="flex items-center space-x-2">
          <LightbulbIcon className="h-6 w-6 text-secondary-foreground lg:block" />
          <span className="hidden text-xl font-semibold text-secondary-foreground lg:inline">
            Rivis
          </span>
        </div>
        <div>
          <Button
            onClick={() => navigate("/login")}
            className="flex space-x-2"
            variant={"outline"}
          >
            <LogOutIcon className="h-4 w-4" />
            <p>Login</p>
          </Button>
        </div>
      </div>
      <div className="flex h-screen flex-col items-center justify-center space-y-4 p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 rounded-lg border bg-gray-100 px-2 py-1">
            <DraftingCompassIcon className="h-5 w-5" />
            <div className="flex items-center space-x-2">
              <p className="font-medium text-foreground hover:cursor-pointer">
                Releasing in beta
              </p>
              <ArrowRightIcon className="h-5 w-5 text-black" />
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold md:text-5xl">
            Be Capable, not label-able
          </h1>
        </div>
        <h2 className="text-center text-lg text-secondary-foreground">
          Unlock your full potential with our structured learning approach.
        </h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <Link to="/register">
            <Button className="w-full md:w-auto">Get Started</Button>
          </Link>
          <Button
            variant={"outline"}
            onClick={scrollToCourses}
            className="w-full md:w-auto"
          >
            Courses
          </Button>
        </div>
      </div>
      <section className="w-full h-screen py-12 md:py-24 lg:py-32" ref={coursesRef}>
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-center text-2xl font-bold md:text-4xl">
                Explore Our Courses
              </h2>
              <p className="text-center text-lg text-secondary-foreground">
                Unlock your full potential with our structured learning
                approach.
              </p>
            </div>
          </div>
          <Carousel
            opts={{ loop: true }}
            plugins={[
              AutoScroll({
                playOnInit: true,
                stopOnMouseEnter: true,
                stopOnInteraction: false,
              }),
            ]}
            className="mx-auto w-full"
          >
            <CarouselContent className="ml-1">
              {result?.data?.allRoadmaps?.map((r, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card key={index} className="w-full">
                      <div className="relative aspect-video w-full overflow-clip rounded-md border-b">
                        <LazyLoadImage
                          src={r.image}
                          alt={r.title}
                          className="w-full scale-100 grayscale-0 duration-500 ease-in-out"
                          style={{
                            aspectRatio: "1920/1080",
                            objectFit: "cover",
                            filter: "blur(20px)",
                            transition: "filter 0.5s ease",
                          }}
                          loading="lazy"
                          onLoad={(e) => (e.target.style.filter = "blur(0px)")}
                        />
                      </div>
                      <CardContent className="space-y-2 p-4">
                        <h3 className="text-lg font-bold">{r.title}</h3>
                        <div className="flex w-full items-center justify-between">
                          <p className="text-gray-500 dark:text-gray-400">
                            {r.description.substring(0, 50)}...
                          </p>
                          <Button
                            variant={"outline"}
                            onClick={() => navigate(`/roadmaps/${r.id}`)}
                          >
                            View Course
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Philosophy</h2>
              <p className="text-lg">
                We believe that a structured learning path and a disciplined
                approach are sufficient to make anyone proficient in any skill.
                That's why Rivis offers roadmaps that anyone can follow to
                master any skill.
              </p>
            </div>
            <div className="relative aspect-video w-full overflow-clip rounded-md">
              <LazyLoadImage
                src={"https://cdn-icons-png.flaticon.com/512/2116/2116935.png"}
                className="aspect-video w-full scale-100 object-contain blur-[20px] grayscale-0 duration-500 ease-in-out"
                style={{
                  filter: "blur(20px)",
                  transition: "filter 0.5s ease",
                }}
                loading="lazy"
                onLoad={(e) => (e.target.style.filter = "blur(0px)")}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
