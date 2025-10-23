import React from 'react';
import Navbar from '../../Component/Navbar';
import Blogs from '../../Component/Blogs/Blogs';
import Footer from '../../Component/Footer';
import Header from '../../Component/Header';

const Blog = () => {
    return (
        <div>
            <Header></Header>
            {/* <Navbar></Navbar> */}
            <Blogs></Blogs>
            <Footer></Footer>
        </div>
    );
};

export default Blog;