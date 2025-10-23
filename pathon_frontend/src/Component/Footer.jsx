import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Link } from "react-router";
import Image from "../Images/bank_logo.png"

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full  bg-blue-950 text-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left: Logo, blurb, socials */}
          <div className="md:col-span-5">
            {/* Logo */}
            <div className="select-none">
              {/* If you have a logo image, swap this text for an <img src="/path/logo.svg" /> */}
              <div className="text-[34px] font-extrabold tracking-tight text-purple-600 leading-none">
                PATHON
              </div>
            </div>

            {/* Blurb */}
            <p className="mt-4 text-[14px] leading-6  max-w-[520px]">
              Welcome to Pathon, your dedicated partner in the world of education
              technology. At Pathon, we are driven by a singular mission: to empower
              learners and educators with innovative tools and resources that redefine
              the learning experience.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-6 text-[#111]">
              <a href="#" aria-label="Facebook" className="hover:opacity-70">
                <FaFacebookF className="w-5 h-5 text-white" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:opacity-70">
                <FaTwitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:opacity-70">
                <FaLinkedinIn className="w-5 h-5 text-white" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:opacity-70">
                <FaInstagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Middle: Link columns */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[16px] font-semibold ">Pathon</h4>
              <ul className="mt-4 space-y-3 text-[14px] ">
                <li><Link to={'/about'} onClick={scrollToTop} className="hover:underline">About Us</Link></li>
                <li><Link to={'/privacy-policy'} onClick={scrollToTop} className="hover:underline">Privacy Policy</Link></li>
                <li><Link to={'/return-policy'} onClick={scrollToTop} className="hover:underline">Return Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[16px] font-semibold ">Community</h4>
              <ul className="mt-4 space-y-3 text-[14px] ">
                <li><Link to={'/career'} onClick={scrollToTop} className="hover:underline">Careers</Link></li>
                <li><Link to={'/blogs'} onClick={scrollToTop} className="hover:underline">Blog</Link></li>
                <li><Link to={'/terms'} onClick={scrollToTop} className="hover:underline">Terms of Use</Link></li>
                <li><Link to={'/support'} onClick={scrollToTop} className="hover:underline">Help and Support</Link></li>
              </ul>
            </div>
          </div>

          {/* Right: Store badges */}
          <div className="md:col-span-3 flex md:block items-start justify-start md:justify-end">
            <div className="space-y-6 md:ml-auto">
              {/* App Store badge */}

              {/* Google Play badge */}
              <a href="https://play.google.com/store/apps/details?id=app.pathon.https" aria-label="Get it on Google Play" className="block">
                <img
                  className="h-12 w-auto rounded-md"
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                />
              </a>

            </div>
          </div>
        </div>
        {/* Bank logo image for payment - placed below the top grid */}
        <div className="mt-6 flex justify-center md:justify-start">
          <a href="#" aria-label="Bank Logo" className="block">
            <img
              className="h-12 w-auto rounded-md"
              src={Image}
              alt="Bank Logo"
            />
          </a>
        </div>

        <hr className="border-t border-1 border-gray-300 mt-12 mb-0" />

        {/* Bottom row */}
        <div className="mt-4">
          <p className="text-[14px] font-semibold text-center text-gray-300">
            © 2025 Pathon Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
