import { useEffect } from "react";
import "./Home.css";
import Middle from "./Middle";
import { Footer, Navbar } from "../../components";
import { AiOutlineSwapRight } from "react-icons/ai";
import Portifolio from "./Portifolio";
import Reviews from "./Reviews";
import Accordion from "./Accordion";
import video from "../../assets/video.mp4";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { getUserInfoFromCookie } from "../../utils";

const Home = () => {
  const user = getUserInfoFromCookie();
  useEffect(() => {
    Aos.init({ duration: 2000 });
    // Add your script here
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/65e157138d261e1b5f6720d2/1hns3o9kf";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []); // Empty dependency array ensures that the effect runs only once after the initial render

  return (
    <>
      <Navbar />
      <div className="Home">
        <div className="videoBg">
          <video
            src={video}
            autoPlay
            loop
            muted
            className="object-cover"
          ></video>
        </div>
        <div className="sectionText">
          <h1 data-aos="fade-up" className=" text-white ">
            Dump it right, keep the planet bright.
          </h1>
          <p data-aos="fade-up">
            {" "}
            Lets make a commitment to responsible waste management.
          </p>
          <Link
            to={!user ? "/registration" : "/user/dashboard/regular-schedules"}
          >
            <button
              data-aos="fade-up"
              className="getstartedbtn flex hover:scale-105 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            >
              Get Started <AiOutlineSwapRight className="icon" />
            </button>
          </Link>
        </div>
      </div>
      <div className="head mx-auto mt-[70px]">
        <h2 data-aos="fade-up">
          Your Partner for Achieving a Zero Waste Future
        </h2>
        <h1 data-aos="fade-up">DumpItRight</h1>
        <h3 data-aos="fade-up">
          DumpItRight is a comprehensive solution designed to efficiently
        </h3>
        <h4 data-aos="fade-up">
          {" "}
          handle the collection and disposal of waste.
        </h4>
      </div>
      <Middle />
      <Portifolio />
      <Reviews />
      <Accordion />
      <Footer />
    </>
  );
};

export default Home;
