import express from "express";
import {
  uploadDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/documentController.js";
import { protect } from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

//protected routes
router.use;
