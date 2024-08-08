import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@apollo/client";
import { ALL_USERS } from "@/queries";
import { ClipLoader } from "react-spinners";

const Leaderboards = () => {
  const { data, loading } = useQuery(ALL_USERS);

  if (loading || !data) {
    <div className="flex h-screen w-full items-center justify-center">
      <ClipLoader size={64} />
    </div>;
  }

  return (
    <div className="rounded-full shadow-none  mx-auto w-full max-w-4xl p-4">
    <Card className="w-full ">
  <Table className=''>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Rank</TableHead>
        <TableHead>User</TableHead>
        <TableHead>Points</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data?.allUsers?.map((user, index) => (
        <TableRow key={user.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
          <TableCell className="font-medium">{index + 1}.</TableCell>
          <TableCell className="flex items-center space-x-4">
            <Avatar className='border'>
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold">{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</div>
              <div className="text-sm text-muted-foreground">
               
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Badge
              variant="secondary"
              className="bg-green-200 text-green-800"
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
