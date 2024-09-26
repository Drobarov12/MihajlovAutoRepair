import './App.css';
import Header from './Header';
import MainContent from './Main'; 
import AboutUs from './AboutUs'; 
import OurServices from './OurServices';
import WhyChooseUs from './WhyChoseUs';


function App() {
  return (
    <div className="App">
      <Header />
      <MainContent />
      <AboutUs />
      <OurServices />
      <WhyChooseUs />
    </div>
  );
}

export default App;
