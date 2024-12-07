import { Request, Response } from "express";
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    // 1. Check if the user already exists in the database
    if (existingUser) {
      return res.status(200).send();
    }

    // 2. Create a new user and save it to the database
    const newUser = new User(req.body);
    await newUser.save();
    // 3. Return the user to the client
    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the user");
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);
    if (!user || user === null) {
      return res.status(404).send("User not found");
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while updating the user");
  }
};

export default { createCurrentUser, updateCurrentUser, getCurrentUser };
