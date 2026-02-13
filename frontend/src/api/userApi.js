import api from "./setupAxios.js";
const createUser = async (data) => {
    try {
        const res = await api.post('/register-user', data);
        return res.data;
    } catch (error) {
        // Normalize server-side error message and rethrow so callers can handle it
        if (error?.response?.data?.message) {
            throw new Error(error.response.data.message);
            
        }
        throw new Error(error.message || 'Registration failed');
    }
}

const getAllUsers = async () => {
    try {
        const res = await api.get('/user-details')
        return res.data;
    } catch (error) {
        if (error?.response?.data?.message) {
            throw new Error(error.response.data.message);
            
        }
        console.log(error);
        throw new Error(error.message || 'Failed to fetch user data');
        
    }
}

const getUserById = async (id) => {
    try {
        const res = await api.get(`/user-details/${id}`)
        return res.data;
    } catch (error) {
        if (error?.response?.data?.message) {
            throw new Error(error.response.data.message);
            
        }
        console.log(error);
        throw new Error(error.message || 'Failed to fetch user data');
        
    }
}



const updateUser = async (id, data) => {
    try {
        const res = await api.patch(`/edit-user/${id}`, data)
        return res.data;
    } catch (error) {
        if (error?.response?.data?.message) {
            throw new Error(error.response.data.message);
            
        }
        throw new Error(error.message || 'User data updation failed');
    }
}

const searchUser = async (query) => {
    try {
        const res = await api.get(`/search`, { params: { search: query } })
        return res.data;
    } catch (error) {
        if (error?.response?.data?.message) {
            throw new Error(error.response.data.message);
            
        }
        throw new Error(error.message || 'User data search failed');
    }
}

const deleteUser = async (id) => {
    try {
        const res = await api.delete(`/delete-user/${id}`)
        return res.data;
    } catch (error) {
        if (error?.response?.data?.message) {
            throw new Error(error.response.data.message);
            
        }
        throw new Error(error.message || 'User data deletion failed');
    }
}

export {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserById,
    searchUser
}