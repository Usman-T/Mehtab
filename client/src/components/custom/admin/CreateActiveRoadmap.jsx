import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ALL_ROADMAPS, CREATE_ROADMAP } from "@/queries";
import Loading from "../extras/Loading";

const CreateActiveRoadmap = () => {
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

  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draft");
  const navigate = useNavigate();

  const { data: roadmapData, loading: roadmapLoading } = useQuery(
    ALL_ROADMAPS,
    { variables: { includeDrafts: true } },
  );
  const [createRoadmap] = useMutation(CREATE_ROADMAP, {
    refetchQueries: [ALL_ROADMAPS],
  });

  useEffect(() => {
    if (roadmapData && !roadmapLoading) {
      const draftRoadmap = roadmapData.allRoadmaps.find(
        (r) => r.id === draftId,
      );
      if (draftRoadmap) {
        setRoadmapTitle(draftRoadmap.title);
        setRoadmapDescription(draftRoadmap.description);
        setRoadmapImage(draftRoadmap.image);
        setSections(
          draftRoadmap.sections.map((section) => ({
            ...section,
            images: [...section.images],
          })),
        );
      }
    }
  }, [roadmapData, roadmapLoading, draftId]);

  if (roadmapLoading) {
    return <Loading />;
  }

  const addSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      {
        title: "",
        content: "",
        description: "",
        images: [""],
      },
    ]);
  };

  const updateSection = (index, field, value) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const updatedSection = { ...updatedSections[index] }; // Clone the specific section
      updatedSection[field] = value;
      updatedSections[index] = updatedSection; // Replace the section in the array
      return updatedSections;
    });
  };

  const removeSection = (index) => {
    setSections((prevSections) => prevSections.filter((_, i) => i !== index));
  };

  const addImage = (sectionIndex) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const updatedSection = { ...updatedSections[sectionIndex] }; // Clone the specific section
      updatedSection.images = [...updatedSection.images, ""];
      updatedSections[sectionIndex] = updatedSection; // Replace the section in the array
      return updatedSections;
    });
  };

  const updateImage = (sectionIndex, imageIndex, value) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const updatedSection = { ...updatedSections[sectionIndex] }; // Clone the specific section
      const updatedImages = [...updatedSection.images]; // Clone the images array
      updatedImages[imageIndex] = value;
      updatedSection.images = updatedImages; 
      updatedSections[sectionIndex] = updatedSection; 
      return updatedSections;
    });
  };

  const removeImage = (sectionIndex, imageIndex) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const updatedSection = { ...updatedSections[sectionIndex] }; 
      updatedSection.images = updatedSection.images.filter(
        (_, i) => i !== imageIndex,
      );
      updatedSections[sectionIndex] = updatedSection;
      return updatedSections;
    });
  };

  const saveRoadmap = (isDraft) => {
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


    const variables = {
      title: roadmapTitle,
      description: roadmapDescription,
      image: roadmapImage,
      sections,
      draft: isDraft,
    };

    console.log(variables);

    createRoadmap({ variables })
      .then(() => {
        toast.success(
          isDraft ? "Draft saved successfully" : "Roadmap created successfully",
        );
        setRoadmapTitle("");
        setRoadmapImage("");
        setRoadmapDescription("");
        setSections([
          { title: "", content: "", description: "", images: [""] },
        ]);
        navigate("/roadmaps");
      })
      .catch(() => {
        toast.error("Failed to save roadmap");
      });
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
