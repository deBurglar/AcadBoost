import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import AdminHeader from './Header';
const Layout = () => {
  return (
    <> 
    <AdminHeader/> 
      <div className="flex ">
        
      <Sidebar />
      <div className="bg-purple-100 overflow-auto ml-64"></div>
      <Outlet/>
    </div>
    </>

  );
};

export default Layout;