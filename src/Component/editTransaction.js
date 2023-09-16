import React, { useState } from "react";
import BaseApp from "../BaseApp/baseApp";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate } from "react-router-dom";
import { AppState } from "../context/AppProvider";

export default function EditTransaction() {
  const { transactionData, setTransactionData } = AppState();
  const navigate = useNavigate();
  const [transactionId, setTransactionId] = useState(null);

  const logout = () => {
    localStorage.removeItem("etUserId");
    localStorage.removeItem("etUserToken");
    navigate("/login");
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

  const modify = () => {
    console.log("modify", transactionId);
    console.log("data", transactionData);
    const search = transactionData.filter((data) => {
      return data._id == transactionId;
    });
    console.log("search", search);
    if (search.length != 0) {
      navigate(`/modify/transaction/${search[0]._id}`);
    }
    if (search.length == 0) {
      toast.error("Please Check the Transaction ID");
    }
  };
  return (
    <BaseApp>
      <h2 className="fw-bold pt-2 ps-4">Edit Transaction</h2>
      <form>
        <Container>
          <Row className="justify-content-center">
            <Col lg="8" className="pt-4">
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Enter Your Transaction ID"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  onChange={(e) => setTransactionId(e.target.value)}
                />
                <InputGroup.Text id="basic-addon2" onClick={() => modify()}>
                  Search
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </form>
    </BaseApp>
  );
}
