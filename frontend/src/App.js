import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faMagnifyingGlass, faArrowRightToBracket, faUserCircle, faGear, faMessage, faFile, faShield, faPowerOff, faChalkboardUser, faEllipsis, faPen, faFolderPlus, faTrash, faFolderOpen, faCalendarPlus, faCreditCard, faFileCirclePlus, faArrowRight, faHome, faCircleInfo, faFilePowerpoint, faFileWord, faFileImage, faFilePdf, faFileLines, faFileArrowDown, faLock, faUnlock, faArrowLeft, faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons'
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import "./App.scss";
import useAuth from './routes/useAuth';
import AuthorisedHeader from './components/Header/AuthorisedHeader';
import UnauthorisedHeader from './components/Header/UnauthorisedHeader';
import Footer from "./components/Footer/Footer";
import HomePage from './components/Home-page/HomePage';
import AboutUs from './components/Home-page/AboutUs';
import Login from './components/LoginSignUp/Login/Login';
import SignUp from './components/LoginSignUp/SignUp/SignUp';
import PageNotFound from './routes/PageNotFound/PageNotFound';
import ContactUs from './components/Home-page/ContactUs';
import PrivacyPolicy from './components/Home-page/PrivacyPolicy';
import TermsAndCondition from './components/Home-page/TermsAndCondition';
import StudentDashboard from './components/Student/Dashboard/StudentDashboard';
import TeacherDashboard from './components/Teacher/Dashboard/TeacherDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import TeacherClassOverview from './components/Teacher/ClassOverview/ClassOverview';
import StudentClassOverview from './components/Student/ClassOverview/ClassOverview';
import CreateChapter from './components/Teacher/CreateEditChapter/CreateChapter';
import EditChapter from './components/Teacher/CreateEditChapter/EditChapter';
import Settings from './components/Configuration/Settings/Settings';
import Profile from './components/Configuration/Profile/Profile';
import ExamSection from './components/Student/ExamSection/ExamSection';
import ProfileOverview from './components/ProfileOverview/ProfileOverview';
import ChapterOverview from './components/Student/ChapterOverview/ChapterOverview';
import FlashcardList from './components/Student/ChapterOverview/Flashcard/FlashcardList';
import Quiz from './components/Student/ChapterOverview/Quiz/Quiz';
import CreateExam from './components/Teacher/CreateEditExam/CreateExam';
import EditExam from './components/Teacher/CreateEditExam/EditExam';

library.add(fab, faHome,faMagnifyingGlass, faArrowRightToBracket, faUserCircle, faGear, faMessage, faFile, faShield, faPowerOff, faFacebookF, faTwitter, faInstagram, faChalkboardUser, faEllipsis, faPen, faFolderPlus, faTrash, faFolderOpen, faCalendarPlus, faCreditCard, faFileCirclePlus,faArrowLeft, faArrowRight, faCircleInfo, faFilePowerpoint, faFileWord, faFileImage, faFilePdf, faFileLines, faFileArrowDown, faLock, faUnlock, faClipboardList)

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

  const handleLogin = (user) => {
    setUser(user);

    //Add data to local storage
    localStorage.setItem('user', JSON.stringify(user));
    login();
  };

  const onSettingsChange = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  //useNavigate is passed as parameter as useNavigate can only be used in Router
  const handleLogout = (e, navigate) => {
    e.preventDefault();

    //Remove data from local storage
    localStorage.removeItem('user');
    logout();
    navigate('/login');
  };

  const studentCondition = user.type === 'Student';
  const teacherCondition = user.type === 'Teacher';
  const adminCondition = user.type === 'Admin';

  return (
    <Router>
      {isAuthenticated ? (
        <AuthorisedHeader user={user} handleLogout={handleLogout} />
      ) : (
        <UnauthorisedHeader />
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/login" element={<Login handleLogin={handleLogin}/>} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/support" element={<ContactUs />} />
        <Route path="/policy" element={<PrivacyPolicy />} />
        <Route path="/t&c" element={<TermsAndCondition />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />


        <Route path=':userType/:userID/settings' element={<AuthenticatedRoutes component={<Settings user={user} onSettingsChange={onSettingsChange}/>} />} />
        <Route path=':userType/:userID/profile' element={<AuthenticatedRoutes component={<Profile user={user}/>} />} />
        <Route path='profile/:userType/:userID' element={<AuthenticatedRoutes component={<ProfileOverview />} />} />


        <Route 
          path="/student/:studentID/*" 
          element={<AuthenticatedRoutes accessCondition={studentCondition} component={<StudentDashboard user={user}/>} />}
        />
        <Route 
          path="student/:studentID/class/:classID/*" 
          element={<AuthenticatedRoutes accessCondition={studentCondition} component={<StudentClassOverview />} />} 
        />
        <Route 
          path="student/:studentID/class/:classID/chapter/:chapterID" 
          element={<AuthenticatedRoutes accessCondition={studentCondition} component={<ChapterOverview />} />} 
        />
        <Route 
          path='student/:studentID/class/:classID/exam/:examID' 
          element={<AuthenticatedRoutes accessCondition={studentCondition} component={<ExamSection user={user} />} />} 
        />
        <Route 
          path='student/:studentID/class/:classID/chapter/:chapterID/flashcard' 
          element={<AuthenticatedRoutes accessCondition={studentCondition} component={<FlashcardList />} />} 
        />
        <Route 
          path='student/:studentID/class/:classID/chapter/:chapterID/quiz' 
          element={<AuthenticatedRoutes accessCondition={studentCondition} component={<Quiz user={user} />} />} 
        />


        <Route 
          path='teacher/:teacherID/*' 
          element={<AuthenticatedRoutes accessCondition={teacherCondition} component={<TeacherDashboard user={user}/>} />} 
        />
        <Route 
          path="teacher/:teacherID/class/:classID/*" 
          element={<AuthenticatedRoutes accessCondition={teacherCondition} component={<TeacherClassOverview />} />} 
        />
        <Route 
          path='teacher/:teacherID/class/:classID/add_exam' 
          element={<AuthenticatedRoutes accessCondition={teacherCondition} component={<CreateExam />} />} 
        />
        <Route 
          path='teacher/:teacherID/class/:classID/add_chapter' 
          element={<AuthenticatedRoutes accessCondition={teacherCondition} component={<CreateChapter/>} />}
        />
        <Route 
          path="teacher/:teacherID/class/:classID/edit_chapter/:chapterID" 
          element={<AuthenticatedRoutes accessCondition={teacherCondition} component={<EditChapter/>} />}
        />
        <Route 
          path="teacher/:teacherID/class/:classID/edit_exam/:examID" 
          element={<AuthenticatedRoutes accessCondition={teacherCondition} component={<EditExam/>} />}
        />

        
        <Route 
          path="admin/:adminID" 
          element={<AuthenticatedRoutes accessCondition={adminCondition} component={<AdminDashboard user={user}/>} />} 
        />


      </Routes>
      <Footer />
    </Router>
  );
}

export default App