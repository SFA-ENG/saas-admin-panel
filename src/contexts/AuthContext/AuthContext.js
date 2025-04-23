// AuthContext.js
import React, { createContext, useContext, useState } from "react";
import { nameHOC } from "../hoc-utils";


const AuthContext = createContext();


 const AuthContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const setUserMasterData = ({ user_data }) => {
    if (user_data?.mobile_no) {
      setUserData(user_data);
    }
  };

  return (
    <AuthContext.Provider value={{ userData, setUserMasterData }}>
      {children}
    </AuthContext.Provider>
  );
};


const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "Please use useAuth inside AuthContextProvider wrapped component"
    );
  }
  return context;
};

const withAuthContext = (WrappedComponent) => {
  const ComponentWithAuthContext = (props) => {
    const authContext = useAuth();
    return (
      <React.Fragment>
        <WrappedComponent {...props} authContext={authContext} />
      </React.Fragment>
    );
  };
  ComponentWithAuthContext.displayName = nameHOC(
    WrappedComponent,
    "withAuthContext"
  );
  return ComponentWithAuthContext;
};

export { AuthContextProvider, withAuthContext };
