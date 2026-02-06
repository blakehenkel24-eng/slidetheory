"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const hasValidCredentials = supabaseUrl && supabaseKey && 
  supabaseUrl !== "your_supabase_url" && 
  supabaseKey !== "your_supabase_anon_key";

interface SupabaseContextType {
  supabase: SupabaseClient | null;
  user: User | null;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  user: null,
  loading: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasValidCredentials) {
      try {
        const client = createClient(supabaseUrl, supabaseKey);
        setSupabase(client);

        client.auth.getSession().then(({ data: { session } }) => {
          setUser(session?.user ?? null);
          setLoading(false);
        });

        const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Failed to initialize Supabase:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, user, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);
