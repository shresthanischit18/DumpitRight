
import { FaRecycle } from "react-icons/fa";

import { MdCompost } from "react-icons/md";

import { FaBiohazard } from "react-icons/fa6";
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react';





const Portifolio = () => {
    useEffect(() => {
    Aos.init({ duration: 2000});},[]);
  return (
    <>
    <div className="portifolio section  flex justify-center  w-[80%] mx-auto mt-[180px] ">
      
        <div className="secContainer grid w-full">
        <div className="rightContent">
                <img src="https://img.freepik.com/premium-photo/blue-trash-can-is-overflowing-with-garbage-city-street-fall-season_116317-42711.jpg?w=1060" alt="" className='rounded-md w-[100rem] object-cover h-[420px]'data-aos='fade-down'/>
            </div>

            <div className="leftContent ml-[5rem] mt-[-1.5rem] sm:ml-[10px]">
                <div className="secHeading sm:mt-[90px]">
                    <h3 data-aos='fade-up'>Best Way To Dump Your Waste</h3>
                    <p data-aos='fade-up'> 
                    When it comes to waste disposal, its essential to prioritize methods that minimize harm to the environment and human health.
                    </p>
                </div>
                <div className="portifoliogrid ">
                    <div className="singlePortifolio flex mt-[-1rem] sm:mt-[50px] ">
                        <div className="iconDiv">
                        <FaRecycle data-aos='fade-up' />

                        </div>
                        <div className="infor">
                            <h4 data-aos='fade-up'>Reduce, Reuse, Recycle</h4>
                            <p data-aos='fade-up'> Encourage practices such as reducing consumption, reusing items, and recycling materials whenever possible.</p>

                        </div>
                    </div>

                    <div className="singlePortifolio flex">
                        <div className="iconDiv">
                        <MdCompost data-aos='fade-up'/>
                        </div>
                        <div className="infor">
                            <h4 data-aos='fade-up'>Composting</h4>
                            <p data-aos='fade-up'>Organic waste, such as food scraps and yard trimmings, can be composted to create nutrient-rich soil for gardening and landscaping. </p>
                            
                        </div>
                    </div>

                    <div className="singlePortifolio flex">
                        <div className="iconDiv ">
                        <FaBiohazard data-aos='fade-up'/>
                        </div>
                        <div className="infor ">
                            <h4 data-aos='fade-up'>Hazardous Waste</h4>
                            <p data-aos='fade-up'>Hazardous waste, such as batteries, electronics, chemicals, and medical waste, should be disposed of properly to prevent harm to human health and the environment. </p>
                            
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    </>
  )
}

export default Portifolio