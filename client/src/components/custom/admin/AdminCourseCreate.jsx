import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALL_ROADMAPS, CREATE_ROADMAP } from "@/queries";
import CreateActiveRoadmap from "./CreateActiveRoadmap";
import CreateUpcomingRoadmap from "./CreateUpcomingRoadmap";

const AdminRoadmapCreate = () => {
  const [createRoadmap] = useMutation(CREATE_ROADMAP, {
    refetchQueries: [ALL_ROADMAPS],
  });

  const [roadmapTitle, setRoadmapTitle] = useState("");
  const [roadmapDescription, setRoadmapDescription] = useState("");
  const [roadmapImage, setRoadmapImage] = useState("");
  const [sections, setSections] = useState([
    {
      title: "Introduction",
      content: "",
      description: "",
      images: [""],
    },
  ]);

  const navigate = useNavigate();

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "",
        content: "",
        description: "",
        images: [""],
      },
    ]);
  };

  const updateSection = (index, field, value) => {
    const updatedSections = [...sections];
    updatedSections[index][field] = value;
    setSections(updatedSections);
  };

  const removeSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const addImage = (sectionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].images.push("");
    setSections(updatedSections);
  };

  const updateImage = (sectionIndex, imageIndex, value) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].images[imageIndex] = value;
    setSections(updatedSections);
  };

  const removeImage = (sectionIndex, imageIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].images.splice(imageIndex, 1);
    setSections(updatedSections);
  };

  const saveRoadmap = () => {
    const completedSections = sections.filter(
      (section) => section.title && section.content && section.description,
    );

    if (
      !roadmapTitle ||
      !roadmapDescription ||
      !roadmapImage ||
      completedSections.length !== sections.length
    ) {
      return toast.error("Incomplete roadmap data");
    }

    console.log({
      variables: {
        title: roadmapTitle,
        description: roadmapDescription,
        image: roadmapImage,
        sections,
      },
    });

    createRoadmap({
      variables: {
        title: roadmapTitle,
        description: roadmapDescription,
        image: roadmapImage,
        sections,
      },
    });

    toast.success("Created roadmap successfully");
    setRoadmapTitle("");
    setRoadmapImage("");
    setRoadmapDescription("");
    setSections([{ title: "", content: "", description: "", images: [""] }]);
    navigate("/roadmaps");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Tabs defaultValue="create">
        <TabsList className="w-full">
          <TabsTrigger
            className="border-rounded-r-none w-full border"
            value="create"
          >
            Create
          </TabsTrigger>
          <TabsTrigger
            className="border-rounded-l-none w-full border"
            value="upcoming"
          >
            Upcoming
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreateActiveRoadmap />
        </TabsContent>
        <TabsContent value="upcoming">
          <CreateUpcomingRoadmap />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRoadmapCreate;
