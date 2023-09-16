import React, { useState } from "react";
import BaseApp from "../BaseApp/baseApp";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router-dom";
import { AppState } from "../context/AppProvider";

const urlSchemaValidation = yup.object({
  description: yup
    .string()
    .required("Title is Required")
    .min(4, "Title cannot be less than 4 characters"),
  amount: yup.string().required("Amount is Required"),
  category: yup.string().required("category is Required"),
  date: yup.date().required("Data is Required"),
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddTransaction() {
  const { setTransactionData } = AppState();
  const navigate = useNavigate();
  const userId = localStorage.getItem("etUserId");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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

  const getData = async (req, res) => {
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

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        description: "",
        amount: "",
        category: "Expense",
        date: "",
      },
      validationSchema: urlSchemaValidation,
      onSubmit: async (data, { resetForm }) => {
        try {
          setLoading(true);

          const response = await fetch(
            `https://expense-tracker-shl5.onrender.com/expense/create/${userId}`,
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          if (result.success == true) {
            resetForm();
            handleClick();
            getData();
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      },
    });
  return (
    <BaseApp>
      {loading ? (
        <Box sx={{ width: "100vw" }}>
          <LinearProgress />
        </Box>
      ) : (
        " "
      )}
      <h2 className="fw-bold pt-2 ps-4">Add Transaction</h2>
      <form onSubmit={handleSubmit}>
        <Container>
          <Row className="justify-content-center">
            <Col lg="8" className="pt-4">
              <Form.Group className="mb-3 mt-3" controlId="formGroupEmail">
                <Form.Label style={{ fontWeight: "600" }}>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Title"
                  name="description"
                  value={values.description}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.description && errors.description ? (
                  <p style={{ color: "crimson" }}>{errors.description}</p>
                ) : (
                  ""
                )}
              </Form.Group>
              <Row>
                <Col className="pb-2">
                  <Form.Label style={{ fontWeight: "600" }}>
                    Category
                  </Form.Label>
                  <Form.Select
                    value={values.category}
                    name="category"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  >
                    <option>Income</option>
                    <option>Expense</option>
                  </Form.Select>
                </Col>

                <Col className="pb-2">
                  <Form.Label style={{ fontWeight: "600" }}>Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Date"
                    name="date"
                    value={values.date}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.date && errors.date ? (
                    <p style={{ color: "crimson" }}>{errors.date}</p>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>

              <Form.Group className="mb-3 mt-3" controlId="formGroupEmail">
                <Form.Label style={{ fontWeight: "600" }}>Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Amount"
                  name="amount"
                  value={values.amount}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {touched.amount && errors.amount ? (
                  <p style={{ color: "crimson" }}>{errors.amount}</p>
                ) : (
                  ""
                )}
              </Form.Group>
              <Button className="w-100" type="submit" variant="contained">
                Create
              </Button>
            </Col>
          </Row>
        </Container>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Transaction Created Successfully
        </Alert>
      </Snackbar>
    </BaseApp>
  );
}
