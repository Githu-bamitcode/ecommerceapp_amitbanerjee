import express from "express";
import {
  getUserslistController,
  userslistCountController,
  userslisttListController,
} from "../controllers/userslistController.js";

const router = express.Router();

//get users
router.get("/get-userslist", getUserslistController);

//users count
router.get("/userslist-count", userslistCountController);

//users per page
router.get("/userslist-list/:pagelist", userslisttListController);

export default router;
