import React, { useEffect, useState } from "react";
import { User, Lock, Upload } from "lucide-react";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils/api";
import Alert from "../components/Alert"; 

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    profilePhoto: null,
    profilePhotoPreview: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState({ type: "success", message: "" });

 const fetchProfile = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const data = await apiRequest("/profile", {}, accessToken);
      if (data.success && data.data.profile) {
        const imageURL = data.data.profile.image 
          ? `http://localhost:8083${data.data.profile.image}`
          : null;
        
        setProfileData({
          fullName: data.data.profile.fullname || "",
          email: data.data.profile.email || "",
          profilePhoto: null,
          profilePhotoPreview: imageURL,
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setAlert({ type: "error", message: "Gagal mengambil data profile" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [accessToken]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setAlert({ type: "error", message: "File harus JPG/JPEG/PNG" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAlert({ type: "error", message: "File terlalu besar, max 2MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData({
        ...profileData,
        profilePhoto: file,
        profilePhotoPreview: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) return;

    const formData = new FormData();
    formData.append("fullname", profileData.fullName);
    formData.append("email", profileData.email);
    if (profileData.profilePhoto) {
      formData.append("image", profileData.profilePhoto);
    }

    try {
      const data = await apiRequest(
        "/profile",
        { method: "PATCH", body: formData },
        accessToken
      );

      if (data.success) {
        setAlert({ type: "success", message: "Profile berhasil diupdate!" });
        fetchProfile();
      } else {
        setAlert({
          type: "error",
          message: "Gagal update profile: " + data.message,
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Terjadi kesalahan saat update profile",
      });
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setAlert({ type: "success", message: "Password updated (demo)" });
    console.log("Password updated:", passwordData);
  };

  return (
    <>
      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, message: "" })}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Settings
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account settings and preferences.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Profile Information
              </h2>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {profileData.profilePhotoPreview ? (
                      <img
                        src={profileData.profilePhotoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-600 hover:text-gray-700 font-medium flex justify-center items-center gap-2 py-2 px-3 border border-gray-200 rounded-xl">
                      <Upload className="w-5 h-5" />
                      Upload New Photo
                    </span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  placeholder="Your name..."
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  placeholder="Your Email..."
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Change Password
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="bg-gray-900 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex gap-2 justify-center items-center"
              >
                <Lock className="w-5 h-5 text-white" />
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
