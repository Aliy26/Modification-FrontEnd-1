import React from "react";
import { Box, Button, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import {
  sweetErrorHandling,
  sweetFailureProvider,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import ProductService from "../../services/ProductService";
import { Product } from "../../../lib/types/product";

interface BasketProps {
  cartItems: CartItem[];
  updateCartPrices: () => void;
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Basket(props: BasketProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    updateCartPrices,
  } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const itemsPrice = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0
  );
  const shippingCost: number = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const ids = cartItems.map((ele: CartItem) => ele._id);
  console.log(ids, "idsssss");
  const product = new ProductService();

  /** HANDLERS **/

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);

    await updateCartPrices();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const proceedOrderHandler = async () => {
    handleClose();
    try {
      if (!authMember) throw new Error(Messages.error2);
      if (!authMember.memberAddress || authMember.memberAddress.length < 5) {
        await sweetFailureProvider(
          "Please provide your address before making orders!"
        );

        history.push("/member-page");
        return false;
      }

      const productsHandler = async () => {
        const product = new ProductService();
        const results: Product[] = await Promise.all(
          ids.map(async (id: string) => {
            return await product.getProduct(id);
          })
        );

        console.log(results); // This will now be an array of Product objects
        const filteredItems = cartItems.filter((ele: CartItem) =>
          results
            .map((product: Product) => product.productLeftCount && product._id)
            .includes(ele._id)
        );

        const order = new OrderService();
        await order.createOrder(filteredItems);
        onDeleteAll();
        setOrderBuilder(new Date());
        history.push("/orders");
      };

      await productsHandler();
    } catch (err) {
      console.log("Error, orders", err);
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box className={"hover-line"}>
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge
          badgeContent={cartItems.length}
          color="primary"
          className="left-side"
        >
          <img
            src={"/icons/new-cart.svg"}
            alt="shopping-icon"
            className="shopping-cart"
          />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 52,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Stack className={"basket-frame"}>
          <Box className={"all-check-box"}>
            {cartItems.length === 0 ? (
              <div>Cart is empty!</div>
            ) : (
              <Stack flexDirection={"row"}>
                <div>Cart Products:</div>
                <DeleteForeverIcon
                  sx={{ ml: "5px", cursor: "pointer" }}
                  color={"primary"}
                  onClick={() => onDeleteAll()}
                />
              </Stack>
            )}
          </Box>

          <Box className={"orders-main-wrapper"}>
            <Box className={"orders-wrapper"}>
              {cartItems.map((item: CartItem) => {
                const imagePath = `${serverApi}/${item.image}`;
                return (
                  <Box
                    className={
                      item.leftCount && item.leftCount > 0
                        ? "basket-info-box"
                        : "out-of-stock"
                    }
                    key={item._id}
                  >
                    <img
                      src={imagePath}
                      className={"product-img"}
                      alt="product-image"
                    />
                    <span className={"product-name"}>
                      {item.name} {item.leftCount === 0 ? "Out of stock" : ""}
                    </span>

                    <div className="col-2">
                      <div className={"cancel-btn"}>
                        <span className={"product-price"}>
                          ${item.price} x {item.quantity}
                        </span>
                        <button
                          onClick={() => onRemove(item)}
                          className="remove"
                        >
                          -
                        </button>{" "}
                        <button onClick={() => onAdd(item)} className="add">
                          +
                        </button>
                        <CancelIcon
                          color={"primary"}
                          onClick={() => onDelete(item)}
                        />
                      </div>
                    </div>
                  </Box>
                );
              })}
            </Box>
          </Box>
          {cartItems.length !== 0 ? (
            <Box className={"basket-order"}>
              <span className={"price"}>
                Total: ${totalPrice} ({itemsPrice} + {shippingCost})
              </span>
              <Button
                onClick={proceedOrderHandler}
                startIcon={<ShoppingCartIcon />}
                variant={"contained"}
              >
                Order
              </Button>
            </Box>
          ) : (
            ""
          )}
        </Stack>
      </Menu>
    </Box>
  );
}
