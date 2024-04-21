import React from 'react';
import blog from '../../assets/blog.jpg';
import './Banner.css'; // Import or create a CSS file for your component styles

const Banner = () => {
  return (
    <>
        <div className='flex items-center justify-center relative'>
      <img
        src={blog}
        className=' m-[2rem] mt-[6.6rem] blackbox-border border-gray-300 p-2 border-2 object-cover h-[22rem] sm:h-[25rem] md:h-[30rem] w-full'
        alt=''
      />
      
      <div className='absolute w-max'>
        <h1 className='animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-2xl sm:text-3xl md:text-4xl text-center text-gray-700 font-bold'>
         TRENDING BLOGS..
        </h1>
      </div>
    </div>
    </>

  );
};

export default Banner;
