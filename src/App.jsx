import React, {useRef, useState} from 'react';
import './App.css';
import { NavBar, Home, Projects, About, Testimonials, Collaborations, Contact } from './Components/index';

function App() {
  const homeRef = useRef(null);
  const workRef = useRef(null);
  const aboutRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);
  const [selectedAboutPanel, setSelectedAboutPanel] = useState(0);

  const handleAboutPanelChange = (optionIndex) => {
    setSelectedAboutPanel(optionIndex);
  }

  return (
    <div className="App">
      <NavBar homeRef={homeRef} workRef={workRef} aboutRef={aboutRef} testimonialsRef={testimonialsRef} contactRef={contactRef} />
      <div ref={homeRef}><Home onSelectAboutOption={handleAboutPanelChange} aboutRef={aboutRef} projectsRef={workRef} testimonialsRef={testimonialsRef} /></div>
      <div ref={workRef}><Projects /></div>
      <div ref={aboutRef}><About selectedPanel={selectedAboutPanel} onSelectAboutOption={handleAboutPanelChange} contactRef={contactRef} /></div>
      <div ref={testimonialsRef}><Testimonials /></div>
      <Collaborations />
      <div ref={contactRef}><Contact /></div>
    </div>
  );
}

export default App;
