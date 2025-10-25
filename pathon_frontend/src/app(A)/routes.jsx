import { createBrowserRouter } from "react-router-dom";
import Signin from "../Pages/Login/Signin";
import About from "../Pages/About/About";
import Contact from "../Pages/Contact/Contact";
import Policy from "../Pages/Privacy/Policy";
import Career from "../Pages/Careers/Career";
import Blog from "../Pages/Blogs/Blog";
import Helps from "../Pages/Support/Helps";
import Terms from "../Pages/Terms/Terms";
import FreeCourse from "../Pages/Course/FreeCourse";
import AllCourse from "../Pages/Course/AllCourse";
import Signup from "../Pages/Login/Signup";
import Lives1 from "../Pages/Lives/Lives";
import Lives3 from "../Pages/Lives/Lives3";
import Records from "../Pages/Records/Records.jsx";
import Records3 from "../Pages/Records/Records3.jsx";
import Problems from "../Pages/Problems/Problems";
import Problems3 from "../Pages/Problems/Problems3";
import Profiles from "../Pages/Profile/Profiles";
import Transactions from "../Pages/Profile/Transactions";
import UserProfiles from "../Pages/Profile/UserProfile";
import Lives2 from "../Pages/Lives/Lives2";
import Problems2 from "../Pages/Problems/Problems2";
import Records2 from "../Pages/Records/Records2.jsx";
import Recom from "../Pages/Reco/Recom.jsx";
import Episods from "../Pages/Details/Episods.jsx";
import ProtectedHome from "../Component/Home/ProtectedHome.jsx";
import DetailLive from "../Pages/Details/DetailLive.jsx";
import DetailRecord from "../Pages/Details/DetailRecord.jsx";
import DetailProblem from "../Pages/Details/DetailProblem.jsx";
import LClass from "../Pages/Lives/LClass.jsx";
import RClass from "../Pages/Records/RClass.jsx";
import PClass from "../Pages/Problems/PClass.jsx";
import UpdateClassPage from "../Pages/UpdateClass/UpdateClassPage.jsx";
import UpdateRecordClassPage from "../Pages/UpdateClass/UpdateRecordClassPage.jsx";
import UpdateProblemClassPage from "../Pages/UpdateClass/UpdateProblemClassPage.jsx";
import MyEnrolment from "../Component/Live/MyEnrolmentLive.jsx";
import Negotiation from "../Component/Profile.jsx/Interested.jsx";
import MainLayout from "../components(A)/layout/MainLayout.jsx";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <ProtectedHome />,
      },
      {
        path: "/profile",
        element: <Profiles />,
      },
      {
        path: "/user-profile/:user_id?",
        element: <UserProfiles />,
      },
      {
        path: "/transaction",
        element: <Transactions />,
      },
      {
        path: "/negotiation",
        element: <Negotiation />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/privacy-policy",
        element: <Policy />,
      },
      {
        path: "/career",
        element: <Career />,
      },
      {
        path: "/blogs",
        element: <Blog />,
      },
      {
        path: "/support",
        element: <Helps />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/return-policy",
        element: <FreeCourse />,
      },
      {
        path: "/all-course",
        element: <AllCourse />,
      },
      {
        path: "/live-classes",
        element: <Lives1 />,
      },
      {
        path: "/live-class",
        element: <Lives2 />,
      },
      {
        path: "/live-class-me",
        element: <LClass />,
      },
      {
        path: "/my-enrolment",
        element: <MyEnrolment />,
      },
      {
        path: "/create-live-class",
        element: <Lives3 />,
      },
      {
        path: "/record-classes",
        element: <Records />,
      },
      {
        path: "/record-class",
        element: <Records2 />,
      },
      {
        path: "/record-class-me",
        element: <RClass />,
      },
      {
        path: "/create-record-classes",
        element: <Records3 />,
      },
      {
        path: "/problem-solving",
        element: <Problems />,
      },
      {
        path: "/solve-class",
        element: <Problems2 />,
      },
      {
        path: "/solve-class-me",
        element: <PClass />,
      },
      {
        path: "/create-solve-classes",
        element: <Problems3 />,
      },
      {
        path: "/for-you",
        element: <Recom />,
      },
      {
        path: "/details-live/:subject_id",
        element: <DetailLive />,
      },
      {
        path: "/details-record/:subject_id",
        element: <DetailRecord />,
      },
      {
        path: "/details-problem/:subject_id",
        element: <DetailProblem />,
      },
      {
        path: "/add-episode/:subject_id",
        element: <Episods />,
      },
      { path: "/update-class/:subject_id", element: <UpdateClassPage /> },
      {
        path: "/update-record-class/:subject_id",
        element: <UpdateRecordClassPage />,
      },
      {
        path: "/update-problem-class/:subject_id",
        element: <UpdateProblemClassPage />,
      },
    ],
  },
]);
