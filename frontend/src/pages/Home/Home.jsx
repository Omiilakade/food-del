import React, { useState, useContext } from "react";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import { StoreContext } from "../../Context/StoreContext"; // Import StoreContext

const Home = () => {
  const [category, setCategory] = useState("All");
  const { searchFoodList } = useContext(StoreContext); // Access search function

  // Handle search term change
  const handleSearch = (query) => {
    searchFoodList(query); // Trigger search in context
  };

  return (
    <>
      <Header />
      {/* Pass setCategory and category as props */}
      <ExploreMenu setCategory={setCategory} category={category} />
      {/* Pass handleSearch to FoodDisplay for search handling */}
      <FoodDisplay category={category} onSearch={handleSearch} />
      {/* <AppDownload /> */}
    </>
  );
};

export default Home;
