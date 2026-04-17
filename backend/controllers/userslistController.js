import userlistModel from "../models/userlistModel.js";

import fs from "fs";

//get all users
export const getUserslistController = async (req, res) => {
  try {
    const userslist = await userlistModel.find({});
    res.status(200).send({
      success: true,
      message: "All Users List Displayed for Admin",
      userslist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all Users list for admin display",
    });
  }
};

//users count
export const userslistCountController = async (req, res) => {
  try {
    const totallist = await userlistModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      totallist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in users count for admin display",
      error,
      success: false,
    });
  }
};

//users list based on page
export const userslisttListController = async (req, res) => {
  try {
    const perPagelist = 6;
    const pagelist = req.params.pagelist ? parseInt(req.params.pagelist) : 1;

    if (pagelist < 1) {
      res.status(400).send({
        success: false,
        message: "Invalid page number",
      });
      return;
    }

    const userslist = await userlistModel
      .find({})
      .select(-"password")
      .skip((pagelist - 1) * perPagelist)
      .limit(perPagelist)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      userslist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in per page ctrl for admin diaplay",
      error,
    });
  }
};
