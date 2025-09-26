export const auth = {
  isLoggedIn: () => localStorage.getItem("isLoggedIn") === "true",
  userId: () => localStorage.getItem("userId"),
  username: () => localStorage.getItem("username"),
  loginSession: ({ userId, username }) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
  },
  logout: () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  }
};