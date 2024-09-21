import { createSlice } from "@reduxjs/toolkit";
import { HomePageState } from "../../../lib/types/screen";

const initialState: HomePageState = {
  PopularProducts: [],
  NewProducts: [],
  topUsers: [],
};

const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setPopularProducts: (state, action) => {
      state.PopularProducts = action.payload;
    },
    setNewProducts: (state, action) => {
      state.NewProducts = action.payload;
    },
    setTopUsers: (state, action) => {
      state.topUsers = action.payload;
    },
  },
});

export const { setPopularProducts, setNewProducts, setTopUsers } =
  homePageSlice.actions;

//  export const HomePageReducer = homePageSlice.reducer;

const HomePageReducer = homePageSlice.reducer;
export default HomePageReducer;
