import {useState, useEffect} from "react"

export default function Navbar() {
  const [activeItem, setActiveItem] = useState<string>('創建證明');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`navbar bg-slate-400 custom-border-radius shadow-lg fixed top-4 left-0 right-0 h-18 z-50 max-w-[1300px] mx-auto transition-all duration-300 ${isScrolled ? 'bg-opacity-70 backdrop-blur-md' : ''}`}>
      <div className="navbar-start">
        {/* <a className="btn btn-ghost text-2xl">daisyUI</a> */}
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-xl flex gap-4">
          {['創建證明', '生成證明', '驗證證明'].map((item) => (
            <li key={item}>
              <a
                className={`hover:bg-slate-500 px-4 py-2 ${activeItem === item ? 'border-b-2 border-white' : ''}`}
                onClick={() => setActiveItem(item)}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        {/* <a className="btn">Button</a> */}
      </div>
    </div>
  );
}
