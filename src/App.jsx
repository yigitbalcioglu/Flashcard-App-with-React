import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Card from "./FlashCard/Card";
import DBController  from "./FlashCard/DBController"

function App() {
  return (
    <BrowserRouter>
      <Routes>
				<Route path='/' element={<Card />}/>
        <Route path="/add" element={<DBController />} />
		  </Routes>
    </BrowserRouter>
  );
}

export default App;
