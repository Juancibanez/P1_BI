import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import NewsAnalysisPage from './components/NewsAnalysisPage'
import ModelRetrainingPage from './components/ModelRetrainingPage'

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/predict' element={<NewsAnalysisPage />} />
          <Route path='/retrain' element={<ModelRetrainingPage />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App