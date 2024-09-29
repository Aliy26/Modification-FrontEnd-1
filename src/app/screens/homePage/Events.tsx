import { Box, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { plans } from "../../../lib/data/plans";
import { createSelector } from "@reduxjs/toolkit";
import { retrieveNewProducts } from "./selector";
import { useSelector } from "react-redux";
import { serverApi } from "../../../lib/config";

SwiperCore.use([Autoplay, Navigation, Pagination]);

const newProductsRetriever = createSelector(
  retrieveNewProducts,
  (newProducts) => ({
    newProducts,
  })
);

export default function Events() {
  const { newProducts } = useSelector(newProductsRetriever);
  return (
    <div className={"events-frame"}>
      <Stack className={"events-main"}>
        <Box className={"events-text"}>
          <span className={"category-title"}>Events</span>
        </Box>

        <Swiper
          className={"events-info swiper-wrapper"}
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={30}
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
          {newProducts.map((value, number) => {
            const imagePath = `${serverApi}/${value.productImages[0]}`;
            return (
              <SwiperSlide key={number} className={"events-info-frame"}>
                <div className={"events-img"}>
                  <img src={imagePath} className={"events-img"} alt="plans" />
                </div>
                <Box className={"events-desc"}>
                  <Box className={"events-bott"}>
                    <Box className={"bott-left"}>
                      <div className={"event-title-speaker"}>
                        <strong>{value.productName}</strong>
                        <div className={"event-organizator"}>
                          <img src={"/icons/speaker.svg"} alt="plans" />
                          <p className={"spec-text-author"}>
                            {value.productName}
                          </p>
                        </div>
                      </div>

                      <p className={"text-desc"}> {value.productDesc} </p>

                      <div className={"bott-info"}>
                        <div className={"bott-info-main"}>
                          <img src={"/icons/calendar.svg"} alt="calendar" />
                          {value.productStatus}
                        </div>
                        <div className={"bott-info-main"}>
                          <img src={"/icons/location.svg"} alt="button-info" />
                          {value.productDesc}
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
