import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Typography,
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';

import { v4 as uuid } from 'uuid';
import { Loader } from '../../components';
import { getUserInfoFromCookie } from '../../utils';
import { getRequest } from '../../utils/apiHandler';
import { format } from 'date-fns';
import GiveFeedbackForm from '../../components/forms/GiveFeedbackForm';

const UserFeedbacksList = () => {
  const user = getUserInfoFromCookie();

  const {
    data: feedbackLists,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['Feedbacks List', user?._id],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/feedbacks/user/${user?._id}`,
      });

      return res?.data || [];
    },
    enabled: !!user,
  });

  const TABLE_HEAD = [
    'SN',
    'Waste type',
    'Feedback Requested Date',
    'Status',
    'Collector',
    'Phone Number ',
    'Action',
  ];

  const TABLE_ROWS = feedbackLists || [];

  return (
    <>
      {isLoading && <Loader />}
      <Card>
        <CardHeader floated={false} shadow={false} className='rounded-none'>
          <div className='mb-8 flex items-center justify-between gap-8'>
            {/* Table title */}
            <Typography variant='h5' color='blue-gray'>
              Pending Feedbacks List
            </Typography>
          </div>
        </CardHeader>

        <CardBody>
          {TABLE_ROWS.length == 0 && (
            <Alert variant='ghost' color='blue'>
              Zero pending feedbacks!!!
            </Alert>
          )}

          {TABLE_ROWS.length !== 0 && (
            <table className='w-full table-auto text-left'>
              <thead>
                <tr>
                  {TABLE_HEAD.map(head => (
                    <th
                      key={uuid()}
                      className='border-y border-blue-gray-100 bg-blue-gray-50/50 p-4'>
                      <Typography
                        variant='small'
                        color='blue-gray'
                        className='font-normal leading-none opacity-70'>
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className='text-sm'>
                {TABLE_ROWS.map((feedback, index) => {
                  const { _id, wasteType, status, createdAt, collector } =
                    feedback;

                  const isLast = index === TABLE_ROWS.length - 1;
                  const classes = isLast
                    ? 'p-4'
                    : 'p-4 border-b border-blue-gray-50';

                  return (
                    <tr key={uuid()}>
                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {index + 1}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {wasteType}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {format(new Date(createdAt), 'dd MMMM, yyyy')}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Chip
                          variant='ghost'
                          color='blue'
                          className='font-normal inline-flex'
                          value={status}
                        />
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {collector?.fullName}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {collector?.phoneNumber}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <GiveFeedbackForm feedbackID={_id} refetch={refetch} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default UserFeedbacksList;

