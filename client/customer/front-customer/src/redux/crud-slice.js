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
    applyFilter: (state, action) => {
      state.queryString = action.payload
    },
    setSaleId: (state, action) => {
      state.saleId = action.payload
    },
    setOrderDetails(state, action) {
      state.orderDetails = action.payload
    },
    setReference(state, action) {
      state.reference = action.payload;
    },
    updateProductQuantity(state, action) {
      const { productId, change } = action.payload;

      if (!productId || typeof change !== 'number') {
        console.error('Payload no válido en updateProductQuantity:', action.payload)
        return
      }
      const existingProduct = state.orderDetails.find(item => item.productId === productId)

      if (existingProduct) {

        existingProduct.quantity += change
        if (existingProduct.quantity <= 0) {
          state.orderDetails = state.orderDetails.filter(item => item.productId !== productId)
        }
      }
    }

  }
})

export const { toggleCart, setCart, applyFilter, setSaleId, setOrderDetails, setReference, updateProductQuantity } = crudSlice.actions
export default crudSlice.reducer
