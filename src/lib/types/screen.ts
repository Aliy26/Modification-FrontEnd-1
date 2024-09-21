import { Member } from "./member";
import { Order } from "./order";
import { Product } from "./product";

// ** REACT APP STATE **//
export interface AppRootState {
  homePage: HomePageState;
  productsPage: ProductsPageState;
  ordersPage: OrdersPageState;
}

//** HOMEPAGE **/
export interface HomePageState {
  PopularProducts: Product[];
  NewProducts: Product[];
  topUsers: Member[];
}

//** PRODUCTS **/
export interface ProductsPageState {
  restaurant: Member | null;
  chosenProduct: Product | null;
  products: Product[];
}

//** ORDERS PAGE **/

export interface OrdersPageState {
  pausedOrders: Order[];
  processOrders: Order[];
  finishedOrders: Order[];
}
