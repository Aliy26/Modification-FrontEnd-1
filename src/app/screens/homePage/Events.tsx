import { Box, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product, ProductInquiry } from "../../../lib/types/product";
import ProductService from "../../services/ProductService";

SwiperCore.use([Autoplay, Navigation, Pagination]);

export default function Events() {
  const histroy = useHistory();
  const [limitedProducts, setLimitedProducts] = useState<Product[]>([]);

  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "productSoldCount",
    sort: "desc",
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

  const products = limitedProducts.filter((item: Product) => {
    return item.productSoldCount > 0;
  });

  return (
    <div className={"events-frame"}>
      <Stack className={"events-main"}>
        <Box className={"events-text"}>
          <span className={"category-title"}>Best Sellers</span>
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
          {products.map((value, number) => {
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
                        <strong className="strong-left">
                          {value.productName}
                        </strong>
                        <div className={"event-organizator"}>
                          <strong>{value.productSoldCount} items sold</strong>
                        </div>
                      </div>

                      <p className={"text-desc"}>{value.productDesc}</p>

                      <div className={"bott-info-main"}>
                        <div>
                          <img src={"/icons/calendar.svg"} alt="calendar" />
                          <p>{value.productStatus}</p>
                          <img src={"/icons/location.svg"} alt="button-info" />
                        </div>
                        <p className="price">${value.productPrice}</p>
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
