
import { useAuthUser } from "@/hooks/useAuthUser";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function NavBar() {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function handleLogout() {
    await supabase.auth.signOut();
    toast({ title: "Logged out" });
    navigate("/");
  }

  return (
    <nav className="flex w-full p-4 items-center justify-end gap-2">
      {user ? (
        <>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          <Button variant="outline" onClick={handleLogout}>Log out</Button>
        </>
      ) : (
        <Button onClick={() => navigate("/auth")}>Log in</Button>
      )}
    </nav>
  );
}
