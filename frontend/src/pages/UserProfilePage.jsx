import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRequest, patchRequest } from '../utils/apiHandler';
import {
  Card,
  CardHeader,
  CardFooter,
  Typography,
  CardBody,
  Input,
  Button,
} from '@material-tailwind/react';
import { Loader } from '../components';
import { toast } from 'react-toastify';
import { setCookie } from '../utils/handleCookie';

const UserProfilePage = () => {
  const { userID } = useParams();
  const defaultUserInfo = {
    fullName: '',
    email: '',
    address: '',
    wardNo: '',
    phoneNumber: '',
    role: '',
    rewardPoint: 0,
  };

  const [user, setUser] = useState(defaultUserInfo);
  const [displayLoader, setDisplayLoader] = useState(false);

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ['user profile', userID],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/users/${userID}`,
      });

      return res.data || null;
    },
  });

  const { fullName, email, address, wardNo, phoneNumber, role, rewardPoint } =
    user;

  useEffect(() => {
    if (userInfo) {
      setUser({ ...userInfo });
    }
  }, [userInfo]);

  const handleChange = e => {
    const { name, value } = e.target;
    setUser(prevInfo => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setDisplayLoader(true);

    const res = await patchRequest({
      endpoint: `/users/${userID}`,
      data: user,
    });

    setCookie('user', JSON.stringify(res.data), 7);

    setDisplayLoader(false);

    if (res.ok) {
      toast.success(res.message);
      return;
    }

    toast.error(res.message);
  };

  console.log(role);

  return (
    <>
      {(isLoading || displayLoader) && <Loader />}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader floated={false} shadow={false} className='rounded-none'>
            <Typography variant='h5' color='blue-gray'>
              Profile
            </Typography>
          </CardHeader>

          <CardBody>
            {user && (
              <div className='space-y-7'>
                <Input
                  name='fullName'
                  label='Full Name'
                  value={fullName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name='role'
                  label='Role'
                  value={role}
                  readOnly
                  required
                />
                {role !== 'collector' && (
                  <Input
                    name='RewardPoint'
                    label='Reward Point'
                    value={rewardPoint}
                    readOnly
                    required
                  />
                )}
                <Input
                  name='email'
                  label='Email'
                  value={email}
                  required
                  readOnly
                />
                <Input
                  name='address'
                  value={address}
                  label='Address'
                  onChange={handleChange}
                  required
                />

                <Input
                  name='wardNo'
                  value={wardNo}
                  label='Ward No'
                  onChange={handleChange}
                  required
                  readOnly
                />

                <Input
                  name='phoneNumber'
                  value={phoneNumber}
                  label='Phone Number'
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </CardBody>

          <CardFooter>
            <Button color='green' type='submit'>
              Update Profile
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default UserProfilePage;



