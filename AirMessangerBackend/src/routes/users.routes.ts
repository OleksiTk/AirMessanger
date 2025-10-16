// // src/routes/users.routes.ts
// import express from "express";
// import { userController } from "../controllers/userController";
// import { authMiddleware } from "../middlewares/authMiddleware";

// const router = express.Router();

// router.get("/me", authMiddleware, userController.getCurrentUser);
// router.get("/:id", userController.getUserById);
// router.put("/:id", authMiddleware, userController.updateUser);
// router.delete("/:id", authMiddleware, userController.deleteUser);

// export default router;
