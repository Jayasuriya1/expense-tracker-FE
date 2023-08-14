import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const userSchemaValidation = yup.object({
  email: yup.string().email().required("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is Rquired")
    .min(7, "Password cannot be less than 7 characters"),
});

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data) => {
        try {
          setLoading(true);
          await localStorage.removeItem("etUserId");
          await localStorage.removeItem("etUserToken");
          const response = await fetch(
            "https://expense-tracker-shl5.onrender.com/user/login",
            {
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          if (
            result.success == false &&
            result.message ==
              "Please Verify The Email. Verification Link Send To Your Mail Successfully"
          ) {
            handleClickOpen();
          }
          if (result.success == true) {
            localStorage.setItem("etUserToken", result.token);
            localStorage.setItem("etUserId", result.id);
            navigate("/dashboard");
          } else {
            toast.error(result.message);
          }
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      },
    });

  return (
    <div
      className="fluid-container    vh-100"
      style={{ backgroundColor: "#FEEFC3" }}
    >
      {loading ? (
        <Box sx={{ width: "100vw" }}>
          <LinearProgress />
        </Box>
      ) : (
        " "
      )}
      <div className=" vh-8 d-flex " style={{ padding: "10px 0 0 60px" }}>
        <box-icon
          color="#4b0dba"
          type="solid"
          size="lg"
          name="book-bookmark"
        ></box-icon>
        <h3 className="pt-2 fw-light">Expense Tracker</h3>
      </div>
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-6  mt-5">
          <h1 className="text-center fw-lighter">Track Your Expenses,</h1>
          <h1 className="text-center fw-light"> Achieve Financial Freedom!</h1>
          <span className="d-flex flex-column text-center">
            <p className="m-0 fw-bold">For Demo:</p>
            <p className="m-0 fw-light">Email: suriya@gmail.com</p>
            <p className="m-0 fw-light">password: user@123</p>
          </span>
        </div>

        <div className="col-12 col-md-6 mt-1 d-flex align-items-center justify-content-center">
          <div className="p-4 card p-4" style={{ width: "300px" }}>
            <h3 className="text-center mb-4">Login</h3>
            <form onSubmit={handleSubmit} className="pt-3">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  placeholder="Enter email"
                  className="form-control"
                  id="email"
                />
              </div>
              {touched.email && errors.email ? (
                <p style={{ color: "crimson" }}>{errors.email}</p>
              ) : (
                ""
              )}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  placeholder="Password"
                  className="form-control"
                  id="password"
                />
              </div>
              {touched.password && errors.password ? (
                <p style={{ color: "crimson" }}>{errors.password}</p>
              ) : (
                ""
              )}
              <button type="submit" className="btn btn-warning btn-block">
                Next
              </button>
            </form>
            <div className="mt-3 text-center">
              <a href="#forgot-password" className="text-muted">
                Forgot Password?
              </a>
            </div>
            <div className="mt-3 text-center">
              <span>Don't have an account? </span>
              <a href="#sign-up" className="text-warning">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"A verification link has send to your email account"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please click on the link that has just been sent to your email
            account to verify your email and continue the registration process.
            {"Note :"} Link valid for 15 minutes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Login;
