import { createSlice } from '@reduxjs/toolkit'

export const crudSlice = createSlice({
  name: 'crud',
  initialState: {
    formElement: {
      data: null
    },
    tableEndpoint: null,
    queryString: null,
    visualSaleElement: {
      data: null
    },
    saleDetails: null,
    saleId: null
  },
  reducers: {
    showFormElement: (state, action) => {
      state.formElement = action.payload
    },
    refreshTable: (state, action) => {
      state.tableEndpoint = action.payload
    },
    applyFilter: (state, action) => {
      state.queryString = action.payload
    },
    showVisualSaleElement: (state, action) => {
      state.visualSaleElement = action.payload
    },
    setSaleDetails: (state, action) => {
      state.saleDetails = action.payload
    },
    setSaleId: (state, action) => {
      state.saleId = action.payload
    }
  }
})

export const {
  showFormElement,
  refreshTable,
  applyFilter,
  showVisualSaleElement,
  setSaleDetails,
  setSaleId
} = crudSlice.actions

export default crudSlice.reducer
