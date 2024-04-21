import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Option,
  Select,
  Typography,
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { v4 as uuid } from 'uuid';
import { Loader } from '../../../components';
import {
  SERVER_URL,
  WASTE_PICKUP_ALL_DAYS,
  WASTE_PICKUP_TIME_BREAKDOWN,
} from '../../../constants';
import { getUserInfoFromCookie } from '../../../utils';
import { getRequest } from '../../../utils/apiHandler';
import { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const CollectorRegularPickupsList = () => {
  const user = getUserInfoFromCookie();
  const currentDate = new Date();
  const [day, setDay] = useState(format(currentDate, 'EEEE'));

  const { data: pickupSchedules, isLoading } = useQuery({
    queryKey: ['RegularPickups', day, user?._id],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/regular-pickups/collector/${user?._id}?day=${day}`,
      });

      return res?.data || [];
    },
  });

  const TABLE_HEAD = [
    'Waste Type',
    'Frequency',
    'Day',
    'Time',
    'User',
    'Contact',
    'Address',
    'Ward No',
    'House No',
    'Special Instructions',
  ];

  const TABLE_ROWS = pickupSchedules || [];

  const handleDownload = async () => {
    const response = await fetch(
      `${SERVER_URL}/regular-pickups/download-excel/collector/${user?._id}?day=${day}`
    );

    if (response.ok) {
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${day}_WasteCollectionSchedule.xlsx`);
      // document.body.appendChild(link);
      link.click();
      link.remove(); // Cleanup the DOM
      window.URL.revokeObjectURL(url); // Cleanup the blob URL

      toast.success('Downloaded successfully');

      return;
    }

    const resMsg = await response.json();

    toast.success(resMsg.message);
  };

  return (
    <>
      {isLoading && <Loader />}
      <Card>
        <CardHeader floated={false} shadow={false} className='rounded-none'>
          <div className='mb-8 flex items-center justify-between gap-8'>
            {/* Table title */}
            <Typography variant='h5' color='blue-gray'>
              Regular Waste Pickups Schedule
            </Typography>
          </div>
        </CardHeader>

        <CardBody>
          <div className='flex justify-between mb-8'>
            <div>
              <Select
                label='Days'
                value={day}
                onChange={value => setDay(value)}
                cla>
                {WASTE_PICKUP_ALL_DAYS.map(status => {
                  return (
                    <Option key={uuid()} value={status}>
                      {status}
                    </Option>
                  );
                })}
              </Select>
            </div>

            <Button onClick={handleDownload}>Download Schedules</Button>
          </div>

          {TABLE_ROWS.length == 0 && (
            <Alert variant='ghost' color='blue'>
              {' '}
              Not found regular pickups schedules!!!
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
                {TABLE_ROWS.map((pickups, index) => {
                  const {
                    wasteType,
                    frequency,
                    day,
                    time,
                    specialInstructions,
                    user,
                  } = pickups;

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
                          {wasteType}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {frequency}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {day}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {WASTE_PICKUP_TIME_BREAKDOWN[time]}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {user?.fullName}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {user?.phoneNumber}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {user?.address}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {user?.wardNo}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {user?.houseNo}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {specialInstructions}
                        </Typography>
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

export default CollectorRegularPickupsList;

