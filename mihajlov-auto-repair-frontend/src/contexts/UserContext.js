import React, { createContext, useContext, useState } from "react";

// Create the Context
const UserContext = createContext(null);

// Create a Provider component
export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfoState] = useState(() => {
        const storedUserInfo = sessionStorage.getItem("userInfo");
        return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    });

    const setUserInfo = (info) => {
        setUserInfoState(info);
        if (info) {
            sessionStorage.setItem("userInfo", JSON.stringify(info));
        } else {
            sessionStorage.removeItem("userInfo"); // Clear storage on logout
        }
    };

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
