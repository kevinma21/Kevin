import './App.css'
import NavBar from './components/NavBar';
import Intro from './components/Intro';
import Heading from './components/Heading';
import About from './components/About';
import Project from './components/Project';
import Footer from './components/Footer';
import { useRef } from 'react';

function App() {
  const ref = useRef(null);
  return (
    <div className="App">
      <div ref={ref} className="h-2 bg-[#0A0E0F]" />
      <NavBar ancestorRef={ref} />
      <div className='px-25' id="content">
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
