import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Option,
  Select,
  Textarea,
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import {
  WASTE_PICKUP_TIME,
  WASTE_PICKUP_TIME_BREAKDOWN,
  WASTE_TYPE,
} from '../../../constants';
import { getUserInfoFromCookie } from '../../../utils';
import {
  getRequest,
  patchRequest,
  postRequest,
} from '../../../utils/apiHandler';

const UrgentPickupScheduleForm = ({
  refetchUrgentPickups,
  scheduleID,
  operationType = 'Add',
}) => {
  const user = getUserInfoFromCookie();

  const defaultSpecialPickupInfo = {
    wasteType: '',
    time: '',
    specialInstructions: '',
    collectorID: '',
    pickupDate: '',
  };

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [specialPickupInfo, setSpecialPickupInfo] = useState(
    defaultSpecialPickupInfo
  );

  const { wasteType, pickupDate, time, specialInstructions, collector } =
    specialPickupInfo;

  const { data } = useQuery({
    queryKey: ['Special Pickups', scheduleID],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/special-pickups/${scheduleID}`,
      });

      return res?.data || [];
    },
    enabled: !!scheduleID,
  });

  const { data: collectors } = useQuery({
    queryKey: ['Available Collectors'],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/users/collectors/ward/${user.wardNo}`,
      });

      return res?.data || [];
    },
  });

  useEffect(() => {
    if (data) {
      setSpecialPickupInfo({
        ...data,
        pickupDate: format(new Date(data.pickupDate), 'yyyy-MM-dd'),
      });
    }
  }, [data]);

  const handleChange = ({ name, value }) => {
    setSpecialPickupInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    if (!wasteType || !pickupDate || !time || !collector) {
      setErrorMessage('All field are required');
      return;
    }

    if (new Date(pickupDate) < new Date()) {
      setErrorMessage('Pickup date cannot be in the past');
      return;
    }

    setErrorMessage('');

    let res;

    if (operationType === 'Add') {
      res = await postRequest({
        endpoint: '/special-pickups',
        data: { ...specialPickupInfo, user: user._id },
      });
    }

    if (operationType === 'Edit') {
      res = await patchRequest({
        endpoint: `/special-pickups/${scheduleID}`,
        data: { ...specialPickupInfo, user: user._id },
      });
    }

    handleOpen();

    if (res.ok) {
      setSpecialPickupInfo(defaultSpecialPickupInfo);
      toast.success(res.message);
      refetchUrgentPickups();
      return;
    }

    toast.error(res.message);
  };

  return (
    <>
      <div>
        {operationType === 'Edit' ? (
          <IconButton variant='text' color='green' onClick={handleOpen}>
            <MdEdit size={20} />
          </IconButton>
        ) : (
          <Button onClick={handleOpen} variant='filled' size='sm'>
            {operationType}
          </Button>
        )}
        <Dialog open={open} handler={handleOpen}>
          <DialogHeader>Request Urgent Pickup </DialogHeader>

          <DialogBody>
            <form className='space-y-5'>
              {errorMessage && (
                <Alert
                  size='sm'
                  color='red'
                  variant='ghost'
                  className='py-2 text-sm'>
                  {errorMessage}
                </Alert>
              )}

              {collectors && (
                <Select
                  label='Collector'
                  value={collector}
                  required
                  onChange={value => {
                    handleChange({
                      name: 'collector',
                      value,
                    });
                  }}>
                  {collectors.map(collector => {
                    return (
                      <Option value={collector._id} key={uuid()}>
                        {collector.fullName} ({collector.rating} ratings)
                      </Option>
                    );
                  })}
                </Select>
              )}

              <Select
                label='Waste Type'
                value={wasteType}
                required
                onChange={value => {
                  handleChange({
                    name: 'wasteType',
                    value,
                  });
                }}>
                {WASTE_TYPE.map(type => {
                  return (
                    <Option value={type} key={uuid()}>
                      {type}
                    </Option>
                  );
                })}
              </Select>

              <Select
                label='Time'
                value={time}
                required
                onChange={value => {
                  handleChange({
                    name: 'time',
                    value,
                  });
                }}>
                {WASTE_PICKUP_TIME.map(time => {
                  return (
                    <Option value={time} key={uuid()}>
                      {time} ({WASTE_PICKUP_TIME_BREAKDOWN[time]})
                    </Option>
                  );
                })}
              </Select>

              <Input
                type='date'
                label='Pickup Date'
                value={pickupDate}
                onChange={e => {
                  handleChange({
                    name: 'pickupDate',
                    value: e.target.value,
                  });
                }}
              />

              <Textarea
                label='Special Instructions'
                value={specialInstructions}
                onChange={e => {
                  handleChange({
                    name: 'specialInstructions',
                    value: e.target.value,
                  });
                }}
              />
            </form>
          </DialogBody>

          <DialogFooter>
            <Button
              variant='text'
              color='red'
              onClick={handleOpen}
              className='mr-1'>
              <span>Cancel</span>
            </Button>

            <Button variant='gradient' color='green' onClick={handleSubmit}>
              <span>{operationType}</span>
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </>
  );
};

export default UrgentPickupScheduleForm;

