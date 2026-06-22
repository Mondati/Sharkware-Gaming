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
  Sparkles,
  Palette,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MobileSidebar from "./MobileSidebar";
import { useWindowWidth } from "../hooks/useWindowWidth";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout, showToast } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  const logoSrc = theme === "retro" ? "/images/logo-retro.png" : "/images/logo.png";

  const ghostPill = (hover) => ({
    backgroundColor: hover ? "rgba(var(--accent-rgb),0.08)" : "transparent",
    border: `1px solid ${hover ? "var(--accent)" : "var(--border)"}`,
    borderRadius: "6px",
    padding: "7px 12px",
    gap: "7px",
    transition: "all 0.18s ease",
    boxShadow: hover ? "0 0 14px rgba(var(--accent-rgb),0.22)" : "none",
  });

  const ghostLabel = (hover) => ({
    fontFamily: "Poppins",
    fontSize: "13px",
    fontWeight: 600,
    color: hover ? "var(--text)" : "var(--text-muted)",
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
          backgroundColor: "var(--bg-navbar)",
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
              <X size={20} color="var(--text-muted)" />
            </button>
            <input
              ref={mobileSearchRef}
              type="text"
              value={mobileSearchTerm}
              onChange={(e) => setMobileSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              style={{
                flex: 1,
                backgroundColor: "var(--surface)",
                border: "none",
                borderRadius: "20px",
                padding: "8px 14px",
                color: "var(--text)",
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
              <Search size={20} color="var(--accent)" />
            </button>
          </form>
        ) : (
          /* ── Mobile normal mode ── */
          <>
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              <img
                src={logoSrc}
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
                    hoveredBtn === "search" ? "var(--surface)" : "transparent",
                  borderRadius: "8px",
                  transition: "background-color 0.15s ease",
                }}
              >
                <Search size={20} color="var(--text-muted)" />
              </button>

              {user ? (
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center justify-center border-none cursor-pointer"
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: userMenuOpen ? "var(--surface)" : "transparent",
                      borderRadius: "8px",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <UserRound size={20} color="var(--accent)" />
                  </button>
                  {userMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "42px",
                        right: 0,
                        backgroundColor: "var(--surface)",
                        borderRadius: "12px",
                        padding: "12px 16px",
                        minWidth: "160px",
                        border: "1px solid var(--border)",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--text)",
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
                            border: "1px solid var(--accent)",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            color: "var(--accent)",
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
                            border: "1px solid var(--accent)",
                            borderRadius: "8px",
                            padding: "6px 12px",
                            color: "var(--accent)",
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
                          border: "1px solid var(--error)",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          color: "var(--error)",
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
                      hoveredBtn === "user" ? "var(--surface)" : "transparent",
                    borderRadius: "8px",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <UserRound size={20} color="var(--text-muted)" />
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
                      hoveredBtn === "cart" ? "var(--surface)" : "transparent",
                    borderRadius: "8px",
                    transition: "background-color 0.15s ease",
                  }}
                >
                  <ShoppingCart size={20} color="var(--text-muted)" />
                  {cartCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        backgroundColor: "var(--accent)",
                        borderRadius: "50%",
                        width: "16px",
                        height: "16px",
                        fontSize: "9px",
                        fontWeight: "700",
                        color: "var(--text-strong)",
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
                    hoveredBtn === "menu" ? "var(--surface)" : "transparent",
                  borderRadius: "8px",
                  transition: "background-color 0.15s ease",
                }}
              >
                <Menu size={22} color="var(--text-muted)" />
              </button>
            </div>
          </>
        )}
      </nav>

      {/* ── Desktop Navbar ── */}
      <nav
        className="hidden md:flex items-center w-full"
        style={{
          backgroundColor: "var(--bg-navbar)",
          height: "76px",
          padding: `0 ${sidePadding}`,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="flex items-center w-full"
          style={{ justifyContent: "space-between", gap: isTablet ? "12px" : "20px" }}
        >
        {/* ── Grupo 1: logo ── */}
        <Link
          to="/"
          className="flex items-center"
          style={{ gap: "14px", flexShrink: 0 }}
        >
          <img
            src={logoSrc}
            alt="Sharkware Gaming"
            style={{ height: "44px", width: "auto", display: "block" }}
          />
          <span
            className="hidden lg:flex flex-col"
            style={{
              lineHeight: 1.1,
              paddingLeft: "14px",
              borderLeft: "1px solid var(--border)",
            }}
          ></span>
        </Link>

        {/* ── Grupo 2: búsqueda ── */}
        <form
          onSubmit={handleDesktopSearch}
          className="flex items-center"
          style={{
            backgroundColor: "var(--elev)",
            borderRadius: "6px",
            padding: "7px 10px",
            gap: "10px",
            flex: isTablet ? "0 1 280px" : "0 1 480px",
            maxWidth: isTablet ? "280px" : "480px",
            border: `1px solid ${searchFocused ? "var(--accent)" : "var(--border)"}`,
            boxShadow: searchFocused
              ? "0 0 0 3px rgba(var(--accent-rgb),0.15), 0 0 20px rgba(var(--accent-rgb),0.12)"
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
              borderRight: "1px solid var(--border)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              height: "20px",
            }}
            aria-label="Buscar"
          >
            <Search size={15} color={searchFocused ? "var(--accent)" : "var(--text-subtle)"} />
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
              color: "var(--text)",
              fontFamily: "Poppins",
              fontSize: "13px",
              flex: 1,
              minWidth: 0,
            }}
          />
        </form>

        {/* ── Grupo 3: botones ── */}
        <div className="flex items-center" style={{ gap: "8px", flexShrink: 0 }}>
        <div
          className="flex items-center"
          style={{ gap: "8px", flexShrink: 0 }}
        >
          {user?.role !== "admin" && (
            <Link
              to="/builder"
              onMouseEnter={() => setHoveredBtn("builder")}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center no-underline"
              style={ghostPill(hoveredBtn === "builder")}
            >
              <Sparkles size={13} color="var(--accent)" />
              {!isTablet && (
                <span style={ghostLabel(hoveredBtn === "builder")}>Armá tu PC</span>
              )}
            </Link>
          )}

          <Link
            to="/crypto"
            onMouseEnter={() => setHoveredBtn("crypto")}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center no-underline"
            style={ghostPill(hoveredBtn === "crypto")}
          >
            <Coins size={13} color="var(--accent)" />
            {!isTablet && (
              <span style={ghostLabel(hoveredBtn === "crypto")}>Cripto</span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            onMouseEnter={() => setHoveredBtn("theme")}
            onMouseLeave={() => setHoveredBtn(null)}
            className="flex items-center cursor-pointer"
            style={ghostPill(hoveredBtn === "theme")}
            title={theme === "retro" ? "Cambiar a tema oscuro" : "Cambiar a tema retro"}
            aria-label="Cambiar tema"
          >
            <Palette size={13} color="var(--accent)" />
            {!isTablet && (
              <span style={ghostLabel(hoveredBtn === "theme")}>
                {theme === "retro" ? "Oscuro" : "Retro"}
              </span>
            )}
          </button>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onMouseEnter={() => setHoveredBtn("adminPanel")}
              onMouseLeave={() => setHoveredBtn(null)}
              className="flex items-center no-underline"
              style={ghostPill(hoveredBtn === "adminPanel")}
            >
              <LayoutDashboard size={13} color="var(--accent)" />
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
              <Package size={13} color="var(--accent)" />
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
              backgroundColor: "var(--elev)",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              padding: "7px 12px",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <UserRound size={15} color="var(--accent)" />
            <span
              style={{
                color: "var(--text)",
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
                borderLeft: "1px solid var(--border)",
                paddingTop: "2px",
                paddingBottom: "2px",
              }}
            >
              <LogOut
                size={14}
                color={hoveredBtn === "logout" ? "var(--error)" : "var(--text-subtle)"}
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
                hoveredBtn === "login" ? "rgba(var(--accent-rgb),0.08)" : "var(--elev)",
              borderRadius: "6px",
              border: `1px solid ${hoveredBtn === "login" ? "var(--accent)" : "var(--border)"}`,
              padding: "7px 14px",
              gap: "8px",
              transition: "all 0.18s ease",
              flexShrink: 0,
              boxShadow:
                hoveredBtn === "login"
                  ? "0 0 12px rgba(var(--accent-rgb),0.2)"
                  : "none",
            }}
          >
            <UserRound
              size={14}
              color={hoveredBtn === "login" ? "var(--accent)" : "var(--text-muted)"}
            />
            <span
              style={{
                color: "var(--text)",
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
                hoveredBtn === "cartDesktop" ? "var(--accent-deep-2)" : "var(--accent-bright)",
              borderRadius: "6px",
              padding: "8px 16px",
              gap: "8px",
              transition: "background-color 0.18s ease, box-shadow 0.18s ease",
              boxShadow:
                cartCount > 0
                  ? "0 0 18px rgba(var(--accent-bright-rgb),0.45), inset 0 -1px 0 rgba(0,0,0,0.15)"
                  : "0 0 10px rgba(var(--accent-bright-rgb),0.18)",
              flexShrink: 0,
            }}
          >
            <ShoppingCart size={14} color="var(--on-accent)" strokeWidth={2.4} />
            <span
              style={{
                color: "var(--on-accent)",
                fontFamily: "Poppins",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              Carrito{cartCount > 0 ? ` (${cartCount})` : ""}
            </span>
          </Link>
        )}
        </div>
        </div>
      </nav>

      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default Navbar;
