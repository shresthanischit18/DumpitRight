import {
    Alert,
    Card,
    CardBody,
    CardHeader,
    Rating,
    Typography
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';

import { v4 as uuid } from 'uuid';
import { Loader } from '../../components';
import { getUserInfoFromCookie } from '../../utils';
import { getRequest } from '../../utils/apiHandler';

const CollectorFeedbacksList = () => {
  const user = getUserInfoFromCookie();

  const { data: feedbackLists, isLoading } = useQuery({
    queryKey: ['Collector Feedbacks List', user?._id],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/feedbacks/collector/${user?._id}`,
      });

      return res?.data || [];
    },
    enabled: !!user,
  });

  const TABLE_HEAD = ['SN', 'Feedback', 'Rating'];

  const TABLE_ROWS = feedbackLists || [];

  return (
    <>
      {isLoading && <Loader />}
      <Card>
        <CardHeader floated={false} shadow={false} className='rounded-none'>
          <div className='mb-8 flex items-center justify-between gap-8'>
            {/* Table title */}
            <Typography variant='h5' color='blue-gray'>
              Received Feedbacks List
            </Typography>
          </div>
        </CardHeader>

        <CardBody>
          {TABLE_ROWS.length == 0 && (
            <Alert variant='ghost' color='blue'>
              Not feedbacks for you!!!
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
                {TABLE_ROWS.map((_feedback, index) => {
                  const { feedback, rating } = _feedback;

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
                          {feedback}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <Rating value={rating} readonly />
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

export default CollectorFeedbacksList;

