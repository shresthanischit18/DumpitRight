import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from '@material-tailwind/react';

import { useQuery } from '@tanstack/react-query';

import { v4 as uuid } from 'uuid';

import { format } from 'date-fns';

import KhaltiCheckout from 'khalti-checkout-web';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader } from '../../components';
import { apiHandler, getUserInfoFromCookie, setCookie } from '../../utils';
import { checkEligibilityForRenewal } from '../../utils/index';
import { generalConfig } from '../Subscription/SubscriptionConfig';

const UserSubscriptionList = () => {
  const user = getUserInfoFromCookie();
  const {
    data: subscriptions,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['Subscriptions', user?._id],
    queryFn: async () => {
      const res = await apiHandler.getRequest({
        endpoint: `/subscriptions/all/user/${user?._id}`,
      });

      return res?.data;
    },
  });

  const navigate = useNavigate();

  const handleRenewalSubscription = subscriptionID => async () => {
    let renewSubscriptionConfig = {
      ...generalConfig,
      productUrl: 'http://localhost:5173/user/dashboard/subscriptions', // Fix the URL here
      eventHandler: {
        async onSuccess(payload) {
          // hit merchant api for initiating verification
          const res = await apiHandler.getRequest({
            endpoint: `/subscriptions/renew/${subscriptionID}`,
          });

          if (res.ok) {
            toast.success('Subscription successful for a month');
            setCookie(
              'user',
              JSON.stringify({ ...user, subscription: res.data })
            );
            refetch();
            return;
          }

          toast.error('Unexpected Error Occurred');
        },
        // onError handler is optional
        onError(error) {
          // handle errors
          console.log(error);
        },
        onClose() {
          console.log('widget is closing');
        },
      },
    };

    let checkout = new KhaltiCheckout(renewSubscriptionConfig);

    checkout.show({ amount: 20000 });
  };

  if (isLoading) {
    return <Loader />;
  }

  const TABLE_HEAD = [
    'SN',
    'Amount',
    'Start Date',
    'End Date',
    'Status',
    'Action',
  ];

  const TABLE_ROWS = subscriptions || [];

  return (
    <>
      <Card className='h-full w-full'>
        <CardHeader floated={false} shadow={false} className='rounded-none'>
          <div className='mb-8 flex items-center justify-between gap-8'>
            {/* Table title */}
            <Typography variant='h5' color='blue-gray'>
              Subscriptions
            </Typography>

            <Button
              onClick={() => {
                navigate('/subscription');
              }}
              disabled={TABLE_ROWS.length !== 0}>
              Take Subscription
            </Button>
          </div>
        </CardHeader>

        {TABLE_ROWS.length == 0 && (
          <CardBody>
            <Alert> You haven't taken any subscription yet !!!</Alert>
          </CardBody>
        )}

        {TABLE_ROWS.length !== 0 && (
          <>
            <CardBody className='overflow-scroll px-0'>
              <table className='w-full min-w-max table-auto text-left'>
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

                <tbody>
                  {TABLE_ROWS.map((subscription, index) => {
                    const { amount, endDate, createdAt, status, _id } =
                      subscription;

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
                            {amount}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal'>
                            {format(
                              new Date(createdAt),
                              'MMM dd, yyyy HH:mm:ss'
                            )}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal'>
                            {format(new Date(endDate), 'MMM dd, yyyy HH:mm:ss')}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal'>
                            {status}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Button
                            variant='filled'
                            color='green'
                            onClick={handleRenewalSubscription(_id)}
                            disabled={!checkEligibilityForRenewal(endDate)}>
                            Renew
                          </Button>
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

export default UserSubscriptionList;

