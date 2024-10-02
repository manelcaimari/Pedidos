import { configureStore } from '@reduxjs/toolkit'
import crudReducer from './crud-slice.js'

export const store = configureStore({
  reducer: {
    crud: crudReducer
  }
})
