import { Navbar, Footer } from '../../components';
import Banner from '../../components/Blog/Banner';
import BlogPage from '../../components/Blog/BlogPage';

const Blog = () => {
  return (
    <>
      <Navbar />
      <div>
      <Banner />
      </div>
      <div className='ml-auto mt-[3rem]'>
        <BlogPage />
      </div>
      <Footer />

    </>
  );
};

export default Blog;

