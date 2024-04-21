import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
} from '@material-tailwind/react';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { v4 as uuid } from 'uuid';

import { format } from 'date-fns';

import Swal from 'sweetalert2';
import { AddCollectorForm, EditCollectorForm, Loader } from '../components';
import { apiHandler } from '../utils';

const CollectorsTable = () => {
  const [page, setPage] = useState(1);

  const {
    data: collectors,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['Incomes', page],
    queryFn: async ({ queryKey }) => {
      const [_key, _page] = queryKey;
      const res = await apiHandler.getRequest({
        endpoint: '/users?role=collector&page=' + _page,
      });

      return res?.data;
    },
    keepPreviousData: true,
  });

  const [displayForm, setDisplayForm] = useState(false);
  const [displayEditCollectorForm, setDisplayEditCollectorForm] =
    useState(false);

  const [collectorInfo, setCollectorInfo] = useState({});

  const [displayLoader, setDisplayLoader] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  const TABLE_HEAD = [
    'Name',
    'Email',
    'Phone Number',
    'Ward No',
    'Address',
    'Registration Date',
    'Action',
  ];

  const TABLE_ROWS = collectors || [];

  const handleDisplayForm = toggleForm => toggleForm(prevState => !prevState);

  const deleteCollector = userID => () => {
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
        setDisplayLoader(true);

        const res = await apiHandler.deleteRequest({
          endpoint: `users/${userID}`,
        });

        setDisplayLoader(false);

        if (res.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: res.message,
            icon: 'success',
          });

          refetch();

          return;
        }

        Swal.fire({
          title: 'Error!',
          text: res.message,
          icon: 'error',
        });
      }
    });
  };

  return (
    <>
      {displayLoader && <Loader />}

      <EditCollectorForm
        collectorInfo={collectorInfo}
        open={displayEditCollectorForm}
        handleOpen={() => handleDisplayForm(setDisplayEditCollectorForm)}
        refetch={refetch}
      />

      <Card className='h-full w-full'>
        <CardHeader floated={false} shadow={false} className='rounded-none'>
          <div className='mb-8 flex items-center justify-between gap-8'>
            {/* Table title */}

            <Typography variant='h5' color='blue-gray'>
              Collectors
            </Typography>

            <Button
              className='flex items-center gap-3'
              size='sm'
              onClick={() => {
                handleDisplayForm(setDisplayForm);
              }}>
              <PlusIcon strokeWidth={2} className='h-5 w-5' />
              Add
            </Button>

            {/* Form */}
            <AddCollectorForm
              handleOpen={() => handleDisplayForm(setDisplayForm)}
              refetch={refetch}
              open={displayForm}
            />
          </div>
        </CardHeader>

        {TABLE_ROWS.length == 0 && (
          <CardBody>
            <Alert> No collectors has been added !!!</Alert>
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
                  {TABLE_ROWS.map((collector, index) => {
                    const {
                      _id,
                      fullName,
                      email,
                      phoneNumber,
                      wardNo,
                      address,
                      createdAt: date,
                    } = collector;

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
                            {fullName}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal'>
                            {email}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal'>
                            {phoneNumber}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal'>
                            {wardNo}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal'>
                            {address}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant='small'
                            color='blue-gray'
                            className='font-normal'>
                            {format(new Date(date), 'MMMM d, yyyy')}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Tooltip content='Edit' className='cursor-pointer'>
                            <IconButton
                              variant='text'
                              onClick={() => {
                                setDisplayEditCollectorForm(true);
                                setCollectorInfo(collector);
                              }}>
                              <PencilSquareIcon
                                color='green'
                                className='h-6 w-6'
                              />
                            </IconButton>
                          </Tooltip>

                          <Tooltip content='Delete' className='cursor-pointer'>
                            <IconButton
                              variant='text'
                              onClick={deleteCollector(_id)}>
                              <TrashIcon color='red' className='h-6 w-6' />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
            <CardFooter className='flex items-center justify-between border-t border-blue-gray-50 p-4'>
              <Typography
                variant='small'
                color='blue-gray'
                className='font-normal'>
                Page {page}
              </Typography>
              <div className='flex gap-2'>
                <Button
                  variant='outlined'
                  size='sm'
                  disabled={page == 1}
                  onClick={() => setPage(_oldPage => _oldPage - 1)}>
                  Previous
                </Button>
                <Button
                  variant='outlined'
                  size='sm'
                  disabled={TABLE_ROWS.length < 10}
                  onClick={() => setPage(_oldPage => _oldPage + 1)}>
                  Next
                </Button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </>
  );
};

export default CollectorsTable;

