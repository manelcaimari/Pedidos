import { createSlice } from '@reduxjs/toolkit'

const crudSlice = createSlice({
  name: 'crud',
  initialState: {
    cart: [],
    isCartOpen: false,
    queryString: null,
    saleId: null,
    orderDetails: [],
    reference: null,
    customerDetails: {},
  },
  reducers: {
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen
    },
    setCart(state, action) {
      const newItem = action.payload
      const existingItem = state.cart.find(item => item.productId === newItem.productId)

      if (existingItem) {
        existingItem.quantity += newItem.quantity

        if (existingItem.quantity <= 0) {
          state.cart = state.cart.filter(item => item.productId !== newItem.productId)
        }
      } else if (newItem.quantity > 0) {
        state.cart.push(newItem)
      }
    },
    setQueryString: (state, action) => {
      state.queryString = action.payload
    },
    setSaleId: (state, action) => {
      state.saleId = action.payload
    },
    setOrderDetails(state, action) {
      state.orderDetails = action.payload
    },
    setReference(state, action) {
      state.reference = action.payload
    },
    setCustomerDetails(state, action) {
      console.log("Cliente recibido en el reducer:", action.payload)
      state.customerDetails = action.payload;
    }
  }
})

export const { toggleCart, setCart, setQueryString, setSaleId, setOrderDetails, setReference, setCustomerDetails } = crudSlice.actions
export default crudSlice.reducer
