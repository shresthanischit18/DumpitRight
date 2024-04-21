import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Navbar.css";
import { AiFillCloseCircle } from "react-icons/ai";
import { PiDotsNineBold } from "react-icons/pi";
import { getUserInfoFromCookie } from "../../utils";
import { FaCircleUser } from "react-icons/fa6";
import { FaOpencart } from "react-icons/fa6";
import { MdAppRegistration } from "react-icons/md";

const Navbar = () => {
  //State to track and update navbar
  const [navBar, setnavBar] = useState("menu");
  //Function to show navbar
  const shownavBar = () => {
    setnavBar("menu shownavBar");
  };
  //Function to show navbar
  const removenavBar = () => {
    setnavBar("menu removenavBar");
  };

  const user = getUserInfoFromCookie();

  return (
    <div className="navBar">
      <a href="/">
        <img
          src={logo}
          alt=""
          className=" m-3 object-center w-[130px] sm:w-[180px]"
        />
      </a>
      <div className={navBar}>
        <ul>
          <li className="navList">
            {" "}
            <Link to="/">Home</Link>
          </li>
          <li className="navList">
            <Link to="/blogs">Blog</Link>
          </li>
          <li className="navList">
            <Link to="/product">Marketplace</Link>
          </li>
        </ul>
        {/*Icons to remove Navbar */}
        <AiFillCloseCircle className="icon closeIcon" onClick={removenavBar} />
      </div>
      {user ? (
        <>
          <Link to="/cart">
            <button className="cart">
              <FaOpencart className="text-[30px] hover:text-[#119f48] focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none" />
            </button>
          </Link>

          <Link to={`/${user.role}/dashboard`}>
            <button className="signUpBtn btn">
              <FaCircleUser className="text-[30px] focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none" />
            </button>
          </Link>
        </>
      ) : (
        <Link to="/registration">
          <button className="signUpBtn btn text-4xl">
            <MdAppRegistration />
          </button>
        </Link>
      )}
      {/*Icons to Toggle Navbar */}
      <PiDotsNineBold className="icon menuIcon" onClick={shownavBar} />
    </div>
  );
};

export default Navbar;
