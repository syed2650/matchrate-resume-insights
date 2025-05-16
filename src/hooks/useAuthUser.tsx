
import { useState, useEffect, createContext, useContext } from "react";
import { supabase, cleanupAuthState } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign out helper with proper cleanup
  const signOut = async () => {
    try {
      // Clean up auth state first
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for a clean state
      window.location.href = '/auth';
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          // Defer data fetching to prevent deadlocks
          setTimeout(() => {
            // Any additional data fetching can go here
            console.log("User signed in:", session?.user?.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    typeof window !== "undefined" ? supabase.auth.getSession() : Promise.resolve({ data: { session: null } }).then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthUser() {
  return useContext(AuthContext);
}
