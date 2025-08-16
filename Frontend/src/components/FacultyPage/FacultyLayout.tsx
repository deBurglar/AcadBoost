import { Outlet } from 'react-router';
import FacultyHeader from "./FacultyHeader"
import FacultySidebar from './FacultySidebar';
const FacultyLayout = () => {
  return (
    <> 
    <FacultyHeader/> 
      <div className="flex ">
        
      <FacultySidebar/>
      <div className="bg-purple-100 overflow-auto ml-64"></div>
      <Outlet/>
    </div>
    </>

  );
};

export default FacultyLayout;