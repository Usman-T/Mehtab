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
import { ALL_ROADMAPS, CREATE_ROADMAP } from "@/queries";

const CreateActiveRoadmap = () => {
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

  const saveRoadmap = (isDraft = false) => {
    const completedSections = sections.filter(
      (section) => section.title && section.content && section.description,
    );

    if (
      !roadmapTitle ||
      !roadmapDescription ||
      !roadmapImage ||
      (!isDraft && completedSections.length !== sections.length)
    ) {
      return toast.error("Incomplete roadmap data");
    }

    const variables = {
      title: roadmapTitle,
      description: roadmapDescription,
      image: roadmapImage,
      sections,
      draft: isDraft, // Add status field
    };

    createRoadmap({ variables });

    toast.success(
      isDraft ? "Draft saved successfully" : "Roadmap created successfully",
    );

    setRoadmapTitle("");
    setRoadmapImage("");
    setRoadmapDescription("");
    setSections([{ title: "", content: "", description: "", images: [""] }]);

    navigate("/roadmaps");
  };
  return (
    <Card className="py-8">
      <div className="grid gap-8">
        <CardContent>
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold">Active Roadmap</h2>
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
            </div>
          </div>
          <div className="grid gap-6">
            <div className="mt-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Roadmap Sections</h2>
              <Button onClick={addSection}>Add Section</Button>
            </div>
            <div className="grid gap-6">
              {sections.map((section, sectionIndex) => (
                <Card key={sectionIndex}>
                  <CardHeader>
                    <div className="flex flex-col space-y-4">
                      <Label htmlFor={`section-${sectionIndex}-title`}>
                        Section Title
                      </Label>
                      <div className="flex items-center justify-between">
                        <Input
                          type="text"
                          placeholder="Section Title"
                          value={section.title}
                          onChange={(e) =>
                            updateSection(sectionIndex, "title", e.target.value)
                          }
                        />
                        <Button
                          variant="ghost"
                          onClick={() => removeSection(sectionIndex)}
                          className="text-red-500 hover:bg-red-500 hover:text-red-50"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`section-${sectionIndex}-content`}>
                          Section Content
                        </Label>
                        <Textarea
                          placeholder="Context in markdown"
                          id={`section-${sectionIndex}-content`}
                          value={section.content}
                          onChange={(e) =>
                            updateSection(
                              sectionIndex,
                              "content",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`section-${sectionIndex}-description`}>
                          Section Description
                        </Label>
                        <Textarea
                          placeholder="Enter section description"
                          id={`section-${sectionIndex}-description`}
                          value={section.description}
                          onChange={(e) =>
                            updateSection(
                              sectionIndex,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`section-${sectionIndex}-images`}>
                            Section Images
                          </Label>
                          <Button
                            variant="ghost"
                            className="text-green-500 hover:bg-green-500 hover:text-green-50"
                            onClick={() => addImage(sectionIndex)}
                          >
                            <PlusIcon className="h-6 w-6" />
                          </Button>
                        </div>
                        {section.images.map((image, imageIndex) => (
                          <div
                            key={imageIndex}
                            className="flex items-center justify-between space-x-4"
                          >
                            <Input
                              type="text"
                              placeholder="Image URL"
                              value={image}
                              onChange={(e) =>
                                updateImage(
                                  sectionIndex,
                                  imageIndex,
                                  e.target.value,
                                )
                              }
                            />
                            <Button
                              variant="ghost"
                              onClick={() =>
                                removeImage(sectionIndex, imageIndex)
                              }
                              className="text-red-500 hover:bg-red-500 hover:text-red-50"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => saveRoadmap(true)}>
                Save as Draft
              </Button>
              <Button
                className="font-semibold"
                onClick={() => saveRoadmap(false)}
              >
                Create Course
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default CreateActiveRoadmap;
