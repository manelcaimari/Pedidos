import { createSlice } from '@reduxjs/toolkit'

const crudSlice = createSlice({
  name: 'crud',
  initialState: {
    cart: [],
    isCartOpen: false
  },
  reducers: {
    toggleCart (state) {
      state.isCartOpen = !state.isCartOpen
    },

    setCart (state, action) {
      const newItem = action.payload
      const existingItem = state.cart.find(item => item.id === newItem.id)

      if (existingItem) {
        existingItem.quantity += newItem.quantity

        if (existingItem.quantity <= 0) {
          state.cart = state.cart.filter(item => item.id !== newItem.id)
        }
      } else if (newItem.quantity > 0) {
        state.cart.push({
          id: newItem.id,
          ...newItem,
          quantity: newItem.quantity || 1
        })
      }
    }
  }
})

export const { toggleCart, setCart } = crudSlice.actions
export default crudSlice.reducer
