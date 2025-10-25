import { Outlet } from "react-router";
import Footer from "../../Component/Footer";
import Header from "../../Component/Header";
import ScrollToTop from './../../Component/ScrollToTop';



const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      {/* <Navbar/> */}
      <main className="main-content">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;