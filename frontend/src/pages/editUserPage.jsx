import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '@/api/userApi';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { userUpdateSchema } from '@/validationSchema/userDataValidation';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({});

  const fields = [
    { name: "firstname", label: "First name" },
    { name: "lastname", label: "Last name" },
    { name: "email", label: "Email address" },
    { name: "mobile", label: "Mobile" },
    { name: "gender", label: "Select Your Gender" },
    { name: "status", label: "Select Your Status" },
    { name: "location", label: "Enter Your Location" },
  ]

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
        if (found && mounted) setFormData({
          firstname: found.firstname ?? "",
          lastname: found.lastname ?? "",
          email: found.email ?? "",
          mobile: found.mobile ?? "",
          gender: found.gender ?? "",
          status: found.status ?? "",
          location: found.location ?? "",
        });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        const payload = {};
        if (!user) throw new Error('Original user not loaded');
        Object.keys(formData).forEach((key) => {
          const orig = user?.[key] ?? "";
          const cur = formData[key] ?? "";
          if (String(orig) !== String(cur)) payload[key] = cur;
        });

        if (Object.keys(payload).length === 0) {
          toast('No changes to update');
          setEditField(null);
          return;
        }
        const validatedPayload = userUpdateSchema.parse(payload);
        await updateUser(id, validatedPayload);
        toast.success("User updated successfully");
        navigate('/');
    } catch (error) {
        console.error(error);
        toast.error(error.issues?.[0]?.message || error.message || "Failed to update user");
    }finally{
        setLoading(false);
    }
  }

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
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              {fields.map((f) => (
                <div key={f.name} className="relative group">
                  <label className="block text-sm mb-1">{f.label}</label>
                  <input
                    value={formData[f.name] ?? ''}
                    disabled={editField !== f.name}
                    onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                    className={`w-full border px-3 py-2 rounded ${editField === f.name ? '' : 'bg-gray-50'}`}
                  />

                  <button
                    type="button"
                    onClick={() => setEditField(editField === f.name ? null : f.name)}
                    className="absolute right-2 top-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition p-1"
                    aria-label={`Edit ${f.name}`}
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}

              <div className="col-span-2 mt-4 flex flex-col sm:flex-row gap-2">
                <Button onClick={() => navigate(-1)} className="w-full sm:w-auto bg-gray-700 text-white">Back</Button>
                <Button type="submit" className="w-full sm:w-auto bg-gray-700 text-white" disabled={loading}>{loading ? 'Updating...' : 'Update'}</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditUserPage
