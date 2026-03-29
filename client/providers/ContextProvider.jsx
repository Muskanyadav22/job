import React from "react";
import { GlobalContextProvider } from "@/context/globalContext";
import { JobsContextProvider } from "@/context/jobsContext";

function ContextProvider({ children }) {
  return (
    <GlobalContextProvider>
      <JobsContextProvider>{children}</JobsContextProvider>
    </GlobalContextProvider>
  );
}

export default ContextProvider;
