import { Link, NavLink } from "react-router-dom";
import logotoko from "../assets/logotoko.png"

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <img src={logotoko} alt="Toko Online" className="brand-logo"/>
        </Link>

        <div className="search-box">
          <input placeholder="Search..." />
          <span>⌕</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/produk">🛒</NavLink>
        </nav>
      </div>
    </header>
  );
}