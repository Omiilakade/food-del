import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "http://localhost:4000";
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const currency = "₹";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
                if (cartItems[item] > 0) {
                    let itemInfo = food_list.find((product) => product._id === item);
                    totalAmount += itemInfo.price * cartItems[item];
                }
            } catch (error) {}
        }
        return totalAmount;
    };

    // ✅ Fetch all food items
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data); // Fetch and set all food items
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    // ✅ Search food items dynamically
    const searchFoodList = async (query) => {
        try {
            if (!query) {
                await fetchFoodList(); // ✅ If no query, fetch all food items
                return;
            }
            const response = await axios.get(`${url}/api/food/search?query=${query}`);
            if (response.data.success) {
                setFoodList(response.data.data); // ✅ Restore previous search functionality
            } else {
                setFoodList([]); // ✅ Show no results if nothing matches
            }
        } catch (error) {
            console.error("Error searching food items:", error);
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList(); // Load all food items initially
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData({ token: localStorage.getItem("token") });
            }
        }
        loadData();
    }, []);

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        setFoodList, // ✅ Added to allow updates in FoodDisplay.js
        searchFoodList, // ✅ New function to fetch search results
        currency,
        deliveryCharge,
    };

    return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
