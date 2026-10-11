import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile, BudgetTierId } from "../types/watch";
import { getActiveUserProfile, saveActiveUserProfile } from "../supabase/mockStore";
import { useCartStore } from "./cartStore";

export const ADMIN_CREDENTIALS = {
  email: "admin@gmail.com",
  pass: "admin@12",
};

interface LoginResult {
  success: boolean;
  error?: string;
  isAdmin: boolean;
}

export const MASTER_OTP = "123456";

export const isValidDemoOtp = (v: string) => /^\d{6}$/.test(v.trim());

interface UserStore {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => LoginResult;
  login: (email: string, password?: string) => LoginResult;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setPreferredBudget: (tier: BudgetTierId) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (email: string, password = ""): LoginResult => {
        const normalizedEmail = email.trim().toLowerCase();
        const trimmedPass = password.trim();

        // Check if user is attempting admin login
        if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
          if (trimmedPass === ADMIN_CREDENTIALS.pass) {
            const adminProfile: UserProfile = {
              id: "usr_admin_master",
              email: ADMIN_CREDENTIALS.email,
              firstName: "Executive",
              lastName: "Administrator",
              phone: "+91 98200 00001",
              preferredBudget: "ultra_luxury",
            };
            saveActiveUserProfile(adminProfile);
            set({
              user: adminProfile,
              isAuthenticated: true,
              isAdmin: true,
            });
            useCartStore.getState().loadUserCart(adminProfile.email);
            return { success: true, isAdmin: true };
          } else {
            return {
              success: false,
              error: "Invalid administrator credentials. Access restricted to authorized executives.",
              isAdmin: false,
            };
          }
        }

        // Signup-first: only accounts stored in localStorage may log in
        if (typeof window === "undefined") {
          return { success: false, error: "Login unavailable.", isAdmin: false };
        }
        const raw = localStorage.getItem("aura_registered_users");
        const users: Record<string, { password: string; firstName: string; lastName: string }> = raw ? JSON.parse(raw) : {};
        const record = users[normalizedEmail];
        if (!record) {
          return {
            success: false,
            error: "No account found for this email. Please sign up first.",
            isAdmin: false,
          };
        }
        if (record.password !== trimmedPass) {
          return { success: false, error: "Wrong email or password. Please try again.", isAdmin: false };
        }

        // Regular Patron / Collector Login
        const profile = getActiveUserProfile();
        const patronProfile: UserProfile = {
          ...profile,
          email: normalizedEmail,
          firstName: record.firstName || normalizedEmail.split("@")[0],
          lastName: record.lastName || "",
        };
        saveActiveUserProfile(patronProfile);
        localStorage.setItem("aura_last_email", normalizedEmail);
        localStorage.setItem("aura_last_pass", trimmedPass);
        set({
          user: patronProfile,
          isAuthenticated: true,
          isAdmin: false,
        });

        // Load user's saved cart from Supabase / Storage
        useCartStore.getState().loadUserCart(patronProfile.email).then(() => {
          // If user had a pending cart item before logging in, append it now
          if (typeof window !== "undefined") {
            const rawPending = localStorage.getItem("aura_pending_cart_item");
            if (rawPending) {
              try {
                const pending = JSON.parse(rawPending);
                if (pending?.product) {
                  useCartStore.getState().addItem(pending.product, pending.quantity || 1, pending.engraving);
                  localStorage.removeItem("aura_pending_cart_item");
                }
              } catch (e) {
                console.error("Error parsing pending cart item", e);
              }
            }
          }
        });

        return { success: true, isAdmin: false };
      },

      logout: () => {
        useCartStore.getState().logoutUserCart();
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },

      signup: (email: string, password: string, firstName = "", lastName = ""): LoginResult => {
        const normalizedEmail = email.trim().toLowerCase();
        const trimmedPass = password.trim();
        if (!normalizedEmail || !trimmedPass) {
          return { success: false, error: "Email and password are required.", isAdmin: false };
        }
        if (typeof window === "undefined") {
          return { success: false, error: "Signup unavailable.", isAdmin: false };
        }
        const raw = localStorage.getItem("aura_registered_users");
        const users: Record<string, { password: string; firstName: string; lastName: string }> = raw ? JSON.parse(raw) : {};
        users[normalizedEmail] = { password: trimmedPass, firstName: firstName.trim(), lastName: lastName.trim() };
        localStorage.setItem("aura_registered_users", JSON.stringify(users));
        localStorage.setItem("aura_last_email", normalizedEmail);
        localStorage.setItem("aura_last_pass", trimmedPass);
        // Auto-login after signup via same login path
        return get().login(normalizedEmail, trimmedPass);
      },

      updateProfile: (updates) => {
        const current = get().user || getActiveUserProfile();
        const updated = { ...current, ...updates };
        saveActiveUserProfile(updated);
        set({ user: updated });
      },

      setPreferredBudget: (tier) => {
        const current = get().user || getActiveUserProfile();
        const updated = { ...current, preferredBudget: tier };
        saveActiveUserProfile(updated);
        set({ user: updated });
      },
    }),
    {
      name: "aura_auth_state",
    }
  )
);
