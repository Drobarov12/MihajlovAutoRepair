import React, { createContext, useContext, useState } from "react";

// Create the Context
const UserContext = createContext(null);

// Create a Provider component
export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for using the context
export const useUser = () => {
    return useContext(UserContext);
};
