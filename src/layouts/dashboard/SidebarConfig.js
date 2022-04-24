// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'Музей',
    path: '/dashboard/gallery',
    icon: getIcon('eva:home-outline')
  },
  {
    title: 'Выставки',
    path: '/dashboard/exhibition',
    icon: getIcon('eva:image-outline')
  },
  {
    title: 'Картины',
    path: '/dashboard/arts',
    icon: getIcon('eva:color-palette-outline')
  }
];

export default sidebarConfig;
