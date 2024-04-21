import {
  Alert,
  Button,
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
import { FiCheckCircle } from 'react-icons/fi';
import { RxCrossCircled } from 'react-icons/rx';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { Loader } from '../../../components';
import {
  SERVER_URL,
  SPECIAL_PICKUP_STATUS,
  WASTE_PICKUP_TIME_BREAKDOWN,
} from '../../../constants';
import { getUserInfoFromCookie } from '../../../utils';
import { getRequest, patchRequest } from '../../../utils/apiHandler';
import Swal from 'sweetalert2';

const CollectorUrgentPickupList = () => {
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
        endpoint: `/special-pickups/collector/${user?._id}?status=${pickupStatus}`,
      });

      return res?.data || [];
    },
  });

  const TABLE_HEAD = [
    'Waste Type',
    'Time',
    'Pickup Date',
    'User',
    'Contact',
    'Address',
    'Ward No',
    'House No',
    'Status',
    'Special Instructions',
    'Action',
  ];

  const TABLE_ROWS = pickupSchedules || [];

  const handleDownload = async () => {
    const response = await fetch(
      `${SERVER_URL}/special-pickups/download-excel/collector/${user?._id}?status=${pickupStatus}`
    );

    if (response.ok) {
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${pickupStatus}_WasteCollectionSchedule.xlsx`
      );
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

  const handleUpdatePickupStatus =
    ({ scheduleID, status }) =>
    () => {
      console.log(status);
      Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        text: 'You will not be able to undo this!!!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then(async result => {
        if (result.isConfirmed) {
          const res = await patchRequest({
            endpoint: `/special-pickups/${scheduleID}`,
            data: {
              status,
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
              Urgent Waste Pickups Schedule
            </Typography>
          </div>
        </CardHeader>
        <CardBody>
          <div className='flex justify-between mb-8'>
            <div>
              <Select
                label='Status'
                value={pickupStatus}
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

            <Button onClick={handleDownload}>Download Schedules</Button>
          </div>

          {TABLE_ROWS.length == 0 && (
            <Alert variant='ghost' color='blue'>
              No urgent pickups scheduled found!!!
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
                    pickupDate,
                    time,
                    specialInstructions,
                    status,
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
                          {user?.houseNo || 'NA'}
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
                        <Typography
                          variant='small'
                          color='blue-gray'
                          className='font-normal'>
                          {specialInstructions}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <div className='flex gap-x-1 items-center'>
                          <IconButton
                            variant='text'
                            color='green'
                            className='p-0'
                            size='sm'
                            disabled={status !== SPECIAL_PICKUP_STATUS.PENDING}
                            onClick={handleUpdatePickupStatus({
                              scheduleID: pickups?._id,
                              status: SPECIAL_PICKUP_STATUS.COLLECTED,
                            })}>
                            <FiCheckCircle size={20} />
                          </IconButton>

                          <IconButton
                            variant='text'
                            color='red'
                            size='sm'
                            className='p-0'
                            disabled={status !== SPECIAL_PICKUP_STATUS.PENDING}
                            onClick={handleUpdatePickupStatus({
                              scheduleID: pickups?._id,
                              status: SPECIAL_PICKUP_STATUS.CANCELLED,
                            })}>
                            <RxCrossCircled size={20} />
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

export default CollectorUrgentPickupList;

