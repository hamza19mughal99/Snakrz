import React from 'react';
import PageTitleBar from "../../PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import RctCollapsibleCard from "../../RctCollapsibleCard/RctCollapsibleCard";
import './DataTable.css'
import MUIDataTable from "mui-datatables";
import {Button} from "react-bootstrap";

const DataTable = props => {
	const editRowHandler = (tableMeta) => {
		console.log(tableMeta.rowData)
	}
	const actions = {
		name: "Actions",
		options: {
			customBodyRender: (value, tableMeta, updateValue) => {
				return <i className="zmdi zmdi-edit" onClick={() => editRowHandler(tableMeta)} />
			},
		},
	}
	props.columns.push(actions);



	const onRowsSelect = (rowsSelectedData, allRows, rowsSelected) => {
		console.log("---RowSelect")
		const arr = [];
		rowsSelected.forEach((id) => {
			arr.push(props.data[id][0]);
		})
		console.log("All Selected: ", arr);
	}
	const options = {
		filterType: 'dropdown',
		responsive: "stacked",
		onRowSelectionChange: onRowsSelect,
	};
	return (
		<div className="data-table-wrapper">
			<PageTitleBar title={<IntlMessages id="sidebar.dataTable" />} match={props.match} />
			<RctCollapsibleCard heading="Data Table" fullBlock>
				<Button id={'dataTable__add'}>Add</Button>
				<MUIDataTable
					title={"Service list"}
					data={props.data}
					columns={props.columns}
					options={options}

				/>
			</RctCollapsibleCard>
		</div>
	);
};

export default DataTable;
