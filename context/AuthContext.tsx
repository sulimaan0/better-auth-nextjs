"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define the shape of your session object
type Session = {
  user: { name: string; email: string };
  token?: string;
} | null;

type AuthContextType = {
  session: Session;
  setSession: (session: Session) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session;
}) => {
  const [session, setSession] = useState<Session>(initialSession);

  return (
    <AuthContext.Provider value={{ session, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
