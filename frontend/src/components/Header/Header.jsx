import React from 'react'
import './Header.css'
import { menu_list } from '../../assets/assets'
import { useNavigate } from "react-router-dom";


const Header = () => {

    const navigate = useNavigate();

    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Order your favourite food here</h2>
                <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
                <button className='view-menu'  onClick={() => {window.location.href = "#explore-menu";}}>
                <span className="text">View Menu</span>
                </button>


            </div>
        </div>
    )
}

export default Header
