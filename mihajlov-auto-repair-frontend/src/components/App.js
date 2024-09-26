import './App.css';
import Header from './Header';
import MainContent from './Main'; 
import AboutUs from './AboutUs'; 
import OurServices from './OurServices';


function App() {
  return (
    <div className="App">
      <Header />
      <MainContent />
      <AboutUs />
      <OurServices />
    </div>
  );
}

export default App;
