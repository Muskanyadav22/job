import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import formatMoney from "@/utils/formatMoney";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

function AdminUsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User deleted successfully");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "recruiter":
        return "bg-blue-100 text-blue-800";
      case "jobseeker":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Users Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  {user.profilePicture && (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete user"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(
                      user.role || "jobseeker"
                    )}`}
                  >
                    {(user.role || "jobseeker").charAt(0).toUpperCase() + (user.role || "jobseeker").slice(1)}
                  </span>
                </div>

                {user.profession && (
                  <div>
                    <p className="text-xs text-gray-500">Profession</p>
                    <p className="text-sm text-gray-700">{user.profession}</p>
                  </div>
                )}

                {user.bio && (
                  <div>
                    <p className="text-xs text-gray-500">Bio</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{user.bio}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200">
                  {(!user.role || user.role === "jobseeker") && (
                    <p className="text-xs text-gray-500">
                      Applied Jobs: <span className="font-semibold">{user.appliedJobs?.length || 0}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersManager;
