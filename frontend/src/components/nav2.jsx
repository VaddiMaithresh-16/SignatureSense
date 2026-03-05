import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import '../css/nav2.css'

function Nav2(){
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const closeDropdown = () => setIsOpen(false);

  const handleSignOut = (e) => {
    e.preventDefault();
    closeDropdown();
    localStorage.removeItem('sessionId');
    navigate('/');
  };

  return(
    <>
      <nav className="navbar navbar-expand-lg nav2nav">
        <div className="container">
          <Link className="navbar-brand navtitle" to={"/"}>Signature Sense</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNavDropdown" 
            aria-controls="navbarNavDropdown" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className={`nav-item dropdown nav2drop ${isOpen ? 'show' : ''}`} ref={dropdownRef}>
                <button 
                  type="button"
                  className={`nav-link dropdown-toggle text-light ${isOpen ? 'show' : ''}`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  style={{ background: 'transparent', border: 0, cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); setIsOpen(o => !o); }}
                >
                  Details
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${isOpen ? 'show' : ''}`}>
                  <li>
                    <Link 
                      className="dropdown-item text-dark" 
                      to="/profile"
                      onClick={closeDropdown}
                    >
                      Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-dark" 
                      style={{ 
                        border: 'none', 
                        background: 'none', 
                        width: '100%', 
                        textAlign: 'left', 
                        cursor: 'pointer',
                        padding: '0.5rem 1rem'
                      }}
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Nav2;