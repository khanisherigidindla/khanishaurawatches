import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  notificationCount: number;
  setNotificationCount: (count: number) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      notificationCount: 0,

      toggleWishlist: (productId: string) => {
        set((state) => {
          const exists = state.productIds.includes(productId);
          return {
            productIds: exists
              ? state.productIds.filter((id) => id !== productId)
              : [...state.productIds, productId],
          };
        });
      },

      isInWishlist: (productId: string) => {
        return get().productIds.includes(productId);
      },

      clearWishlist: () => set({ productIds: [] }),

      setNotificationCount: (count: number) => set({ notificationCount: count }),
    }),
    {
      name: "aura_luxury_wishlist",
    }
  )
);

/* ---- Notification Store ---- */

export type NotificationType = "exclusive" | "system" | "order";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (item: Omit<NotificationItem, "id">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],

      unreadCount: 0,

            addNotification: (item) =>
        set((state) => ({
          notifications: [{ ...item, id: `notif_${Date.now()}` }, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),

      markAsRead: (id) =>
        set((state) => {
          const updated = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          const unread = updated.filter((n) => !n.read).length;
          return { notifications: updated, unreadCount: unread };
        }),

      markAllAsRead: () =>
        set(() => ({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearNotification: (id) =>
        set((state) => {
          const updated = state.notifications.filter((n) => n.id !== id);
          const unread = updated.filter((n) => !n.read).length;
          return { notifications: updated, unreadCount: unread };
        }),

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "aura_luxury_notifications",
    }
  )
);
