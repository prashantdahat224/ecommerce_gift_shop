import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginDialog_two from "../components/LoginDialog_two";
import { useNavigate } from "react-router-dom";
  import FullScreenLoader from "../utils/FullScreenLoader"; 


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
const navigate = useNavigate();

  //console.log("user",user)
  //console.log("children",children)
  const open = !loading && !user;
  
  if (loading) {
    return     <FullScreenLoader loading={loading}
      message=" loading..."/>//null//<div />; // or loader
  }

  if (!user) {
   // return <Navigate to="/EmailRegistration" replace />;
   return <LoginDialog_two open={open} onClose={() => navigate("/home")} />;
  }

  return children;
};

export default ProtectedRoute;