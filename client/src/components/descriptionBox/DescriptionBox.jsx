import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews(122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          Introducing our latest collection, the perfect blend of style and
          comfort. This trendy shirt is made from high-quality fabric, ensuring
          a soft and luxurious feel. With its modern design and versatile color,
          it's perfect for any occasion. Whether you're going for a casual look
          or dressing up for a special event, this shirt is a must-have in your
          wardrobe. Get yours today and elevate your fashion game!
        </p>
        <p>
          An ecommerce of clothes is an online platform where customers can
          browse and purchase clothing items. It offers a wide range of
          products, including shirts, pants, dresses, accessories, and more.
          Customers can conveniently shop from the comfort of their homes,
          explore different brands and styles, and have their chosen items
          delivered to their doorstep. Ecommerce platforms often provide
          detailed product descriptions, images, customer reviews, and secure
          payment options to enhance the shopping experience.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
