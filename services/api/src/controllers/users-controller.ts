import { Request, Response } from "express";
import { getFirebaseAuth } from "../config/firebase";
import { deleteAlertsForUser } from "../services/alert-service";
import { deletePendingUser } from "../services/auth-service";

export const deleteUserHandler = async (req: Request, res: Response): Promise<void> => {
  const requesterId = req.user?.uid;
  if (!requesterId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const targetUserId = req.params.id;
  const isAdmin = Boolean(req.user?.admin);
  if (requesterId !== targetUserId && !isAdmin) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const deletedAlerts = deleteAlertsForUser(targetUserId);
  deletePendingUser(targetUserId);

  let firebaseDeleted = false;
  try {
    await getFirebaseAuth().deleteUser(targetUserId);
    firebaseDeleted = true;
  } catch (error) {
    const code = (error as { code?: string } | undefined)?.code;
    if (code !== "auth/user-not-found") {
      res.status(500).json({ error: "Failed to delete user from auth provider" });
      return;
    }
  }

  res.json({
    success: true,
    deletedAlerts,
    firebaseDeleted,
    notes: [
      "PostgreSQL and Redis user data cleanup must be wired once persistence is enabled.",
      "Order records should be anonymized for accounting compliance."
    ]
  });
};
