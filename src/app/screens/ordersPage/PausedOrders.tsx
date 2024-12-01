import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { T } from "../../../lib/types/common";
import {
  showSaveConfirmation,
  sweetErrorHandling,
  sweetFailureProvider,
  sweetTopSmallSuccessAlert,
  sweetTopSuccessAlert,
} from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";

/** REDUX SLICE & SELECTOR */
const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);

interface PausedOrdersProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { pausedOrders } = useSelector(pausedOrdersRetriever);

  //** HANDLERS **/

  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirm = await showSaveConfirmation(
        "Do you want to delete the order?"
      );
      if (confirm.isConfirmed) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBuilder(new Date());
        await sweetTopSmallSuccessAlert("Order is deleted!", 3000);
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const processOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (!authMember.memberAddress || authMember.memberAddress.length < 5)
        await sweetFailureProvider(
          "Please provide your address before making orders!"
        );
      // PAYMENT PROCESS

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      };
      const confirm = await showSaveConfirmation(
        "Do you want proceed with the payment?"
      );
      if (confirm.isConfirmed) {
        const order = new OrderService();
        await order.updateOrder(input);
        await sweetTopSuccessAlert("Order has been placed!", 1500);
        setValue("2");
        setOrderBuilder(new Date());
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <TabPanel value={"1"}>
      <Stack>
        {pausedOrders?.map((order: Order) => {
          return (
            <Box key={order._id} className={"order-main-box"}>
              <Box className={"order-box-scroll"}>
                {order?.orderItems.map((item: OrderItem) => {
                  const product: Product = order.productData.filter(
                    (ele: Product) => item.productId === ele._id
                  )[0];
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Box key={item._id} className={"orders-name-price"}>
                      <Box className={"dish-info"}>
                        <img
                          src={imagePath}
                          className={"order-dish-img"}
                          alt="order-name"
                        />
                        <p className={"title-dish"}>{product.productName}</p>
                      </Box>
                      <Box className={"price-box"}>
                        <p>{item.itemPrice}</p>
                        <img src={"/icons/close.svg"} alt="icons-close" />
                        <p>{item.itemQuantity}</p>
                        <img src="/icons/pause.svg" alt="icons-pause" />
                        <p style={{ marginLeft: "15px" }}>
                          {item.itemQuantity * item.itemPrice}
                        </p>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box className={"total-price-box"}>
                <Box className={"box-total"}>
                  <p>Product price</p>
                  <p>${order.orderTotal - order.orderDelivery}</p>
                  <img
                    src={"/icons/plus.svg"}
                    style={{ marginLeft: "20px" }}
                    alt="icons-plus"
                  />
                  <p>Delivery cost</p>
                  <p>${order.orderDelivery}</p>
                  <img
                    src={"/icons/pause.svg"}
                    style={{ marginLeft: "20px" }}
                    alt="icons-pause"
                  />
                  <p>Total</p>
                  <p>${order.orderTotal}</p>
                </Box>
                <Button
                  value={order._id}
                  variant="contained"
                  color="secondary"
                  className={"cancel-button"}
                  onClick={deleteOrderHandler}
                >
                  Cancel
                </Button>
                <Button
                  value={order._id}
                  variant="contained"
                  className={"pay-button"}
                  onClick={processOrderHandler}
                >
                  Payment
                </Button>
              </Box>
            </Box>
          );
        })}

        {!pausedOrders ||
          (pausedOrders.length === 0 && (
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"center"}
            >
              <img
                src="/icons/noimage-list.svg"
                style={{ width: 300, height: 300 }}
                alt="icons-noimage"
              />
            </Box>
          ))}
      </Stack>
    </TabPanel>
  );
}
