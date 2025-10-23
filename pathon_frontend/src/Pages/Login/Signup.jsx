import React from 'react';
import Navbar from '../../Component/Navbar';
import Signup1 from '../../Component/Login/Signup';
import Footer from '../../Component/Footer';
import Header from '../../Component/Header';
const Signup = () => {
    return (
        <div>
            <Header></Header>
            {/* <Navbar></Navbar> */}
            <Signup1></Signup1>
            <Footer></Footer>
        </div>
    );
};

export default Signup;