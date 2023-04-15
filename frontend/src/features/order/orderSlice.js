import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import orderItems from '../../../orderItems';
const initialState = {
	orderItems: orderItems,
	amount: 0,
	total: 0,
	isLoading: true,
};

const orderSlice = createSlice({
	name: 'order',
	initialState,
});

// console.log(orderSlice);

export default orderSlice.reducer;
