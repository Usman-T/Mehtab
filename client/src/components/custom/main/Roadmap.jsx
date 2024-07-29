import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ALL_ROADMAPS } from "@/queries";
import { ClipLoader } from "react-spinners";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleCheck } from "lucide-react";
import toast from "react-hot-toast";

const ENROLL_USER = gql`
  mutation ($roadmapId: ID!) {
    enrollUser(roadmapId: $roadmapId) {
      progress {
        roadmap {
          title
        }
        completedSections {
          title
        }
      }
    }
  }
`;

const Roadmap = () => {
  const [enrollUser] = useMutation(ENROLL_USER);

  const navigate = useNavigate();

  const { loading, data } = useQuery(ALL_ROADMAPS);
  const [roadmap, setRoadmap] = useState(null);
  const [yearly, setYearly] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    if (!loading && data && !roadmap) {
      const currentRoadmap = data.allRoadmaps.find((r) => r.id === id);
      if (currentRoadmap) {
        setRoadmap(currentRoadmap);
      }
    }
  }, [loading, data, id, roadmap]);

  if (loading || !roadmap) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={64} />
      </div>
    );
  }

  const handleEnrollment = async () => {
    if (!localStorage.getItem("vertex-user-token")) {
      return toast.error("Must be logged in to enroll in a course");
    }

    try {
      await enrollUser({ variables: { roadmapId: id } });

      toast.success("Enrolled in course");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (error.message === "User already enrolled in this roadmap") {
        return toast.error("You are already enrolled in the course");
      } else if (
        error.message === "User not found" ||
        error.message === "Invalid Token"
      ) {
        return toast.error("Login to enroll the course");
      }
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-4 md:w-3/4 mt-8">
        <div className="mb-4">
          <div className="relative aspect-video  w-full overflow-clip rounded-md border-b">
            <LazyLoadImage
              src={roadmap.image}
              alt={roadmap.title}
              className="scale-100 grayscale-0 duration-500 ease-in-out"
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
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4">
            <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              {roadmap.sections.length} Sections
            </span>
          </div>
          <h2 className="mb-4 text-2xl font-bold">{roadmap.title}</h2>
          <p className="text-sm text-slate-500">{roadmap.description}</p>
        </div>
      </div>
      <div className="space-y-4 p-4 md:w-1/2">
        <Card className="rounded-lg p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold">Ready to start?</h3>
          <p className="mb-4">
            Track your progress, watch with subtitles, change quality & speed,
            and more.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">Start Learning</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center justify-center sm:max-w-md">
              <h2 className="mb-4 text-2xl font-bold">
                <DialogHeader>
                  <DialogTitle> {yearly ? "Yearly" : "Monthly"}</DialogTitle>
                </DialogHeader>
              </h2>
              <div className="mb-4 flex w-full px-2">
                <Button
                  className={`w-full rounded-r-none ${yearly ? "bg-primary/80 text-secondary hover:bg-primary hover:text-primary-foreground" : ""}`}
                  variant="outline"
                  onClick={() => setYearly(true)}
                >
                  Yearly
                </Button>
                <Button
                  className={`w-full rounded-l-none ${!yearly ? "bg-primary/80 text-secondary hover:bg-primary hover:text-primary-foreground" : ""}`}
                  variant="outline"
                  onClick={() => setYearly(false)}
                >
                  Monthly
                </Button>
              </div>
              <div className="mb-4 text-4xl font-bold">
                ${yearly ? "0" : "0"}/mo
              </div>

              <ul className="mb-4 list-none">
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-primary">
                    <CircleCheck />
                  </span>{" "}
                  Full access to course
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-primary">
                    <CircleCheck />
                  </span>{" "}
                  Unlock All sections
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-primary">
                    <CircleCheck />
                  </span>{" "}
                  Regular new content
                </li>
                <li className="mb-2 flex items-center">
                  <span className="mr-2 text-primary">
                    <CircleCheck />
                  </span>{" "}
                  Intuitive interface
                </li>
              </ul>
              <Button onClick={() => handleEnrollment()} className="w-full">
                Enroll
              </Button>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </div>
  );
};

export default Roadmap;
