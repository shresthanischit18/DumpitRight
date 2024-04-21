import { Button } from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { FaUser } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequest } from '../../utils/apiHandler';
import { Loader } from '../../components';
import { format } from 'date-fns';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Navbar, Footer } from '../../components';



const BlogDescription = () => {
  const { blogID } = useParams();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['Blog', blogID],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/blogs/${blogID}`,
      });

      return res.data || {};
    },
  });

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {isLoading && <Loader />}
      <div>
        {/*Blog Details */}
        <div className=' mx-auto mt-[10rem] my-12'>
          <div className='lg:w-3/4 mx-auto'>
            <Button className='mb-[5rem] bg-[#119f48] flex justify-center hover:scale-105 items-center gap-2 text-[15px]' onClick={() => navigate('/blogs')}>
            <IoMdArrowRoundBack  /> Go Back
            </Button>

            <div>
            <h3 className='mt-4 mb-5 font-bold text-5xl flex justify-center items-center'>
              {blog?.title}
            </h3>
              <img
                src={`http://localhost:8000/${blog?.coverImg}`}
                alt=''
                className='w-[1410px] h-[600px] object-cover mx-auto rounded mb-5'
              />
            </div>

            <p className='mb-2 text-gray-600'>
              <FaUser className='inline-flex items-center mr-2' />
              {blog?.user?.fullName}
            </p>
            <p className='text-sm text-gray-500 mb-5'>
              <FaClock className='inline-flex items-center mr-2' />
              Published:{' '}
              {blog?.createdAt &&
                format(new Date(blog?.createdAt), 'MMMM dd, yyyy HH:mm:ss a')}
            </p>

            <div dangerouslySetInnerHTML={{ __html: blog?.content }}></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDescription;

