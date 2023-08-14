import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Component/login';
import Dashboard from './Component/dashboard';
import ViewTransaction from './Component/viewTransaction';
import AddTransaction from './Component/addTransaction';

function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
        <Route exact path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/veiw/transaction" element={<ViewTransaction/>}/>
        <Route path="/add/transaction" element={<AddTransaction/>}/>
        <Route path='*' element={<Navigate to="/login"/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
