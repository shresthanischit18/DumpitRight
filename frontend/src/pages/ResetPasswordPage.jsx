import React, { useState } from 'react';
import { Typography, Input, Button } from '@material-tailwind/react';
import { postRequest } from '../utils/apiHandler';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import logo from "../assets/logo.png";

import KTM from '../assets/KTM.jpg'

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const defaultResetPasswordInfo = {
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const [resetPasswordInfo, setResetPasswordInfo] = useState(
    defaultResetPasswordInfo
  );

  const { email, verificationCode, newPassword, confirmNewPassword } =
    resetPasswordInfo;

  const handleChange = e => {
    const { name, value } = e.target;
    setResetPasswordInfo(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const generateCode = async () => {
    const res = await postRequest({
      endpoint: '/auth/generate-otp',
      data: { email },
    });

    if (res.ok) {
      toast.success('OTP is send to your email. Please check it');
      setStep(2);
      return;
    }

    toast.error(res.message);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (step === 1) {
      await generateCode();
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('Password does not match');
      return;
    }

    const res = await postRequest({
      endpoint: '/auth/forgot-password',
      data: { email, verificationCode, newPassword },
    });

    if (res.ok) {
      toast.success(res.message);
      setResetPasswordInfo(defaultResetPasswordInfo);
      setStep(1);
      navigate('/login');
      return;
    }

    toast.error(res.message);
  };

  return (
  

    <div className='flex items-center justify-center h-screen bg-gray-200'>
      <form
        className='w-[500px] m-auto bg-white p-5 space-y-5 rounded'
        onSubmit={handleSubmit}>
          <Link to= '/login'>
          <button className='font-semibold text-[#119f48] transition-all duration-200 hover:underline'>Back</button></Link>
        <Typography variant='h5' className='text-center'>
          Reset Password
        </Typography>

        <Input
          name='email'
          label='email'
          onChange={handleChange}
          value={email}
          type='email'
          required
        />
        {step === 2 && (
          <>
            <Input
              name='verificationCode'
              label='Verification Code'
              onChange={handleChange}
              value={verificationCode}
              type='number'
              required
            />
            <Input
              name='newPassword'
              label='New Password'
              onChange={handleChange}
              value={newPassword}
              type='password'
              required
            />
            <Input
              name='confirmNewPassword'
              label='Confirm New Password'
              onChange={handleChange}
              value={confirmNewPassword}
              type='password'
              required
            />
          </>
        )}

        <div>
          <Button size='sm' type='submit'>
            {step === 1 ? 'Generate OTP' : 'Reset Password'}
          </Button>
        </div>
      </form>
    </div>

  );
};

export default ResetPasswordPage;



