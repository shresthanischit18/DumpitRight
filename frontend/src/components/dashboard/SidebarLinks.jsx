import { FaUsers } from 'react-icons/fa';
import { FaClock, FaCrown } from 'react-icons/fa6';
import { IoHomeOutline } from 'react-icons/io5';
import { MdScheduleSend } from 'react-icons/md';

import { FaHome, FaUserCircle } from 'react-icons/fa';
import { HiShoppingCart } from 'react-icons/hi';
import { IoAddOutline } from 'react-icons/io5';
import { MdArticle, MdDashboard } from 'react-icons/md';
import { RiFeedbackFill } from 'react-icons/ri';

export const USER_SIDEBAR_LINKS = [
  {
    name: 'Subscriptions',
    path: '/user/dashboard/',
    icon: <FaCrown className='h-5 w-5' />,
  },
  {
    name: 'Home',
    path: '/',
    icon: <FaHome className='h-5 w-5' />,
  },

  {
    name: 'Profile',
    path: '/login',
    icon: <FaUserCircle className='h-5 w-5' />,
  },

  {
    name: 'Orders',
    path: '/user/dashboard/orders',
    icon: <HiShoppingCart className='h-5 w-5' />,
  },

  {
    name: 'Blog',
    path: '/user/dashboard/blog',
    icon: <MdArticle className='h-5 w-5' />,
  },

  {
    name: 'Pickups Schedule',
    path: '/user/dashboard/regular-schedules',
    icon: <FaClock className='h-5 w-5' />,
    requiresSubscription: true,
  },

  {
    name: 'Urgent Pickups',
    path: '/user/dashboard/urgent-schedules',
    icon: <MdScheduleSend className='h-5 w-5' />,
    requiresSubscription: true,
  },

  {
    name: 'Feedbacks',
    path: '/user/dashboard/feedbacks',
    icon: <RiFeedbackFill className='h-5 w-5' />,
    requiresSubscription: true,
  },
];

export const ADMIN_SIDEBAR_LINKS = [
  {
    name: 'Home',
    path: '/',
    icon: <IoHomeOutline className='h-5 w-5' />,
  },

  {
    name: 'Collectors',
    path: '/admin/dashboard/',
    icon: <FaUsers className='h-5 w-5' />,
  },
  {
    name: 'Blog',
    path: '/admin/dashboard/blog',
    icon: <MdArticle className='h-5 w-5' />,
  },
  {
    name: 'Add Products',
    path: '/admin/dashboard/addproduct',
    icon: <IoAddOutline className='h-5 w-5' />,
  },
  {
    name: 'Orders',
    path: '/admin/dashboard/orders',
    icon: <HiShoppingCart className='h-5 w-5' />,
  },
];

export const COLLECTORS_SIDEBAR_LINKS = [
  {
    name: 'Regular Pickups',
    path: '/collector/dashboard/',
    icon: <FaClock className='h-5 w-5' />,
  },
  {
    name: 'Home',
    path: '/',
    icon: <FaHome className='h-5 w-5' />,
  },

  {
    name: 'Profile',
    path: '/login',
    icon: <FaUserCircle className='h-5 w-5' />,
  },

  {
    name: 'Urgent Pickups',
    path: '/collector/dashboard/urgent-schedules',
    icon: <MdScheduleSend className='h-5 w-5' />,
  },
  {
    name: 'Blog',
    path: '/collector/dashboard/blog',
    icon: <MdArticle className='h-5 w-5' />,
  },

  {
    name: 'Feedbacks',
    path: '/collector/dashboard/feedbacks',
    icon: <RiFeedbackFill className='h-5 w-5' />,
  },
];

export const SIDEBAR_LINKS = {
  user: USER_SIDEBAR_LINKS,
  admin: ADMIN_SIDEBAR_LINKS,
  collector: COLLECTORS_SIDEBAR_LINKS,
};

