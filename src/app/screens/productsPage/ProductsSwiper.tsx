import { Box, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { createSelector, Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { setLimitedProducts } from "./slice";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { retrieveLimitedProducts } from "./selector";
import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";

SwiperCore.use([Autoplay, Navigation, Pagination]);

const actionDispatch = (dispatch: Dispatch) => ({
  setLimitedProducts: (data: Product[]) => dispatch(setLimitedProducts(data)),
});
const limitedProductsRetriever = createSelector(
  retrieveLimitedProducts,
  (limitedProducts) => ({
    limitedProducts,
  })
);

export default function ProductSwiper() {
  const { limitedProducts } = useSelector(limitedProductsRetriever);
  const histroy = useHistory();
  const { setLimitedProducts } = actionDispatch(useDispatch());
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "productLeftCount",
    sort: "asc",
    search: "",
  });

  useEffect(() => {
    const product = new ProductService();
    product
      .getProducts(productSearch)
      .then((data) => setLimitedProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  const chosenProductHandler = (id: string) => {
    histroy.push(`/products/${id}`);
  };

  const filteredProducts = limitedProducts.filter(
    (product) => product.productLeftCount <= 30
  );

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className={"events-frame"}>
      <Stack className={"events-main"}>
        <Box className={"events-text"}>
          <span className={"category-title"}>Limited Additions</span>
        </Box>

        <Swiper
          className={"events-info swiper-wrapper"}
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={15}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: true,
          }}
        >
          {filteredProducts.map((value, number) => {
            const imagePath = `${serverApi}/${value.productImages[0]}`;
            return (
              <SwiperSlide key={number} className={"events-info-frame"}>
                <div className={"events-img"} style={{ position: "relative" }}>
                  <img
                    src={imagePath}
                    className={"events-img"}
                    alt="plans"
                    style={{
                      borderRadius: "15px",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onClick={() => {
                      chosenProductHandler(value._id);
                    }}
                  />
                </div>
                <Box className={"events-desc"}>
                  <Box className={"events-bott"}>
                    <Box className={"bott-left"}>
                      <div className={"event-title-speaker"}>
                        <strong>{value.productName}</strong>
                      </div>

                      <p className={"text-desc"}>{value.productDesc}</p>

                      <div className={"bott-info"}>
                        <div className={"bott-info-main"}>
                          <img src={"/icons/calendar.svg"} alt="calendar" />
                          Order Now!
                        </div>
                        <div className={"bott-info-main"}>
                          <img
                            src={"/icons/clock-solid.svg"}
                            alt="button-info"
                          />
                          only {value.productLeftCount} left!
                        </div>
                      </div>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <Box className={"prev-next-frame"}>
          <img
            src={"/icons/arrow-right.svg"}
            className={"swiper-button-prev"}
            alt="swiper"
          />
          <div className={"dot-frame-pagination swiper-pagination"}></div>
          <img
            alt="swiper"
            src={"/icons/arrow-right.svg"}
            className={"swiper-button-next"}
            style={{ transform: "rotate(-180deg)" }}
          />
        </Box>
      </Stack>
    </div>
  );
}
