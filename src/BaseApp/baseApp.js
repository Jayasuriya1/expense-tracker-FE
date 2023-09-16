import React from "react";
import "boxicons";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

export default function BaseApp({ children }) {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("etUserId");
    localStorage.removeItem("etUserToken");
    navigate("/login");
  };
  return (
    <div className="">
      <div className="header"></div>
      <div className="main-container">
        <div className="side-bar">
          <div className="title-icon">
            <box-icon
              color="#4b0dba"
              type="solid"
              size="lg"
              name="book-bookmark"
            ></box-icon>
          </div>
          <div
            className="sidebar-button-container"
            onClick={() => navigate("/dashboard")}
          >
            <box-icon type="solid" size="md" name="dock-top"></box-icon>
            <p>Dashboard</p>
          </div>
          <div
            className="sidebar-button-container"
            onClick={() => navigate("/veiw/transaction")}
          >
            <box-icon name="list-ul" size="md"></box-icon>
            <p>View Transaction</p>
          </div>
          <div
            className="sidebar-button-container"
            onClick={() => navigate("/add/transaction")}
          >
            <box-icon name="transfer" size="md"></box-icon>
            <p>Add Transaction</p>
          </div>
          <div
            className="sidebar-button-container"
            onClick={() => navigate("/edit/transaction")}
          >
            <box-icon type='solid' size="md" name='edit'></box-icon>
            <p>Edit Transaction</p>
          </div>
          <div className="sidebar-button-container" onClick={logOut}>
            <box-icon name="log-out" size="md"></box-icon>
            <p>Log Out</p>
          </div>
        </div>
        <div className="content-container">
          <div className="headers">
            <div className="header-container">
              <Avatar
                className="avatar"
                sx={{ bgcolor: deepOrange[500] }}
              ></Avatar>
              <h3>Jayasuriya</h3>
            </div>
          </div>
          <div className=" children-container">{children}</div>
        </div>
      </div>
    </div>
  );
}
