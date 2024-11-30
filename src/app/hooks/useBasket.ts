import axios from "axios";
import { serverApi } from "../../lib/config";
import { useState } from "react";
import { CartItem } from "../../lib/types/search";
import {
  sweetFailureProvider,
  sweetTopSmallSuccessAlert,
  sweetTopSuccessAlert,
} from "../../lib/sweetAlert";
import { Product } from "../../lib/types/product";
import ProductService from "../services/ProductService";

const useBasket = () => {
  const cartJson: string | null = localStorage.getItem("cartData");
  const currentCart = cartJson ? JSON.parse(cartJson) : [];
  const [cartItems, setCartItems] = useState<CartItem[]>(currentCart);
  const path = serverApi;

  const updateCartPrices = async () => {
    try {
      const updatedItems = await Promise.all(
        cartItems.map(async (item: CartItem) => {
          const product = new ProductService();
          const result: Product = await product.getProduct(item._id);

          if (result.productPrice !== item.price) {
            return { ...item, price: result.productPrice };
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
    const product = new ProductService();
    const result: Product = await product.getProduct(input._id);
    console.log("result:", result);
    const exist: any = cartItems.find(
      (item: CartItem) => item._id === input._id
    );
    if (exist) {
      if (exist.quantity < result.productLeftCount) {
        const cartUpdate = cartItems.map((item: CartItem) =>
          item._id === input._id
            ? {
                ...exist,
                quantity: exist.quantity + result.productPerSaleCount,
              }
            : item
        );
        setCartItems(cartUpdate);
        localStorage.setItem("cartData", JSON.stringify(cartUpdate));
        await sweetTopSmallSuccessAlert("Product added!", 500);
      } else {
        sweetFailureProvider("Can't add more that there is in stock!");
      }
    } else {
      if (result.productLeftCount > input.quantity) {
        const cartUpdate = [...cartItems, { ...input }];
        setCartItems(cartUpdate);
        localStorage.setItem("cartData", JSON.stringify(cartUpdate));
        await sweetTopSuccessAlert("Product added!", 2000);
      } else {
        sweetFailureProvider("Can't add more that there is in stock!");
      }
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
