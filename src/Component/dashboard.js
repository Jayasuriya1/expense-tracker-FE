import React, { useEffect, useState } from "react";
import BaseApp from "../BaseApp/baseApp";
import { AppState } from "../context/AppProvider";
import { useNavigate } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";

export default function Dashboard() {
  const { user, setUser, transactionData, setTransactionData } = AppState();
  const [totalRevenue, setTotalReveue] = useState(null);
  const [totalExpense, setTotalExpense] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [minIncome, setMinIncome] = useState(null);
  const [maxIncome, setMaxIncome] = useState(null);
  const [minExpense, setMinExpence] = useState(null);
  const [maxExpense, setMaxExpence] = useState(null);
  const [recentHistory, setRecentHistory] = useState(null);
  const [revenuePercentage, setRevenuePercentage] = useState(null);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("etUserId");
    localStorage.removeItem("etUserToken");
    navigate("/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("etUserToken")) {
      logout();
    } else {
      const getData = async (req, res) => {
        try {
          const id = localStorage.getItem("etUserId");
          const token = localStorage.getItem("etUserToken");
          const response = await fetch(
            `https://expense-tracker-shl5.onrender.com/user/profile/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await response.json();
          setUser(data.data);

          const response2 = await fetch(
            `https://expense-tracker-shl5.onrender.com/expense/data/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data2 = await response2.json();
          setTransactionData(data2.data);

          if (data.success == false) {
            logout();
          }
          if (data2.success == false) {
            logout();
          }
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }
  }, []);

  useEffect(() => {
    if (transactionData != (null || undefined)) {
      var totalExp = 0;
      var totalExpObject = [];
      var expAmoArr = [];
      const data1 = transactionData.map((data) => {
        if (data.category == "Expense") {
          totalExp = totalExp + data.amount;
          totalExpObject.push(data);
          expAmoArr.push(data.amount);
        }
      });
      const minExp = Math.min(...expAmoArr);
      const maxExp = Math.max(...expAmoArr);
      setTotalExpense(totalExp);
      setMinExpence(minExp);
      setMaxExpence(maxExp);

      var totalRev = 0;
      var totalRevObject = [];
      var revAmoArr = [];
      const data2 = transactionData.map((data) => {
        if (data.category == "Income") {
          totalRev = totalRev + data.amount;
          totalRevObject.push(data);
          revAmoArr.push(data.amount);
        }
      });
      const minInc = Math.min(...revAmoArr);
      const maxInc = Math.max(...revAmoArr);
      setTotalReveue(totalRev);
      setMaxIncome(maxInc);
      setMinIncome(minInc);

      var totalBal = totalRev - totalExp;
      setTotalBalance(totalBal);

      setRevenuePercentage(
        Math.floor((totalRev / (totalRev + totalExp)) * 100)
      );

      var sortedArray = transactionData.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      const recentHis = sortedArray.slice(0, 3);
      setRecentHistory(recentHis);
    }
  }, [transactionData]);

  return (
    <BaseApp>
      <h2 className="fw-bold pt-2 ps-4">Dashboard</h2>
      <div className="container-fluid">
        <div className="row ">
          <div className="col-8 ">
            <div className="d-flex mb-3 mt-2">
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: revenuePercentage, label: "Revenue" },
                      {
                        id: 1,
                        value: 100 - revenuePercentage,
                        label: "Expense",
                      },
                    ],
                  },
                ]}
                width={400}
                height={200}
              />
            </div>

            <div className="dashboard-net">
              <div>
                <h5> Total Revenue</h5>
                <p className="">
                  {totalRevenue != (null || undefined) ? totalRevenue : "0"}
                </p>
              </div>
              <div>
                <h5>Total Expense</h5>
                <p className="">
                  {totalExpense != (null || undefined) ? totalExpense : "0"}
                </p>
              </div>
            </div>
            <div className="dashboard-net-2">
              <h5>Total Balance</h5>
              <p
                style={
                  Math.sign(totalBalance) != -1
                    ? { color: "green" }
                    : { color: "Red" }
                }
              >
                {totalBalance != (null || undefined) ? totalBalance : "0"}
              </p>
            </div>
          </div>
          <div className="col-4">
            <h5>Recent History</h5>
            {recentHistory &&
              recentHistory.map((data, index) => {
                return (
                  <div key={index} className="doshboard-history-div">
                    <p>{data.description}</p>
                    <p
                      style={
                        data.category != "Income"
                          ? { color: "Red" }
                          : { color: "green" }
                      }
                    >
                      {data.amount}
                    </p>
                  </div>
                );
              })}
            <div className="min-max">
              <p className="fw-bold">min</p>
              <h4 className="text-center ">Income</h4>
              <p className="fw-bold">max</p>
            </div>
            <div className="doshboard-history-div">
              <p>{minIncome != (null || undefined) ? minIncome : "0"}</p>
              <p>{maxIncome != (null || undefined) ? maxIncome : "0"}</p>
            </div>

            <div className="min-max">
              <p className="fw-bold">min</p>
              <h4 className="text-center ">Expense</h4>
              <p className="fw-bold">max</p>
            </div>
            <div className="doshboard-history-div">
              <p>{minExpense != (null || undefined) ? minExpense : "0"}</p>
              <p>{maxExpense != (null || undefined) ? maxExpense : "0"}</p>
            </div>
          </div>
        </div>
      </div>
    </BaseApp>
  );
}
