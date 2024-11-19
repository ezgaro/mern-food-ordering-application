import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 5 * 1024 * 1024, //5mb
  },
});

router.post(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  MyRestaurantController.createMyResturant
);

export default router;