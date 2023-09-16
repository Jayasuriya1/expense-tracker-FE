import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BaseApp from "../BaseApp/baseApp";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import * as yup from "yup";
import { toast } from "react-toastify";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { AppState } from "../context/AppProvider";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const urlSchemaValidation = yup.object({
  description: yup
    .string()
    .required("Title is Required")
    .min(4, "Title cannot be less than 4 characters"),
  amount: yup.string().required("Amount is Required"),
  category: yup.string().required("category is Required"),
  date: yup.date().required("Data is Required"),
});

export default function ModifyTransaction(props) {
  const { id } = useParams();
  console.log("--id--", id);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [validate, setValidate] = useState(false);

  const { transactionData, setTransactionData } = AppState();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const filteredData = transactionData.find((data) => {
      return data._id == id;
    });
    setDescription(filteredData.description);
    setAmount(filteredData.amount);
    setCategory(filteredData.category);

    console.log("Filtered Data ", filteredData);
  }, []);

  const logout = () => {
    localStorage.removeItem("etUserId");
    localStorage.removeItem("etUserToken");
    navigate("/login");
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const getData = async () => {
    try {
      const id = localStorage.getItem("etUserId");
      const token = localStorage.getItem("etUserToken");
      const response = await fetch(`http://localhost:7002/expense/data/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setTransactionData(data.data);

      if (data.success == false) {
        toast.error(data.message);
        logout();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const update = async (e) => {
    e.preventDefault();
    if (description == "" || amount == "") {
      setValidate(true);
    } else {
      const data = {
        description,
        amount,
        category,
      };
      console.log("Output Data", data);
      const response = await fetch(
        `https://expense-tracker-shl5.onrender.com/expense/update/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log("result", result);
      if (result.success == true) {
        navigate("/edit/transaction");
        toast.success(result.message);
        handleClick();
        getData();
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <BaseApp>
      <h2 className="fw-bold pt-2 ps-4">Edit Transaction</h2>
      <form>
        <Container>
          <Row className="justify-content-center">
            <Col lg="8" className="pt-4">
              {validate ? (
                <p style={{ color: "crimson" }}>Please Fill All Section</p>
              ) : (
                ""
              )}
              <Form.Group className="mb-3 mt-3" controlId="formGroupEmail">
                <Form.Label style={{ fontWeight: "600" }}>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  name="description"
                  require
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
              <Row>
                <Col className="pb-2">
                  <Form.Label style={{ fontWeight: "600" }}>
                    Category
                  </Form.Label>
                  <Form.Select
                    value={category}
                    name="category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Income</option>
                    <option>Expense</option>
                  </Form.Select>
                </Col>
              </Row>

              <Form.Group className="mb-3 mt-3" controlId="formGroupEmail">
                <Form.Label style={{ fontWeight: "600" }}>Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Amount"
                  name="amount"
                  value={amount}
                  required="required"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Form.Group>
              <Button
                className="w-100"
                type="submit"
                onClick={(e) => update(e)}
                variant="contained"
              >
                Update
              </Button>
            </Col>
          </Row>
        </Container>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Transaction updated Successfully
        </Alert>
      </Snackbar>
    </BaseApp>
  );
}
