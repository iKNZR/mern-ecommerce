import React, { useState, useEffect } from "react";
import "./Popular.css";
import Item from "../item/Item";

const Popular = () => {
  const [data_product, setData_product] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/popularinwoman")
      .then((res) => res.json())
      .then((data) => setData_product(data.slice(0, 4)));
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {data_product.map((item, index) => {
          return (
            <Item
              key={index}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
