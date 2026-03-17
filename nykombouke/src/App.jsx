import './App.css';
import Page from './Page';
import Header from './Header';
import Footer from './Footer';
import Personvern from './Personvern';

function App() {
  if (window.location.pathname === '/personvern') {
    return <Personvern />;
  }

  return (
    <div className="App">
      <Header />
      
      <div style={{ 
        margin: '50px', 
        backgroundColor: '#110954ff', 
        borderRadius: '30px', 
        boxShadow: '0 10px 70px rgba(0, 0, 0, 0.5)',
        padding: '20px',
        height: 'calc(100vh - 100px)',
        minHeight: '600px'
      }}>
        <Page />
      </div>
      <Footer />
    </div>
  );
}

export default App;