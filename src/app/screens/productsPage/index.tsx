import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ChosenProduct from "./ChosenProduct";
import Products from "./Products";
import Tablets from "./Tablets";
import Bottles from "./Bottles";
import Powders from "./Poweders";
import Protein from "./Protein";
import Equipments from "./Equipments";
import { CartItem } from "../../../lib/types/search";
import "../../../css/products.css";
import Statistics from "./Statistics";
import ProductAdverstisement from "./Advertisement";

interface ProductsPageProps {
  onAdd: (item: CartItem) => void;
}

export default function ProductsPage(props: ProductsPageProps) {
  const { onAdd } = props;
  const products = useRouteMatch();

  return (
    <div className="products-page">
      <Switch>
        <Route path={`${products.path}/powders`}>
          <Powders />
        </Route>
        <Route path={`${products.path}/tablets`}>
          <Tablets />
        </Route>
        <Route path={`${products.path}/protein`}>
          <Protein />
        </Route>
        <Route path={`${products.path}/bottles`}>
          <Bottles />
        </Route>
        <Route path={`${products.path}/equipments`}>
          <Equipments />
        </Route>
        <Route path={`${products.path}/:productId`}>
          <ChosenProduct onAdd={onAdd} />
        </Route>
        <Route path={`${products.path}`}>
          <Products />
        </Route>
      </Switch>
    </div>
  );
}
