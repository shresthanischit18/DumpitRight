import { Link } from 'react-router-dom';
import { getRequest } from '../../utils/apiHandler';
import Loader from '../Loader';
import BlogCards from './BlogCards';
import { useQuery } from '@tanstack/react-query';

const BlogPage = () => {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['Blogs'],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: '/blogs',
      });

      return res.data || [];
    },
  });

  return (
    <>
      {isLoading && <Loader />}
      <div>
        {/*blog*/}
        <div>
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 px-10 ml-[5rem]'>
          {blogs?.map(blog => (
            <Link to={`/blogs/${blog._id}`} key={blog._id}>
              <BlogCards blog={blog} />
            </Link>
          ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;

