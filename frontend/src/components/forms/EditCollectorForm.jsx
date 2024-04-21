/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Alert,
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import Loader from '../Loader';

import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { apiHandler } from '../../utils';
import Swal from 'sweetalert2';

const EditCollectorForm = ({ collectorInfo, open, handleOpen, refetch }) => {
  const defaultUserInfo = {
    fullName: '',
    email: '',
    address: '',
    wardNo: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'collector',
  };

  const [displayLoader, setDisplayLoader] = useState(false);
  const [userInfo, setUserInfo] = useState(collectorInfo);

  const [submitMessage, setSubmitMessage] = useState({
    display: false,
    isError: false,
    message: '',
  });

  const {
    _id,
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
    setUserInfo(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  useEffect(() => {
    if (collectorInfo) {
      setUserInfo(collectorInfo);
    } else {
      setUserInfo(defaultUserInfo);
    }
  }, [collectorInfo]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (confirmPassword !== password) {
      setSubmitMessage({
        display: true,
        isError: true,
        message: 'Password Do Not Match',
      });
      return;
    }

    setDisplayLoader(true);

    let res = await apiHandler.patchRequest({
      endpoint: `/users/${_id}`,
      data: userInfo,
    });

    setDisplayLoader(false);

    if (res.ok) {
      refetch();

      setSubmitMessage({
        display: false,
        isError: false,
        message: '',
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.message,
      });

      handleOpen();

      setUserInfo(defaultUserInfo);

      return;
    }

    setSubmitMessage({
      display: true,
      isError: true,
      message: res.message,
    });
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Edit Collector Details</DialogHeader>

        <DialogBody>
          {displayLoader && <Loader />}

          <div>
            {!submitMessage.isError ? (
              <Alert
                icon={<CheckBadgeIcon className='h-5 w-5' />}
                color='green'
                variant='outlined'
                open={submitMessage.display}
                className='py-2 text-sm items-center mb-7'>
                {submitMessage.message}
              </Alert>
            ) : (
              <Alert
                icon={<XCircleIcon className='h-5 w-5' />}
                color='red'
                variant='outlined'
                open={submitMessage.display}
                className='py-2 text-sm items-center mb-7'>
                {submitMessage.message}
              </Alert>
            )}
          </div>

          <form className='space-y-5' id='incomeForm' onSubmit={handleSubmit}>
            {/* {submitMessage.display && */}

            <Input
              type='text'
              name='fullName'
              label='Name'
              value={fullName}
              onChange={handleChange}
              required
            />

            <Input
              type='text'
              name='email'
              label='Email'
              value={email}
              onChange={handleChange}
              required
            />

            <Input
              type='text'
              name='address'
              label='Address'
              value={address}
              onChange={handleChange}
              required
            />

            <Input
              type='text'
              name='phoneNumber'
              label='Phone Number'
              value={phoneNumber}
              onChange={handleChange}
              required
            />

            <Input
              type='number'
              name='wardNo'
              label='Ward No'
              value={wardNo}
              onChange={handleChange}
              required
              min={1}
              max={32}
            />

            <Input
              type='password'
              name='password'
              label='Password'
              value={password}
              onChange={handleChange}
            />

            <Input
              type='password'
              name='confirmPassword'
              label='Confirm Password'
              value={confirmPassword}
              onChange={handleChange}
            />
          </form>
        </DialogBody>

        <DialogFooter>
          <Button
            variant='text'
            color='red'
            onClick={() => {
              handleOpen();
              setSubmitMessage({
                display: false,
                isError: false,
                message: '',
              });
            }}
            className='mr-1'>
            <span>Cancel</span>
          </Button>

          <Button
            variant='gradient'
            color='green'
            type='submit'
            form='incomeForm'>
            <span>Edit</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default EditCollectorForm;

