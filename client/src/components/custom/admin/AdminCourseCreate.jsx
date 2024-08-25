import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateActiveRoadmap from "./CreateActiveRoadmap";
import CreateUpcomingRoadmap from "./CreateUpcomingRoadmap";

const AdminRoadmapCreate = () => {
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
