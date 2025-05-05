import Authorization from "../middlewares/Authorization.js";
import Upload from "../middlewares/Multer.js";
import {
  ExitExamDelete,
  GetExitExam,
  ExitExamCreation,
  ResourceDelete,
  GetResource,
  ResourceCreation,
} from "../controllers/resourceControllers.js";

const router = express.Router();

// Apply middlewares to relevant routes
router.post(
  "/createExit-exams",
  Authenticated,
  Authorization(["teacher", "admin"]),
  Upload.array("files"),
  ExitExamCreation
);
router.get("/getExit-exams", Authenticated, GetExitExam);
router.delete(
  "/deleteExit-exams/:id",
  Authenticated,
  Authorization(["teacher", "admin"]),
  ExitExamDelete
);

router.post(
  "/createResources",
  Authenticated(),
  Authorization("teacher", "admin"),
  Upload.array("files"),
  ResourceCreation
);
router.get("/getResources", Authenticated, GetResource);
router.delete(
  "/deleteResources/:id",
  Authenticated,
  Authorization("teacher", "admin"),
  ResourceDelete
);
export default router;