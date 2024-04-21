import './Portifolio.css'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react';

import { GrSchedule } from "react-icons/gr";
import { IoNotificationsCircle } from "react-icons/io5";
import { GiTargetPrize } from "react-icons/gi";


const Portifolio = () => {
        useEffect(() => {
        Aos.init({ duration: 2000});},[]);
  return (
    <>
    <div className="portifolio section  flex justify-center  w-[80%] mx-auto mt-[120px]">
        <div className="secContainer grid w-full">
            <div className="leftContent">
                <div className="secHeading">
                    <h3 data-aos='fade-up'>Why Choose Us?</h3>
                    <p data-aos='fade-up'>
                    Offers efficient collection, disposal services, contributing
                     to environmental protection and public health.
                    </p>
                </div>
                <div className="portifoliogrid">
                    <div className="singlePortifolio flex">
                        <div className="iconDiv">
                        <GrSchedule data-aos='fade-up'/>
                        </div>
                        <div className="infor">
                            <h4 data-aos='fade-up'>Schedule Pickups</h4>
                            <p data-aos='fade-up'>Scheduled waste pickups ensure timely and organized collection of waste for proper disposal and recycling.</p>

                        </div>
                    </div>

                    <div className="singlePortifolio flex">
                        <div className="iconDiv">
                        <IoNotificationsCircle data-aos='fade-up'/>
                        </div>
                        <div className="infor">
                            <h4 data-aos='fade-up'>Notification Alert</h4>
                            <p data-aos='fade-up'>Notification alerts ensure timely communication on collection schedules, service updates, and disposal instructions for efficient waste handling.</p>
                            
                        </div>
                    </div>

                    <div className="singlePortifolio flex">
                        <div className="iconDiv">
                        <GiTargetPrize data-aos='fade-up'/>
                        </div>
                        <div className="infor">
                            <h4 data-aos='fade-up'>Reward Points</h4>
                            <p data-aos='fade-up'>Reward points in waste management system offer incentives for eco-friendly practices, encouraging responsible disposal and recycling behaviors.</p>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="rightContent">
                <img src="https://images.pexels.com/photos/13092792/pexels-photo-13092792.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" data-aos='fade-down'/>
            </div>

        </div>
    </div>
    </>
  )
}

export default Portifolio