import React from 'react';
import Navbar from '../../Component/Navbar';
import Careers from '../../Component/Careers/Careers';
import Footer from '../../Component/Footer';
import Header from '../../Component/Header';

const Career = () => {
    return (
        <div>
            <Header></Header>
            {/* <Navbar></Navbar> */}
            <Careers></Careers>
            <Footer></Footer>
        </div>
    );
};

export default Career;