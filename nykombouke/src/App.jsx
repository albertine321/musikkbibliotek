import './App.css';
import Page from './Page';

function App() {
  return (

<div className="App">
      {/* Dette er bakgrunnen rundt boksen */}
      <div style={{ padding: '0px', backgroundColor: '#110954ff', minHeight: '90vh', borderRadius: '30px', boxShadow: '0 10px 70px rgba(0, 0, 0, 0.5)' }}>
          <Page />
      </div>
    </div>
  );
}

export default App;