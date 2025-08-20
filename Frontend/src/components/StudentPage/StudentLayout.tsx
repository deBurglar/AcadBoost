import { Outlet } from 'react-router';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';
const StudentLayout = () => {
  return (
    <> 
    <StudentHeader/> 
      <div className="flex ">
        
      <StudentSidebar/>
      <div className="bg-purple-100 overflow-auto ml-64"></div>
      <Outlet/>
    </div>
    </>

  );
};

export default StudentLayout;