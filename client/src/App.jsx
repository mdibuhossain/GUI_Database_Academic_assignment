import { Routes, Route } from "react-router-dom";
import CreateTable from "./pages/CreateTable";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newtable" element={<CreateTable />} />
      </Routes>
    </>
  );
}

export default App;
