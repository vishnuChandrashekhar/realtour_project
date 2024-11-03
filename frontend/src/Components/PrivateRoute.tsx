import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserState } from "../Redux/user/userSlice";

function PrivateRouute() {
  const { currentUser } = useSelector(
    (state: RootState) => state.user
  ) as UserState;

  const token = Cookies.get("access_token");

  if (!currentUser && !token) {
    return <Navigate to={"/signin"} />;
  }

  return <Outlet />;
}

export default PrivateRouute;
