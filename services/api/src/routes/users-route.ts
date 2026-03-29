import { Router } from "express";
import { deleteUserHandler } from "../controllers/users-controller";
import { requireAuth } from "../middleware/auth";

const usersRouter = Router();

usersRouter.delete("/:id", requireAuth, deleteUserHandler);

export default usersRouter;
