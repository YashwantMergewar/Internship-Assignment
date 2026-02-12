import { Router } from "express";
import { deleteUser, exportToCSV, getAllUserProfile, registerUser, searchUser, updateUser } from "../controller/user.controller.js";

const router = Router()

router.route("/register-user").post(registerUser)
router.route("/edit-user/:id").patch(updateUser)
router.route("/delete-user/:id").delete(deleteUser)
router.route("/user-details").get(getAllUserProfile)
router.route("/export-to-csv").get(exportToCSV)
router.route("/search").get(searchUser)


export default router;