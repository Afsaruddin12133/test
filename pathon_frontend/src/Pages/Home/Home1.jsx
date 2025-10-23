import React, {useState} from 'react';
import Navbar from '../../Component/Navbar';
import Hero from '../../Component/Hero';
import Hero1 from '../../Component/Home/Hero1';
import Footer from '../../Component/Footer';
import Live from '../../Component/Live';
import Record from '../../Component/Record';
import Problem from '../../Component/Problem';
import Recommended from '../../Component/Home/Recommended';
import Header from '../../Component/Header';

const Home1 = () => {
    const [active, setActive] = useState("live");
    
      const tabs = [
        { id: "live", label: "Live Class", node: <Live /> },
        { id: "record", label: "Recorded Class", node: <Record /> },
        { id: "problem", label: "Problem Solving", node: <Problem /> },
      ];
    return (
        <div>
          <Header></Header>
            {/* <Navbar></Navbar> */}
            <Hero></Hero>
            <Hero1></Hero1>
            {/* --- Tabbed section for Live/Record/Problem --- */}
      <section className="w-full bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="flex flex-wrap gap-3">
            {tabs.map((t) => {
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActive(t.id)}
                  className={
                    "rounded-md px-4 sm:px-5 py-2 text-sm sm:text-base font-semibold transition " +
                    (isActive
                      ? "bg-purple-700 text-white shadow"
                      : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200")
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            {tabs.find((t) => t.id === active)?.node}
          </div>
        </div>
      </section>
      {/* --- End tabbed section --- */}
            {/* <Recommended></Recommended> */}
            <Footer></Footer>
        </div>
    );
};

export default Home1;