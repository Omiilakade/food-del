import React, { useState } from 'react';
import './Add.css';
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = () => {
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        ar_model_link: ""  // Store AR Model Link
    });

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error('Please select an image.');
            return;
        }

        if (!data.ar_model_link.trim()) {
            toast.error('Please enter a valid AR model link.');
            return;
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        if (image) {
            formData.append("image", image);
        }
        formData.append("ar_model_link", data.ar_model_link ? data.ar_model_link.trim() : ""); // Ensure it's not undefined
        
        try {
            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                toast.success(response.data.message);
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad",
                    ar_model_link: ""
                });
                setImage(null);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error adding food item.");
        }
    };

    const onChangeHandler = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                
                {/* Image Upload */}
                <div className='add-img-upload flex-col'>
                    <p>Upload Image</p>
                    <input 
                        type="file" 
                        accept="image/*" 
                        id="image" 
                        hidden 
                        onChange={(e) => setImage(e.target.files[0])} 
                    />
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="Upload" />
                    </label>
                </div>

                {/* AR Model Link Input Field */}
                <div className='add-ar-link flex-col'>
                    <p>AR Model Link</p>
                    <input 
                        type="text" 
                        name="ar_model_link" 
                        onChange={onChangeHandler} 
                        value={data.ar_model_link} 
                        placeholder="Paste AR model link here" 
                        required 
                    />
                </div>

                {/* Product Name */}
                <div className='add-product-name flex-col'>
                    <p>Product Name</p>
                    <input 
                        type="text" 
                        name="name" 
                        onChange={onChangeHandler} 
                        value={data.name} 
                        placeholder="Enter product name" 
                        required 
                    />
                </div>

                {/* Product Description */}
                <div className='add-product-description flex-col'>
                    <p>Product Description</p>
                    <textarea 
                        name="description" 
                        onChange={onChangeHandler} 
                        value={data.description} 
                        rows={4} 
                        placeholder="Enter product description" 
                        required 
                    />
                </div>

                {/* Category & Price */}
                <div className='add-category-price'>
                    <div className='add-category flex-col'>
                        <p>Category</p>
                        <select name="category" onChange={onChangeHandler} value={data.category}>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Starters">Starters</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className='add-price flex-col'>
                        <p>Price (₹)</p>
                        <input 
                            type="number" 
                            name="price" 
                            onChange={onChangeHandler} 
                            value={data.price} 
                            placeholder="Enter price" 
                            required 
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button type='submit' className='add-btn'>ADD</button>
            </form>
        </div>
    );
};

export default Add;
