import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import { useState } from 'react';
import { apiHandler, setCookie } from '../../utils';
import Swal from 'sweetalert2';
import { Loader } from '../../components';
import logo from '../../assets/logo.png';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayLoader, setDisplayLoader] = useState(false);
  const navigate = useNavigate();

  const login = async e => {
    e.preventDefault();

    setDisplayLoader(true);

    const res = await apiHandler.postRequest({
      endpoint: '/auth/login',
      data: { email, password },
    });

    setDisplayLoader(false);

    if (res.ok) {
      setEmail('');
      setPassword('');

      const user = res.data.user;
      user.password = null;
      user.verificationCode = null;

      setCookie('user', JSON.stringify(user), 7);
      setCookie('authToken', res.data.authToken, 7);

      navigate(`/${user.role}/dashboard`);

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
      <div className='loginwrapper'>
        <div className='w-[162px] mb-[40rem] mr-[73rem]'>
          <Link to='/'>
            {' '}
            <img src={logo} alt='' />
          </Link>
        </div>
        <div className='wrapper w-full md:w-[40%] fixed'>
          <h2 className='text-3xl font-bold leading-tight text-black sm:text-4xl'>
            Sign in
          </h2>

          <p className='mt-2 text-sm text-gray-600'>
            Don&apos;t have an account?{' '}
            <Link to='/registration'>
              <span className='font-semibold text-[#119f48] transition-all duration-200 hover:underline'>
                Create a free account
              </span>
            </Link>
          </p>

          <form onSubmit={login} className='mt-8'>
            <div className='space-y-5'>
              <div>
                <label
                  htmlFor=''
                  className='text-base font-medium text-gray-900'>
                  {' '}
                  Email address{' '}
                </label>
                <div className='mt-2'>
                  <input
                    className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required></input>
                </div>
              </div>
              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor=''
                    className='text-base font-medium text-gray-900'>
                    {' '}
                    Password{' '}
                  </label>
                  <Link
                    to='/reset-password'
                    title=''
                    className='text-sm font-semibold text-black hover:underline'>
                    {' '}
                    Forgot password?{' '}
                  </Link>
                </div>
                <div className='mt-2'>
                  <input
                    className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required></input>
                </div>
              </div>
              <div>
                <Button
                  type='submit'
                  size='lg'
                  variant='filled'
                  className='w-full bg-[#119f48]'>
                  Get started
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;

