import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@apollo/client";
import { ALL_USERS } from "@/queries";
import Loading from "../extras/Loading";

const Leaderboards = () => {
  const { data, loading } = useQuery(ALL_USERS);

  if (loading || !data) {
    return <Loading />;
  }

  const sortedUsers = [...data.allUsers].sort((a, b) => b.points - a.points);

  return (
    <div className="mx-auto w-full max-w-4xl p-4 shadow-none">
      <Card className="w-full overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-xs md:text-sm">Rank</TableHead>
              <TableHead className="text-xs md:text-sm">User</TableHead>
              <TableHead className="text-xs md:text-sm">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.slice(0, 20).map((user, index) => (
              <TableRow
                key={user.id}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <TableCell className="text-xs font-medium md:text-sm">
                  {index + 1}.
                </TableCell>
                <TableCell className="flex items-center space-x-4 text-xs md:text-sm">
                  <Avatar className="border">
                    <AvatarFallback>
                      {user.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold">
                      {user.username.charAt(0).toUpperCase() +
                        user.username.slice(1)}
                    </div>
                    <div className="text-sm text-muted-foreground"></div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-green-200 text-xs text-green-800 md:text-sm"
                  >
                    {user.points}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Leaderboards;