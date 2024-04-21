import './Middle.css'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react';


const Middle = () => {
  useEffect(() => {
    Aos.init({ duration: 2000});},[]);
  return (
   <>
        <div className="middle section flex justify-center mx-auto my-auto">
          <div className="secContainer container">
            <div className="middlegrid">
              <span className='flex' data-aos='fade-up'>
                <h1>3</h1>
                <p>Waste Categories</p>
              </span>
              
              <span className='flex' data-aos='fade-up'>
                <h1>10K+</h1>
                <p>Customers Reviews</p>
              </span>
              
              <span className='flex' data-aos='fade-up'>
                <h1>10</h1>
                <p>World of Experiences</p>
              </span>

              <span className='flex' data-aos='fade-up'>
                <h1>4.6</h1>
                <p>Overall Rating</p>
              </span>
            </div>
          </div>
        </div>
   </>
  )
}

export default Middle