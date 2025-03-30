import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import OpinionAnalysisPage from './components/OpinionAnalysisPage'
import ModelRetrainingPage from './components/ModelRetrainingPage'

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/predict' element={<OpinionAnalysisPage />} />
          <Route path='/retrain' element={<ModelRetrainingPage />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App