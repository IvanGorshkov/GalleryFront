// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ToastContainer />
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Router />
    </ThemeConfig>
  );
}
