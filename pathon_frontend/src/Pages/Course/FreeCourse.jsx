import React from 'react';
import Navbar from '../../Component/Navbar';
import Free from '../../Component/Course/Free';
import Footer from '../../Component/Footer';
import Header from '../../Component/Header';

const FreeCourse = () => {
    return (
        <div>
            <Header></Header>
            {/* <Navbar></Navbar> */}
            <Free></Free>
            <Footer></Footer>
        </div>
    );
};

export default FreeCourse;