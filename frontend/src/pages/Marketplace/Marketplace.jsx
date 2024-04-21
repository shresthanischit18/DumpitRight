// import { Link } from 'react-router-dom';
// import { BsPlus, BsEyeFill } from 'react-icons/bs';  // Import icons from react-icons library
// import { Navbar } from '../../components';
// import { MdArrowDropDown } from "react-icons/md";
// import mbanner from '../.././assets/mbanner.jpg'

// const Marketplace = () => {
//   return (
//     <>
//       <Navbar />

//       <div className='mt-[8rem] m-[5rem]'>
//         <div className='flex flex-wrap'>
//           <h1>Categories <MdArrowDropDown /></h1>

//         </div>
//         <div>
//           <h1 className='text-4xl font-bold flex justify-center items-center mb-[4rem]'>TRENDY PRODUCTS</h1>
//         </div>

//           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-[30px] max-w-sm mx-auto md:max-w-none md:mx-0'>
//           <div className="group w-[20rem]">
//             <div className="bg-[url('https://images.pexels.com/photos/4210315/pexels-photo-4210315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] hover:bg-[url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover w-[340px] h-[460px] relative">
//               <div className='group-hover:right-5 p-2 flex flex-col items-end gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-0 right-0'>
//                 <button>
//                   <div className='flex justify-center items-center w-12 h-12 text-white bg-red-500'><BsPlus className='text-3xl'/>
//                   </div>
//                 </button>
//                 <Link to={'/singleproduct'} className='w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl'>
//                   <BsEyeFill />
//                 </Link>
//               </div>
//             </div>
//           <h1 className='text-[1rem] text-gray-600 font-medium'>Reused Product</h1>
//           <h2 className='text-[1.1rem] text-black font-medium '>Vase Made from Newspaper</h2>
//           <h2 className='text-[1.1rem] text-black font-medium'>200 Reward</h2>
//           </div>

//           <div className="group w-[20rem]">
//             <div className="bg-[url('https://images.pexels.com/photos/4210315/pexels-photo-4210315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] hover:bg-[url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover w-[340px] h-[460px] relative">
//               <div className='group-hover:right-5 p-2 flex flex-col items-end gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-0 right-0'>
//                 <button>
//                   <div className='flex justify-center items-center w-12 h-12 text-white bg-red-500'><BsPlus className='text-3xl'/>
//                   </div>
//                 </button>
//                 <Link to={'/singleproduct'} className='w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl'>
//                   <BsEyeFill />
//                 </Link>
//               </div>
//             </div>
//           <h1 className='text-[1rem] text-gray-600 font-medium'>Reused Product</h1>
//           <h2 className='text-[1.1rem] text-black font-medium '>Vase Made from Newspaper</h2>
//           <h2 className='text-[1.1rem] text-black font-medium'>200 Reward</h2>
//           </div>

//           <div className="group w-[20rem]">
//             <div className="bg-[url('https://images.pexels.com/photos/4210315/pexels-photo-4210315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] hover:bg-[url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover w-[340px] h-[460px] relative">
//               <div className='group-hover:right-5 p-2 flex flex-col items-end gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-0 right-0'>
//                 <button>
//                   <div className='flex justify-center items-center w-12 h-12 text-white bg-red-500'><BsPlus className='text-3xl'/>
//                   </div>
//                 </button>
//                 <Link to={'/singleproduct'} className='w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl'>
//                   <BsEyeFill />
//                 </Link>
//               </div>
//             </div>
//           <h1 className='text-[1rem] text-gray-600 font-medium'>Reused Product</h1>
//           <h2 className='text-[1.1rem] text-black font-medium '>Vase Made from Newspaper</h2>
//           <h2 className='text-[1.1rem] text-black font-medium'>200 Reward</h2>
//           </div>

//           <div className="group w-[20rem]">
//             <div className="bg-[url('https://images.pexels.com/photos/4210315/pexels-photo-4210315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] hover:bg-[url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover w-[340px] h-[460px] relative">
//               <div className='group-hover:right-5 p-2 flex flex-col items-end gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-0 right-0'>
//                 <button>
//                   <div className='flex justify-center items-center w-12 h-12 text-white bg-red-500'><BsPlus className='text-3xl'/>
//                   </div>
//                 </button>
//                 <Link to={'/singleproduct'} className='w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl'>
//                   <BsEyeFill />
//                 </Link>
//               </div>
//             </div>
//           <h1 className='text-[1rem] text-gray-600 font-medium'>Reused Product</h1>
//           <h2 className='text-[1.1rem] text-black font-medium '>Vase Made from Newspaper</h2>
//           <h2 className='text-[1.1rem] text-black font-medium'>200 Reward</h2>
//           </div>

//           <div className="group w-[20rem]">
//             <div className="bg-[url('https://images.pexels.com/photos/4210315/pexels-photo-4210315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] hover:bg-[url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover w-[340px] h-[460px] relative">
//               <div className='group-hover:right-5 p-2 flex flex-col items-end gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-0 right-0'>
//                 <button>
//                   <div className='flex justify-center items-center w-12 h-12 text-white bg-red-500'><BsPlus className='text-3xl'/>
//                   </div>
//                 </button>
//                 <Link to={'/singleproduct'} className='w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl'>
//                   <BsEyeFill />
//                 </Link>
//               </div>
//             </div>
//           <h1 className='text-[1rem] text-gray-600 font-medium'>Reused Product</h1>
//           <h2 className='text-[1.1rem] text-black font-medium '>Vase Made from Newspaper</h2>
//           <h2 className='text-[1.1rem] text-black font-medium'>200 Reward</h2>
//           </div>

//           <div className="group w-[20rem]">
//             <div className="bg-[url('https://images.pexels.com/photos/4210315/pexels-photo-4210315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] hover:bg-[url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover w-[340px] h-[460px] relative">
//               <div className='group-hover:right-5 p-2 flex flex-col items-end gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-0 right-0'>
//                 <button>
//                   <div className='flex justify-center items-center w-12 h-12 text-white bg-red-500'><BsPlus className='text-3xl'/>
//                   </div>
//                 </button>
//                 <Link to={'/singleproduct'} className='w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl'>
//                   <BsEyeFill />
//                 </Link>
//               </div>
//             </div>
//           <h1 className='text-[1rem] text-gray-600 font-medium'>Reused Product</h1>
//           <h2 className='text-[1.1rem] text-black font-medium '>Vase Made from Newspaper</h2>
//           <h2 className='text-[1.1rem] text-black font-medium'>200 Reward</h2>
//           </div>

//           <div className="group w-[20rem]">
//             <div className="bg-[url('https://images.pexels.com/photos/4210315/pexels-photo-4210315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] hover:bg-[url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover w-[340px] h-[460px] relative">
//               <div className='group-hover:right-5 p-2 flex flex-col items-end gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-0 right-0'>
//                 <button>
//                   <div className='flex justify-center items-center w-12 h-12 text-white bg-red-500'><BsPlus className='text-3xl'/>
//                   </div>
//                 </button>
//                 <Link to={'/singleproduct'} className='w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl'>
//                   <BsEyeFill />
//                 </Link>
//               </div>
//             </div>
//           <h1 className='text-[1rem] text-gray-600 font-medium'>Reused Product</h1>
//           <h2 className='text-[1.1rem] text-black font-medium '>Vase Made from Newspaper</h2>
//           <h2 className='text-[1.1rem] text-black font-medium'>200 Reward</h2>
//           </div>

//           <div className="group w-[20rem]">
//             <div className="bg-[url('https://images.pexels.com/photos/4210315/pexels-photo-4210315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] hover:bg-[url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover w-[340px] h-[460px] relative">
//               <div className='group-hover:right-5 p-2 flex flex-col items-end gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-0 right-0'>
//                 <button>
//                   <div className='flex justify-center items-center w-12 h-12 text-white bg-red-500'><BsPlus className='text-3xl'/>
//                   </div>
//                 </button>
//                 <Link to={'/singleproduct'} className='w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl'>
//                   <BsEyeFill />
//                 </Link>
//               </div>
//             </div>
//           <h1 className='text-[1rem] text-gray-600 font-medium'>Reused Product</h1>
//           <h2 className='text-[1.1rem] text-black font-medium '>Vase Made from Newspaper</h2>
//           <h2 className='text-[1.1rem] text-black font-medium'>200 Reward</h2>
//           </div>

//           <div className="group w-[20rem]">
//             <div className="bg-[url('https://images.pexels.com/photos/4210315/pexels-photo-4210315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] hover:bg-[url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover w-[340px] h-[460px] relative">
//               <div className='group-hover:right-5 p-2 flex flex-col items-end gap-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-0 right-0'>
//                 <button>
//                   <div className='flex justify-center items-center w-12 h-12 text-white bg-red-500'><BsPlus className='text-3xl'/>
//                   </div>
//                 </button>
//                 <Link to={'/singleproduct'} className='w-12 h-12 bg-white flex justify-center items-center text-primary drop-shadow-xl'>
//                   <BsEyeFill />
//                 </Link>
//               </div>
//             </div>
//           <h1 className='text-[1rem] text-gray-600 font-medium'>Reused Product</h1>
//           <h2 className='text-[1.1rem] text-black font-medium '>Vase Made from Newspaper</h2>
//           <h2 className='text-[1.1rem] text-black font-medium'>200 Reward</h2>
//           </div>

//           </div>
//         </div>
//     </>
//   );
// }

// export default Marketplace;
