import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import EvaluatePage from './pages/EvaluatePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import { useState } from 'react';

function App() {
  const [lastResult, setLastResult] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <EvaluatePage
              onResult={(result, request) => {
                setLastResult(result);
                setLastRequest(request);
              }}
            />
          }
        />
        <Route
          path="/results"
          element={<ResultsPage result={lastResult} request={lastRequest} />}
        />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </>
  );
}

export default App;
