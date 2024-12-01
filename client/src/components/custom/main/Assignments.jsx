import React from "react";
import { useQuery } from "@apollo/client";
import Loading from "../extras/Loading";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLinkIcon, FileXIcon } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ALL_ASSIGNMENTS, ALL_ROADMAPS, ME } from "@/queries";
import { Badge } from "@/components/ui/badge";

const Assignments = () => {
  const navigate = useNavigate();
  const { data: meData, loading: meLoading } = useQuery(ME);
  const { data: assignmentsData, loading: assignmentsLoading } =
    useQuery(ALL_ASSIGNMENTS);

  if (meLoading || assignmentsLoading) {
    return <Loading />;
  }

  // Sample submissions data
  const submittedAssignments = [
    {
      assignment: { title: "HTML Basics Assignment" },
      user: { username: "JohnDoe" },
      section: { title: "HTML Basics" },
      assignmentUrl: "https://example.com/submission/1",
      gradedBy: { username: "Admin" },
      status: "Graded",
      feedback: "Great work! Well-done.",
      grade: "A",
      id: "1",
    },
    {
      assignment: { title: "CSS Flexbox Project" },
      user: { username: "JaneSmith" },
      section: { title: "CSS Layouts" },
      assignmentUrl: "https://example.com/submission/2",
      gradedBy: null,
      status: "Pending",
      feedback: null,
      grade: null,
      id: "2",
    },
  ];

  const roadmapIds = new Set(meData?.me.progress.map((r) => r.id));
  const userAssignments = assignmentsData?.allAssignments.filter((a) =>
    roadmapIds.has(a.roadmap.id),
  );

  return (
    <div className="flex flex-col space-y-6 bg-background p-8">
      {meData?.me?.progress.length > 0 ? (
        <>
          <h2 className="text-xl font-bold md:text-2xl lg:text-3xl">
            Welcome {meData?.me.username}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold md:text-xl">Assignments</h3>
              <p className="text-sm text-slate-700">
                View the assignments with the specified courses here
              </p>
              <div className="mb-6 mt-4 grid grid-cols-1 space-x-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {meData?.me?.progress.map(({ roadmap }) => (
                  <Card
                    key={roadmap.id}
                    onClick={() => navigate(`/assignments/${roadmap.id}`)}
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
                            onLoad={(e) =>
                              (e.target.style.filter = "blur(0px)")
                            }
                          />
                        </div>

                        <div className="flex flex-col px-3 pt-2">
                          <h1 className="text-sm font-semibold transition group-hover:text-sky-700 md:text-base">
                            {roadmap.title}
                          </h1>
                        </div>
                        <div className="px-3 pb-3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold md:text-xl">Submissions</h3>
              <p className="text-sm text-slate-700">
                All your submissions that have been graded and are to be graded
              </p>
              <Card className="w-full overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px] text-xs md:text-sm">
                        Sr.
                      </TableHead>
                      <TableHead className="text-xs md:text-sm">
                        Title
                      </TableHead>
                      <TableHead className="text-xs md:text-sm">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submittedAssignments.map((a, index) => (
                      <TableRow
                        key={a.id}
                        className={`hover:cursor-pointer ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                        onClick={() => navigate(`/submission/${a?.id}`)}
                      >
                        <TableCell className="text-xs font-medium md:text-sm">
                          {index + 1}.
                        </TableCell>
                        <TableCell className="flex items-center space-x-4 text-xs md:text-sm">
                          <div>
                            <div className="font-bold">
                              {a?.assignment.title}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`${a?.status === "Graded" ? "bg-green-200 text-green-800" : a?.status === "Pending" ? "bg-yellow-200 text-yellow-800" : "bg-red-200 text-red-800"} text-xs  md:text-sm font-semibold`}
                          >
                            {a?.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-3 text-center">
            <Card>
              <div className="mx-auto w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-center">No Assignments</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <FileXIcon className="h-12 w-12" />
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    You are not enrolled in any roadmap so you cannot submit any
                    assignments
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Link to="/roadmaps">
                    <Button className="flex space-x-2">
                      <p className="font-semibold">Explore Roadmaps</p>
                      <ExternalLinkIcon className="h-5 w-5" />
                    </Button>
                  </Link>
                </CardFooter>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Assignments;
