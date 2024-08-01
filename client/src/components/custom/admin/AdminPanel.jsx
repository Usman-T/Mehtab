import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@apollo/client";
import {
  ActivityIcon,
  BookIcon,
  CircleCheckIcon,
  ClipboardIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ALL_ROADMAPS, ALL_USERS } from "@/queries";
import { ClipLoader } from "react-spinners";

const StatCard = ({ title, value, percentageChange, icon: Icon }) => (
  <Card className="flex flex-col space-y-2 py-2">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{percentageChange}</p>
    </CardContent>
  </Card>
);

const RecentUsersTable = ({ users }) => (
  <Card className="flex flex-col space-y-2 py-2">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="font-medium">Recent Users</CardTitle>
      <ActivityIcon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Enrolled Courses</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.progress.length} courses</TableCell>
              <TableCell>{user.points} points</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const CoursesTable = ({ courses }) => {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col space-y-2 py-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-medium">Courses</CardTitle>
        <ClipboardIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Sections</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course, index) => (
              <TableRow
                key={index}
                className="hover:cursor-pointer"
                onClick={() => navigate(`/roadmaps/${course.id}`)}
              >
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>{course.description.substring(0, 60)}...</TableCell>
                <TableCell>{course.sections.length} sections</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const CreateCourseForm = () => {
  const navigate = useNavigate();
  return (
    <Card className="flex flex-col space-y-2 py-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-medium">Create new course</CardTitle>
        <PlusIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Course Name</Label>
            <Input id="name" placeholder="Enter course name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter course description" />
          </div>
          <Button onClick={() => navigate("/admin/create")} className="w-full">
            Create Course
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const AdminPanel = () => {
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(ALL_USERS);
  const {
    loading: roadmapLoading,
    error: roadmapError,
    data: roadmapData,
  } = useQuery(ALL_ROADMAPS);

  if (userLoading || roadmapLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={64} className="" />
      </div>
    );
  if (userError || roadmapError)
    return <p>Error: {userError?.message || roadmapError?.message}</p>;

  const users = userData.allUsers.slice(0, 5);
  const roadmaps = roadmapData.allRoadmaps.slice(0, 5);
  const totalPoints = userData.allUsers.reduce(
    (acc, user) => acc + user.points,
    0,
  );
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StatCard
              title="Total Users"
              value={users.length}
              percentageChange="registered users"
              icon={UsersIcon}
            />
            <StatCard
              title="Active Roadmaps"
              value={roadmaps.length}
              percentageChange="availble roadmaps"
              icon={BookIcon}
            />
            <StatCard
              title="Enrolled Courses"
              value="4"
              percentageChange="current enrollments"
              icon={ClipboardIcon}
            />
            <StatCard
              title="Total Points Earned"
              value={totalPoints}
              percentageChange="total points (collectively)"
              icon={CircleCheckIcon}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RecentUsersTable users={users} />
            <CoursesTable courses={roadmaps} />
          </div>
          <CreateCourseForm />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
