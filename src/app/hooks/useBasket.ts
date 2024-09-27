import axios from "axios";
import { serverApi } from "../../lib/config";
import { useState } from "react";
import { CartItem } from "../../lib/types/search";
import {
  sweetTopSmallSuccessAlert,
  sweetTopSuccessAlert,
} from "../../lib/sweetAlert";
import { Product } from "../../lib/types/product";

const useBasket = () => {
  const cartJson: string | null = localStorage.getItem("cartData");
  const currentCart = cartJson ? JSON.parse(cartJson) : [];
  const [cartItems, setCartItems] = useState<CartItem[]>(currentCart);
  const path = serverApi;

  const updateCartPrices = async () => {
    try {
      const updatedItems = await Promise.all(
        cartItems.map(async (item: CartItem) => {
          const response = await axios.get(`${path}/product/${item._id}`);
          const latestProduct: Product = response.data;

          if (latestProduct.productPrice !== item.price) {
            return { ...item, price: latestProduct.productPrice };
          }
          return item;
        })
      );
      setCartItems(updatedItems);
      localStorage.setItem("cartData", JSON.stringify(updatedItems));
    } catch (err) {
      console.log("Error, updating cart prices:", err);
    }
  };

  const onAdd = async (input: CartItem) => {
    const exist: any = cartItems.find(
      (item: CartItem) => item._id === input._id
    );
    if (exist) {
      const cartUpdate = cartItems.map((item: CartItem) =>
        item._id === input._id
          ? { ...exist, quantity: exist.quantity + 1 }
          : item
      );
      setCartItems(cartUpdate);
      localStorage.setItem("cartData", JSON.stringify(cartUpdate));
      await sweetTopSmallSuccessAlert("Product added!", 500);
    } else {
      const cartUpdate = [...cartItems, { ...input }];
      setCartItems(cartUpdate);
      localStorage.setItem("cartData", JSON.stringify(cartUpdate));
      await sweetTopSuccessAlert("Product added!", 2000);
    }
  };

  const onRemove = async (input: CartItem) => {
    const exist: any = cartItems.find(
      (item: CartItem) => item._id === input._id
    );
    if (exist.quantity === 1) {
      const cartUpdate = cartItems.filter(
        (item: CartItem) => item._id !== input._id
      );
      setCartItems(cartUpdate);
      localStorage.setItem("cartData", JSON.stringify(cartUpdate));
      await sweetTopSmallSuccessAlert("Item removed!", 1000);
    } else {
      const cartUpdate = cartItems.map((item: CartItem) =>
        item._id === input._id
          ? { ...exist, quantity: exist.quantity - 1 }
          : item
      );
      setCartItems(cartUpdate);
      localStorage.setItem("cartData", JSON.stringify(cartUpdate));
    }
  };

  const onDelete = async (input: CartItem) => {
    const cartUpdate = cartItems.filter(
      (item: CartItem) => item._id !== input._id
    );
    setCartItems(cartUpdate);
    localStorage.setItem("cartData", JSON.stringify(cartUpdate));
    await sweetTopSmallSuccessAlert("Item removed!", 1000);
  };

  const onDeleteAll = async () => {
    setCartItems([]);
    localStorage.removeItem("cartData");
    await sweetTopSmallSuccessAlert("All items dropped!", 1000);
  };

  return {
    cartItems,
    updateCartPrices,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
  };
};

export default useBasket;
