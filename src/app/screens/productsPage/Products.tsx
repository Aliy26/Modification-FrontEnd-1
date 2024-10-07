import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveRedIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowFrowardIcon from "@mui/icons-material/ArrowForward";
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
import ProductSwiper from "./ProductsSwiper";
import ProductAdverstisement from "./Advertisement";
import Statistics from "./Statistics";

/** Redux Slice & Selector */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

export default function Products() {
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 100,
    order: "createdAt",

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
    window.scrollTo(0, 0);
  }, []);

  //* HANDLERS* //

  const searchProductHandler = () => {
    productSearch.search = searchText;
    setProductSearch({ ...productSearch });
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const productsPageHandler = () => {
    history.push("/products");
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
          <Box className={"top-title"}>The Gatorade Shop</Box>
          <Stack className={"avatar-big-box"}>
            <img
              src="icons/gatorade.svg"
              alt="brand-logo"
              className="brand-logo"
              onClick={productsPageHandler}
            />
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
                  color="secondary"
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
                          <div>
                            <Button className={"view-btn"}>
                              <Badge
                                badgeContent={product.productViews}
                                color="secondary"
                                className="badge"
                              >
                                <RemoveRedIcon />
                              </Badge>
                            </Button>
                          </div>
                        </Stack>
                      </Stack>
                      <Box className={"product-desc"}>
                        <span className={"product-title"}>
                          {product.productName}
                        </span>
                        <div className="product-price">
                          ${product.productPrice}
                        </div>
                      </Box>
                    </Stack>
                  );
                })
              ) : (
                <Box className={"no-data"}>No Products in This Page</Box>
              )}
            </Stack>
          </Stack>
          <Stack className={"pagination-section"}>
            <Pagination
              count={
                products.length !== 0
                  ? productSearch.page + 1
                  : productSearch.page
              }
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: ArrowBackIcon,
                    next: ArrowFrowardIcon,
                  }}
                  {...item}
                  color={"secondary"}
                />
              )}
              onChange={paginationHandler}
            />
          </Stack>
        </Stack>
      </Container>
      <ProductSwiper />
      <ProductAdverstisement />
      <Statistics />
    </div>
  );
}
