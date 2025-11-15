// src/components/activity/ActivityContext.jsx
import React, { createContext, useContext, useState } from "react";
import { scoreActivity } from "./scoreUtils";

const ActivityContext = createContext();

export function ActivityProvider({ children }) {
  const [activities, setActivities] = useState([]);
  const [scores, setScores] = useState([]);

  const addActivity = (activity) => {
    // Optional: restrict to application|interview
    if (!["application", "interview"].includes(activity?.kind)) return;

    const id = String(Date.now());
    const userId = "demoUser";
    const full = {
      ...activity,
      id,
      userId,
      createdAt: new Date().toISOString(),
    };
    const newScores = scoreActivity(full);

    setActivities((a) => [full, ...a]);
    setScores((s) => [...newScores, ...s]);
  };

  return (
    <ActivityContext.Provider value={{ activities, scores, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  return useContext(ActivityContext);
}
