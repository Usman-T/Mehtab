import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { ALL_ROADMAPS, CREATE_ROADMAP } from "@/queries";

const AdminRoadmapCreate = () => {
  const [createRoadmap, result] = useMutation(CREATE_ROADMAP, {
    refetchQueries: [ALL_ROADMAPS],
  });

  const [roadmapTitle, setRoadmapTitle] = useState("");
  const [roadmapDescription, setRoadmapDescription] = useState("");
  const [roadmapImage, setRoadmapImage] = useState("");
  const [resources, setResources] = useState([""]);
  const [sections, setSections] = useState([
    {
      title: "Introduction",
      content: "",
      resources: resources,
    },
  ]);

  const navigate = useNavigate();

  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "",
        content: "",
        resources: [],
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

  const addResource = () => {
    setResources([...resources, ""]);
  };

  const updateResource = (index, value) => {
    const updatedResources = [...resources];
    console.log(updatedResources);
    updatedResources[index] = value;
    setResources(updatedResources);
  };

  const removeResource = (index) => {
    const updatedResources = [...resources];
    updatedResources.splice(index, 1);
    setResources(updatedResources);
  };

  const saveRoadmap = () => {
    const completedSections = sections.filter(
      (section) => section.title !== "" && section.content !== "",
    );
    const completedResources = resources.filter((resource) => resource !== "");

    console.log({ completedSections, sections });

    if (
      !roadmapTitle ||
      !roadmapDescription ||
      !roadmapImage ||
      completedSections.length !== sections.length ||
      completedResources.length !== resources.length
    ) {
      return toast.error("Incomplete roadmap data");
    }

    console.log("Saving roadmap:", {
      title: roadmapTitle,
      description: roadmapDescription,
      image: roadmapImage,
      sections,
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
    setSections([{ title: "", content: "", resources: [] }]);
    navigate("/roadmaps");
  };

  return (
    <div className="bg- container mx-auto px-4 py-8 md:px-6">
      <Card className="py-8">
        <div className="grid gap-8">
          <CardContent>
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">Roadmap Details</h2>
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
                <Label htmlFor="image">Roadmap Title</Label>
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
                {sections.map((section, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex flex-col space-y-4">
                        <Label htmlFor={`section-${index}-title`}>
                          Section Title
                        </Label>
                        <div className="flex items-center justify-between">
                          <Input
                            type="text"
                            placeholder="Section Title"
                            value={section.title}
                            onChange={(e) =>
                              updateSection(index, "title", e.target.value)
                            }
                          />
                          <Button
                            variant="ghost"
                            onClick={() => removeSection(index)}
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
                          <Label htmlFor={`section-${index}-content`}>
                            Section Content
                          </Label>
                          <Textarea
                            placeholder="Context in markdown"
                            id={`section-${index}-content`}
                            onChange={(e) =>
                              updateSection(index, "content", e.target.value)
                            }
                          />
                          <div />
                        </div>
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`section-${index}-resources`}>
                              Section Resources
                            </Label>
                            <Button
                              variant="ghost"
                              className="text-green-500 hover:bg-green-500 hover:text-green-50"
                              onClick={() => addResource()}
                            >
                              <PlusIcon className="h-6 w-6" />
                            </Button>
                          </div>
                          {resources.map((resource, id) => (
                            <div
                              key={id}
                              className="flex items-center justify-between space-x-4"
                            >
                              <Input
                                type="text"
                                placeholder="Resource"
                                value={resource}
                                onChange={(e) =>
                                  updateResource(id, e.target.value)
                                }
                              />
                              <Button
                                variant="ghost"
                                onClick={() => removeResource(id)}
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
                <Button variant="outline" onClick={saveRoadmap}>
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default AdminRoadmapCreate;
