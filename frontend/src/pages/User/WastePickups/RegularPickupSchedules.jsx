import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  IconButton,
  Typography,
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid';
import { WASTE_PICKUP_TIME_BREAKDOWN } from '../../../constants';
import { getUserInfoFromCookie } from '../../../utils';
import {
  deleteRequest,
  getRequest,
  patchRequest,
} from '../../../utils/apiHandler';
import RegularPickupScheduleForm from './RegularPickupScheduleForm';
import { Loader } from '../../../components';

const RegularPickupSchedules = () => {
  const user = getUserInfoFromCookie();

  const {
    data: pickupSchedules,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['RegularPickups'],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/regular-pickups/user/${user?._id}`,
      });

      return res?.data || [];
    },
  });

  const TABLE_HEAD = [
    'Waste Type',
    'Frequency',
    'Day',
    'Time',
    'Special Instructions',
    'Name',
    'Contact',
    'Status',
    'Change Status',
    'Action',
  ];

  const TABLE_ROWS = pickupSchedules || [];

  const deleteRegularSchedule = id => async () => {
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
        const res = await deleteRequest({
          endpoint: `/regular-pickups/${id}`,
        });

        if (res.ok) {
          toast.success('Regular pickup schedule deleted successfully');
          refetch();
          return;
        }

        toast.error('Failed to delete regular pickup schedule');
      }
    });
  };

  const handleActiveStatus =
    ({ id, isActive }) =>
    async () => {
      Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then(async result => {
        if (result.isConfirmed) {
          const res = await patchRequest({
            endpoint: `/regular-pickups/${id}/change-active-status`,
            data: {
              isActive,
            },
          });

          if (res.ok) {
            toast.success(res.message);
            refetch();
            return;
          }

          toast.error(res.message);
        }
      });
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

            <RegularPickupScheduleForm refetchRegularPickups={refetch} />
          </div>
        </CardHeader>

        {TABLE_ROWS.length == 0 && (
          <CardBody>
            <Alert variant='ghost' color='blue'>
              {' '}
              You haven't scheduled any regular pickups!!!
            </Alert>
          </CardBody>
        )}

        {TABLE_ROWS.length !== 0 && (
          <>
            <CardBody className='overflow-scroll px-0'>
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
                      isActive,
                      _id,
                      specialInstructions,
                      collector,
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
                            {specialInstructions}
                          </Typography>
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
                          <div>
                            {isActive ? (
                              <Chip
                                value='Active'
                                variant='ghost'
                                className='inline-flex'
                                color='green'
                              />
                            ) : (
                              <Chip
                                value='Inactive'
                                variant='ghost'
                                className='inline-flex'
                                color='red'
                              />
                            )}
                          </div>
                        </td>

                        <td className={classes}>
                          <div>
                            {isActive ? (
                              <Button
                                variant='filled'
                                color='red'
                                size='sm'
                                onClick={handleActiveStatus({
                                  id: _id,
                                  isActive: false,
                                })}>
                                Disable
                              </Button>
                            ) : (
                              <Button
                                variant='filled'
                                color='green'
                                size='sm'
                                onClick={handleActiveStatus({
                                  id: _id,
                                  isActive: true,
                                })}>
                                Enable
                              </Button>
                            )}
                          </div>
                        </td>

                        <td className={classes}>
                          <div className='flex gap-x-2 items-center'>
                            <RegularPickupScheduleForm
                              refetchRegularPickups={refetch}
                              scheduleID={_id}
                              operationType='Edit'
                            />

                            <IconButton
                              variant='text'
                              color='red'
                              className='p-0'
                              onClick={deleteRegularSchedule(_id)}>
                              <MdDelete size={20} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
          </>
        )}
      </Card>
    </>
  );
};

export default RegularPickupSchedules;

