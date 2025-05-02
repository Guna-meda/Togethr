import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { loginLogic, logout, deleteAcc } from "../firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import toast from "react-hot-toast";
import { getRedirectResult } from "firebase/auth";

const Profile = () => {
  const user = useUserStore((s) => s.user);
  const updateUser = useUserStore((s) => s.updateUser);
  const setUser = useUserStore((state) => state.setUser);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profession: "",
  });

  useEffect(() => {
    const handleRedirectResult = async () => {
      const justRedirected = sessionStorage.getItem("justRedirected");
      if (!justRedirected) {
        console.log("⛔ No redirect flag found");
        return;
      }
      
      try {
        const result = await getRedirectResult(auth);
        if (!result) {
          console.log("⚠️ getRedirectResult returned null");
          return;
        }
        if (result?.user) {
          console.log("✅ Redirect login result received");
          const firebaseUser = result.user;

          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          let finalUser;
          if (docSnap.exists()) {
            finalUser = docSnap.data();
          } else {
            finalUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              bio: "",
              profession: "",
            };
            await setDoc(docRef, finalUser);
          }

          useUserStore.getState().setUser(finalUser);
        }
      } catch (err) {
        console.error("🔥 Redirect login error:", err);
      } finally {
        sessionStorage.removeItem("justRedirected");
      }
    };

    handleRedirectResult();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        profession: user.profession || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Login first to edit profile");
      return;
    }

    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, formData);
      updateUser(formData);
      setEditMode(false);
      toast.success("Profile updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
      {!user ? (
        <div className="text-center">
          <p className="text-lg mb-4">Login to setup your profile</p>
          <button
            onClick={loginLogic}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={user.photoURL || "/avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Profile</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Profession</label>
            <input
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:text-white"
            />
          </div>

          {editMode && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    name: user.name || "",
                    bio: user.bio || "",
                    profession: user.profession || "",
                  });
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          )}

          <hr className="my-6" />

          <div className="flex justify-between">
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
            <button
              onClick={deleteAcc}
              className="bg-red-900 text-white px-4 py-2 rounded-md"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
