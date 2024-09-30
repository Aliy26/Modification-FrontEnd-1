import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
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
import { CartItem } from "../../../lib/types/search";

/** Redux Slice & Selector */
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});
const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Protein(props: ProductsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
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

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
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
                  color={productSearch.sort === "asc" ? "primary" : "secondary"}
                  className={"order"}
                  onClick={() => searchOrderHandler("productPrice", "asc")}
                >
                  Price Up
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
      <div className="brands-logo">
        <Container className="family-brands">
          <Stack className="brand-list">
            <Box className={"category-title"}>Our Family Brands</Box>
            <Box className={"review-box"}>
              <img
                className="rest-logo"
                src={"/img/gurme.webp"}
                alt="rest-logo"
              />
              <img
                className="rest-logo"
                src={"/img/seafood.webp"}
                alt="rest-logo"
              />
              <img
                className="rest-logo"
                src={"/img/sweets.webp"}
                alt="rest-logo"
              />
              <img
                className="rest-logo"
                src={"/img/doner.webp"}
                alt="rest-logo"
              />
            </Box>
          </Stack>
        </Container>
      </div>
      <div className="address">
        <Container>
          <Stack className="address-area">
            <Box className={"title"}>Our Address</Box>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10318.676760234534!2d127.05146155758018!3d37.550703270493614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3a4c23b83eb%3A0xa27a76b786341663!2sD%20Museum!5e0!3m2!1sen!2skr!4v1720935785350!5m2!1sen!2skr"
              width="100%"
              height="570px"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
