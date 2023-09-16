import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Component/login';
import Dashboard from './Component/dashboard';
import ViewTransaction from './Component/viewTransaction';
import AddTransaction from './Component/addTransaction';
import EditTransaction from './Component/editTransaction';
import ModifyTransaction from './Component/modifyTransaction';
import Register from './Component/register';
import EmailVerification from './Component/emailVerification';

function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/veiw/transaction" element={<ViewTransaction/>}/>
        <Route path="/add/transaction" element={<AddTransaction/>}/>
        <Route path="/edit/transaction" element={<EditTransaction/>}/>
        <Route path="/modify/transaction/:id" element={<ModifyTransaction/>}/>
        <Route path="/user/email/verification/:id" element={<EmailVerification/>}/>
        <Route path='*' element={<Navigate to="/login"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
