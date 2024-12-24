import { createContext, useContext, useState } from "react";
import { userService } from "../services/api";

const UserContext = createContext(null);

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getStoredUser);

  const login = async (name) => {
    if (!name?.trim()) {
      throw new Error("Name is required");
    }

    try {
      const response = await userService.login(name);
      const userData = response.data || response;
      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
