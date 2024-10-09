import { createSlice } from '@reduxjs/toolkit'

const crudSlice = createSlice({
  name: 'crud',
  initialState: {
    cart: [],
    isCartOpen: false,
    queryString: null
  },
  reducers: {
    toggleCart (state) {
      state.isCartOpen = !state.isCartOpen
    },
    setCart (state, action) {
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
    }
  }
})

export const { toggleCart, setCart, applyFilter } = crudSlice.actions
export default crudSlice.reducer
