import React from 'react';
import Navbar from '../../Component/Navbar';
import Problem1 from '../../Component/Problem/Problem1';
import Footer from '../../Component/Footer';
import Header from '../../Component/Header';

const Problems = () => {
    return (
        <div>
            <Header></Header>
            {/* <Navbar></Navbar> */}
            <Problem1></Problem1>
            <Footer></Footer>
        </div>
    );
};

export default Problems;