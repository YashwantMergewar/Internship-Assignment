import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from "@/api/userApi.js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ViewUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const resp = await getUserById(id);
        const users = resp?.data?.Users ?? resp?.Users ?? resp ?? null;
        let found = null;
        if (Array.isArray(users)) {
          found = users.find((u) => String(u._id) === String(id));
        } else if (users && typeof users === "object") {
          found = users;
        }
        if (mounted) setUser(found ?? null);
        if (!found) toast.error("User not found");
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetch();
    return () => (mounted = false);
  }, [id]);

  return (
    <div className="min-w-screen  bg-gray-50">
      <div className="bg-black text-white p-4">
        <h1 className="text-center text-lg">MERN stack developer practical task</h1>
      </div>

      <div className="p-4 sm:p-6 w-full flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-center text-xl font-medium mb-4">Register Your Details</h2>

          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl sm:text-3xl">👤</div>
          </div>

          {loading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : !user ? (
            <div className="py-8 text-center text-gray-600">No user data to display</div>
          ) : (
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">First name</label>
                <input value={user.firstname || ""} disabled className="w-full border px-3 py-2 rounded bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm mb-1">Last Name</label>
                <input value={user.lastname || ""} disabled className="w-full border px-3 py-2 rounded bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm mb-1">Email address</label>
                <input value={user.email || ""} disabled className="w-full border px-3 py-2 rounded bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm mb-1">Mobile</label>
                <input value={user.mobile || ""} disabled className="w-full border px-3 py-2 rounded bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm mb-1">Select Your Gender</label>
                <input value={user.gender || ""} disabled className="w-full border px-3 py-2 rounded bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm mb-1">Select Your Status</label>
                <input value={user.status || ""} disabled className="w-full border px-3 py-2 rounded bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm mb-1">Enter Your Location</label>
                <input value={user.location || ""} disabled className="w-full border px-3 py-2 rounded bg-gray-50" />
              </div>

              <div className="col-span-2 mt-4 flex flex-col sm:flex-row gap-2">
                <Button onClick={() => navigate(-1)} className="w-full sm:w-auto bg-gray-700 text-white">Back</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
