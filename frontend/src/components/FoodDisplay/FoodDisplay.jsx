import React, { useState, useContext } from "react";
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";
import { StoreContext } from "../../Context/StoreContext";

const FoodDisplay = ({ category }) => {
    const { food_list, searchFoodList } = useContext(StoreContext);
    const [searchTerm, setSearchTerm] = useState(""); // ✅ Correct variable name

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchTerm(query); // ✅ Correct function name
        searchFoodList(query); // ✅ Restore dynamic search function
    };

    return (
        <div className="food-display" id="food-display">
            <h2>Top recommended dishes for you.</h2>
            <div className="food-search">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search food..."
                    value={searchTerm} // ✅ Use correct state variable
                    onChange={handleSearch}
                    className="search-bar"
                />
            </div>
            <div className="food-display-list">
                {food_list.length > 0 ? (
                    food_list.map((item) => (
                        (category === "All" || category === item.category) && (
                            <FoodItem
                                key={item._id}
                                image={item.image}
                                name={item.name}
                                desc={item.description}
                                price={item.price}
                                id={item._id}
                                ar_model_link={item.ar_model_link} // Pass AR model link to FoodItem
                            />
                        )
                    ))
                ) : (
                    <p>No food items found.</p>
                )}
            </div>
        </div>
    );
};

export default FoodDisplay;
