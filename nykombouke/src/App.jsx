import './App.css';
import Page from './Page';
import Header from './Header';

function App() {
  return (
    <div className="App">
      <Header />
      
      <div style={{ 
        margin: '50px', 
        backgroundColor: '#110954ff', 
        borderRadius: '30px', 
        boxShadow: '0 10px 70px rgba(0, 0, 0, 0.5)',
        padding: '20px',
        height: 'calc(100vh - 100px)',  /* Nesten full skjermhøyde */
        minHeight: '600px'  /* Minimum høyde */
      }}>
        <Page />
      </div>
    </div>
  );
}

export default App;