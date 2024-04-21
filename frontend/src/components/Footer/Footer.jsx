import "./Footer.css";
import { FaFacebook } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaInstagramSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <>
      <hr className="h-[1px] mx-auto bg-[black] border-0 rounded mt-[160px]" />

      <footer>
        <div className="footer flex-col sm:flex-col md:flex-col lg:flex-row items-center text-center ">
          <div className="footer-content flex flex-col items-center sm:flex-col md:flex-col">
            <a href="/">
              <img src={logo} alt="" className="w-42 h-20 m-3 object-center" />
            </a>
            <p>
              for controlling the unmanaged waste disposals in the Kathmandu
              Valley, Nepal.
            </p>
          </div>
          <div className="footer-content">
            <h3>Quick Links</h3>
            <ul className="list">
              <li>
                <a href="">Home</a>
              </li>
              <li>
                <a href="">Blog</a>
              </li>
              <li>
                <a href="">Marketplace</a>
              </li>
            </ul>
          </div>
          <div className="footer-content">
            <h3>Follow Us</h3>
            <ul className="social-icons ">
              <li>
                <a href="https://www.facebook.com/">
                  <FaFacebook className="hover:scale-105" />
                </a>
              </li>
              <li>
                <a href="https://twitter.com/?lang=en">
                  <AiFillTwitterCircle className="hover:scale-105" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/">
                  <FaInstagramSquare className="hover:scale-105" />
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/">
                  <FaYoutube className="hover:scale-105" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="bottom-bar ">
          <hr className="h-[1px] mx-auto bg-[black] border-0 rounded mb-[-1rem] " />
          <br />
          <p> @2024 your DumpItRight . All rights reserved</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
