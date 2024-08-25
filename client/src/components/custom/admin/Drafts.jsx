import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

const Drafts = ({ drafts }) => {
  const navigate = useNavigate();
  const handleDraftClick = (draft) => {
    navigate(`/admin/create?draft=${draft.id}`);
  };

  return (
    <Card className="flex flex-col space-y-2 py-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-medium">Drafts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drafts.map((draft) => (
              <TableRow key={draft.id} className="hover:cursor-pointer" onClick={() => handleDraftClick(draft)}>
                <TableCell className="font-medium">{draft.title}</TableCell>
                <TableCell>{draft.description.substring(0, 60)}...</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Drafts;