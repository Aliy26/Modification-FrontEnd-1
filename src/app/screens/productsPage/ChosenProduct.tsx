import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Stack,
  Box,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Divider from "../../components/divider";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setChosenProduct, setRestaurant } from "./slice";
import { createSelector } from "reselect";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { Product } from "../../../lib/types/product";
import { Member } from "../../../lib/types/member";
import { useHistory, useLocation, useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { Messages, serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import {
  showSaveConfirmation,
  sweetErrorHandling,
  sweetFailureProvider,
} from "../../../lib/sweetAlert";
import { SelectChangeEvent } from "@mui/material/Select";

const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: Member) => dispatch(setRestaurant(data)),
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});
const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({
    restaurant,
  })
);
const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({
    chosenProduct,
  })
);

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { productId } = useParams<{ productId: string }>();
  const { setRestaurant, setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);
  const [count, setCount] = useState<number>(1);
  const [itemName, setItemName] = useState<string>("");
  const history = useHistory<any>();
  const location = useLocation<any>();
  const [sticks, setSticks] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [saleCount, setSaleCount] = useState<number>(0);

  const handleChange = (event: SelectChangeEvent) => {
    setSticks(event.target.value);
  };

  const proceedOrderHandler = async (input: CartItem[]) => {
    try {
      if (!authMember) {
        await sweetFailureProvider("Please login first!");
        return false;
      } else if (
        !authMember?.memberAddress ||
        authMember.memberAddress.length < 5
      ) {
        await sweetFailureProvider(
          "Please provide your address before making orders!"
        );
        history.push("/member-page");
        return false;
      }

      const confirm = await showSaveConfirmation(
        `Do you want to purchase ${
          count > saleCount ? count : saleCount
        } of ${itemName}`
      );

      if (!authMember) {
        history.push("/");
        throw new Error(Messages.error2);
      }
      if (confirm.isConfirmed) {
        const order = new OrderService();
        const result = await order.createOrder(input);
        if (result) {
          setOrderBuilder(new Date());
          history.push("/orders");
        } else if (confirm.isDismissed) {
          return false;
        }
      }
    } catch (err) {
      console.log("Error, chosenProduct order", err);
      sweetErrorHandling(err).then();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (location.state?.fromHome) {
          history.push("/");
        } else {
          history.push("/products");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

  useEffect(() => {
    const product = new ProductService();
    product
      .getProduct(productId)
      .then((data) => {
        setChosenProduct(data);
        setItemName(data.productName);
        setPrice(data.productPrice);
        setCount(data.productPerSaleCount);
        setSaleCount(data.productPerSaleCount);
      })
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getRestaurnat()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));

    window.scrollTo(480, 480);
  }, []);

  if (!chosenProduct) return null;
  return (
    <div className={"chosen-product"}>
      <Box className={"title"}>Product Detail</Box>
      <Container className={"product-container"}>
        <Stack className={"chosen-product-slider"}>
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="swiper-area"
          >
            {chosenProduct?.productImages.map((ele: string, index: number) => {
              const imagePath = `${serverApi}/${ele}`;
              return (
                <SwiperSlide key={index}>
                  <img
                    className="slider-image"
                    src={imagePath}
                    alt="slider-image"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Stack>
        <Stack className={"chosen-product-info"}>
          <Box className={"info-box"}>
            <strong className={"product-name"}>
              {chosenProduct?.productName}
            </strong>
            <span className={"resto-name"}>{restaurant?.memberNick}</span>
            <span className={"resto-name"}>
              Contact: {restaurant?.memberPhone}
            </span>
            <Box className={"rating-box"}>
              <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
              <div className={"evaluation-box"}>
                <div className={"product-view"}>
                  <RemoveRedEyeIcon sx={{ mr: "10px" }} />
                  <span>{chosenProduct?.productViews}</span>
                </div>
              </div>
            </Box>
            <p className={"product-desc"}>
              {chosenProduct?.productDesc
                ? chosenProduct.productDesc
                : "No Description"}
            </p>

            <Box className="increment-or-basket">
              <Box className="plus-minus">
                <img
                  src="/icons/minus.svg"
                  alt="minus"
                  className="minus"
                  onClick={() => {
                    if (count === chosenProduct.productPerSaleCount)
                      return false;
                    setCount(count - 1);
                  }}
                />

                {chosenProduct.productCollection == "POWDER" ||
                chosenProduct.productCollection == "TABLET" ? (
                  <TextField
                    className="basic-input"
                    label="Outlined"
                    variant="outlined"
                    value={count}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^[0-9\b]+$/.test(value)) {
                        setCount(Number(value)); // Update with the user input
                      }
                    }}
                  />
                ) : (
                  <TextField
                    className="basic-input"
                    label="Outlined"
                    variant="outlined"
                    value={count}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^[0-9\b]+$/.test(value)) {
                        setCount(Math.max(Number(value), 1));
                      }
                    }}
                  />
                )}

                <img
                  src="/icons/increment.svg"
                  alt="increment"
                  className="increment"
                  onClick={() => {
                    setCount(count + 1);
                  }}
                />
              </Box>
              <Box className="cart">
                <img
                  src="/icons/new-cart.svg"
                  className="add-to-basket"
                  onClick={() => {
                    onAdd({
                      _id: chosenProduct._id,
                      quantity: count > saleCount ? count : saleCount,
                      name: chosenProduct.productName,
                      price: price * saleCount,
                      image: chosenProduct.productImages[0],
                    });
                    setCount(chosenProduct.productPerSaleCount);
                  }}
                />
              </Box>
            </Box>

            <Divider height="1" width="100%" bg="#000000" />
            <div className={"product-price"}>
              <span>Price: {price * count}</span>
            </div>
            <div className={"button-box"}>
              <Button
                className="buy-now"
                variant="contained"
                onClick={() => {
                  proceedOrderHandler([
                    {
                      _id: chosenProduct._id,
                      quantity: count > saleCount ? count : saleCount,
                      name: chosenProduct.productName,
                      price: price,
                      image: chosenProduct.productImages[0],
                    },
                  ]);
                }}
              >
                Buy Now{" "}
                <img
                  src="/img/greater.png"
                  alt="greater-than"
                  className="greater"
                />
              </Button>
            </div>
          </Box>
        </Stack>
      </Container>

      <Snackbar
        className="checkk"
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }} className="check">
          Product added to basket!
        </Alert>
      </Snackbar>
    </div>
  );
}
