import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Layout from './Component/Layout';
import Signin from './Pages/Login/Signin';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import Policy from './Pages/Privacy/Policy';
import Career from './Pages/Careers/Career';
import Blog from './Pages/Blogs/Blog';
import Helps from './Pages/Support/Helps';
import Terms from './Pages/Terms/Terms';
import FreeCourse from './Pages/Course/FreeCourse';
import AllCourse from './Pages/Course/AllCourse';
import Signup from './Pages/Login/Signup';
import Lives1 from './Pages/Lives/Lives';
import Lives3 from './Pages/Lives/Lives3';
import Records from './Pages/Records/Records.jsx';
import Records3 from './Pages/Records/Records3.jsx';
import Problems from './Pages/Problems/Problems';
import Problems3 from './Pages/Problems/Problems3';
import Profiles from './Pages/Profile/Profiles';
import Transactions from './Pages/Profile/Transactions';
import UserProfiles from './Pages/Profile/UserProfile';
import Lives2 from './Pages/Lives/Lives2';
import Problems2 from './Pages/Problems/Problems2';
import Records2 from './Pages/Records/Records2.jsx';
import Recom from './Pages/Reco/Recom.jsx';
import Episods from './Pages/Details/Episods.jsx';
import ProtectedHome from './Component/Home/ProtectedHome.jsx';
import DetailLive from './Pages/Details/DetailLive.jsx';
import DetailRecord from './Pages/Details/DetailRecord.jsx';
import DetailProblem from './Pages/Details/DetailProblem.jsx';
import LClass from './Pages/Lives/LClass.jsx';
import RClass from './Pages/Records/RClass.jsx';
import PClass from './Pages/Problems/PClass.jsx';
import UpdateClassPage from './Pages/UpdateClass/UpdateClassPage.jsx';
import UpdateRecordClassPage from './Pages/UpdateClass/UpdateRecordClassPage.jsx';
import UpdateProblemClassPage from './Pages/UpdateClass/UpdateProblemClassPage.jsx';
import MyEnrolment from './Component/Live/MyEnrolmentLive.jsx';
import Negotiation from './Component/Profile.jsx/Interested.jsx';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <ProtectedHome></ProtectedHome>
      },
      {
        path: "/profile",
        element: <Profiles></Profiles>
      },
      {
        path: "/user-profile/:user_id?",
        element: <UserProfiles></UserProfiles>
      },
      {
        path: "/transaction",
        element: <Transactions></Transactions>
      },
      {
        path: '/negotiation',
        element: <Negotiation></Negotiation>
      },
      {
        path: '/signin',
        element: <Signin></Signin>
      },
      {
        path: '/signup',
        element: <Signup></Signup>
      },
      {
        path: '/about',
        element: <About></About>
      },
      {
        path: '/contact',
        element: <Contact></Contact>
      },
      {
        path: '/privacy-policy',
        element: <Policy></Policy>
      },
      {
        path: '/career',
        element: <Career></Career>
      },
      {
        path: '/blogs',
        element: <Blog></Blog>
      },
      {
        path: '/support',
        element: <Helps></Helps>
      },
      {
        path: '/terms',
        element: <Terms></Terms>
      },
      {
        path: '/return-policy',
        element: <FreeCourse></FreeCourse>
      },
      {
        path: '/all-course',
        element: <AllCourse></AllCourse>
      },
      {
        path: '/live-classes',
        element: <Lives1></Lives1>
      },
      {
        path: '/live-class',
        element: <Lives2></Lives2>
      },
      {
        path: '/live-class-me',
        element: <LClass></LClass>
      },
      {
        path: '/my-enrolment',
        element: <MyEnrolment></MyEnrolment>
      },
      {
        path: '/create-live-class',
        element: <Lives3></Lives3>
      },
      {
        path: "/record-classes",
        element: <Records></Records>
      },
      {
        path: '/record-class',
        element: <Records2></Records2>
      },
      {
        path: '/record-class-me',
        element: <RClass></RClass>
      },
      {
        path: '/create-record-classes',
        element: <Records3></Records3>
      },
      {
        path: "/problem-solving",
        element: <Problems></Problems>
      },
      {
        path: '/solve-class',
        element: <Problems2></Problems2>
      },
      {
        path: '/solve-class-me',
        element: <PClass></PClass>
      },
      {
        path: "/create-solve-classes",
        element: <Problems3></Problems3>
      },
      {
        path: '/for-you',
        element: <Recom></Recom>
      },
      {
        path: "/details-live/:subject_id",
        element: <DetailLive></DetailLive>
      },
      {
        path: "/details-record/:subject_id",
        element: <DetailRecord></DetailRecord>
      },
      {
        path: "/details-problem/:subject_id",
        element: <DetailProblem></DetailProblem>
      },
      {
        path: '/add-episode/:subject_id',
        element: <Episods></Episods>
      },
      {
        path: '/update-class/:subject_id',
        element: <UpdateClassPage></UpdateClassPage>
      },
      {
        path: '/update-record-class/:subject_id',
        element: <UpdateRecordClassPage></UpdateRecordClassPage>
      },
      {
        path: '/update-problem-class/:subject_id',
        element: <UpdateProblemClassPage></UpdateProblemClassPage>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
