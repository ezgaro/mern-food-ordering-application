import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

async function getMyRestaurant(req: Request, res: Response) {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
}

async function createMyRestaurant(req: Request, res: Response) {
  try {
    const existingRestaurant = await Restaurant.findOne({
      user: req.userId,
    });
    if (existingRestaurant) {
      return res.status(409).send({ message: "Restaurant already exists" });
    }

    const imageUrl = await upoladImage(req.file as Express.Multer.File);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();
    await restaurant.save();
    res.status(201).send({ message: "Restaurant created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
}

async function updateMyRestaurant(req: Request, res: Response) {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "restaurant not found" });
    }
    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await upoladImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong" });
  }
}

async function getMyRestaurantOrders(req: Request, res: Response) {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const restaurant = await Restaurant.findById(order.restaurant);

    if (restaurant?.user?._id.toString() !== req.userId) {
      res.status(401).send();
    }
    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to update order status" });
  }
}

async function upoladImage(file: Express.Multer.File) {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.uploader.upload(dataURI);
  return uploadResponse.url;
}

export default {
  updateOrderStatus,
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
};
