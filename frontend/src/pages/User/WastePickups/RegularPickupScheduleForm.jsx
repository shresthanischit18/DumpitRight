import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Option,
  Select,
  Textarea,
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import {
  WASTE_PICKUP_DAYS,
  WASTE_PICKUP_FREQUENCY,
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

const RegularPickupScheduleForm = ({
  refetchRegularPickups,
  scheduleID,
  operationType = 'Add',
}) => {
  const user = getUserInfoFromCookie();

  const defaultRegularPickupInfo = {
    wasteType: 'Organic',
    frequency: '',
    day: '',
    time: '',
    specialInstructions: '',
    collectorID: '',
  };

  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [regularPickupInfo, setRegularPickupInfo] = useState(
    defaultRegularPickupInfo
  );

  const { wasteType, frequency, day, time, specialInstructions, collector } =
    regularPickupInfo;

  const { data, isLoading } = useQuery({
    queryKey: ['RegularPickups', scheduleID],
    queryFn: async () => {
      const res = await getRequest({
        endpoint: `/regular-pickups/${scheduleID}`,
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
      setRegularPickupInfo(data);
    }
  }, [data]);

  const handleChange = ({ name, value }) => {
    setRegularPickupInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    if (!wasteType || !frequency || !day || !time) {
      setErrorMessage('All field are required');
      return;
    }

    setErrorMessage('');

    let res;

    if (operationType === 'Add') {
      res = await postRequest({
        endpoint: '/regular-pickups',
        data: { ...regularPickupInfo, user: user._id },
      });
    }

    if (operationType === 'Edit') {
      res = await patchRequest({
        endpoint: `/regular-pickups/${scheduleID}`,
        data: { ...regularPickupInfo, user: user._id },
      });
    }

    handleOpen();

    if (res.ok) {
      setRegularPickupInfo(defaultRegularPickupInfo);
      toast.success(res.message);
      refetchRegularPickups();
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
          <Button onClick={handleOpen} variant='gradient' size='sm'>
            {operationType}
          </Button>
        )}
        <Dialog open={open} handler={handleOpen}>
          <DialogHeader>Add Regular Pickup Schedule</DialogHeader>

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
                disabled={operationType === 'Edit'}
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
                label='Day'
                value={day}
                required
                onChange={value => {
                  handleChange({
                    name: 'day',
                    value,
                  });
                }}>
                {WASTE_PICKUP_DAYS[wasteType].map(day => {
                  return (
                    <Option value={day} key={uuid()}>
                      {day}
                    </Option>
                  );
                })}
              </Select>

              <Select
                label='Frequency'
                value={frequency}
                required
                onChange={value => {
                  handleChange({
                    name: 'frequency',
                    value,
                  });
                }}>
                {WASTE_PICKUP_FREQUENCY.map(frequency => {
                  return (
                    <Option value={frequency} key={uuid()}>
                      {frequency}
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

export default RegularPickupScheduleForm;

