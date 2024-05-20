import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PublicRoute from "./RouteLayout/PublicRoute";

import AdminProfile from "./AdminDashboard/AdminProfile";
import AdminProtected from "./Utils/AdminProtected";
import StudentProtected from "./Utils/StudetProtected";
import AdminPrivateRoute from "./RouteLayout/AdminPrivateRoute";
import AuthContextProvider from "./Hooks/UseAuth";
import StudentPrivateRoute from "./RouteLayout/StudentPrivateRoute";
import StudentExam from "./StudentDashboard/StudentExam";
import StudentProfile from "./StudentDashboard/StudentProfile";
import StudentResult from "./StudentDashboard/StudentResult";
import ExamTable from "./StudentDashboard/ExamTable";
import AddQuestion from "./AdminDashboard/AddQuestion";
import AddQuiz from "./AdminDashboard/AddQuiz";
import ListQuize from "./AdminDashboard/ListQuize";
import UpdateQuiz from "./AdminDashboard/UpdateQuize";
import Login from "./App/Login/Login";
import Register from "./App/Register/Register";
import InstantResult from "./StudentDashboard/Components/instantResult";
import ResultTable from "./StudentDashboard/Components/resultTable";
import QuestionList from "./AdminDashboard/QuestionList";
import UserList from "./AdminDashboard/UserList";
import TagList from "./AdminDashboard/TagList";
import AddTag from "./AdminDashboard/AddTag";
import UpdateQuestionAnswer from "./AdminDashboard/UpdateQuestionAnswer";

const App = () => {
  return (
    <AuthContextProvider>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<AdminProtected />}>
          <Route element={<AdminPrivateRoute />}>
            <Route path="/adminprofile" element={<AdminProfile />} />
            <Route path="/addquiz" element={<AddQuiz />} />
            <Route
              // path="/updatequestionanswer/:id"
              path="/updatequestionanswer"
              element={<UpdateQuestionAnswer />}
            />
            <Route path="/addquestion" element={<AddQuestion />} />
            <Route path="/listquize" element={<ListQuize />} />
            <Route path="/updatequize" element={<UpdateQuiz />} />
            <Route path="/questionlist" element={<QuestionList />} />
            <Route path="/userlist" element={<UserList />} />
            <Route path="/taglist" element={<TagList />} />
            <Route path="/addtag" element={<AddTag />} />
          </Route>
        </Route>

        <Route element={<StudentProtected />}>
          <Route element={<StudentPrivateRoute />}>
            <Route path="/studentexamlist" element={<StudentExam />} />
            <Route path="/studentprofile" element={<StudentProfile />} />
            <Route path="/studentresult" element={<StudentResult />} />
          </Route>
        </Route>
        <Route element={<StudentProtected />}>
          <Route path="/examtable/:id" element={<ExamTable />} />
          <Route path="/resulttablestudent/:id" element={<ResultTable />} />
          <Route path="/instantresult" element={<InstantResult />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  );
};

export default App;
