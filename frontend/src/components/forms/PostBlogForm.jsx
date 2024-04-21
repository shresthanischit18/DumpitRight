import {
  Card,
  Input,
  Typography,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from '@material-tailwind/react';
import { Editor } from '@tinymce/tinymce-react';
import React, { useState } from 'react';
import { getUserInfoFromCookie } from '../../utils';
import { getRequest, postRequest } from '../../utils/apiHandler';
import Swal from 'sweetalert2';
import Loader from '../Loader';

const PostBlogForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [coverImgURL, setCoverImgURL] = useState('');
  const [displayLoader, setDisplayLoader] = useState(false);

  const postBlog = async () => {
    const user = getUserInfoFromCookie();

    if (!title || !coverImg || !content) {
      Swal.fire({
        title: 'Error',
        text: 'All fields are required',
        icon: 'error',
      });
      return;
    }

    const formData = new FormData();

    const blogDetails = JSON.stringify({
      title,
      content,
      userID: user._id,
    });

    formData.append('blogDetails', blogDetails);

    formData.append('coverImg', coverImg);

    setDisplayLoader(true);

    const res = await postRequest({
      endpoint: '/blogs',
      data: formData,
    });

    setDisplayLoader(false);

    if (res.ok) {
      Swal.fire({
        title: 'Success',
        text: 'Blog Posted Successfully',
        icon: 'success',
      });

      setTitle('');
      setContent('');
      setCoverImg('');
      setCoverImgURL('');

      return;
    }

    Swal.fire({
      title: 'Error',
      text: res.message,
      icon: 'error',
    });
  };

  return (
    <>
      {displayLoader && <Loader />}
      <Card className='p-5'>
        <CardHeader floated={false} shadow={false} className='rounded-none'>
          {/* Table title */}
          <Typography variant='h5' color='blue-gray'>
            Post Blog
          </Typography>
        </CardHeader>

        <CardBody>
          {coverImgURL && (
            <div className='mb-8'>
              <img src={coverImgURL} className='h-[300px]' />
            </div>
          )}

          <div className='space-y-7'>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              label='Blog Title'
            />
            <div className='space-y-2'>
              <p>Cover Image</p>
              <input
                type='file'
                accept='image/*'
                onChange={e => {
                  setCoverImg(e.target.files[0]);
                  setCoverImgURL(URL.createObjectURL(e.target.files[0]));
                }}
                label='Blog Title'
                required
              />
            </div>

            <div className='space-y-2'>
              <p>Write Blog</p>
              <Editor
                value={content}
                // onInit={(evt, editor) => (textEditorRef.current = editor)}
                apiKey='suwzab5lnbznd16t2xjpzv7aytbk23p91j1pdwz7m6an8jod'
                init={{
                  plugins:
                    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                  toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                  tinycomments_mode: 'embedded',
                  tinycomments_author: 'Author name',

                  ai_request: (request, respondWith) =>
                    respondWith.string(() =>
                      Promise.reject('See docs to implement AI Assistant')
                    ),

                  height: 400,
                }}
                onEditorChange={(newValue, editor) => setContent(newValue)}
              />
            </div>
          </div>

          <Button size='md' className='mt-8' onClick={postBlog}>
            Post Blog
          </Button>
        </CardBody>
      </Card>
    </>
  );
};

export default PostBlogForm;

