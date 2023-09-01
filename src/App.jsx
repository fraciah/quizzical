import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage  from "./components/StartPage";
import Questions from "./components/Questions";

function App() {

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/questions" element={<Questions />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
