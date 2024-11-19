import { Request, Response } from "express";
import Restaurant from "../../models/restaurant";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

async function createMyResturant(req: Request, res: Response) {
  try {
    const existingRestaurant = await Restaurant.findOne({
      user: req.userId,
    });
    if (existingRestaurant) {
      return res.status(409).send({ message: "Restaurant already exists" });
    }

    const image = req.file as Express.Multer.File;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.uploader.upload(dataURI);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = uploadResponse.url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();
    res.status(201).send({ message: "Restaurant created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
}

export default { createMyResturant };
