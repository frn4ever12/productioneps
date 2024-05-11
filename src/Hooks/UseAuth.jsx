import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const nav = useNavigate();
  const [user, setUser] = useState(
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null
  );

  const loginWithGoogle = async (accessToken) => {
    try {
      const response = await axios.post("google/", {
        access_token: accessToken,
      });

      const userData = response?.data;
      // console.log(userData);
      // Save user data to sessionStorage
      sessionStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Redirect based on user role
      if (userData.user_is_admin) {
        nav("/adminprofile", { replace: true });
      } else if (userData.teacher) {
        nav("/teacher", { replace: true });
      } else if (userData.student) {
        nav("/studentexamlist", { replace: true });
      }
    } catch (error) {
      console.error("Login with Google error:", error);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post("login/", {
        email: username,
        password: password,
      });
      const userData = response?.data;

      // Save user data to sessionStorage
      sessionStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Redirect based on user role
      if (userData.user_is_admin) {
        nav("/adminprofile", { replace: true });
      } else if (userData.teacher) {
        nav("/teacher", { replace: true });
      } else if (userData.student) {
        nav("/studentexamlist", { replace: true });
      }

      // console.log(response);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async (
    username,
    email,
    first_name,
    last_name,
    password,
    password2,
    phone,
    is_student,
    is_teacher
  ) => {
    try {
      const response = await axios.post("register/", {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        password2: password2,
        phone: phone,
        is_student: is_student,
        is_teacher: is_teacher,
      });
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    nav("/", { replace: true });
  };

  return (
    <div>
      <AuthContext.Provider
        value={{
          user,
          login,
          logout,
          register,
          loginWithGoogle,
        }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthContextProvider;
