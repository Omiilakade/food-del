import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id, ar_model_link }) => {
    const [itemCount, setItemCount] = useState(0);
    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);

    // Default AR link as fallback
    const defaultArLink = "https://ar-code.com/dDTxhJRrc?view=webar";

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={url + "/images/" + image} alt="" />
                {!cartItems[id] ? (
                    <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
                ) : (
                    <div className="food-item-counter">
                        <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="" />
                        <p>{cartItems[id]}</p>
                        <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="" />
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    {/* Show "View AR" button for both old and new functionality */}
                    <button 
                        className='AR' 
                        onClick={() => {
                            if (ar_model_link && ar_model_link.trim() !== "") {
                                window.open(ar_model_link, '_blank');
                            } else {
                                alert("No AR Model Available for this item.");
                            }
                        }}
                    >
                        <span className="text">View AR</span>
                    </button>
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">₹{price}</p>
            </div>
        </div>
    );
};

export default FoodItem;
