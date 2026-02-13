
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "@/api/userApi.js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { userRegistrationSchema } from "@/validationSchema/userDataValidation";

const AddUsers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    gender: "male",
    status: "active",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    const required = ["firstname", "lastname", "email", "mobile", "gender", "status", "location"];
    for (const key of required) {
      if (!form[key] || String(form[key]).trim() === "") return `${key} is required`;
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    try {
      setLoading(true);
      const payload = { ...form };
      const validatedPayload = userRegistrationSchema.parse(payload);
      await createUser(validatedPayload);
      toast.success("User registered successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.issues?.[0]?.message || error.message || "User registration failed");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-screen bg-gray-50">
      <div className="bg-black text-white p-4">
        <h1 className="text-center text-lg">MERN stack developer practical task</h1>
      </div>

    
      <div className="p-4 sm:p-6 w-full flex justify-center">
        <form onSubmit={onSubmit} className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-center text-xl font-medium mb-4">Register Your Details</h2>

          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl sm:text-3xl">👤</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">First name</label>
              <input name="firstname" value={form.firstname} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter FirstName" />
            </div>

            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input name="lastname" value={form.lastname} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter LastName" />
            </div>

            <div>
              <label className="block text-sm mb-1">Email address</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter Email" />
            </div>

            <div>
              <label className="block text-sm mb-1">Mobile</label>
              <input name="mobile" value={form.mobile} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter Mobile" />
            </div>

            <div>
              <label className="block text-sm mb-1">Select Your Gender</label>
              <div className="flex gap-4 items-center">
                <label className="text-sm"><input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={handleChange} /> <span className="ml-2">Male</span></label>
                <label className="text-sm"><input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={handleChange} /> <span className="ml-2">Female</span></label>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Select Your Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Enter Your Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="Enter Your Location" />
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full sm:w-auto bg-rose-700 hover:bg-rose-800 text-white" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUsers;
