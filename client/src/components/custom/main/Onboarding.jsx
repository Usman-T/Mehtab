import { useRef } from "react";
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircle2Icon,
  DraftingCompassIcon,
  GithubIcon,
  InstagramIcon,
  MoonIcon,
  LogOutIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { CardContent, Card } from "@/components/ui/card";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useQuery } from "@apollo/client";
import { ALL_ROADMAPS, ALL_UPCOMING_ROADMAPS } from "@/queries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import toast from "react-hot-toast";

const Landing = () => {
  const coursesRef = useRef(null);
  const navigate = useNavigate();

  const result = useQuery(ALL_ROADMAPS);
  const upcomingResult = useQuery(ALL_UPCOMING_ROADMAPS);

  if (result.loading || !result.data || upcomingResult.loading) {
    return (
      <div className="absolute top-0 w-full">
        <div className="relative flex h-screen flex-col items-center justify-center">
          <div className="animate-spin">
            <div className="flex flex-col md:flex-row">
              <MoonIcon className="h-16 w-16 text-gray-900" />
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
    <div className="h-screen">
      <div className="relative h-screen overflow-x-hidden">
        <div className="top-0 flex h-16 w-screen items-center justify-between bg-white px-4">
          <div className="mx-[5%] flex items-center space-x-2">
            <MoonIcon className="h-6 w-6 text-secondary-foreground lg:block" />
            <span className="hidden text-xl font-semibold text-secondary-foreground lg:inline">
              Mehtab
            </span>
          </div>
          <div className="mx-[5%] flex space-x-2">
            <Button
              variant={"ghost"}
              onClick={() => navigate("/register")}
              className="flex space-x-2"
            >
              <LogOutIcon className="h-4 w-4" />
              <p>Register</p>
            </Button>
          </div>
        </div>
        <div className="h-screen">
          <div className="flex h-1/2 flex-col items-center justify-center space-y-4 p-4">
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
                Define Your Own Path
              </h1>
            </div>
            <h2 className="text-center text-lg text-secondary-foreground">
              Learn valueable skills with structured paths and a lively
              community
            </h2>
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <Link to="/register">
                <Button className="w-full font-semibold md:w-auto">
                  Get Started
                </Button>
              </Link>
              <Button
                variant={"outline"}
                onClick={scrollToCourses}
                className="w-full md:w-auto"
              >
                Roadmaps
              </Button>
            </div>
          </div>
          <section
            className="w-full bg-gray-50 py-12 md:py-24 lg:py-32"
            ref={coursesRef}
          >
            <div className="space-y-12 px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-center text-2xl font-bold md:text-4xl">
                    Explore Our Roadmaps
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
                    speed: 0.5,
                  }),
                ]}
                className="mx-auto w-full"
              >
                <CarouselContent className="ml-1">
                  {upcomingResult?.data?.allUpcomingRoadmaps?.map(
                    (r, index) => (
                      <CarouselItem
                        key={index}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
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
                                onLoad={(e) =>
                                  (e.target.style.filter = "blur(0px)")
                                }
                              />
                            </div>
                            <CardContent className="space-y-2 p-4">
                              <h3 className="text-lg font-bold">{r.title}</h3>
                              <div className="flex w-full items-center justify-between">
                                <p className="text-gray-500 dark:text-gray-400">
                                  {r.description.substring(0, 50)}...
                                </p>
                                <Link to={`/roadmaps/${r.id}`}>
                                  <Button variant={"outline"}>View More</Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ),
                  )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </section>
          <div className="flex flex-col items-center justify-center space-y-8 py-16">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Mehtab's Promise
              </h2>
              <p className="text-lg text-gray-600">
                Our platform is built with features that ensure you succeed.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-2 md:px-8 lg:px-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center rounded-full bg-secondary p-4">
                  <DraftingCompassIcon className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Structured Learning Paths
                </h3>
                <p className="mt-2 text-gray-500">
                  Follow clear, step-by-step roadmaps <br /> to build skills
                  efficiently.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center rounded-full bg-secondary p-4">
                  <UsersIcon className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Engaging Community
                </h3>
                <p className="mt-2 text-gray-500">
                  Join a lively community to connect, <br /> collaborate, and
                  grow together.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center rounded-full bg-secondary p-4">
                  <CheckCircle2Icon className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Personalized Assessments
                </h3>
                <p className="mt-2 text-gray-500">
                  Get one-on-one feedback from instructors <br />
                  tailored to your progress.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center rounded-full bg-secondary p-4">
                  <CalendarIcon className="h-10 w-10" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  Regular Assignments
                </h3>
                <p className="mt-2 text-gray-500">
                  Stay on track with weekly and monthly <br />
                  assignments to reinforce learning.
                </p>
              </div>
            </div>
          </div>{" "}
          <div className="flex flex-col items-center justify-center space-y-8 bg-gray-50 px-8 py-16">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Behind the Code
              </h2>
              <Card className="mx-auto max-w-4xl py-8">
                <CardContent>
                  <div className="flex h-full flex-col items-center justify-center space-y-4 md:flex-row md:items-start md:space-x-6 md:space-y-0">
                    <LazyLoadImage
                      src="/creator.jpg"
                      alt="Developer"
                      className="my-auto h-32 w-32 scale-100 rounded-full grayscale-0 duration-500 ease-in-out"
                      style={{
                        aspectRatio: "1920/1080",
                        objectFit: "cover",
                        filter: "blur(20px)",
                        transition: "filter 0.5s ease",
                      }}
                      loading="lazy"
                      onLoad={(e) => (e.target.style.filter = "blur(0px)")}
                    />
                    <div className="flex flex-col items-center md:items-start">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        Usman Tanveer
                      </h3>
                      <p className="mt-4 text-center text-gray-600 md:text-left">
                        Hi, I’m Usman, the developer of this platform. I believe
                        in the power of curiosity and hard work. I’m dedicated
                        to creating meaningful solutions and constantly learning
                        to improve my skills. My goal is to inspire others to
                        pursue their passions with enthusiasm and integrity. I
                        aim to make a difference in everything I do.
                      </p>
                      <div className="mt-4 flex flex-col text-lg font-semibold md:flex-row">
                        <p>Want to reach me?</p>
                        <div>
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText("03298226969");
                              toast.success("Phone number copied to clipboard");
                            }}
                            className="cursor-pointer"
                            variant={"ghost"}
                          >
                            <>
                              <svg
                                stroke-linejoin="round"
                                viewBox="0 0 16 16"
                                className="text-primary w-6 h-6"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M13.6376 2.32334C12.1421 0.825856 10.153 0.000759757 8.03365 0C3.66658 0 0.112432 3.55377 0.110912 7.92199C0.110152 9.31841 0.475216 10.6814 1.1685 11.8826L0.0444336 15.9883L4.24437 14.8867C5.40147 15.5181 6.70446 15.8504 8.03025 15.8508H8.03365C12.4 15.8508 15.9545 12.2967 15.956 7.92844C15.9568 5.8114 15.1336 3.8212 13.6376 2.32372V2.32334ZM8.03365 14.5129H8.031C6.84956 14.5125 5.69058 14.1949 4.67935 13.5951L4.43887 13.4523L1.94649 14.106L2.61166 11.6759L2.45514 11.4267C1.79605 10.3783 1.4477 9.16645 1.44846 7.92239C1.44998 4.29187 4.40392 1.33793 8.03635 1.33793C9.79515 1.33869 11.4484 2.02438 12.6917 3.26924C13.9351 4.51372 14.6192 6.16849 14.6185 7.92769C14.6169 11.5586 11.663 14.5125 8.03365 14.5125V14.5129ZM11.6455 9.5813C11.4476 9.48217 10.4744 9.00349 10.2928 8.93741C10.1112 8.87129 9.97942 8.83828 9.84757 9.03655C9.71577 9.23487 9.33628 9.68084 9.22079 9.81264C9.1053 9.94484 8.9898 9.96119 8.79188 9.86201C8.594 9.76287 7.95617 9.55394 7.19984 8.87965C6.61142 8.35465 6.21402 7.70661 6.09858 7.50829C5.98309 7.31001 6.08642 7.20287 6.18516 7.10449C6.27405 7.0156 6.38309 6.87315 6.48222 6.75766C6.58141 6.64217 6.61407 6.55938 6.68015 6.42754C6.74627 6.29534 6.71321 6.17989 6.66384 6.08071C6.61442 5.98157 6.21862 5.00716 6.05336 4.61096C5.89265 4.22501 5.72934 4.27744 5.60815 4.27098C5.49265 4.26528 5.36085 4.26414 5.22865 4.26414C5.09646 4.26414 4.88218 4.31352 4.70061 4.51182C4.51904 4.7101 4.00771 5.18913 4.00771 6.16314C4.00771 7.13715 4.71696 8.07889 4.8161 8.21109C4.91524 8.34329 6.21212 10.3426 8.19776 11.2004C8.66998 11.4043 9.03882 11.5263 9.32638 11.6175C9.8005 11.7683 10.232 11.747 10.5731 11.6961C10.9534 11.6391 11.7443 11.2171 11.9092 10.7547C12.074 10.2924 12.074 9.89582 12.0247 9.81339C11.9753 9.73096 11.8431 9.68119 11.6452 9.58206L11.6455 9.5813Z"
                                ></path>
                              </svg>
                            </>
                          </Button>
                          <Button variant={"ghost"}>
                            <Link
                              className="cursor-pointer"
                              to={"https://www.instagram.com/usman.da.dev/"}
                              target="_blank"
                            >
                              <InstagramIcon />
                            </Link>
                          </Button>
                          <Button variant={"ghost"}>
                            <Link
                              className="cursor-pointer"
                              to={"https://github.com/Usman-T"}
                              target="_blank"
                            >
                              <GithubIcon />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
