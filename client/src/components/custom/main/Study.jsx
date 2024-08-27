import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  BookIcon,
  ArrowRightIcon,
  TrendingUp,
  CheckIcon,
  Terminal,
  ExternalLinkIcon,
} from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Button } from "@/components/ui/button";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import toast from "react-hot-toast";
import { ME } from "@/queries";
import Loading from "../extras/Loading";

const Study = () => {
  const chartConfig = {
    completion: {
      label: "completion",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-1))",
    },
  };

  const { id } = useParams();
  const { loading, data } = useQuery(ME);
  const [roadmap, setRoadmap] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!loading && data && !roadmap) {
      const currentRoadmap = data.me.progress.find((p) => p.roadmap.id === id);

      if (currentRoadmap) {
        setRoadmap(currentRoadmap);
        setChartData([
          {
            browser: "safari",
            completion:
              (currentRoadmap.completedSections.length /
                currentRoadmap.roadmap.sections.length) *
              100,
            fill: "var(--color-safari)",
          },
        ]);
      } else {
        toast.error("Roadmap not found");
      }
    }
  }, [loading, data, id, roadmap]);

  if (loading || !roadmap || !chartData) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 px-6 py-8 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader className="mb-4 items-center pb-0">
              <CardTitle className="text-lg md:text-xl lg:text-2xl">
                Progress
              </CardTitle>
              <CardDescription className="text-center text-sm md:text-base lg:text-lg">
                Keep focused and continue learning!
              </CardDescription>
            </CardHeader>
            <CardContent className="z-50 flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <RadialBarChart
                  data={chartData}
                  innerRadius={80}
                  outerRadius={110}
                  startAngle={90}
                  endAngle={(360 * chartData[0].completion) / 100 + 90}
                >
                  <PolarGrid
                    gridType="circle"
                    radialLines={false}
                    stroke="none"
                    className="relative first:fill-muted last:fill-background"
                    polarRadius={[82, 70]}
                  />
                  <RadialBar
                    dataKey="completion"
                    background
                    cornerRadius={20}
                  />
                  <PolarRadiusAxis
                    tick={false}
                    tickLine={false}
                    axisLine={false}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {Math.round(chartData[0].completion)}%
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground text-sm"
                              >
                                Completed
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-center text-center font-medium leading-none">
                Completed {roadmap.completedSections.length} out of{" "}
                {roadmap.roadmap.sections.length}{" "}
                <TrendingUp className="ml-1 h-4 w-4" />
              </div>
              <div className="text-center text-xs leading-none text-muted-foreground md:text-sm lg:text-base">
                Showing progress made in the roadmap's completion
              </div>
            </CardFooter>
          </Card>
          <Card className="flex flex-col gap-4 bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                  {roadmap.roadmap.title}
                </h3>
              </div>
            </div>
            {true ? (
              <Carousel
                opts={{ loop: true, autoplay: true, autoplayTimeout: 5000 }}
                className="w-full"
              >
                <CarouselContent>
                  {roadmap.roadmap?.sections?.map((section) => (
                    <CarouselItem key={section.id}>
                      <div className="flex flex-col gap-4">
                        <LazyLoadImage
                          src={section.images[0]}
                          alt={section.title}
                          className="aspect-video scale-100 rounded-lg grayscale-0 duration-500 ease-in-out"
                          style={{
                            aspectRatio: "1920/1080",
                            objectFit: "cover",
                            filter: "blur(20px)",
                            transition: "filter 0.5s ease",
                          }}
                          loading="lazy"
                          onLoad={(e) => (e.target.style.filter = "blur(0px)")}
                        />
                        <div>
                          <h4 className="text-lg font-semibold">
                            {section.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {section.description.substring(0, 150)}...
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {section.title}
                            </span>
                          </div>
                          <Link
                            to={`/study/${roadmap.roadmap.id}/${section.id}`}
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
              <div className="text-center text-muted-foreground">
                <p>You haven't enrolled in any courses yet.</p>
                <Link
                  to="/roadmaps"
                  className="mt-4 inline-block rounded bg-primary px-4 py-2 text-white"
                >
                  Explore Courses
                </Link>
              </div>
            )}
          </Card>
          <Card className="flex flex-col gap-4 bg-card p-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Course Contents</h3>
              </div>
              <Link to="/roadmaps" className="text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="grid gap-4">
              {roadmap.roadmap.sections.map((section) => (
                <div
                  key={section.id}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-4"
                >
                  <div className="rounded-full bg-primary p-2 text-primary-foreground">
                    {roadmap?.completedSections
                      ?.map((section) => section.id)
                      .includes(section.id) ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <BookIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{section.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {section.description.substring(0, 80)}...
                    </div>
                  </div>
                  <Link to={`/study/${roadmap.roadmap.id}/${section.id}`}>
                    <Button variant="outline" size="icon">
                      <ArrowRightIcon className="h-4 w-4" />
                      <span className="sr-only">View course</span>
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Study;
