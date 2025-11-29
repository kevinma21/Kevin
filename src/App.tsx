import './App.css'
import NavBar from './components/NavBar';
import Intro from './components/Intro';
import Heading from './components/Heading';
import About from './components/About';

function App() {
  return (
    <div className="App">
      <NavBar />
      <div id="content">
        <Intro />
        <Heading headingName="about me" />
        <About />
      </div>
    </div>
  )
}

export default App
