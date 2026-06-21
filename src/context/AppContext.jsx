import { createContext, useState, useContext, useEffect } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Identity & Gamification
  const [name, setName] = useState("Eco Warrior");
  const [goal, setGoal] = useState("emissions");
  const [xp, setXp] = useState(0); 
  
  // Daily Carbon Battle (Net Score)
  const [carbonSaved, setCarbonSaved] = useState(0); // grams
  const [carbonGenerated, setCarbonGenerated] = useState(0); // grams
  const netCarbonScore = carbonSaved - carbonGenerated;

  // Activity Tracking
  const [steps, setSteps] = useState(0);
  const [screenTimeMinutes, setScreenTimeMinutes] = useState(0);

  // Challenges
  const [challenges, setChallenges] = useState([
    { id: 1, title: "Walk 5000 steps", progress: 0, target: 5000, xp: 50, completed: false },
    { id: 2, title: "No food delivery today", progress: 0, target: 1, xp: 100, completed: false },
    { id: 3, title: "Reduce screen time by 1h", progress: 0, target: 1, xp: 80, completed: false }
  ]);

  // League Data
  const [leagueData, setLeagueData] = useState([
    { rank: 1, name: "Sarah J.", score: 1200, isMe: false, badge: "Green Champion" },
    { rank: 2, name: "Campus Eco Club", score: 1050, isMe: false, badge: "" },
    { rank: 3, name: name, score: 890, isMe: true, badge: "" },
    { rank: 4, name: "Mike T.", score: 720, isMe: false, badge: "" }
  ]);

  // AI Carbon Twin State
  // Can be 'thriving' (high net score), 'stable' (neutral), or 'struggling' (negative net score)
  const [twinState, setTwinState] = useState("stable");
  const [twinStyle, setTwinStyle] = useState("forest"); // forest, cyber, ocean

  useEffect(() => {
    // Update Twin State based on Net Carbon Score (highly sensitive)
    if (netCarbonScore >= 50) {
      setTwinState("thriving"); // Good twin for net positive habits
    } else if (netCarbonScore < -10) {
      setTwinState("struggling"); // Bad twin for net negative habits
    } else {
      setTwinState("stable"); // Neutral
    }
  }, [netCarbonScore]);

  // Calculate Rank based on XP
  const getRank = (currentXp) => {
    if (currentXp < 100) return { name: "Eco Rookie", level: 1, next: 100 };
    if (currentXp < 300) return { name: "Planet Protector", level: 2, next: 300 };
    if (currentXp < 600) return { name: "Climate Ninja", level: 3, next: 600 };
    return { name: "Future Earth Guardian", level: 4, next: "MAX" };
  };

  const rank = getRank(xp);

  const addXp = (amount) => setXp((prev) => prev + amount);

  // Helper to add carbon saved
  const addCarbonSaved = (amount) => setCarbonSaved(prev => prev + amount);
  // Helper to add carbon generated
  const addCarbonGenerated = (amount) => setCarbonGenerated(prev => prev + amount);

  // System Glitch Mechanic
  const systemStatus = netCarbonScore <= -500 ? "CORRUPTED" : "NORMAL";

  return (
    <AppContext.Provider value={{ 
      name, setName, goal, setGoal, xp, addXp, rank, 
      steps, setSteps, screenTimeMinutes, setScreenTimeMinutes,
      carbonSaved, addCarbonSaved, setCarbonSaved, carbonGenerated, addCarbonGenerated, setCarbonGenerated, netCarbonScore,
      challenges, setChallenges, leagueData, twinState, twinStyle, setTwinStyle,
      systemStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};
