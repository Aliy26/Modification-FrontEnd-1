import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setProducts } from "./slice";
import { createSelector } from "reselect";
import { retrieveProducts } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";

/** Redux Slice & Selector */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

export default function Protein() {
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 100,
    order: "createdAt",
    productCollection: ProductCollection.PROTEIN,
    search: "",
  });
  const [searchText, setSearchText] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      productSearch.search = "";
      setProductSearch({ ...productSearch });
    }
  }, [searchText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        history.push("/products");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  //* HANDLERS* //

  const searchOrderHandler = (order: string, sort: string = "") => {
    productSearch.page = 1;
    productSearch.order = order;
    productSearch.sort = sort;
    setProductSearch({ ...productSearch });
  };

  const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };

  const shopNavHandler = (link: string) => {
    history.push(`/products/${link}`);
  };

  const chosenProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className="products">
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack className={"section-title"}>
            <Box className={"red"}>
              <input
                type={"search"}
                className="input"
                name={"singleResearch"}
                placeholder="Type here"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchProductHandler();
                }}
              />
              <Button
                variant="contained"
                className="search-button"
                onClick={searchProductHandler}
              >
                Search <SearchIcon sx={{ ml: "10px" }} className="icon" />
              </Button>
            </Box>
          </Stack>
          <Stack className="avatar-big-box">
            <Stack className={"dishes-filter-box"}>
              <Box>
                <Button
                  color="secondary"
                  className="btn"
                  onClick={() => shopNavHandler("powders")}
                >
                  Powders
                </Button>
                <Button
                  color="secondary"
                  className="btn"
                  onClick={() => shopNavHandler("tablets")}
                >
                  Tablets
                </Button>
                <Button
                  color="primary"
                  className="btn"
                  onClick={() => shopNavHandler("protein")}
                >
                  Protein
                </Button>
                <Button
                  color="secondary"
                  className="btn"
                  onClick={() => shopNavHandler("bottles")}
                >
                  Bottles
                </Button>
                <Button
                  color="secondary"
                  className="btn"
                  onClick={() => shopNavHandler("equipments")}
                >
                  Equipment
                </Button>
              </Box>
              <Box>
                <Button
                  variant={"contained"}
                  color={
                    productSearch.order === "createdAt"
                      ? "primary"
                      : "secondary"
                  }
                  className={"order"}
                  onClick={() => searchOrderHandler("createdAt")}
                >
                  New
                </Button>
                <Button
                  variant={"contained"}
                  color={
                    productSearch.sort === "desc" ? "primary" : "secondary"
                  }
                  className={"order"}
                  onClick={() => searchOrderHandler("productPrice", "desc")}
                >
                  Price Down
                </Button>
                <Button
                  variant={"contained"}
                  color={productSearch.sort === "asc" ? "primary" : "secondary"}
                  className={"order"}
                  onClick={() => searchOrderHandler("productPrice", "asc")}
                >
                  Price Up
                </Button>

                <Button
                  variant={"contained"}
                  color={
                    productSearch.order === "productViews"
                      ? "primary"
                      : "secondary"
                  }
                  className={"order"}
                  onClick={() => searchOrderHandler("productViews")}
                >
                  Views
                </Button>
              </Box>
            </Stack>
          </Stack>

          <Stack className={"list-category-section"}>
            <Stack className={"product-category"}></Stack>

            <Stack className={"product-wrapper"}>
              {products.length !== 0 ? (
                products.map((product: Product) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;

                  return (
                    <Stack
                      key={product._id}
                      className={"product-card"}
                      onClick={() => chosenProductHandler(product._id)}
                    >
                      <Stack
                        className={"product-img"}
                        sx={{ backgroundImage: `url(${imagePath})` }}
                      >
                        <Stack className={"product-btns"}>
                          <Button className={"view-btn"}>
                            <Badge
                              badgeContent={product.productViews}
                              color="secondary"
                              className="badge"
                            >
                              <RemoveRedIcon
                                sx={{
                                  color:
                                    product.productViews === 0
                                      ? "gray"
                                      : "white",
                                }}
                              />
                            </Badge>
                          </Button>
                        </Stack>
                      </Stack>
                      <Box className={"product-desc"}>
                        <span className={"product-title"}>
                          {product.productName}
                        </span>
                        <div className="product-price">
                          <MonetizationOnIcon />
                          {product.productPrice}
                        </div>
                      </Box>
                    </Stack>
                  );
                })
              ) : (
                <Box className={"no-data"}>No Products Available</Box>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
