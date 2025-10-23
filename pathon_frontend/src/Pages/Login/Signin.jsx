import React from 'react';
import Navbar from '../../Component/Navbar';
import Login from '../../Component/Login/Login';
import Footer from '../../Component/Footer';
import Header from '../../Component/Header';

const Signin = () => {
    return (
        <div>
            <Header></Header>
            {/* <Navbar></Navbar> */}
            <Login></Login>
            <Footer></Footer>
        </div>
    );
};

export default Signin;