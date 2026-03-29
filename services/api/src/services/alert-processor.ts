const DAILY_PUSH_LIMIT = 2;

interface PushCounter {
  date: string;
  sent: number;
  lastNotifiedAt: string;
}

const pushCounterStore = new Map<string, PushCounter>();

const dateKey = () => new Date().toISOString().slice(0, 10);

export const canSendPushNotification = (userId: string): boolean => {
  const key = `${userId}:${dateKey()}`;
  const state = pushCounterStore.get(key);
  if (!state) {
    return true;
  }

  return state.sent < DAILY_PUSH_LIMIT;
};

export const markPushNotificationSent = (userId: string) => {
  const key = `${userId}:${dateKey()}`;
  const state = pushCounterStore.get(key);

  if (!state) {
    pushCounterStore.set(key, {
      date: dateKey(),
      sent: 1,
      lastNotifiedAt: new Date().toISOString(),
    });
    return;
  }

  state.sent += 1;
  state.lastNotifiedAt = new Date().toISOString();
  pushCounterStore.set(key, state);
};
