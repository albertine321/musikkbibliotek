export default function Header() {

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <div className="text-2xl font-bold">
          Utstyrssystem
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button className="font-medium hover:underline">Button</button>
          <button className="font-medium hover:underline">Button</button>
          <button className="font-medium hover:underline">Button</button>
          <button className="font-medium hover:underline">Button</button>
          <button className="font-medium hover:underline">Button</button>
        </div>
       
      </nav>
    </header>
  );
}