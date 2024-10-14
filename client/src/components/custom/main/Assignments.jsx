import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, PaperclipIcon, BarChartIcon } from "lucide-react";
import React from "react";

const Assignments = () => {
  return (
    <div className="flex flex-col bg-background p-8 space-y-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Assignments</h2>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Completed Assignments */}
        <Card className="flex flex-col space-y-2 py-2 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium">Assignments Completed</CardTitle>
            <CheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">assignments completed</p>
          </CardContent>
        </Card>
        
        {/* Available Assignments */}
        <Card className="flex flex-col space-y-2 py-2 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium">Available Assignments</CardTitle>
            <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">can be completed</p>
          </CardContent>
        </Card>

        {/* Pending Results */}
        <Card className="flex flex-col space-y-2 py-2 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium">Pending Results</CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">are being checked</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <h3 className="text-lg font-semibold">Progress Overview</h3>
        <p className="text-sm text-muted-foreground">60% of assignments completed</p>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Assignment 1 - Submitted</span>
            <span className="text-xs text-muted-foreground">2 days ago</span>
          </li>
          <li className="flex justify-between">
            <span>Assignment 2 - Graded</span>
            <span className="text-xs text-muted-foreground">3 days ago</span>
          </li>
        </ul>
      </div>
      
      {/* Upcoming Deadlines */}
      <div>
        <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
        <ul className="space-y-2">
          <li className="flex justify-between text-red-500">
            <span>Assignment 3 - Due in 2 days</span>
            <span>Sept 25, 2024</span>
          </li>
          <li className="flex justify-between text-yellow-500">
            <span>Assignment 4 - Due in 5 days</span>
            <span>Sept 28, 2024</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Assignments;
