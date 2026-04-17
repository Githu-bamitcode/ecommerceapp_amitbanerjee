import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  cart: { items: [], totalPrice: 0 },
  cartCount: 0, // <-- track number of items in cart
};

const productSlice = createSlice({
  name: "product",
  initialState: {
    addresses: [],
    selectedAddress: null, // currently chosen address
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
      // update cart count automatically whenever cart changes
      state.cartCount = state.cart?.items?.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
    },
    clearCart: (state) => {
      state.cart = { items: [], totalPrice: 0 };
      state.cartCount = 0;
    },

    //Address management
    addAddress: (state, action) => {
      if (!state.addresses) state.addresses = [];
      state.addresses.push(action.payload);
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (_, index) => index !== action.payload,
      );

      // Reset selected address if it was deleted
      if (state.selectedAddress === action.payload) {
        state.selectedAddress = null;
      }
    },
  },
});

export const {
  setProducts,
  setCart,
  clearCart,
  addAddress,
  setSelectedAddress,
  deleteAddress,
} = productSlice.actions;
export default productSlice.reducer;

{
  /*}
import { createSlice } from "@reduxjs/toolkit";
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    cart: [],
  },
  reducers: {
    //actions
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const { setProducts, setCart } = productSlice.actions;
export default productSlice.reducer;
*/
}
