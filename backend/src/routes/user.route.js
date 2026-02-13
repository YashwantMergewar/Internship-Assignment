import { Router } from "express";
import { deleteUser, exportToCSV, getAllUserProfile, getUserById, registerUser, searchUser, updateUser } from "../controller/user.controller.js";

const router = Router()

router.route("/register-user").post(registerUser)
router.route("/edit-user/:id").patch(updateUser)
router.route("/delete-user/:id").delete(deleteUser)
router.route("/user-details").get(getAllUserProfile)
router.route("/user-details/:id").get(getUserById)
router.route("/export-to-csv").get(exportToCSV)
router.route("/search").get(searchUser)


export default router;