import { Button } from '@material-tailwind/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Loader } from '../../components';
import { apiHandler } from '../../utils';
import './register.css';
import logo from '../../assets/logo.png'


const RegistrationForm = () => {
  const defaultUserInfo = {
    fullName: '',
    email: '',
    address: '',
    wardNo: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'user',
  };

  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [displayLoader, setDisplayLoader] = useState(false);

  const {
    fullName,
    email,
    address,
    wardNo,
    password,
    confirmPassword,
    phoneNumber,
  } = userInfo;

  const handleChange = e => {
    const { name, value } = e.target;
    setUserInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const registerUser = async e => {
    e.preventDefault();

    if (confirmPassword !== password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match',
      });
      return;
    }

    setDisplayLoader(true);

    const res = await apiHandler.postRequest({
      endpoint: '/users',
      data: userInfo,
    });

    setDisplayLoader(false);

    if (res.ok) {
      setUserInfo(defaultUserInfo);

      Swal.fire({
        icon: 'success',
        title: 'success',
        text: res.message,
      });

      return;
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: res.message,
    });
  };

  return (
    <>
      {displayLoader && <Loader />}
      
      <div className='registerwrapper'>
      <div className='w-[162px] mb-[40rem] mr-[73rem] '>
        <Link to='/'>
          <img src={logo} alt="" /></Link>
        </div>
        <div className='wrapper w-full md:w-[50%] fixed'>
          <h2 className='text-3xl font-bold leading-tight text-black sm:text-4xl'>
            Sign up
          </h2>
          <p className='mt-2 text-base text-gray-600'>
            Already have an account?{' '}
            <Link to='/login' title=''>
              <span className='font-semibold text-[#119f48] transition-all duration-200 hover:underline'>
                {' '}
                Sign In
              </span>
            </Link>
          </p>

          <form onSubmit={registerUser} className='mt-8'>
            <div className='space-y-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5'>
                <div>
                  <label
                    htmlFor='name'
                    className='text-base font-medium text-gray-900'>
                    {' '}
                    Full Name{' '}
                  </label>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      required
                      type='text'
                      placeholder='Full Name'
                      name='fullName'
                      value={fullName}
                      onChange={handleChange}
                      id='name'></input>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='phoneNumber'
                    className='text-base font-medium text-gray-900'>
                    {' '}
                    Phone Number{' '}
                  </label>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      required
                      type='text'
                      placeholder='Phone Number'
                      id='phoneNumber'
                      name='phoneNumber'
                      value={phoneNumber}
                      onChange={handleChange}></input>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5'>
                <div>
                  <label
                    htmlFor='address'
                    className='text-base font-medium text-gray-900'>
                    {' '}
                    Address{' '}
                  </label>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      required
                      type='text'
                      placeholder='Address'
                      id='address'
                      name='address'
                      value={address}
                      onChange={handleChange}></input>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor='wardNo'
                    className='text-base font-medium text-gray-900'>
                    {' '}
                    Ward No{' '}
                  </label>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      required
                      type='Number'
                      placeholder='Ward No'
                      min={1}
                      max={32}
                      id='wardNo'
                      name='wardNo'
                      value={wardNo}
                      onChange={handleChange}></input>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5'>
                <div>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor='password'
                      className='text-base font-medium text-gray-900'>
                      {' '}
                      Password{' '}
                    </label>
                  </div>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      required
                      type='password'
                      placeholder='Password'
                      id='password'
                      name='password'
                      value={password}
                      onChange={handleChange}></input>
                  </div>
                </div>

                <div>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor='confirmPassword'
                      className='text-base font-medium text-gray-900'>
                      {' '}
                      Confirm Password{' '}
                    </label>
                  </div>
                  <div className='mt-2'>
                    <input
                      className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                      required
                      type='password'
                      placeholder='confirmPassword'
                      id='confirmPassword'
                      name='confirmPassword'
                      value={confirmPassword}
                      onChange={handleChange}></input>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='text-base font-medium text-gray-900'>
                  {' '}
                  Email address{' '}
                </label>
                <div className='mt-2'>
                  <input
                    className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                    required
                    type='email'
                    placeholder='Email'
                    id='email'
                    name='email'
                    value={email}
                    onChange={handleChange}></input>
                </div>
              </div>

              <div>
                <Button
                  type='submit'
                  size='lg'
                  variant='filled'
                  className='w-full bg-[#119f48]'>
                  Create Account
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;

