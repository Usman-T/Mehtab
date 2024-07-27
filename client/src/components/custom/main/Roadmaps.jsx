import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookIcon } from "lucide-react";

const Roadmaps = () => {
  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          "All",
          "Next.js",
          "React.js",
          "MySQL",
          "MongoDB",
          "Prisma",
          "Tailwind",
          "Node.js",
          "Supabase",
        ].map((tag) => (
          <Button key={tag} variant="outline" className="text-sm">
            {tag}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[
          {
            year: "2024",
            title: "Full Stack Canva Clone",
            description: "Build a Canva clone",
            chapters: "52 Chapters",
            imageUrl: "/placeholder.svg?height=150&width=300",
          },
          {
            year: "2024",
            title: "Build a Finance Platform",
            description: "Build a Finance Platform",
            chapters: "31 Chapters",
            imageUrl: "/placeholder.svg?height=150&width=300",
          },
          {
            year: "2024",
            title: "Full Stack Duolingo Clone",
            description: "Duolingo Clone",
            chapters: "29 Chapters",
            imageUrl: "/placeholder.svg?height=150&width=300",
          },
          {
            year: "2024",
            title: "Prisma & Databases",
            description: "Prisma & Free Databases (MySQL)",
            chapters: "4 Chapters",
            imageUrl: "/placeholder.svg?height=150&width=300",
          },
          {
            year: "2024",
            title: "Full Stack Miro Clone",
            description: "Build a Real-Time Miro Clone",
            chapters: "40 Chapters",
            imageUrl: "/placeholder.svg?height=150&width=300",
          },
          {
            year: "2024",
            title: "Next Auth V5",
            description: "Next Auth v5 - Advanced Guide",
            chapters: "23 Chapters",
            imageUrl: "/placeholder.svg?height=150&width=300",
          },
          {
            year: "2023",
            title: "Full Stack Twitch Clone",
            description: "Twitch Clone",
            chapters: "40 Chapters",
            imageUrl: "/placeholder.svg?height=150&width=300",
          },
          {
            year: "2023",
            title: "Full Stack Trello Clone",
            description: "Trello Clone",
            chapters: "25 Chapters",
            imageUrl: "/placeholder.svg?height=150&width=300",
          },
        ].map((course, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="relative">
              <img
                src="/placeholder.svg"
                alt={course.title}
                className="h-40 w-full rounded-t-md object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg font-bold">
                {course.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {course.description}
              </CardDescription>
              <div className="mt-2 flex items-center">
                <BookIcon className="h-4 w-4 text-muted-foreground" />
                <span className="ml-2 text-sm">{course.chapters}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
