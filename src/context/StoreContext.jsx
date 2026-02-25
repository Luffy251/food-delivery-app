import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const API_URL = "http://localhost:4000";

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null); // { name, email }
  const [authError, setAuthError] = useState("");

  // ─── Cart ───────────────────────────────────────────────────────────────────
  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const removeFromCart = (itemId) => {
    if (cartItems[itemId] === 1) {
      const newCartItems = { ...cartItems };
      delete newCartItems[itemId];
      setCartItems(newCartItems);
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    }
  };

  const getTotalQuantity = () => {
    let totalQuantity = 0;
    for (const itemId in cartItems) {
      totalQuantity += cartItems[itemId];
    }
    return totalQuantity;
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // ─── Auth ────────────────────────────────────────────────────────────────────

  /**
   * Register a new user. Returns { success, message }.
   */
  const registerUser = async (name, email, password) => {
    setAuthError("");
    try {
      const { data } = await axios.post(`${API_URL}/api/user/register`, {
        name,
        email,
        password,
      });
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("fd_token", data.token);
        localStorage.setItem("fd_user", JSON.stringify(data.user));
        return { success: true };
      } else {
        setAuthError(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Registration failed. Try again.";
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  /**
   * Login an existing user. Returns { success, message }.
   */
  const loginUser = async (email, password) => {
    setAuthError("");
    try {
      const { data } = await axios.post(`${API_URL}/api/user/login`, {
        email,
        password,
      });
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("fd_token", data.token);
        localStorage.setItem("fd_user", JSON.stringify(data.user));
        return { success: true };
      } else {
        setAuthError(data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Login failed. Try again.";
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  /**
   * Logout the current user.
   */
  const logoutUser = () => {
    setToken("");
    setUser(null);
    setCartItems({});
    localStorage.removeItem("fd_token");
    localStorage.removeItem("fd_user");
  };

  // Restore session from localStorage on first load
  useEffect(() => {
    const savedToken = localStorage.getItem("fd_token");
    const savedUser = localStorage.getItem("fd_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ─── Context Value ────────────────────────────────────────────────────────────
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalQuantity,
    // auth
    token,
    user,
    authError,
    setAuthError,
    registerUser,
    loginUser,
    logoutUser,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
