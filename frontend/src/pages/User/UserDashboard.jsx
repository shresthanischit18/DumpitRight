import React from 'react';
import { getUserInfoFromCookie } from '../../utils';
import { Alert, Typography } from '@material-tailwind/react';

const UserDashboard = () => {
  const user = getUserInfoFromCookie();

  return (
    <div>
      <Typography variant='h5'>Dashboard</Typography>

      <div className='mt-5'>
        {!user.subscription && (
          <Alert color='blue'>
            You have not taken the premium subscription
          </Alert>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

