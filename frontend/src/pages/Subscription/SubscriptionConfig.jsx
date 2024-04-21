import { toast } from 'react-toastify';
import { getUserInfoFromCookie, setCookie } from '../../utils';
import { postRequest } from '../../utils/apiHandler';
import myKey from './SubcriptionKey';
import axios from 'axios';

export const generalConfig = {
  publicKey: myKey.publicTestKey,
  productIdentity: '1236969',
  productName: 'DumpitRight',
  paymentPreference: ['KHALTI'],
};

export const newSubscriptionConfig = {
  ...generalConfig,
  productUrl: 'http://localhost:5173/subscription', 
  eventHandler: {
    async onSuccess(payload) {
      const user = getUserInfoFromCookie();

      if (user) {
        const res = await postRequest({
          endpoint: '/subscriptions',
          data: {
            userID: user._id,
            amount: 200,
            type: 'Monthly',
          },
        });

        if (res.ok) {
          toast.success('Subscription successful for a month');
          setCookie(
            'user',
            JSON.stringify({ ...user, subscription: res.data })
          );
          return;
        }

        toast.error('Unexpected Error Occurred');
      }
    },
    // onError handler is optional
    onError(error) {
      console.log(error);
      toast.error('Unexpected Error Occurred');
    },
    onClose() {
      console.log('widget is closing');
    },
  },
};


