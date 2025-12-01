import './App.css'
import NavBar from './components/NavBar';
import Intro from './components/Intro';
import Heading from './components/Heading';
import About from './components/About';
import Project from './components/Project';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <NavBar />
      <div id="content">
        <Intro />
        <Heading headingName="about me" />
        <About />
        <Heading headingName="stuff i made" />
        <Project />
        <Footer />
      </div>
    </div>
  )
}

export default App
