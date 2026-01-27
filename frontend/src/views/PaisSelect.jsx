import React from "react";
import "./PaisSelect.css";

const PAISES = [
  { code: "+591", icon: "bo", label: "Bolivia", abbr: "BO" },
  { code: "+54", icon: "ar", label: "Argentina", abbr: "AR" },
  { code: "+56", icon: "cl", label: "Chile", abbr: "CL" },
  { code: "+57", icon: "co", label: "Colombia", abbr: "CO" },
  { code: "+51", icon: "pe", label: "Perú", abbr: "PE" },
  { code: "+52", icon: "mx", label: "México", abbr: "MX" },
  { code: "+1", icon: "us", label: "Estados Unidos", abbr: "US" },
];

function FlagIcon({ code }) {
  switch (code) {
    case "bo": // Bolivia
      return <svg width="22" height="16" viewBox="0 0 22 16"><rect width="22" height="5.33" y="0" fill="#D52B1E"/><rect width="22" height="5.33" y="5.33" fill="#F9E300"/><rect width="22" height="5.34" y="10.67" fill="#007934"/></svg>;
    case "ar": // Argentina
      return <svg width="22" height="16" viewBox="0 0 22 16"><rect width="22" height="5.33" y="0" fill="#74ACDF"/><rect width="22" height="5.33" y="5.33" fill="#fff"/><rect width="22" height="5.34" y="10.67" fill="#74ACDF"/></svg>;
    case "cl": // Chile
      return <svg width="22" height="16" viewBox="0 0 22 16"><rect width="22" height="8" y="8" fill="#D52B1E"/><rect width="22" height="8" y="0" fill="#fff"/><rect width="8" height="8" fill="#0039A6"/><polygon points="4,2.5 4.95,5.1 7.7,5.1 5.4,6.6 6.35,9.2 4,7.7 1.65,9.2 2.6,6.6 0.3,5.1 3.05,5.1" fill="#fff"/></svg>;
    case "co": // Colombia
      return <svg width="22" height="16" viewBox="0 0 22 16"><rect width="22" height="8" y="0" fill="#F9E300"/><rect width="22" height="4" y="8" fill="#003893"/><rect width="22" height="4" y="12" fill="#D52B1E"/></svg>;
    case "pe": // Perú
      return <svg width="22" height="16" viewBox="0 0 22 16"><rect width="7.33" height="16" x="0" fill="#D91023"/><rect width="7.34" height="16" x="7.33" fill="#fff"/><rect width="7.33" height="16" x="14.67" fill="#D91023"/></svg>;
    case "mx": // México
      return <svg width="22" height="16" viewBox="0 0 22 16"><rect width="7.33" height="16" x="0" fill="#006341"/><rect width="7.34" height="16" x="7.33" fill="#fff"/><rect width="7.33" height="16" x="14.67" fill="#CE1126"/></svg>;
    case "us": // USA
      return <svg width="22" height="16" viewBox="0 0 22 16"><rect width="22" height="16" fill="#B22234"/><g><rect width="22" height="1.23" y="1.23" fill="#fff"/><rect width="22" height="1.23" y="3.69" fill="#fff"/><rect width="22" height="1.23" y="6.15" fill="#fff"/><rect width="22" height="1.23" y="8.61" fill="#fff"/><rect width="22" height="1.23" y="11.07" fill="#fff"/><rect width="22" height="1.23" y="13.53" fill="#fff"/></g><rect width="8.8" height="7.69" fill="#3C3B6E"/><g fill="#fff"><circle cx="1.1" cy="1.1" r="0.5"/><circle cx="3.3" cy="1.1" r="0.5"/><circle cx="5.5" cy="1.1" r="0.5"/><circle cx="7.7" cy="1.1" r="0.5"/><circle cx="2.2" cy="2.3" r="0.5"/><circle cx="4.4" cy="2.3" r="0.5"/><circle cx="6.6" cy="2.3" r="0.5"/><circle cx="1.1" cy="3.5" r="0.5"/><circle cx="3.3" cy="3.5" r="0.5"/><circle cx="5.5" cy="3.5" r="0.5"/><circle cx="7.7" cy="3.5" r="0.5"/><circle cx="2.2" cy="4.7" r="0.5"/><circle cx="4.4" cy="4.7" r="0.5"/><circle cx="6.6" cy="4.7" r="0.5"/><circle cx="1.1" cy="5.9" r="0.5"/><circle cx="3.3" cy="5.9" r="0.5"/><circle cx="5.5" cy="5.9" r="0.5"/><circle cx="7.7" cy="5.9" r="0.5"/></g></svg>;
    default:
      return null;
  }
}

function PaisSelect({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const selectRef = React.useRef();
  const selected = PAISES.find(p => p.code === value) || PAISES[0];

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="pais-select" ref={selectRef}>
      <button
        type="button"
        className={`pais-select-btn${open ? " open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="pais-abbr">{selected.abbr}</span>
        <span className="pais-flag"><FlagIcon code={selected.icon} /></span>
        <span className="pais-code">{selected.code}</span>
        <span className="pais-label">{selected.label}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#1D7373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <ul className="pais-select-list" role="listbox">
          {PAISES.map(p => (
            <li
              key={p.code}
              className={`pais-select-item${p.code === value ? " selected" : ""}`}
              onClick={() => { onChange(p.code); setOpen(false); }}
              role="option"
              aria-selected={p.code === value}
            >
              <span className="pais-abbr">{p.abbr}</span>
              <span className="pais-flag"><FlagIcon code={p.icon} /></span>
              <span className="pais-code">{p.code}</span>
              <span className="pais-label">{p.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PaisSelect;
