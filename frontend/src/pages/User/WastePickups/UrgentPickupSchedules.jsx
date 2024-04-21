import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Chip,
  IconButton,
  Option,
  Select,
  Typography,
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid';
import {
  SPECIAL_PICKUP_STATUS,
  WASTE_PICKUP_TIME_BREAKDOWN,
} from '../../../constants';
import { getUserInfoFromCookie } from '../../../utils';
import { deleteRequest, getRequest } from '../../../utils/apiHandler';
import UrgentPickupScheduleForm from './UrgentPickupScheduleForm';
import { Loader } from '../../../components';

const UrgentPickupSchedules = () => {
  const user = getUserInfoFromCookie();
  const [pickupStatus, setPickupStatus] = useState(
    SPECIAL_PICKUP_STATUS.PENDING
  );

  const {
    data: pickupSchedules,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['Special Pickups', pickupStatus],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/special-pickups/user/${user?._id}?status=${pickupStatus}`,
      });

      return res?.data || [];
    },
  });

  const TABLE_HEAD = [
    'Waste Type',
    'Time',
    'Pickup Date',
    'Special Instructions',
    'Name',
    'Contact',
    'Status',
    'Action',
  ];

  const TABLE_ROWS = pickupSchedules || [];

  const deleteSpecialSchedule = id => async () => {
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
          endpoint: `/special-pickups/${id}`,
        });

        if (res.ok) {
          toast.success('Urgent pickup schedule deleted successfully');
          refetch();
          return;
        }

        toast.error('Failed to delete urgent pickup schedule');
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
              Urgent Waste Pickups Schedule
            </Typography>

            <UrgentPickupScheduleForm refetchUrgentPickups={refetch} />
          </div>
        </CardHeader>
        <CardBody>
          <div className='w-[200px] mb-8'>
            <Select
              value={pickupStatus}
              label='Status'
              onChange={value => setPickupStatus(value)}>
              {Object.values(SPECIAL_PICKUP_STATUS).map(status => {
                return (
                  <Option key={uuid()} value={status}>
                    {status}
                  </Option>
                );
              })}
            </Select>
          </div>

          {TABLE_ROWS.length == 0 && (
            <Alert variant='ghost' color='blue'>
              You haven't scheduled any pickups!!!
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
                    _id,
                    wasteType,
                    pickupDate,
                    time,
                    specialInstructions,
                    status,
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
                          {WASTE_PICKUP_TIME_BREAKDOWN[time]}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {format(new Date(pickupDate), 'dd MMM, yyyy')}
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
                        <Chip
                          variant='ghost'
                          color={
                            status === SPECIAL_PICKUP_STATUS.PENDING
                              ? 'blue'
                              : status === SPECIAL_PICKUP_STATUS.CANCELLED
                              ? 'red'
                              : 'green'
                          }
                          className='font-normal inline-flex'
                          value={status}
                        />
                      </td>

                      <td className={classes}>
                        <div className='flex gap-x-2 items-center'>
                          {status !== SPECIAL_PICKUP_STATUS.PENDING ? (
                            <IconButton
                              variant='text'
                              color='green'
                              disabled={
                                status !== SPECIAL_PICKUP_STATUS.PENDING
                              }>
                              <MdEdit size={20} />
                            </IconButton>
                          ) : (
                            <UrgentPickupScheduleForm
                              refetchRegularPickups={refetch}
                              scheduleID={_id}
                              operationType='Edit'
                              disableEditButton
                            />
                          )}

                          <IconButton
                            variant='text'
                            color='red'
                            className='p-0'
                            onClick={deleteSpecialSchedule(_id)}
                            disabled={status !== SPECIAL_PICKUP_STATUS.PENDING}>
                            <MdDelete size={20} />
                          </IconButton>
                        </div>
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

export default UrgentPickupSchedules;

