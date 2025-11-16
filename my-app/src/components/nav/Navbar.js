import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { PiShoppingCartThin } from "react-icons/pi";
import { AuthSessionContext } from "../../Context/SessionProvider";
import { VscChromeClose } from "react-icons/vsc";
import { RxHamburgerMenu } from "react-icons/rx";
import { ProductContext } from "../../Context/ProductContext";
import { IoSearchOutline } from "react-icons/io5";
import { GoPerson } from "react-icons/go";
import { CartContext } from "../../Context/CartContext";
import { ProductsApiContext } from "../../Context/ProductsContext";

export default function Navbar() {
  let totalQty = 0;
  const { pathname } = useLocation();
  const { session } = useContext(AuthSessionContext);
  const { categories, getCategories } = useContext(ProductContext);
  const [query, setQuery] = useState("");
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const { cartItems } = useContext(CartContext);
  const { setPrice, setCategoryID, setCurrentPage, setMessage } =
    useContext(ProductsApiContext);

  const [isClicked, setIsClicked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const newParams = new URLSearchParams(searchParams);

  const urlCategory = searchParams.get("categoryID") || "";

  const nav = useNavigate();

  useEffect(() => {
    getCategories();

    if (isSearchClicked) {
      searchInputRef.current?.focus();
    }

    if (window.location.pathname === "/checkout") {
      setIsCheckOut(true);
    } else {
      setIsCheckOut(false);
    }

    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [window.location.pathname, isSearchClicked]);

  const isOpen = () => {
    setIsClicked(true);
  };

  const isClose = () => {
    setIsClicked(false);
    setIsSearchClicked(false);
  };

  const openSearchInput = () => {
    setIsSearchClicked(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query) {
      setCategoryID("");
      setPrice(0);

      nav(`/search?query=${query}`);
    }

    setIsSearchClicked(false);
  };

  const toggleDropdown = (state) => {
    setIsDropdownOpen(state);
  };

  const kl = () => {
    setPrice(0);
    setCategoryID("");
    setCurrentPage(1);
    setMessage("")
  };

  return (
    <header className={`${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-content-wrapper">
          <div
            onClick={isClose}
            className="nav-logo-img">
            <Link to={`/`}>
              <img src="/sound.png" />
            </Link>
          </div>

          <nav className={isClicked ? "active-menu" : ""}>
            <ul onClick={isClose}>
              <li
                className="headphones-link-container"
                onMouseEnter={() => toggleDropdown(true)}
                onMouseLeave={() => toggleDropdown(false)}
              >
                <Link className="headphones-link" to="">
                  Hörlurar
                </Link>

                <ul
                  className={`dropdown-links ${isDropdownOpen ? "visible" : ""
                    }`}
                >
                  <li>
                    <Link
                      to={`/products`}
                      onClick={() => {
                        toggleDropdown(false);
                        kl();
                      }}
                    >
                      Alla hörlurar
                    </Link>
                  </li>
                  {categories.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/products/${item.id}/cat/${item.category}`}
                        onClick={() => {
                          toggleDropdown(false);
                          kl();
                        }}
                      >
                        {item.category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>

        <div className="navbar-icons-wrapper">
          {isSearchClicked ? (
            <>
              <div
                className={isSearchClicked ? "search-input-container" : ""}
                style={{ zIndex: "999" }}
              >
                <form onSubmit={handleSubmit}>
                  <input
                    type="search"
                    placeholder="Sök"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    ref={searchInputRef}
                  />
                  <VscChromeClose
                    className="close-search-input-icon"
                    onClick={isClose}
                  />
                </form>
              </div>
            </>
          ) : (
            <>
              {isCheckOut ? (
                ""
              ) : (
                <>
                  <div className="grapper">
                    {isClicked ? (
                      ""
                    ) : (
                      <>
                        <IoSearchOutline
                          className="search-icon"
                          onClick={openSearchInput}
                        />
                      </>
                    )}
                    <div onClick={isClose}>
                      {session ? (
                        <div>
                          <Link to={`/profile`}>
                            <GoPerson />
                          </Link>
                        </div>
                      ) : (
                        <div>
                          <Link to={`/signin`}>
                            <GoPerson />
                          </Link>
                        </div>
                      )}
                    </div>
                    <Link
                    onClick={isClose} 
                    className="cart-icon" 
                    to={`/cart`}>
                      <PiShoppingCartThin />
                      <p className="qty-wrapper">
                        {cartItems && cartItems.length > 0
                          ? cartItems.forEach((qty) => {
                            totalQty += qty.quantity;
                            return totalQty;
                          })
                          : ""}
                        {totalQty}
                      </p>
                    </Link>
                  </div>
                </>
              )}

              {isClicked ? (
                <VscChromeClose className="close" onClick={isClose} />
              ) : (
                <RxHamburgerMenu className="open" onClick={isOpen} />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
