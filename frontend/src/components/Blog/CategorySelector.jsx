

// const CategorySelector = ({onSelectCatagory, activeCatagory}) => {
//     const categories = ['Reuse Blogs', 'Reduce Waste Blogs', 'Recycle Waste Blogs', 'Extra'];
//   return (
//     <>
//     <div className="px-4 mb-8 lg:space-x-16 flex flex-wrap items-center border-b-2 py-5 text-gray-900
//     font-semibold">
//         <button onClick={() => onSelectCatagory(null)} className={`lg:ml-12 ${activeCatagory ? "" : "active-button"}`}>All</button>
//         {
//             categories.map((category) => (
//                 <button
//                 onClick={() => onSelectCatagory(category)}
//                 className={`mr-2 space-x-16 ${activeCatagory === category ? "active-button" : ""}`}
//                 key={category}>
//                     {category}

//                 </button>
//             ))
//         }
//     </div>
//     </>
//   )
// }

// export default CategorySelector