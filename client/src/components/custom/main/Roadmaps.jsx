import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@apollo/client";
import { BookOpenIcon } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ALL_ROADMAPS } from "@/queries";

const Roadmaps = () => {
  const result = useQuery(ALL_ROADMAPS);

  const navigate = useNavigate();

  if (result.loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={64} className="" />
      </div>
    );
  }

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
        {result.data.allRoadmaps.map((roadmap, index) => (
          <Card
            key={index}
            onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
            className="hover:cursor-pointer"
          >
            <CardContent className="p-0">
              <div>
                <div className="relative aspect-video w-full overflow-hidden rounded-t-md border-b">
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
                <div className="flex flex-col px-3 pt-2">
                  <h1 className="line-clamp-1 text-sm font-medium transition group-hover:text-sky-700 md:text-base">
                    {roadmap.title}
                  </h1>
                  <div className="my-3 flex items-center gap-x-2 text-xs">
                    <div className="mt-2 flex items-start text-slate-500">
                      <div className="inline-flex items-center justify-center space-x-1 rounded-md border border-transparent bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-800 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        <BookOpenIcon className="h-4 w-4" />
                        <span>{roadmap.sections.length} Sections</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;
