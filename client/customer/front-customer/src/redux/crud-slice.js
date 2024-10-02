import { createSlice } from '@reduxjs/toolkit'

const crudSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload)
      state.total += action.payload.price * action.payload.quantity
    },
    removeItem: (state, action) => {
      const item = state.items[action.payload]
      state.total -= item.price * item.quantity
      state.items.splice(action.payload, 1)
    },
    updateItemQuantity: (state, action) => {
      const { index, quantity } = action.payload
      const item = state.items[index]
      state.total += item.price * (quantity - item.quantity)
      item.quantity = quantity
    }
  }
})

export const { addItem, removeItem, updateItemQuantity } = crudSlice.actions
export default crudSlice.reducer
