import { useState, useCallback } from "react";
import {
  Search,
  UserRound,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  Coins,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MobileSidebar from "./MobileSidebar";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout, showToast } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { sidePadding } = useWindowWidth();
  const isTablet = sidePadding === "40px";
  const navigate = useNavigate();

  const ghostPill = (hover) => ({
    backgroundColor: hover ? "rgba(36,168,245,0.08)" : "transparent",
    border: `1px solid ${hover ? "#24A8F5" : "#1B2333"}`,
    borderRadius: "6px",
    padding: "7px 12px",
    gap: "7px",
    transition: "all 0.18s ease",
    boxShadow: hover ? "0 0 14px rgba(36,168,245,0.22)" : "none",
  });

  const ghostLabel = (hover) => ({
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 600,
    color: hover ? "#F5F7FA" : "#AAB3C5",
    transition: "color 0.18s ease",
  });

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    showToast("Sesión cerrada correctamente");
    navigate("/");
  };

  const mobileSearchRef = useCallback((node) => {
    node?.focus();
  }, []);

  const handleDesktopSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchTerm("");
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    const q = mobileSearchTerm.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setMobileSearchOpen(false);
    setMobileSearchTerm("");
  };

  return (
    <>
      {/* ── Mobile Navbar ── */}
      <nav
        className="flex md:hidden items-center w-full"
        style={{
          backgroundColor: "#060810",
          height: "56px",
          padding: "0 16px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {mobileSearchOpen ? (
          /* ── Mobile search bar mode ── */
          <form
            onSubmit={handleMobileSearch}
            className="flex items-center w-full"
            style={{ gap: "8px" }}
          >
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen(false);
                setMobileSearchTerm("");
              }}
              className="flex items-center justify-center border-none cursor-pointer"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "transparent",
                borderRadius: "8px",
                flexShrink: 0,
              }}
            >
              <X size={20} color="#AAB3C5" />
            </button>
            <input
              ref={mobileSearchRef}
              type="text"
              value={mobileSearchTerm}
              onChange={(e) => setMobileSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              style={{
                flex: 1,
                backgroundColor: "#1E2232",
                border: "none",
                borderRadius: "20px",
                padding: "8px 14px",
                color: "#F5F7FA",
                fontFamily: "Poppins",
                fontSize: "13px",
              }}
            />
            <button
              type="submit"
              className="flex items-center justify-center border-none cursor-pointer"
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "transparent",
                borderRadius: "8px",
                flexShrink: 0,
              }}
            >
              <Search size={20} color="#24A8F5" />
            </button>
          </form>
        ) : (
          /* ── Mobile normal mode ── */
          <>
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/images/logo.png"
                alt="Sharkware Gaming"
                style={{ height: "48px", width: "auto", display: "block" }}
              />
            </Link>

            <div className="flex-1" />

            <div className="flex items-center" style={{ gap: "4px" }}>
              <button
                onClick={() => setMobileSearchOpen(true)}
                onMouseEnter={() => setHoveredBtn("search")}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center justify-center border-none cursor-pointer"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor:
                    hoveredBtn === "search" ? "#1E2232" : "transparent",
                  borderRadius: "8px",
                  transition: "background-color 0.15s ease",
                }}
              >
                <Search size={20} color="#AAB3C5" />
              </button>

              {user ? (
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center justify-center border-none cursor-pointer"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: userMenuOpen ? "#1E2232" : "transparent",
                      borderRadius: "8px",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <UserRound size={20} color="#24A8F5" />
                  </button>
                  {userMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "42px",
                        right: 0,
                        backgroundColor: "#1E2232",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        minWidth: "160px",
                        border: "1px solid #1B2333",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#F5F7FA",
                          fontFamily: "Poppins",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {user.name}
                      </span>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            background: "transparent",
                            border: "1px solid #24A8F5",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            color: "#24A8F5",
                            fontFamily: "Poppins",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            textDecoration: "none",
                          }}
                        >
                          <LayoutDashboard size={12} /> Panel admin
                        </Link>
                      )}
                      {user.role !== "admin" && (
                        <Link
                          to="/mis-pedidos"
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            background: "transparent",
                            border: "1px solid #24A8F5",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            color: "#24A8F5",
                            fontFamily: "Poppins",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            textDecoration: "none",
                          }}
                        >
                          <Package size={8} /> Pedidos
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        style={{
                          background: "transparent",
                          border: "1px solid #EF4444",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          color: "#EF4444",
                          fontFamily: "Poppins",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <LogOut size={12} /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  onMouseEnter={() => setHoveredBtn("user")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  className="flex items-center justify-center no-underline"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor:
                      hoveredBtn === "user" ? "#1E2232" : "transparent",
                    borderRadius: "8px",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <UserRound size={20} color="#AAB3C5" />
                </Link>
              )}

              {user?.role !== "admin" && (
                <Link
                  to="/cart"
                  onMouseEnter={() => setHoveredBtn("cart")}
                  onMouseLeave={() => setHoveredBtn(null)}
                  className="flex items-center justify-center no-underline"
                  style={{
                    position: "relative",
                    width: "36px",
                    height: "36px",
                    backgroundColor:
                      hoveredBtn === "cart" ? "#1E2232" : "transparent",
                    borderRadius: "8px",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <ShoppingCart size={20} color="#AAB3C5" />
                  {cartCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        backgroundColor: "#24A8F5",
                        borderRadius: "50%",
                        width: "16px",
                        height: "16px",
                        fontSize: "9px",
                        fontWeight: "700",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              <button
                onClick={() => setSidebarOpen(true)}
                onMouseEnter={() => setHoveredBtn("menu")}
                onMouseLeave={() => setHoveredBtn(null)}
                className="flex items-center justify-center border-none cursor-pointer"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor:
                    hoveredBtn === "menu" ? "#1E2232" : "transparent",
                  borderRadius: "8px",
                  transition: "background-color 0.15s ease",
                }}
              >
                <Menu size={22} color="#AAB3C5" />
              </button>
            </div>
          </>
        )}
      </nav>

      {/* ── Desktop Navbar ── */}
      <nav
        className="hidden md:flex items-center w-full"
        style={{
          backgroundColor: "#060810",
          height: "76px",
          padding: `0 ${sidePadding}`,
          gap: isTablet ? "12px" : "20px",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <Link
          to="/"
          className="flex items-center"
          style={{ gap: "14px", flexShrink: 0 }}
        >
          <img
            src="/images/logo.png"
            alt="Sharkware Gaming"
            style={{ height: "44px", width: "auto", display: "block" }}
          />
          <span
            className="hidden lg:flex flex-col"
            style={{
              lineHeight: 1.1,
              paddingLeft: "14px",
              borderLeft: "1px solid #1B2333",
            }}
          ></span>
        </Link>

        <form
          onSubmit={handleDesktopSearch}
          className="flex items-center"
          style={{
            backgroundColor: "#0E1424",
            borderRadius: "6px",
            padding: "7px 10px",
            gap: "10px",
            flex: 1,
            maxWidth: isTablet ? "280px" : "480px",
            border: `1px solid ${searchFocused ? "#24A8F5" : "#1B2333"}`,
            boxShadow: searchFocused
              ? "0 0 0 3px rgba(36,168,245,0.15), 0 0 20px rgba(36,168,245,0.12)"
              : "none",
            transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          }}
        >
          <button
            type="submit"
            style={{
              background: "transparent",
              border: "none",
              padding: "0 10px 0 2px",
              borderRight: "1px solid #1B2333",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              height: "20px",
            }}
            aria-label="Buscar"
          >
            <Search size={15} color={searchFocused ? "#24A8F5" : "#8890A4"} />
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Buscar productos..."
            style={{
              background: "transparent",
              border: "none",
              color: "#F5F7FA",
              fontFamily: "Poppins",
              fontSize: "13px",
              flex: 1,
              minWidth: 0,
            }}
          />
        </form>

        <div
          className="flex items-center"
          style={{ gap: "8px", flexShrink: 0 }}
        >
          <Link
            to="/crypto"
            onMouseEnter={() => setHoveredBtn("crypto")}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center no-underline"
            style={ghostPill(hoveredBtn === "crypto")}
          >
            <Coins size={13} color="#24A8F5" />
            {!isTablet && (
              <span style={ghostLabel(hoveredBtn === "crypto")}>Cripto</span>
            )}
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onMouseEnter={() => setHoveredBtn("adminPanel")}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center no-underline"
              style={ghostPill(hoveredBtn === "adminPanel")}
            >
              <LayoutDashboard size={13} color="#24A8F5" />
              {!isTablet && (
                <span style={ghostLabel(hoveredBtn === "adminPanel")}>
                  Panel
                </span>
              )}
            </Link>
          )}

          {user && user.role !== "admin" && (
            <Link
              to="/mis-pedidos"
              onMouseEnter={() => setHoveredBtn("myOrders")}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center no-underline"
              style={ghostPill(hoveredBtn === "myOrders")}
            >
              <Package size={13} color="#24A8F5" />
              {!isTablet && (
                <span style={ghostLabel(hoveredBtn === "myOrders")}>
                  Pedidos
                </span>
              )}
            </Link>
          )}
        </div>

        {user ? (
          <div
            className="flex items-center"
            style={{
              backgroundColor: "#0E1424",
              borderRadius: "6px",
              border: "1px solid #1B2333",
              padding: "7px 12px",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <UserRound size={15} color="#24A8F5" />
            <span
              style={{
                color: "#F5F7FA",
                fontFamily: "Poppins",
                fontSize: "13px",
                fontWeight: 600,
                maxWidth: isTablet ? "80px" : "140px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              onMouseEnter={() => setHoveredBtn("logout")}
              onMouseLeave={() => setHoveredBtn(null)}
              title="Cerrar sesión"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                paddingLeft: "4px",
                borderLeft: "1px solid #1B2333",
                paddingTop: "2px",
                paddingBottom: "2px",
              }}
            >
              <LogOut
                size={14}
                color={hoveredBtn === "logout" ? "#EF4444" : "#8890A4"}
              />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onMouseEnter={() => setHoveredBtn("login")}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center no-underline"
            style={{
              backgroundColor:
                hoveredBtn === "login" ? "rgba(36,168,245,0.08)" : "#0E1424",
              borderRadius: "6px",
              border: `1px solid ${hoveredBtn === "login" ? "#24A8F5" : "#1B2333"}`,
              padding: "7px 14px",
              gap: "8px",
              transition: "all 0.18s ease",
              flexShrink: 0,
              boxShadow:
                hoveredBtn === "login"
                  ? "0 0 12px rgba(36,168,245,0.2)"
                  : "none",
            }}
          >
            <UserRound
              size={14}
              color={hoveredBtn === "login" ? "#24A8F5" : "#AAB3C5"}
            />
            <span
              style={{
                color: "#F5F7FA",
                fontFamily: "Poppins",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Ingresar
            </span>
          </Link>
        )}

        {user?.role !== "admin" && (
          <Link
            to="/cart"
            onMouseEnter={() => setHoveredBtn("cartDesktop")}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center no-underline"
            style={{
              backgroundColor:
                hoveredBtn === "cartDesktop" ? "#00B8EF" : "#00C8FF",
              borderRadius: "6px",
              padding: "8px 16px",
              gap: "8px",
              transition: "background-color 0.18s ease, box-shadow 0.18s ease",
              boxShadow:
                cartCount > 0
                  ? "0 0 18px rgba(0,200,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.15)"
                  : "0 0 10px rgba(0,200,255,0.18)",
              flexShrink: 0,
            }}
          >
            <ShoppingCart size={14} color="#060810" strokeWidth={2.4} />
            <span
              style={{
                color: "#060810",
                fontFamily: "Poppins",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              Carrito{cartCount > 0 ? ` (${cartCount})` : ""}
            </span>
          </Link>
        )}
      </nav>

      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default Navbar;
