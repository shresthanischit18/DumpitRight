import KhaltiCheckout from 'khalti-checkout-web';
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import KTM from '../../assets/KTM.jpg';
import { Navbar } from '../../components';
import { newSubscriptionConfig } from './SubscriptionConfig';
import { getUserInfoFromCookie } from '../../utils';
import { toast } from 'react-toastify';

export default function Subscription() {
  let checkout = new KhaltiCheckout(newSubscriptionConfig);

  const handleSubscription = () => {
    const user = getUserInfoFromCookie();

    if (!user) {
      toast.error('You need to register first to take the subscription');
      return;
    }

    if (user.subscription) {
      toast.info(
        'You have already a subscription plan. You cannot take new subscription'
      );
      return;
    }

    checkout.show({ amount: 20000 });
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          backgroundImage: `url(${KTM})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
        className='flex justify-center items-center'>
        <div className='flex justify-center items-center bg-white px-5 py-10'>
          <div className='mt-18 ml-[1rem] w-[40rem]'>
            <h1 className='text-green-600 text-[1.2rem] font-semibold'>
              WELCOME TO DUMPITRIGHT
            </h1>
            <h2 className='text-[2.5rem] font-bold font-mono'>
              Select your DumpItRight Plan
            </h2>
            <h3 className='font-semibold text-[15px] mt-5'>
              What Benefits will you get after subscribing?
            </h3>
            <p className='w-98 text-gray-600 text-[15px]'>
              Unlock a world of exclusive content and stay ahead with our
              premium subscription.
            </p>
            <br />
            <p className='w-96 text-gray-600 items-end text-[15px]'>
              {' '}
              By subscribing, you will be able to gain access to all the
              features like schedule wastepickups, notification alerts, gaining
              reward points and redeeming products through the points using marketplace.
            </p>
            <h3 className='font-semibold text-[15px] mt-5'>
              Grab a flat 20% Discount on Yearly Subscription.
            </h3>
            <p className='w-96 text-gray-600 items-end text-[15px]'> </p>{' '}
          </div>
          <div>
            <div className='mt-1'>
          
              <div className='mt-4 blackbox-border border-gray-300 h-32 w-[30rem] p-4 border-4 rounded-xl hover:border-green-200 cursor-pointer'>
                <div className='flex flex-nowrap'>
             
                  <h1 className='font-semibold text-[1.2rem] m-2'>Monthly</h1>
                  <h2 className='font-semibold text-right mt-3 ml-48'>
                    NRs 200.00
                  </h2>
                </div>
                <p className='font-semibold text-[15px] text-gray-600'>
                  For the new users who just wants to explore this web
                  application.
                </p>
              </div>
              <div>
                <button
                  onClick={handleSubscription}
                  className='mt-5 bg-green-600 blackbox-border border-gray-300 h-14 w-[30rem] p-4 border-4 rounded-xl hover:border-green-200 cursor-pointer'>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

