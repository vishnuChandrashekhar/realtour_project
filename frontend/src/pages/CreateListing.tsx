import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { app } from "../firebase";
import { ListingType, ErrorObject } from "../Types/typesForDevlopment";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { useNavigate } from "react-router-dom";
import { UserState } from "../Redux/user/userSlice";

const CreateListing: React.FC = () => {
  const { currentUser } = useSelector(
    (state: RootState) => state.user
  ) as UserState;
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState<Partial<ListingType>>({
    title: "",
    description: "",
    address: "",
    type: "rent",
    regularPrice: 1500,
    discountedPrice: 0,
    bathrooms: 0,
    bedrooms: 0,
    furnished: false,
    parking: false,
    offer: false,
    imageURLs: [],
    userRef: "",
  });

  const [uploading, setUploding] = useState<boolean>(false);

  const [imageUploadError, setImageUploadError] = useState<boolean | string>(
    false
  );

  const [error, setError] = useState<boolean | string>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [previewURLs, setPreviewURLs] = useState<string[]>([]);

  // functions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      // const newPreviewURLs = selectedFiles.map((file) =>
      //   URL.createObjectURL(file)
      // );
      // setPreviewURLs(newPreviewURLs);
    }
  };

  const handleImageSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (
      files.length > 0 &&
      files.length + (formData.imageURLs?.length ?? 0) < 7
    ) {
      setUploding(true);
      setImageUploadError(false);

      const uploadPromises: Promise<string>[] = files.map((file) =>
        storeImage(file, "Listing")
      );

      const imageURLs: string[] = await Promise.all(uploadPromises);

      setFormData({
        ...formData,
        imageURLs,
      });
    } else {
      setImageUploadError(`You can only upload 6 images per listing`);
      setUploding(false);
    }

    setUploding(false);
  };

  // Firebase function for storing the image in firebase
  const storeImage = async (file: File, folder: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress} % done`);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(downloadURL);
          resolve(downloadURL);
        }
      );
    });
  };

  // function
  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      imageURLs: formData.imageURLs?.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked, type, value } = e.target;
    if (id === "sale" || id === "rent") {
      setFormData({
        ...formData,
        type: id,
      });
      return;
    }

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [id]: checked,
      });
      return;
    }

    if (type === "number" || type === "text") {
      setFormData({
        ...formData,
        [e.target.id]: value,
      });
      return;
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(false);

      if (!formData.imageURLs || formData.imageURLs.length < 1) {
        setError(`You must select atleast 1 image`);
        setLoading(false);
        return;
      }

      if (
        formData.regularPrice !== undefined &&
        formData.discountedPrice !== undefined &&
        formData.regularPrice < formData.discountedPrice
      ) {
        setError(`Discounted price should be lower than regular price`);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/listing/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser?._id,
          }),
        }
      );

      const data: ErrorObject | ListingType = await res.json();
      console.log(data);
      setLoading(false);

      if ("success" in data && data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${(data as ListingType)._id}`);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>
      <form
        action="submit"
        onSubmit={handleFormSubmit}
        className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="title"
            placeholder="Title"
            className="border p-3 rounded-lg"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg"
            required
            onChange={handleTextAreaChange}
            value={formData.description}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-3 items-center">
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                id="bedrooms"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                id="bathrooms"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                id="regularPrice"
                required
                min={1500}
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col gap-1">
                <p>Regular Price</p>
                <span className="text-xs">(₹/month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  className="p-3 border border-gray-300 rounded-lg"
                  id="discountedPrice"
                  min={1500}
                  required
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col gap-1">
                  <p>Discounted Price</p>
                  <span className="text-xs">(₹/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (Maximum 6 images)
            </span>{" "}
          </p>
          <div className="flex gap-4">
            <input
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {(formData.imageURLs?.length ?? 0) > 0 &&
            formData.imageURLs?.map((url, index) => (
              <div
                key={url}
                className="flex justify-between items-center p-3 border">
                <img
                  src={url}
                  alt="listing image"
                  className="h-20 w-30 object-contain rounded-lg hover:opacity-85"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-65">
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-85 disabled:opacity-90">
            {loading ? "Creating...." : "Create Listing"}
          </button>
          <p className="text-red-700 text-sm">
            {imageUploadError ? imageUploadError : null}
          </p>
          <p className="text-red-700 text-sm">{error ? error : null}</p>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
