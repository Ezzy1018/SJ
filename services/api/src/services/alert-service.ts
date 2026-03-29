import { AlertRecord, CreateAlertRequest } from "@sj/contracts";
import { alertStore } from "../models/store";

const maxAlertsPerUser = 3;

export const createAlert = (payload: CreateAlertRequest): AlertRecord => {
  const activeCount = alertStore.filter(
    (alert) => alert.userId === payload.userId && alert.status === "active",
  ).length;

  if (activeCount >= maxAlertsPerUser) {
    throw new Error("ALERT_LIMIT_REACHED");
  }

  const alert: AlertRecord = {
    ...payload,
    id: `alert_${Math.random().toString(36).slice(2, 10)}`,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  alertStore.push(alert);
  return alert;
};

export const getUserAlerts = (userId: string): AlertRecord[] => {
  return alertStore.filter((alert) => alert.userId === userId);
};

export const deleteAlertForUser = (
  userId: string,
  alertId: string,
): boolean => {
  const index = alertStore.findIndex(
    (alert) => alert.id === alertId && alert.userId === userId,
  );
  if (index < 0) {
    return false;
  }
  alertStore.splice(index, 1);
  return true;
};

  export const deleteAlertsForUser = (userId: string): number => {
    const before = alertStore.length;
    for (let i = alertStore.length - 1; i >= 0; i -= 1) {
      if (alertStore[i].userId === userId) {
        alertStore.splice(i, 1);
      }
    }

    return before - alertStore.length;
  };
