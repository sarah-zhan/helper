import { Table, Button, Checkbox } from 'antd';
import CopyText from '../copyText/CopyText';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckSquareOutlined } from '@ant-design/icons';

const ProductTable = props => {
	console.log('props.orderProductPrice', props.orderProductPrice);
	const [selectedVendorCost, setSelectedVendorCost] = useState(null);

	// Function to update an order product
	const handleVendorCostClick = vendorProduct => {
		console.log('vendorProduct', vendorProduct);
		setSelectedVendorCost(vendorProduct.vendor_cost);
		axios
			.post(
				`http://localhost:8080/order_products/${props.orderProductId}/edit/selected_supplier`,
				{
					selected_supplier_cost: vendorProduct.vendor_cost.toString(),
				}
			)
			.then(res => {
				console.log(res.data);
			})
			.catch(error => {
				console.error(error);
			});
	};

	const columns_by_sku = [
		{
			title: 'Manufacturer',
			dataIndex: 'brand_name',
			key: 'brand_name',
		},
		{
			title: 'SKU',
			dataIndex: 'sku',
			key: 'sku',
		},
		{
			title: 'Image',
			dataIndex: 'image',
			key: 'image',
			render: image => <img src={image} alt='Product' width='50' />,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			width: '30%',
		},
		{
			title: 'Price',
			dataIndex: 'price',
			key: 'price',
			render: price => {
				if (props.orderProductPrice) {
					return props.orderProductPrice;
				} else {
					return price;
				}
			},
		},
		{
      title: "Suggested Vendor",
      dataIndex: "vendorProducts",
      key: "lowest_cost",
      align: "center",
			width: '10%',
			render: (vendorProducts, record) => {
				const vendorsWithInventory = vendorProducts.filter(
					(vp) => vp.vendor_inventory > 0
				);
				if (vendorsWithInventory.length === 0) {
					return "-";
				}
				const minVendorProduct = vendorsWithInventory.reduce((min, curr) => {
					if (curr.vendor_cost < min.vendor_cost) {
						return curr;
					}
					return min;
				}, vendorsWithInventory[0]);
			
				const margin =
					((record.price - minVendorProduct.vendor_cost) / record.price) * 100;
	
			
				return (
					<div>
						<div>{minVendorProduct.vendor.name}</div>
						<div>{`$${minVendorProduct.vendor_cost}`}</div>
						<div> {`${margin.toFixed(0)}%`} </div>
						<Checkbox
							onChange={() => handleVendorCostClick(minVendorProduct)}
							style={{ color: 'green' }}
						/>
					</div>
				);
			},
			
    },
		{
			title: 'Vendor Name',
			dataIndex: 'vendorProducts',
			key: 'vendor_id',
			render: vendorProducts =>
				vendorProducts.map(vendorProduct => (
					<CopyText key={vendorProduct.id} text={vendorProduct.vendor.name} />
				)),
		},
		{
			title: 'Vendor Cost',
			dataIndex: 'vendorProducts',
			key: 'vendor_cost',
			render: vendorProducts =>
				vendorProducts.map(vendorProduct => (
					<div
						key={vendorProduct.id}
						style={{ display: 'flex', justifyContent: 'space-between' }}
					>
						<CopyText text={`${vendorProduct.vendor_cost}`}>
							<span style={{ marginRight: 8 }}>{`${vendorProduct.vendor_cost}`}</span>
						</CopyText>
						<Checkbox
							onChange={() => handleVendorCostClick(vendorProduct)}
							style={{ color: 'green' }}
						/>
					</div>
				)),
		},
		

		{
			title: 'Margin %',
			key: 'margin',
			render: record => {
				const { vendorProducts } = record;
				return vendorProducts.map(vendorProduct => {
					const { vendor_cost } = vendorProduct;
					const margin =
						((props.orderProductPrice - vendor_cost) /
							props.orderProductPrice) *
						100;
					const className = margin < 20 ? 'red-margin' : '';
					return (
						<CopyText
							key={vendorProduct.vendor_id}
							className={className}
							text={`${margin.toFixed(2)}%`}
						/>
					);
				});
			},
		},
		{
			title: 'Vendor Inventory',
			dataIndex: 'vendorProducts',
			key: 'vendor_inventory',
			render: vendorProducts =>
				vendorProducts.map(vendorProduct => (
					<div key={vendorProduct.id}>{vendorProduct.vendor_inventory}</div>
				)),
		},
		{
			title: 'Vendor SKU   ',
			dataIndex: 'vendorProducts',
			key: 'vendor_sku',
			render: vendorProducts =>
				vendorProducts.map(vendorProduct => (
					<div key={vendorProduct.id}>{vendorProduct.vendor_sku}</div>
				)),
		},
	];

	return (
		<div>
			<Table
				dataSource={props.data}
				columns={columns_by_sku}
				rowKey='sku'
				pagination={false}
			/>
		</div>
	);
};

export default ProductTable;
