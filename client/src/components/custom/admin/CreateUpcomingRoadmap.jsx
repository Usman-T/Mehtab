import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { ALL_ROADMAPS, CREATE_UPCOMING_ROADMAP } from "@/queries";
import { Button } from "@/components/ui/button";

const CreateUpcomingRoadmap = () => {
  const [createUpcomingRoadmap] = useMutation(CREATE_UPCOMING_ROADMAP, {
    refetchQueries: [ALL_ROADMAPS],
  });

  const [roadmapTitle, setRoadmapTitle] = useState("");
  const [roadmapDescription, setRoadmapDescription] = useState("");
  const [roadmapImage, setRoadmapImage] = useState("");

  const navigate = useNavigate();

  const saveUpcomingRoadmap = () => {
    if (!roadmapTitle || !roadmapDescription || !roadmapImage) {
      return toast.error("Incomplete roadmap data");
    }

    console.log({
      variables: {
        title: roadmapTitle,
        description: roadmapDescription,
        image: roadmapImage,
      },
    });

    createUpcomingRoadmap({
      variables: {
        title: roadmapTitle,
        description: roadmapDescription,
        image: roadmapImage,
      },
    });

    toast.success("Created roadmap successfully");
    setRoadmapTitle("");
    setRoadmapImage("");
    setRoadmapDescription("");
    navigate("/roadmaps");
  };

  return (
    <Card className="py-8">
      <div className="grid gap-8">
        <CardContent>
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold">Upcoming Roadmap</h2>
            <div className="grid gap-2">
              <Label htmlFor="title">Roadmap Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter roadmap title"
                value={roadmapTitle}
                onChange={(e) => setRoadmapTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Roadmap Description</Label>
              <Textarea
                id="description"
                placeholder="Enter roadmap description"
                value={roadmapDescription}
                onChange={(e) => setRoadmapDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Roadmap Image</Label>
              <Input
                id="image"
                type="text"
                placeholder="Enter roadmap cover image"
                value={roadmapImage}
                onChange={(e) => setRoadmapImage(e.target.value)}
              />
              {roadmapImage && (
                <LazyLoadImage
                  src={roadmapImage}
                  alt="haha"
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
              )}
            </div>
          </div>
          <div className="mt-16 flex justify-end gap-4">
            <Button onClick={saveUpcomingRoadmap}>Create roadmap</Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default CreateUpcomingRoadmap;
