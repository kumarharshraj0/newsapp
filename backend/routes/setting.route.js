import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getSetting, updateSetting, deleteSetting, getAllSettings } from "../controllers/setting.controller.js";

const router = express.Router();

router.get("/all", getAllSettings);
router.get("/:key", getSetting);
router.post("/:key", verifyToken, updateSetting);
router.delete("/:key", verifyToken, deleteSetting);

export default router;
