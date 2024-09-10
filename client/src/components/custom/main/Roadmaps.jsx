import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { AlertCircle, BookOpenIcon, Code, Search } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, useNavigate } from "react-router-dom";
import { ALL_ROADMAPS, ALL_UPCOMING_ROADMAPS } from "@/queries";
import Loading from "../extras/Loading";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Roadmaps = () => {
  const { loading: loadingRoadmaps, data: dataRoadmaps } =
    useQuery(ALL_ROADMAPS);
  const { loading: loadingUpcoming, data: dataUpcoming } = useQuery(
    ALL_UPCOMING_ROADMAPS,
  );

  const navigate = useNavigate();

  if (loadingRoadmaps || loadingUpcoming) {
    return <Loading />;
  }

  const allRoadmaps = dataRoadmaps?.allRoadmaps || [];
  const upcomingRoadmaps = dataUpcoming?.allUpcomingRoadmaps || [];

  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-semibold">Active Roadmaps</h2>
        {allRoadmaps.length > 0 ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {allRoadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                navigate={navigate}
              />
            ))}
          </div>
        ) : (
          <Alert className="mt-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6" />
              <h3 className="text-xl font-semibold"> No roadmaps found</h3>
            </div>
            <AlertDescription className="hover:cursor-pointer">
              <Link to="/community">
                No active roadmaps were found, vote for upcoming roadmaps{" "}
                <span className="underline">here</span>
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </div>
      <h2 className="p-4 text-xl font-semibold">Upcoming Roadmaps</h2>
      <div className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {upcomingRoadmaps.length > 0 ? (
          upcomingRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              navigate={navigate}
            />
          ))
        ) : (
          <p>No roadmaps found.</p>
        )}
      </div>
    </>
  );
};

export default Roadmaps;

const RoadmapCard = ({ roadmap, navigate }) => {
  return (
    <Card
      onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
      className="hover:cursor-pointer"
    >
      <CardContent className="p-0">
        <div>
          <div className="relative aspect-video w-full overflow-hidden rounded-t-md border-b">
            <LazyLoadImage
              src={roadmap.image}
              alt={roadmap.title}
              className="h-full w-full object-cover duration-500 ease-in-out"
              style={{
                filter: "blur(20px)",
                transition: "filter 0.5s ease",
              }}
              loading="lazy"
              onLoad={(e) => (e.target.style.filter = "blur(0px)")}
            />
          </div>

          <div className="flex flex-col px-3 pt-2">
            <h1 className="line-clamp-1 text-sm font-medium transition group-hover:text-sky-700 md:text-base">
              {roadmap.title}
            </h1>
            <div className="my-3 flex items-center gap-x-2 text-xs">
              <div className="mt-2 flex items-start text-slate-500">
                <div className="inline-flex items-center justify-center space-x-1 rounded-md border border-transparent bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-800 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <BookOpenIcon className="h-4 w-4" />
                  <p>
                    {roadmap.sections
                      ? `${roadmap.sections.length} Sections`
                      : `${Math.floor(Math.random() * (15 - 9 + 1)) + 9} Sections`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3"></div>
        </div>
      </CardContent>
    </Card>
  );
};
