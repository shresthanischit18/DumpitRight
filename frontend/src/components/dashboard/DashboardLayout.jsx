import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className='bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row bg-gray-100'>
      <Sidebar />
      <div className='flex flex-col flex-1'>
        <Header />
        <div className='flex-1 p-4 min-h-0 overflow-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

