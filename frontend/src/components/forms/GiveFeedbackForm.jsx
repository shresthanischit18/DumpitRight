import {
  Alert,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Rating,
  Textarea,
} from '@material-tailwind/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { patchRequest } from '../../utils/apiHandler';

const GiveFeedbackForm = ({ feedbackID, refetch }) => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(1);

  const handleOpen = () => setOpen(!open);

  const updateFeedback = async () => {
    if (!feedback || rating < 1 || rating > 5) {
      setErrorMessage('Please provide feedback and rating');
      return;
    }

    const res = await patchRequest({
      endpoint: `/feedbacks/${feedbackID}`,
      data: { feedback, rating },
    });

    handleOpen();

    if (res.ok) {
      toast.success(res.message);
      setFeedback('');
      setRating(1);
      refetch();
      return;
    }

    toast.error(res.message);
  };

  return (
    <div>
      <Button size='sm' onClick={handleOpen}>
        Give Feedback
      </Button>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Feedback</DialogHeader>

        <DialogBody className='space-y-5 '>
          {errorMessage && (
            <Alert
              size='sm'
              color='red'
              variant='ghost'
              className='py-2 text-sm'>
              {errorMessage}
            </Alert>
          )}

          <div className='flex item-center gap-x-3'>
            <label>Rating:</label>
            <Rating value={rating} onChange={value => setRating(value)} />
          </div>

          <Textarea
            label='Feedback'
            name='feedback'
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
          />
        </DialogBody>

        <DialogFooter>
          <Button
            variant='text'
            color='red'
            onClick={handleOpen}
            className='mr-1'>
            <span>Cancel</span>
          </Button>

          <Button variant='gradient' color='green' onClick={updateFeedback}>
            <span>Submit</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default GiveFeedbackForm;


