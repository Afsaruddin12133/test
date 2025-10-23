import React from 'react';
import Navbar from '../../Component/Navbar';
import All from '../../Component/Course/All';
import Footer from '../../Component/Footer';
import Header from '../../Component/Header';

const AllCourse = () => {
    return (
        <div>
            <Header></Header>
            {/* <Navbar></Navbar> */}
            <All></All>
            <Footer></Footer>
        </div>
    );
};

export default AllCourse;