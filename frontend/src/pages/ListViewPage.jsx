import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Download, Eye, Edit2, Trash2, MoreVertical } from "lucide-react";
import { deleteUser, getAllUsers, searchUser } from "@/api/userApi.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 5;

export default function ListViewPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const resp = await getAllUsers();
        const users = resp?.data?.Users ?? resp?.data ?? resp?.Users ?? resp ?? [];
        const normalized = Array.isArray(users) ? users : (users ? [users] : []);
        if (mounted) setAllUsers(normalized);
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return () => (mounted = false);
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!searchQuery || String(searchQuery).trim() === "") {
        const resp = await getAllUsers();
        const users = resp?.data?.Users ?? resp?.data ?? resp?.Users ?? resp ?? [];
        setAllUsers(Array.isArray(users) ? users : (users ? [users] : []));
        setCurrentPage(1);
        return;
      }

      const resp = await searchUser(searchQuery);
      const users = resp?.data?.Users ?? resp?.data ?? resp?.Users ?? resp ?? [];
      const normalized = Array.isArray(users) ? users : (users ? [users] : []);
      setAllUsers(normalized);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  const totalItems = allUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages]);

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return allUsers.slice(start, start + pageSize);
  }, [allUsers, currentPage, pageSize]);

  const goTo = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  const handleExport = () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/export-to-csv`;
    window.open(url, "_blank");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      setAllUsers(allUsers.filter(user => user._id !== id));
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    }

  }

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`)
  }

  return (
    <div className="min-w-screen bg-gray-50">
      <div className="bg-black text-white p-4">
        <h1 className="text-center text-lg font-semibold">MERN stack developer practical task</h1>
      </div>

      <div className="p-4 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full">
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              placeholder="Search"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
            />
            <button className="bg-amber-700 hover:bg-amber-800 text-white px-4" onClick={handleSearch} disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-start sm:justify-end">
            <button className="bg-amber-700 hover:bg-amber-800 flex text-white gap-2 w-full sm:w-auto justify-center" onClick={() => navigate("/add-users")}>
              <Plus size={18} className="mt-1"/> Add User
            </button>
            <button onClick={handleExport} className="bg-amber-700 hover:bg-amber-800 flex text-white gap-2 w-full sm:w-auto justify-center">
              <Download size={18} className="mt-1"/> Export To Csv
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-6 py-4 text-left font-semibold w-16">ID</th>
                <th className="px-6 py-4 text-left font-semibold">Full Name</th>
                <th className="px-6 py-4 text-left font-semibold">Email</th>
                <th className="px-6 py-4 text-left font-semibold">Gender</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Profile</th>
                <th className="px-6 py-4 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No users found</td>
                </tr>
              ) : (
                pageData.map((user, idx) => (
                  <tr key={user._id || idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-6 py-4">{`${user.firstname || ""} ${user.lastname || ""}`.trim() || user.fullName}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.gender}</td>
                    <td className="px-6 py-4">{user.status}</td>
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-xl">👤</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative group">
                        <button className="text-white hover:text-gray-800"><MoreVertical size={18} /></button>
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 flex flex-col space-y-1 py-1">
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100" onClick={() => navigate(`/view-user/${user._id}`)}><Eye size={16} /> View</button>
                          <button onClick={() => handleEdit(user._id)} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"><Edit2 size={16} /> Edit</button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={() => handleDelete(user._id)}><Trash2 size={16} /> Delete</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 mb-3 px-4">
            <div className="text-sm">Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries</div>

            <div className="flex items-center gap-2">
              <button variant="outline" className="px-3 py-1 text-white" onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>Prev</button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} className={`${currentPage === i + 1 ? "bg-amber-700 text-white" : ""} px-3 py-1`} onClick={() => goTo(i + 1)}>{i + 1}</button>
                ))}
              </div>

              <button variant="outline" className="px-3 py-1 text-white" onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
