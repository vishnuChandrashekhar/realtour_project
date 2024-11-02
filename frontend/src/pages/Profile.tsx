import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/store";
import React, {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { ErrorObject } from "../../../backend/src/utils/error.handler";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { UserSchema } from "../../../backend/src/Models/user.model";
import {
  updateUserStart,
  updateUserFilure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess,
} from "../Redux/user/userSlice";
import { Link } from "react-router-dom";
import { ListingSchema } from "../../../backend/src/Models/listing.model";
// import { persistor } from "../Redux/store";
const Profile: React.FC = () => {
  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.user
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePercent, setFilePercent] = useState<number>(0);
  const [fileUploadError, setFileUploadError] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserSchema>>({});
  const [isUpdateSuccess, setIsUpdateSuccess] = useState<boolean>(false);
  const [showListingsError, setShowListingsError] = useState<boolean | string>(
    false
  );
  const [userListings, setUserListings] = useState<ListingSchema[]>([]);
  const handleFileUpload = (file: File | undefined) => {
    if (!file) {
      console.error("No file to upload");
      return;
    }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const folderNmae = "profile_images";
    const storageRef = ref(storage, `${folderNmae}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapShot) => {
        const progressInPercent =
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        setFilePercent(Math.round(progressInPercent));
      },

      (_error: Error) => {
        setFileUploadError(true);
      },

      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        setFormData({ ...formData, avatar: downloadURL });
      }
    );
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: UserSchema | ErrorObject = await res.json();

      if ("success" in data && data.success === false) {
        dispatch(updateUserFilure(data.message));
      } else {
        dispatch(updateUserSuccess(data as UserSchema));
      }
      setIsUpdateSuccess(true);
    } catch (error: any) {
      dispatch(updateUserFilure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if ("success" in data && data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      } else {
        dispatch(deleteUserSuccess());
      }
    } catch (error: any) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    // interface SignoutSuccessInterface {
    //   message: string;
    // }

    try {
      dispatch(signoutUserStart());
      await fetch("/api/auth/signout", {
        method: "GET",
      });
      // const data: SignoutSuccessInterface | ErrorObject = await res.json();

      // if ("success" in data && data.success === false) {
      //   console.log(data.message);
      // }

      dispatch(signoutUserSuccess());
    } catch (error: any) {
      dispatch(signoutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser?._id}`, {
        method: "GET",
        credentials: "include",
      });
      const data: ListingSchema[] | ErrorObject = await res.json();

      if ("success" in data && data.success === false) {
        return setShowListingsError(data.message);
      }
      setUserListings(data as ListingSchema[]);
    } catch (errro) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if ("success" in data && data.success === false) {
        return console.log(data.message);
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*');

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          hidden
          type="file"
          ref={fileRef}
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <img
          onClick={() => fileRef.current?.click()}
          src={formData.avatar || currentUser?.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-3"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error in image upload (Image must be less than 2MB)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercent}%`}</span>
          ) : filePercent === 100 ? (
            <span className="text-green-600">Image Uploaded</span>
          ) : (
            ""
          )}
        </p>
        {/* <h2 className="text-center text-3xl font-mono capitalize">{ currentUser?.username }</h2> */}
        <input
          type="text"
          id="username"
          placeholder="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <input
          type="text"
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-85 disabled:opacity-75">
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-600 text-white rounded-lg uppercase p-3 text-center hover:opacity-90"
          to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : null}</p>
      <p className="text-green-700 mt-5">
        {isUpdateSuccess ? "User updated successfully!" : null}
      </p>
      <button onClick={handleShowListings} className="text-green-600 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5 text-sm">
        {showListingsError ? "Error in showing listings" : null}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl text-center p-2 font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id as React.Key}
              className="flex items-center justify-between border rounded-lg p-3 gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageURLs[0]}
                  alt="listing cover"
                  className="h-20 w-20 object-contain"
                />
              </Link>
              <Link
                className="text-slate-800 font-semibold text-l font-sarif hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}>
                <p>{listing.title}</p>
              </Link>
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => handleDeleteListing(listing._id as string)}
                  className="text-red-700 uppercase hover:underline">
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600 uppercase hover:underline">
                    Update
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
