import { PlusIcon } from '@heroicons/react/24/solid';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from '@material-tailwind/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiHandler, getUserInfoFromCookie } from '../../utils';
import { useQuery } from '@tanstack/react-query';
import { getRequest } from '../../utils/apiHandler';
import BlogCards from '../../components/Blog/BlogCards';
import { Loader } from '../../components';
import Swal from 'sweetalert2';

const BlogsLists = () => {
  const user = getUserInfoFromCookie();
  const [displayLoader, setDisplayLoader] = useState(false);

  const {
    data: blogs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['Blogs'],
    queryFn: async () => {
      if (!user) {
        return [];
      }

      const res = await getRequest({
        endpoint: `/blogs/user/${user._id}`,
      });

      return res.data || [];
    },
  });

  const deleteBlog = blogID => () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async result => {
      if (result.isConfirmed) {
        setDisplayLoader(true);

        const res = await apiHandler.deleteRequest({
          endpoint: `/blogs/${blogID}`,
        });

        setDisplayLoader(false);

        if (res.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success',
          });

          refetch();

          return;
        }

        Swal.fire({
          title: 'Error!',
          text: res.message,
          icon: 'error',
        });
      }
    });
  };

  return (
    <>
      {(isLoading || displayLoader) && <Loader />}
      <div>
        <Card className='h-full w-full'>
          <CardHeader floated={false} shadow={false} className='rounded-none'>
            <div className='mb-8 flex items-center justify-between gap-8'>
              {/* Table title */}

              <Typography variant='h5' color='blue-gray'>
                Blogs
              </Typography>

              <Link to='/user/dashboard/post-blog'>
                <Button className='flex items-center gap-3' size='sm'>
                  <PlusIcon strokeWidth={2} className='h-5 w-5' />
                  Add
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardBody>
            {blogs?.length === 0 && <Alert> No blogs has been added !!!</Alert>}

            <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-20'>
              {blogs
                ?.filter(blog => blog.user)
                ?.map(blog => (
                  <BlogCards
                    blog={blog}
                    deleteBlog={deleteBlog}
                    key={blog._id}
                  />
                ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default BlogsLists;

