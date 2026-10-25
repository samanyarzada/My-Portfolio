import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { supabase, supabaseConfigured } from "../lib/supabase";

// status: loading | ready | disabled (no Supabase keys)
function initialState() {
  return {
    status: supabaseConfigured ? "loading" : "disabled",
    session: null,
    isAdmin: false,
  };
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;

    // Asks the database if this user is in the "admins" table
    async function resolve(session) {
      if (!session) {
        if (!cancelled) setState({ status: "ready", session: null, isAdmin: false });
        return;
      }
      const { data, error } = await supabase.rpc("is_admin");
      if (!cancelled) {
        setState({ status: "ready", session, isAdmin: !error && data === true });
      }
    }

    // This also fires once at start with the saved session.
    // setTimeout keeps the database call out of the auth callback (a known Supabase pitfall).
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => resolve(session), 0);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ ...state, signIn, signOut }),
    [state, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}