import { useState } from "react";
import { X, Search, Trash2, FolderOpen, User, Calendar, MapPin } from "lucide-react";
import { playSoftClick, playTempleChime } from "../utils/soundEffects";

export default function SavedChartsDrawer({
  isOpen,
  onClose,
  savedCharts = [],
  onLoadChart,
  onDeleteChart
}) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = savedCharts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <FolderOpen className="icon-gold" size={20} />
            <h3>Saved Client Records</h3>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={() => {
              playSoftClick();
              onClose();
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="drawer-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by client name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Client List */}
        <div className="drawer-list">
          {filtered.length === 0 ? (
            <div className="empty-drawer">
              {savedCharts.length === 0
                ? "No client records saved yet. Click 'Save Client Profile' on the birth details form to add records."
                : "No client records match your search."}
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div key={idx} className="saved-client-item">
                <div
                  className="client-clickable-area"
                  onClick={() => {
                    playTempleChime();
                    onLoadChart(item);
                    onClose();
                  }}
                >
                  <div className="client-name-row">
                    <User size={16} className="icon-gold" />
                    <strong>{item.name}</strong>
                    <span className="client-gender-pill">{item.gender}</span>
                  </div>
                  <div className="client-meta-row">
                    <span>
                      <Calendar size={13} /> {item.date} {item.time}
                    </span>
                    <span>
                      <MapPin size={13} /> {item.city}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="delete-client-btn"
                  title="Delete Record"
                  onClick={(e) => {
                    e.stopPropagation();
                    playSoftClick();
                    onDeleteChart(item);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
