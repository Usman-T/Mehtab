import {
  MedalIcon,
  RocketIcon,
  SparkleIcon,
  BadgeIcon,
  ArrowRightIcon,
  BookIcon,
  LinkIcon,
  ExternalLinkIcon,
  ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@apollo/client";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ALL_ROADMAPS, ME } from "@/queries";
import { useEffect } from "react";
import Loading from "../extras/Loading";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("mehtab-user-token")) {
      return navigate("/onboarding");
    }
  }, []);

  const { data: meData, loading: meLoading } = useQuery(ME);
  const { data: roadmapData, loading: roadmapLoading } = useQuery(ALL_ROADMAPS);

  if (meLoading || roadmapLoading) {
    return <Loading />;
  }
  const showAlert = () => {
    if (localStorage.getItem("understood") === "false") {
      return "carousel";
    }

    const randomNumber = Math.floor(Math.random() * 5) + 1;
    switch (randomNumber) {
      case 2:
        return "learningTime";
      default:
        return null;
    }
  };

  const hasActiveCourses = meData?.me?.progress?.length > 0;

  const getPluralizedText = (count, singular, plural) =>
    count === 1 ? singular : plural;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 px-6 py-8 md:px-10 lg:px-16">
        <div className="mb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Welcome to Mehtab</h3>
            <div className="md:flex-rowflex w-full flex-col items-center md:justify-between">
              <Link to="/learn">
                <p>
                  Learn the{" "}
                  <span className="items-center underline hover:cursor-pointer">
                    optimal way
                  </span>{" "}
                  to progress in these courses.
                </p>
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="col-span-1 flex flex-col gap-4 bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Active Roadmaps</h3>
              </div>
            </div>
            {hasActiveCourses ? (
              <Carousel
                opts={{ loop: true, autoplay: true, autoplayTimeout: 5000 }}
                className="w-full"
              >
                <CarouselContent>
                  {meData.me.progress.map((p) => (
                    <CarouselItem key={p.roadmap.id}>
                      <div className="flex flex-col gap-4">
                        <LazyLoadImage
                          src={p.roadmap.image}
                          alt={p.roadmap.title}
                          className="aspect-video scale-100 rounded-lg grayscale-0 duration-500 ease-in-out"
                          style={{
                            aspectRatio: "1920/1080",
                            objectFit: "cover",
                            filter: "blur(20px)",
                            transition: "filter 0.5s ease",
                          }}
                          onLoad={(e) => (e.target.style.filter = "blur(0px)")}
                        />
                        <div>
                          <h4 className="text-lg font-semibold">
                            {p.roadmap.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {p.roadmap.description.substring(0, 120)}...
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {Math.round(
                                (p.completedSections.length /
                                  p.roadmap.sections.length) *
                                  100,
                              )}
                              % Completed
                            </span>
                          </div>
                          <Link
                            to={`/study/${p.roadmap.id}`}
                            className="text-primary hover:underline"
                          >
                            Continue
                          </Link>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="flex h-full flex-col justify-between text-center text-muted-foreground">
                <p className="my-auto">
                  You haven't enrolled in any roadmaps yet.
                </p>
                <Link to="/roadmaps">
                  <Button className="mx-auto mt-auto flex w-1/2 items-center justify-center space-x-2 rounded bg-primary px-4 py-2 text-white">
                    <p className="font-semibold">Explore </p>
                    <ExternalLinkIcon className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            )}
          </Card>
          <Card className="flex flex-col gap-4 bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Recommended Roadmaps</h3>
              </div>
              <Link to="/roadmaps" className="text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="grid gap-4">
              {roadmapData?.allRoadmaps.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4"
                >
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    <BookIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {r.description.substring(0, 30)}...
                    </div>
                  </div>
                  <Link to={`/roadmaps/${r.id}`}>
                    <Button variant="outline" size="icon">
                      <ArrowRightIcon className="h-4 w-4" />
                      <span className="sr-only">View course</span>
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
          <Card className="flex flex-col gap-4 bg-card p-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Achievements</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <BadgeIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center text-sm font-medium">
                  {meData?.me?.progress?.length}{" "}
                  {getPluralizedText(
                    meData?.me?.progress?.length,
                    "Roadmap",
                    "Roadmaps",
                  )}{" "}
                  Enrolled
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <RocketIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center text-sm font-medium">
                  {meData?.me?.progress.reduce(
                    (acc, p) =>
                      acc +
                      (p.completedSections.length === p.roadmap.sections.length
                        ? 1
                        : 0),
                    0,
                  )}{" "}
                  {getPluralizedText(
                    meData?.me?.progress.reduce(
                      (acc, p) =>
                        acc +
                        (p.completedSections.length ===
                        p.roadmap.sections.length
                          ? 1
                          : 0),
                      0,
                    ),
                    "Roadmap",
                    "Roadmaps",
                  )}{" "}
                  Completed
                </div>
                <div className="text-xs text-muted-foreground"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <MedalIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center text-sm font-medium">
                  {meData?.me?.progress?.reduce(
                    (acc, prog) => acc + prog.completedSections.length,
                    0,
                  )}{" "}
                  {getPluralizedText(
                    meData?.me?.progress?.reduce(
                      (acc, prog) => acc + prog.completedSections.length,
                      0,
                    ),
                    "Section",
                    "Sections",
                  )}{" "}
                  Completed
                </div>
                <div className="text-xs text-muted-foreground"></div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <SparkleIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-center text-sm font-medium">
                  {meData.me.points} Points
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
