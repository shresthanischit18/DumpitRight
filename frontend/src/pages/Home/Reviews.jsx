import './Reviews.css'
import { AiFillStar } from 'react-icons/ai';
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react';


const Reviews = () => {
    useEffect(() => {
    Aos.init({ duration: 2000});},[]);
  return (
    <>
    <div className="review section w-[80%] mx-auto mt-[180px]">
        <div className="secContainer grid">
            <div className="textDiv">
                <span data-aos='fade-up' className='redText'>FROM OUR CLIENTS</span>
                <h3 data-aos='fade-up'>Real Waste History From Our Clients</h3>
                <p data-aos='fade-up'>
                service for eco-friendly solutions, efficient disposal, and convenient 
                scheduling, ensuring a clean, sustainable environment.
                </p>
                <span className='star flex' data-aos='fade-up'>
                    <AiFillStar className='icon'/>
                    <AiFillStar className='icon'/>
                    <AiFillStar className='icon'/>
                    <AiFillStar className='icon'/>
                    <AiFillStar className='icon'/>

                </span>

                <div className="clientImages flex">
                    <img src= "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" data-aos='fade-up'/>
                    <img src="https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" data-aos='fade-up'/>
                    <img src="https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" data-aos='fade-up'/>
                    <img src="https://images.pexels.com/photos/247287/pexels-photo-247287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" data-aos='fade-up'/>
                   
                </div>
            </div>
            <div className="imgDiv">
            <img src="https://images.pexels.com/photos/906052/pexels-photo-906052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" data-aos='fade-down' />
            </div>
        </div>
    </div>
    </>
  )
}

export default Reviews