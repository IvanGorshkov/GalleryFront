// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Музей',
    path: '/dashboard/gallery',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'Выставки',
    path: '/dashboard/user',
    icon: getIcon('eva:people-fill')
  },
  {
    title: 'Картины',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill')
  }
];

export default sidebarConfig;
