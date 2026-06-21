import { createContext, useState, useContext, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';

/**
 * Global application context for managing user state, carbon tracking, and UI dynamics.
 * @typedef {Object} AppContextValue
 * @property {number} netCarbonScore - The derived score (carbonSaved - carbonGenerated).
 * @property {string} twinState - The health of the digital twin ('thriving', 'stable', 'struggling').
 * @property {string} systemStatus - The glitch status ('NORMAL' or 'CORRUPTED').
 */
// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Identity & Gamification
  const [name, setName] = useState("Eco Warrior");
  const [goal, setGoal] = useState("emissions");
  const [xp, setXp] = useState(0); 
  
  // Daily Carbon Battle (Net Score)
  const [carbonSaved, setCarbonSaved] = useState(0); // grams
  const [carbonGenerated, setCarbonGenerated] = useState(0); // grams
  const netCarbonScore = useMemo(() => carbonSaved - carbonGenerated, [carbonSaved, carbonGenerated]);

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
  const twinState = useMemo(() => {
    if (netCarbonScore >= 50) return "thriving";
    if (netCarbonScore < -10) return "struggling";
    return "stable";
  }, [netCarbonScore]);
  const [twinStyle, setTwinStyle] = useState("forest");

  /**
   * Calculates the user's current rank tier based on their accumulated XP.
   */
  const getRank = useCallback((currentXp) => {
    if (currentXp < 100) return { name: "Eco Rookie", level: 1, next: 100 };
    if (currentXp < 300) return { name: "Planet Protector", level: 2, next: 300 };
    if (currentXp < 600) return { name: "Climate Ninja", level: 3, next: 600 };
    return { name: "Future Earth Guardian", level: 4, next: "MAX" };
  }, []);

  const rank = useMemo(() => getRank(xp), [getRank, xp]);

  /**
   * Adds experience points to the user's profile.
   */
  const addXp = useCallback((amount) => setXp((prev) => prev + amount), []);
  const addCarbonSaved = useCallback((amount) => setCarbonSaved(prev => prev + amount), []);
  const addCarbonGenerated = useCallback((amount) => setCarbonGenerated(prev => prev + amount), []);

  // System Glitch Mechanic
  const systemStatus = useMemo(() => netCarbonScore <= -500 ? "CORRUPTED" : "NORMAL", [netCarbonScore]);

  // Memoize the entire context value to prevent unnecessary re-renders of the component tree
  const contextValue = useMemo(() => ({
    name, setName, goal, setGoal, xp, addXp, rank, 
    steps, setSteps, screenTimeMinutes, setScreenTimeMinutes,
    carbonSaved, addCarbonSaved, setCarbonSaved, carbonGenerated, addCarbonGenerated, setCarbonGenerated, netCarbonScore,
    challenges, setChallenges, leagueData, setLeagueData, twinState, twinStyle, setTwinStyle,
    systemStatus
  }), [
    name, setName, goal, setGoal, xp, addXp, rank, 
    steps, setSteps, screenTimeMinutes, setScreenTimeMinutes, 
    carbonSaved, addCarbonSaved, setCarbonSaved, carbonGenerated, addCarbonGenerated, setCarbonGenerated, netCarbonScore, 
    challenges, setChallenges, leagueData, setLeagueData, twinState, twinStyle, setTwinStyle, systemStatus
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
