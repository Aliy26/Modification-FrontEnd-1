import React, { useEffect } from "react";
import Statistics from "./Statistics";
import PopularProducts from "./PopularProducts";
import NewProducts from "./NewProducts";
import Adverstisement from "./Advertisement";
import ActiveUsers from "./ActiveUsers";
import Events from "./Events";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setNewProducts, setPopularProducts, setTopUsers } from "./slice";
import { Product } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import MemberService from "../../services/MemberService";
import "../../../css/home.css";
import { Member } from "../../../lib/types/member";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularProducts: (data: Product[]) => dispatch(setPopularProducts(data)),
  setNewProducts: (data: Product[]) => dispatch(setNewProducts(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

export default function HomePage() {
  const { setPopularProducts, setNewProducts, setTopUsers } = actionDispatch(
    useDispatch()
  );

  useEffect(() => {
    // Backend server data fetch => Data
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
        // productCollection: ProductCollection.PROTEIN,
      })
      .then((data) => {
        setPopularProducts(data);
      })
      .catch((err) => {
        console.log("useEffect err", err);
      });

    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "createdAt",
        // productCollection: ProductCollection.DISH,
      })
      .then((data) => {
        {
          setNewProducts(data);
        }
      })
      .catch((err) => {
        console.log("useEffect err", err);
      });

    const member = new MemberService();
    member
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="homepage">
      {/* <Statistics /> */}
      <PopularProducts />
      <NewProducts />
      <ActiveUsers />
      <Events />
      <Adverstisement />
    </div>
  );
}
