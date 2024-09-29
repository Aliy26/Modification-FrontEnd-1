import React from "react";
import { Box, Container, Stack } from "@mui/material";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from "@mui/joy/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewProducts } from "./selector";
import { serverApi } from "../../../lib/config";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { useHistory } from "react-router-dom";

/** REDUX SLICE & SELECTOR */

const newProductsRetriever = createSelector(
  retrieveNewProducts,
  (newProducts) => ({
    newProducts,
  })
);

export default function NewProducts() {
  const { newProducts } = useSelector(newProductsRetriever);
  const history = useHistory();
  const chosenProductHandler = (id: string) => {
    history.push(`/products/${id}`, { fromHome: true });
  };
  return (
    <div className="new-products-frame">
      <Container>
        <Stack className="main">
          <Box className="category-title">New Additions</Box>
          <Stack className="cards-frame">
            <CssVarsProvider>
              {newProducts.length !== 0 ? (
                newProducts.map((product) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;

                  return (
                    <Card
                      key={product._id}
                      variant="outlined"
                      className={"card"}
                      onClick={() => chosenProductHandler(product._id)}
                    >
                      <CardOverflow>
                        <AspectRatio ratio="1">
                          <img src={imagePath} alt="user-iamge" />
                        </AspectRatio>
                      </CardOverflow>

                      <CardOverflow variant="soft" className="product-detail">
                        <Stack className="info">
                          <Stack flexDirection={"row"}>
                            <Typography className={"title"}>
                              {product.productName}
                            </Typography>

                            <Typography className={"price"}>
                              ${product.productPrice}
                            </Typography>
                          </Stack>
                          <Stack>
                            <Typography className={"views"}>
                              {product.productViews}
                              <VisibilityIcon
                                sx={{ fontSize: 20, marginLeft: "5px" }}
                              />
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardOverflow>
                    </Card>
                  );
                })
              ) : (
                <Box className="no-data">New products are not available!</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
