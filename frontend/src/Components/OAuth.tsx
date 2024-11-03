import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signinSuccess } from "../Redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      // Adding Firebase to the project for authentication
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        }
      );

      const data = await response.json();
      dispatch(signinSuccess(data));
      navigate("/");
    } catch (error: any) {
      console.log("Could not signin with google", error);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-85">
      Continue with google
    </button>
  );
}

export default OAuth;
