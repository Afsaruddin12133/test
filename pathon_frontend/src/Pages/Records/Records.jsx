import React from 'react';
import Navbar from '../../Component/Navbar';
import Record1 from '../../Component/Record/Record1';
import Footer from '../../Component/Footer';
import Header from '../../Component/Header';

const Records = () => {
    return (
        <div>
            <Header></Header>
            {/* <Navbar></Navbar> */}
            <Record1></Record1>
            <Footer></Footer>
        </div>
    );
};

export default Records;