
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/hooks/useAuthUser";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

type Submission = {
  id: string;
  created_at: string;
  job_description: string;
  selected_role: string | null;
  feedback_results: any;
};

export default function Dashboard() {
  const { user, loading } = useAuthUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
    if (!loading && user) {
      setFetching(true);
      supabase
        .from("submissions")
        .select("id, created_at, job_description, selected_role, feedback_results")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) setSubmissions(data as Submission[]);
          setFetching(false);
        });
    }
  }, [user, loading, navigate]);

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Submissions</h2>
        <Button variant="outline" onClick={() => navigate("/")}>
          Go to Resume Review
        </Button>
      </div>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetching ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No submissions yet.</TableCell>
              </TableRow>
            ) : (
              submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{new Date(s.created_at).toLocaleString()}</TableCell>
                  <TableCell className="max-w-xs truncate">{s.job_description.slice(0, 30)}</TableCell>
                  <TableCell>{s.selected_role || "-"}</TableCell>
                  <TableCell>
                    {"score" in (s.feedback_results || {}) ? s.feedback_results.score : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
