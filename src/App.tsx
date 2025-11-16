import './App.css'
import NavBar from './components/NavBar';
import Intro from './components/Intro';

function App() {
  return (
    <div className="App">
      <NavBar />
      <div id="content">
        <Intro />
      </div>
    </div>
  )
}

export default App
