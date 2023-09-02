import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage  from "./components/StartPage";
import Questions from "./components/Questions";
import { useState } from "react";

function App() {
  const [quizFinished, setQuizFinished] = useState(false);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/questions" element={<Questions quizFinished={quizFinished}
                                                        setQuizFinished={setQuizFinished}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
