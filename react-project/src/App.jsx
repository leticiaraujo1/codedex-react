import { useState } from 'react'
import './App.css'
import ProgressBar from './ProgressBar.jsx';

function App() {
  const [progress, setProgressCount] = useState(0)

  function updateProgress(){
    if (progress < 100){
      setProgressCount(progress + 10)
    }
  }

  return (
    <div className="container">
      <ProgressBar progress={progress} />
      <button className="progressButton" onClick={updateProgress}>Increase Progress</button>
    </div>
  )
}

export default App
