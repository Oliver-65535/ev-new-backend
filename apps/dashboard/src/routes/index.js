import MainRoutes from './MainRoutes';
import { useRoutes } from 'react-router-dom';

// project import
// import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes /*LoginRoutes*/]);
}
