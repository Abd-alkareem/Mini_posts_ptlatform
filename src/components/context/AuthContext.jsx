import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../../api/axiosConfig"; // improt api axios request
import { useNavigate } from "react-router-dom";

// here we are creating (context) ,and the (context) here is like a storage for information
// ->> that will share info to all other components
const AuthContext = createContext();

// the (provider) is the tool or bumb or what ever that will take the info and delever it
// ->> to all other componentsS
export const AuthProvider = ({ children }) => {
  // Auth and user
  const [isAuth, setIsAuth] = useState(false);
  const [authedUser, setAuthedUser] = useState(null);
  // state for loader
  const [loader, setLoader] = useState(false);
  // import navigate obj
  const navigate = useNavigate();

  // function that will search for user in session
  const checkAuthStatus = async () => {
    setLoader(true);
    try {
      // ملاحظة: نستخدم GET لأننا فقط "نجلب" معلومات الجلسة
      const response = await api.get("/auth/me.php");

      if (response.data.isAuth) {
        setAuthedUser(response.data.user); // تأكد أن الاسم مطابق لما يرسله PHP (user وليس info)
        setIsAuth(true);
        // console.log("Data from auto refresh", response.data.user.username);
      }
    } catch (error) {
      // في حال فشل الطلب (مثلاً 401) لا نفعل شيئاً، يبقى isAuth = false
      console.log("No active session found");
      console.log(isAuth);
    } finally {
      setLoader(false); // نوقف حالة التحميل في كل الأحوال
    }
  };

  // search for user in session when we open the site or reload it
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // login function
  const loginUser = (userData) => {
    setAuthedUser(userData);
    setIsAuth(true);
    // console.log("data from context: ", userData);
  };

  return (
    <AuthContext.Provider
      value={{ authedUser, isAuth, loginUser, loader, setLoader }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// useAuth is a costom hook ,we can deal with it as a shorthand for -useContext(AuthContext)-
// and it's job is to allow other components to get the info form the context.
export const useAuth = () => useContext(AuthContext);
