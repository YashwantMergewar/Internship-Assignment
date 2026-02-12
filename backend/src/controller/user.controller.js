import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../model/user.model.js";
import { Parser as CsvParser } from "json2csv"

const registerUser = asyncHandler(async (req, res)=> {
    const {firstname, lastname, email, mobile, gender, status, location} = req.body

    if(
        [firstname, lastname, email, mobile, gender, status, location].some((field) => field.trim() === "")
    ){
        throw new ApiError(400, "All fields are Required..!")
    }

    const existedUser = await User.findOne({
        $or: [{email}, {mobile}]
    })

    if(existedUser){
        throw new ApiError(409, "User already exist with this email or mobile number")
    }

    const user = await User.create({
        firstname,
        lastname,
        email,
        mobile,
        gender,
        status,
        location
    })

    res.status(201).json(
        new ApiResponse(201, user, "User registered successfully")
    )
})

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, mobile, gender, status, location } = req.body;

    if (!id) {
        throw new ApiError(400, "User ID is required");
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            firstname,
            lastname,
            email,
            mobile,
            gender,
            status,
            location
        },
        { new: true }
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "User ID is required");
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if(!deletedUser){
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(
        new ApiResponse(200, null, "User deleted successfully")
    )
})

const getAllUserProfile = asyncHandler(async (req, res) => {
    const users = (await User.find({})).toSorted({ createdAt: -1 });
    
    if(users.length === 0){
        throw new ApiError(404, "No user found");
    }

    res.status(200).json(
        new ApiResponse(200, {Users: users}, "All users fetched successfully")
    )
})

const searchUser = asyncHandler(async (req, res) => {
    const { search } = req.query || ""
    if(!search){
        throw new ApiError(400, "Search query is required")
    }
    const users = await User.find({
        $or: [
            { firstname: {
                $regex: search,
                $options: "i"
            }},

            { lastname: {
                $regex: search,
                $options: "i"
            }},

            { email: {
                $regex: search,
                $options: "i"
            }},

            { mobile: {
                $regex: search,
                $options: "i"
            }},

            { gender: {
                $regex: search,
                $options: "i"
            }},

            { location: {
                $regex: search,
                $options: "i"
            }}

        ]
    }).sort({ createdAt: -1 })

    if(users.length === 0){
        throw new ApiError(404, "No user found matching the search query")
    }


    res.status(200).json(
        new ApiResponse(200, users, "User details found")
    )
})

const exportToCSV = asyncHandler(async (req, res) => {
    try {
        const users = []
        const userData = await User.find({}).lean();
    
        userData.forEach((user)=> {
            const { firstname, lastname, email, mobile, gender, status, location } = user
            users.push({ firstname, lastname, email, mobile, gender, status, location })
        })
    
        const csvFields = ["Firstname", "Lastname", "Email", "Mobile", "Gender", "Status", "Location"];
        const csvParser = new CsvParser({csvFields});
        const csvData = csvParser.parse(users);
        
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment: filename=Users-Details.csv");
    
        res.status(200).end(csvData);
    } catch (error) {
        throw new ApiError(500, "Error generating CSV file");
    }
})

export {
    registerUser,
    updateUser,
    deleteUser,
    getAllUserProfile,
    searchUser,
    exportToCSV
}