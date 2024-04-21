import { RotatingLines } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className='fixed bg-black h-full w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-opacity-30 loader-wrapper z-50'>
      <RotatingLines
        strokeColor='gray'
        strokeWidth='5'
        animationDuration='0.9'
        width='120'
        visible={true}
      />
    </div>
  );
};

export default Loader;

