import React, { useContext, useState } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { StoreContext } from '../../Context/StoreContext';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter food_list based on search term and category
  const filteredFoodList = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.food_category;
    const matchesSearch = item.food_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="food-display" id="food-display">
      <h2>Top recommended dishes for you.</h2>
      <div className="food-search">
        <input
          type="text"
          placeholder="Search for a dish"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="food-display-list">
        {filteredFoodList.map((item) => (
          <FoodItem
            key={item.food_id}
            image={item.food_image}
            name={item.food_name}
            desc={item.food_desc}
            price={item.food_price}
            id={item.food_id}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
