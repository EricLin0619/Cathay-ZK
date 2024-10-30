import {useState, useEffect} from "react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import styles from "../style/navbar.module.css";

export default function Navbar() {
  const [activeItem, setActiveItem] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (pathname === '/') {
      setActiveItem('創建證明');
    } else if (pathname === '/genProof') {
      setActiveItem('生成證明');
    } else if (pathname === '/verifyProof') {
      setActiveItem('驗證證明');
    }
  }, []);

  return (
    <div className={` max-w-[80vw] navbar bg-slate-500 custom-border-radius custom-shadow fixed top-4 left-0 right-0 h-18 z-50 mx-auto transition-all duration-300 ${isScrolled ? 'bg-opacity-70 backdrop-blur-md' : ''}`}>
      <div className="navbar-start">
        {/* <a className="btn btn-ghost text-2xl">daisyUI</a> */}
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-xl flex gap-4">
          {['創建證明', '生成證明', '驗證證明'].map((item) => (
            <li key={item}>
              <Link
                href={
                  item === '創建證明' 
                    ? '/' 
                    : item === '生成證明' 
                      ? '/genProof' 
                      : item === '驗證證明' 
                        ? '/verProof'
                        : `/${item.toLowerCase()}`
                }
                className={`px-4 py-2 relative ${styles.nav_link} ${activeItem === item ? styles.active : ''}`}
                onClick={() => setActiveItem(item)}
              >
                {item}
              </Link>
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
