import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <nav className="header-nav">
        
        <div className="header-logo">
          🎵 Musikkbibliotek
        </div>

        <div className="header-buttons">
          <button>Hjem</button>
          <button>Bibliotek</button>
          <button>Spillelister</button>
          <button>Favoritter</button>
          <button>Om</button>
        </div>
       
      </nav>
    </header>
  );
}