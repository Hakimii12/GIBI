import express from "express";
import Authenticated from "../middlewares/Authenticated.js";
import Authorization from "../middlewares/Authorization.js";
import Upload from "../middlewares/Multer.js";
import {
  GetAnnouncementPost,
  AnnouncementPostCreation,
  AnnouncementPostDelete,
  PublicPostCreation,
  GetPublicPost,
  PublicPostDelete,
  GetMyPost,
  getPosts,
  createPost,
  getPost,
  deletePost,
} from "../controllers/postControllers.js";
const router = express.Router();
Authorization("admin"),
  router
    .route("/")
    .get(Authenticated(), Upload.single("files"), getPosts)
    .post(
      Authenticated(),
      Authorization("admin"),
      Upload.single("files"),
      createPost
    );
router
  .route("/:id")
  .get(Authenticated(), getPost)
  .delete(Authenticated(), deletePost);
router.post(
  "/announcementCreation",
  Authenticated(),
  Authorization("admin"),
  Upload.single("files"),
  AnnouncementPostCreation
);
router.get("/getAnnouncementPost", Authenticated(), GetAnnouncementPost);
router.delete(
  "/announcementPostDelete/:id",
  Authenticated(),
  Authorization("admin"),
  AnnouncementPostDelete
);

router.post(
  "/publicPostCreation",
  Authenticated(),
  Upload.single("files"),
  PublicPostCreation
);

router.get("/getPublicPost", Authenticated(), GetPublicPost);

router.delete("/publicPostDelete/:id", Authenticated(), PublicPostDelete);

router.get("/getMyPost", Authenticated(), GetMyPost);
export default router;
