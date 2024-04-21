import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid';
import { Loader } from '../../components';
import { getUserInfoFromCookie } from '../../utils';
import {
  deleteRequest,
  getRequest,
  patchRequest,
} from '../../utils/apiHandler';
import { useState } from 'react';

const UserOrderList = () => {
  const user = getUserInfoFromCookie();

  const {
    data: orders,

    isLoading,
  } = useQuery({
    queryKey: ['Users Order List'],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/orders/user/${user?._id}`,
      });

      return res?.data || [];
    },
  });

  const TABLE_HEAD = ['SN', 'Order Placed Date', 'Order Total', 'Action'];

  const TABLE_ROWS = orders || [];

  return (
    <>
      {isLoading && <Loader />}
      <Card>
        <CardHeader floated={false} shadow={false} className='rounded-none'>
          <div className='mb-8 flex items-center justify-between gap-8'>
            {/* Table title */}
            <Typography variant='h5' color='blue-gray'>
              Orders List
            </Typography>
          </div>
        </CardHeader>

        {TABLE_ROWS.length == 0 && (
          <CardBody>
            <Alert variant='ghost' color='blue'>
              {' '}
              You don't haven't placed any orders
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
                  {TABLE_ROWS.map((order, index) => {
                    const { _id, createdAt, orderItems, orderTotal } = order;

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
                            {format(
                              new Date(createdAt),
                              'dd MMMM, yyyy HH:mm:ss'
                            )}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal'>
                            {orderTotal} Reward Points
                          </Typography>
                        </td>

                        <td className={classes}>
                          <div>
                            <UserOrderItemsList orderItems={orderItems} />
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

export default UserOrderList;

const UserOrderItemsList = ({ orderItems = [] }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  return (
    <div>
      <Button variant='filled' color='green' size='sm' onClick={handleOpen}>
        View Orders Items
      </Button>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Order Items List</DialogHeader>

        <DialogBody>
          <div className='overflow-x-auto'>
            <table className='table-auto min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Title
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Item Point
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {/* JavaScript map function to iterate over order items */}
                {/* 'item' represents each individual order item in the array */}
                {/* You can adjust the keys based on your MongoDB schema */}
                {/* For example, item.title, item.point, etc. */}
                {orderItems.map((item, index) => (
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{item.title}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>{item.point}</div>
                    </td>
                  </tr>
                ))}
                {/* End of JavaScript map function */}
              </tbody>
            </table>
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
};

