import React from "react";
import "./RubroSelect.css";

function RubroSelect({ value, onChange, rubros }) {
  const [open, setOpen] = React.useState(false);
  const selectRef = React.useRef();

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (selectRef.current && !selectRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = rubros.find(r => String(r.id_rubro) === String(value));

  return (
    <div className="rubro-select" ref={selectRef}>
      <button
        type="button"
        className={`rubro-select-btn${open ? " open" : ""}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="rubro-select-main">
          <div className="rubro-select-title">
            {selected ? selected.nombre : "Selecciona un rubro"}
          </div>
          <div className="rubro-select-desc">
            {selected ? selected.descripcion : ""}
          </div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#1D7373" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <ul className="rubro-select-list" role="listbox">
          {rubros.map(r => (
            <li
              key={r.id_rubro}
              className={`rubro-select-item${String(r.id_rubro) === String(value) ? " selected" : ""}`}
              onClick={() => { onChange(r.id_rubro); setOpen(false); }}
              role="option"
              aria-selected={String(r.id_rubro) === String(value)}
            >
              <div className="rubro-select-item-title">{r.nombre}</div>
              <div className="rubro-select-item-desc">{r.descripcion}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RubroSelect;
