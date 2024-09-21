import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectHomePage = (state: AppRootState) => state.homePage;

export const retrievePopularProducts = createSelector(
  selectHomePage,
  (HomePage) => HomePage.PopularProducts
);

export const retrieveNewProducts = createSelector(
  selectHomePage,
  (HomePage) => HomePage.NewProducts
);

export const retrieveTopUsers = createSelector(
  selectHomePage,
  (HomePage) => HomePage.topUsers
);
