import React from "react";
import BaseApp from "../BaseApp/baseApp";
import { DataGrid } from "@mui/x-data-grid";
import { AppState } from "../context/AppProvider";

export default function ViewTransaction() {
  const { transactionData, setTransactionData } = AppState();
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "description", headerName: "Title", width: 130 },
    { field: "amount", type: "number", headerName: "Amount", width: 130 },
    {
      field: "category",
      headerName: "Category",

      width: 100,
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
    },
    { field: "_id", headerName: "Transaction ID", width: 220 },
  ];

  if (transactionData != (null, undefined)) {
    var sortedArray = transactionData.sort(function (a, b) {
      console.log("a,b", a, b);
      return new Date(b.date) - new Date(a.date);
    });
    sortedArray = sortedArray.map((data, index) => {
      data.date = new Date(data.date).toLocaleDateString();
      return { ...data, id: `${index + 1}` };
    });
    console.log("sorted array", sortedArray);
  }

  return (
    <BaseApp>
      <h2 className="fw-bold pt-2 ps-4">View Transaction</h2>
      <div className="transaction-table">
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={sortedArray}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
      </div>
    </BaseApp>
  );
}
