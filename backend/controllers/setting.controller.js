import Setting from "../models/setting.model.js";
import { errorHandler } from "../utils/error.js";

// Simple in-memory cache
let settingsCache = {
  data: null,
  timestamp: 0
};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes


export const getSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const setting = await Setting.findOne({ key });
    if (!setting) {
      return res.status(200).json({ success: true, setting: null });
    }
    res.status(200).json({ success: true, setting });
  } catch (error) {
    next(error);
  }
};

export const getAllSettings = async (req, res, next) => {
  try {
    const now = Date.now();
    if (settingsCache.data && (now - settingsCache.timestamp < CACHE_TTL)) {
      return res.status(200).json({ success: true, settings: settingsCache.data });
    }

    const settings = await Setting.find({});
    settingsCache = {
      data: settings,
      timestamp: now
    };
    res.status(200).json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to update settings"));
  }
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    let setting = await Setting.findOne({ key });
    
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = new Setting({ key, value });
      await setting.save();
    }
    
    // Invalidate cache
    settingsCache.data = null;
    
    res.status(200).json({ success: true, setting });
  } catch (error) {
    next(error);
  }
};

export const deleteSetting = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete settings"));
  }
  try {
    const { key } = req.params;
    await Setting.findOneAndDelete({ key });
    // Invalidate cache
    settingsCache.data = null;
    
    res.status(200).json({ success: true, message: "Setting deleted successfully" });
  } catch (error) {
    next(error);
  }
};
