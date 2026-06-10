import React, { useState, useEffect } from 'react';
import {
  Settings, Lock, Unlock, MapPin, Shield, ChevronLeft, ChevronRight,
  Bell, Battery, Wifi, Signal, Navigation, Zap, CheckCircle2,
  AlertCircle, User, X, Search, Calendar, Package, Sparkles,
} from 'lucide-react';

/* =================== BRAND COLORS =================== */
const C = {
  brand:       '#9A1B2E',  // VELOCK red (logo)
  brandDark:   '#6B0F1E',
  brandLight:  '#C84459',
  brandSoft:   '#FAEDEF',  // ultra light red wash
  white:       '#ffffff',
  offWhite:    '#FAF7F5',  // warm app background
  cream:       '#F4EFEC',
  border:      '#EAE4E1',
  borderSoft:  '#F0EBE8',
  ink:         '#1A1413',  // primary text
  inkSoft:     '#3D3530',
  inkMuted:    '#8A827D',
  inkFaint:    '#B5ADA8',
  mapBg:       '#1E1916',  // map dark base
  mapStreet:   '#2C2622',
  mapStreetHi: '#3A332E',
  success:     '#0E8050',
  successSoft: '#E3F4EB',
};

/* =================== LOGO COMPONENT =================== */
function VelockLogo({ width = 140, color = C.brand }) {
  return (
    <svg viewBox="0 0 290 80" width={width} xmlns="http://www.w3.org/2000/svg"
         style={{ display: 'block', color }}>
      <g fill="currentColor"
         style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}>
        <text x="0" y="60" fontSize="68" letterSpacing="-2">VE</text>
        <text x="135" y="60" fontSize="68" letterSpacing="-2">OCK</text>
      </g>
      {/* Key replacing the L */}
      <g transform="translate(108, 4)" fill={color}>
        {/* Trefoil bow */}
        <circle cx="11" cy="7" r="6"/>
        <circle cx="5" cy="14" r="5.5"/>
        <circle cx="17" cy="14" r="5.5"/>
        {/* Crown inside bow (cut-out via white) */}
        <g fill={C.white} transform="translate(11, 11)">
          <polygon points="-4,3 -3,-2 -2,2 -1,-3 0,2 1,-3 2,2 3,-2 4,3"/>
          <rect x="-4" y="3" width="8" height="1.6"/>
        </g>
        {/* Shaft */}
        <rect x="9.5" y="20" width="3" height="38"/>
        {/* Cathedral spires near bottom of shaft */}
        <g fill={C.white} transform="translate(11, 48)">
          <polygon points="-3.2,0 -3.2,8 -0.6,8 -0.6,0"/>
          <polygon points="3.2,0 3.2,8 0.6,8 0.6,0"/>
          <polygon points="-3.2,0 -1.9,-5 -0.6,0"/>
          <polygon points="3.2,0 1.9,-5 0.6,0"/>
        </g>
        {/* Key teeth */}
        <rect x="9.5" y="58" width="7" height="2.2"/>
        <rect x="9.5" y="62" width="5" height="2.2"/>
      </g>
    </svg>
  );
}

/* Compact logo mark (just the key) for tight spaces */
function VelockMark({ size = 28, color = C.brand }) {
  return (
    <svg viewBox="0 0 26 70" width={size * 0.4} height={size} style={{ color }}>
      <g fill={color}>
        <circle cx="13" cy="8" r="6"/>
        <circle cx="7" cy="15" r="5.5"/>
        <circle cx="19" cy="15" r="5.5"/>
        <g fill={C.white} transform="translate(13, 12)">
          <polygon points="-4,3 -3,-2 -2,2 -1,-3 0,2 1,-3 2,2 3,-2 4,3"/>
          <rect x="-4" y="3" width="8" height="1.6"/>
        </g>
        <rect x="11.5" y="21" width="3" height="35"/>
        <rect x="11.5" y="56" width="7" height="2.2"/>
        <rect x="11.5" y="60" width="5" height="2.2"/>
      </g>
    </svg>
  );
}

/* Locker icon (custom) */
function LockerIcon({ size = 20, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="1.5"/>
      <line x1="12" y1="3" x2="12" y2="21"/>
      <circle cx="9.5" cy="12" r="0.6" fill={color}/>
      <circle cx="14.5" cy="12" r="0.6" fill={color}/>
    </svg>
  );
}

/* =================== MAIN APP =================== */
export default function VelockApp() {
  const [screen, setScreen] = useState('map');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedLocker, setSelectedLocker] = useState(null);
  const [lockProgress, setLockProgress] = useState(0);
  const [time] = useState('9:41');
  const [hasSubscription, setHasSubscription] = useState(false);
  const [activeLock, setActiveLock] = useState(null);

  useEffect(() => {
    if (screen === 'locking') {
      const interval = setInterval(() => {
        setLockProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setActiveLock({
                station: selectedStation,
                lockerId: selectedLocker,
                lockedAt: 'May 1 · 09:41',
                releaseBy: 'May 15',
              });
              setScreen('locked');
            }, 400);
            return 100;
          }
          return p + 4;
        });
      }, 40);
      return () => clearInterval(interval);
    }
    if (screen !== 'locking') setLockProgress(0);
  }, [screen, selectedStation, selectedLocker]);

  const navigate = (target) => {
    if (target === 'map') setScreen('map');
    else if (target === 'lock') setScreen(activeLock ? 'locked' : 'no-lock');
    else if (target === 'profile') setScreen('profile');
  };

  const stations = [
    { id: 1, name: 'Köln Hauptbahnhof', distance: '120 m', available: 14, total: 20, x: 52, y: 38 },
    { id: 2, name: 'Neumarkt',          distance: '340 m', available: 6,  total: 12, x: 38, y: 52 },
    { id: 3, name: 'Universität Köln',  distance: '780 m', available: 18, total: 24, x: 65, y: 64 },
    { id: 4, name: 'Rudolfplatz',       distance: '1.1 km', available: 3,  total: 16, x: 28, y: 72 },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#2a2422',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        .phone-frame {
          width: 380px; height: 780px;
          background: #0a0a0a;
          border-radius: 50px;
          padding: 12px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 2px #2a2a2a;
          position: relative;
        }
        .phone-screen {
          width: 100%; height: 100%;
          background: ${C.offWhite};
          border-radius: 40px;
          overflow: hidden; position: relative;
          display: flex; flex-direction: column;
        }
        .notch {
          position: absolute; top: 12px; left: 50%;
          transform: translateX(-50%);
          width: 110px; height: 30px;
          background: #000; border-radius: 20px;
          z-index: 100;
        }

        .status-bar {
          padding: 14px 28px 8px;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 14px; font-weight: 600;
          z-index: 50; position: relative;
        }
        .status-icons { display: flex; gap: 5px; align-items: center; }

        .map-svg { width: 100%; height: 100%; }

        .floating-btn {
          width: 44px; height: 44px;
          background: ${C.white};
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          cursor: pointer; transition: transform 0.15s;
          border: none;
        }
        .floating-btn:active { transform: scale(0.92); }

        .station-pin { position: absolute; transform: translate(-50%, -50%); cursor: pointer; }
        .station-pin .pin-dot {
          width: 16px; height: 16px;
          background: ${C.brand};
          border-radius: 50%;
          border: 3px solid ${C.white};
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          transition: transform 0.2s;
        }
        .station-pin:hover .pin-dot { transform: scale(1.25); }
        .station-pin .pulse {
          position: absolute; inset: -10px; border-radius: 50%;
          background: rgba(154,27,46,0.35);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .you-marker { position: absolute; left: 50%; top: 45%; transform: translate(-50%, -50%); }
        .you-marker .you-dot {
          width: 16px; height: 16px;
          background: ${C.white};
          border-radius: 50%;
          border: 3px solid ${C.ink};
          position: relative; z-index: 2;
        }
        .you-marker .you-cone {
          position: absolute; top: 50%; left: 50%;
          width: 60px; height: 60px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle at 50% 50%, rgba(200, 220, 255, 0.5) 0%, transparent 60%);
          clip-path: polygon(50% 50%, 0% 100%, 100% 100%);
          transform-origin: center;
          rotate: 220deg;
        }

        .bottom-card {
          background: ${C.white};
          border-radius: 28px 28px 0 0;
          padding: 18px 22px 24px;
          box-shadow: 0 -12px 32px rgba(0,0,0,0.18);
          position: relative; z-index: 10;
        }
        .card-handle {
          width: 40px; height: 4px;
          background: ${C.border};
          border-radius: 2px;
          margin: 0 auto 14px;
        }

        .station-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid ${C.borderSoft};
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .station-row:active { opacity: 0.6; }
        .station-row:last-child { border-bottom: none; }

        .station-icon-wrap {
          width: 44px; height: 44px;
          background: ${C.brandSoft};
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: ${C.brand};
          flex-shrink: 0;
        }

        .display { font-family: 'Playfair Display', Georgia, serif; }
        .grotesk { font-family: 'Space Grotesk', sans-serif; }

        .subtle { color: ${C.inkMuted}; font-size: 13px; }

        .stat-tile {
          background: ${C.white};
          border: 1px solid ${C.border};
          border-radius: 16px;
          padding: 14px;
          flex: 1;
        }
        .stat-tile.dark {
          background: ${C.brand};
          border-color: ${C.brand};
          color: ${C.white};
        }

        .pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
        }
        .pill.success { background: ${C.successSoft}; color: ${C.success}; }
        .pill.amber   { background: #FFF6E0; color: #92520E; }
        .pill.brand   { background: ${C.brandSoft}; color: ${C.brand}; }
        .pill.dark    { background: ${C.ink}; color: ${C.white}; }
        .pill.outline {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: ${C.white};
        }

        .nav-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: ${C.white};
          border-top: 1px solid ${C.border};
          padding: 12px 0 26px;
          display: flex; justify-content: space-around; align-items: center;
          z-index: 20;
        }
        .nav-item {
          background: transparent; border: none;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          color: ${C.inkFaint};
          font-size: 10px; font-weight: 600;
          cursor: pointer; padding: 4px 12px;
          letter-spacing: 0.5px;
          transition: color 0.15s;
        }
        .nav-item.active { color: ${C.brand}; }
        .nav-item:active { transform: scale(0.95); }

        .home-indicator {
          position: absolute; bottom: 8px; left: 50%;
          transform: translateX(-50%);
          width: 120px; height: 4px;
          background: ${C.ink};
          border-radius: 2px;
          opacity: 0.3;
          z-index: 30;
        }

        .btn-primary {
          width: 100%;
          background: ${C.brand};
          color: ${C.white};
          border: none;
          padding: 16px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform 0.15s, background 0.15s;
          font-family: inherit;
          letter-spacing: 0.2px;
        }
        .btn-primary:active { transform: scale(0.98); background: ${C.brandDark}; }
        .btn-primary:disabled { background: ${C.inkFaint}; cursor: not-allowed; }

        .btn-secondary {
          width: 100%;
          background: ${C.white};
          color: ${C.brand};
          border: 1.5px solid ${C.brand};
          padding: 14px;
          border-radius: 16px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
        }

        .btn-ghost {
          background: transparent; color: ${C.inkMuted};
          border: 1px solid ${C.border}; border-radius: 12px;
          padding: 12px; font-weight: 600; font-size: 13px;
          cursor: pointer; font-family: inherit; width: 100%;
        }

        /* LOCKER GRID — actual locker doors */
        .locker-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 14px 0 18px;
        }
        .locker {
          aspect-ratio: 0.78;
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          background: ${C.white};
          border: 1.5px solid ${C.border};
          transition: all 0.2s;
          display: flex; flex-direction: column;
          padding: 10px 12px;
          font-family: inherit;
          text-align: left;
        }
        .locker.free:hover { border-color: ${C.brand}; transform: translateY(-2px); }
        .locker.taken {
          background: ${C.cream};
          border-color: ${C.borderSoft};
          opacity: 0.6;
          cursor: not-allowed;
        }
        .locker.selected {
          background: ${C.brand};
          border-color: ${C.brand};
          color: ${C.white};
          box-shadow: 0 8px 20px rgba(154,27,46,0.35);
          transform: translateY(-2px);
        }
        .locker .lid {
          position: absolute; left: 50%; top: 0;
          transform: translateX(-50%);
          width: 28%; height: 4px;
          background: currentColor;
          opacity: 0.15;
          border-radius: 0 0 4px 4px;
        }
        .locker-num {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px; font-weight: 700;
          letter-spacing: -0.5px;
          line-height: 1;
          margin-top: 2px;
        }
        .locker-handle {
          position: absolute;
          right: 8px; top: 50%;
          transform: translateY(-50%);
          width: 5px; height: 22px;
          background: currentColor;
          opacity: 0.4;
          border-radius: 3px;
        }
        .locker.selected .locker-handle { opacity: 1; background: ${C.white}; }
        .locker-status {
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: auto;
          color: currentColor;
          opacity: 0.7;
        }

        .scroll-area { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; }
        .scroll-area::-webkit-scrollbar { display: none; }

        .header-red {
          background: ${C.brand};
          color: ${C.white};
          border-radius: 0 0 28px 28px;
          padding-bottom: 24px;
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-up { animation: slideUp 0.35s ease-out; }
      `}</style>

      <div className="phone-frame">
        <div className="notch"></div>
        <div className="phone-screen">

          {screen === 'map' && (
            <MapScreen
              time={time}
              stations={stations}
              onSelectStation={(s) => { setSelectedStation(s); setScreen('station'); }}
              navigate={navigate}
              activeLock={activeLock}
            />
          )}

          {screen === 'station' && selectedStation && (
            <StationScreen
              time={time}
              station={selectedStation}
              hasSubscription={hasSubscription}
              selectedLocker={selectedLocker}
              setSelectedLocker={setSelectedLocker}
              onBack={() => { setSelectedLocker(null); setScreen('map'); }}
              onLock={() => setScreen('locking')}
            />
          )}

          {screen === 'locking' && (
            <LockingScreen
              time={time}
              progress={lockProgress}
              lockerId={selectedLocker}
              onCancel={() => setScreen('station')}
            />
          )}

          {screen === 'locked' && activeLock && (
            <LockedScreen
              time={time}
              lock={activeLock}
              hasSubscription={hasSubscription}
              onUnlock={() => {
                setActiveLock(null);
                setSelectedLocker(null);
                setSelectedStation(null);
                setScreen('map');
              }}
              navigate={navigate}
            />
          )}

          {screen === 'no-lock' && (
            <NoLockScreen time={time} navigate={navigate} />
          )}

          {screen === 'profile' && (
            <ProfileScreen
              time={time}
              hasSubscription={hasSubscription}
              onToggleSubscription={() => setHasSubscription(s => !s)}
              onBack={() => setScreen('map')}
              navigate={navigate}
            />
          )}

          <div className="home-indicator"></div>
        </div>
      </div>
    </div>
  );
}

/* =================== STATUS BAR =================== */
function StatusBar({ time, dark = false }) {
  const c = dark ? C.white : C.ink;
  return (
    <div className="status-bar" style={{ color: c }}>
      <span>{time}</span>
      <div className="status-icons">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={16} />
      </div>
    </div>
  );
}

/* =================== MAP SCREEN =================== */
function MapScreen({ time, stations, onSelectStation, navigate, activeLock }) {
  return (
    <>
      {/* Map background */}
      <div style={{ position: 'absolute', inset: 0, height: '55%' }}>
        <MapBackground />
        <div className="you-marker">
          <div className="you-cone"></div>
          <div className="you-dot"></div>
        </div>
        {stations.map(s => (
          <div key={s.id} className="station-pin"
               style={{ left: `${s.x}%`, top: `${s.y}%` }}
               onClick={() => onSelectStation(s)}>
            <div className="pulse"></div>
            <div className="pin-dot"></div>
          </div>
        ))}
      </div>

      <StatusBar time={time} dark={true} />

      {/* Logo + settings overlay */}
      <div style={{
        position: 'absolute', top: 56, left: 0, right: 0,
        padding: '0 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 20,
      }}>
        <div style={{
          background: C.white,
          padding: '10px 16px',
          borderRadius: 100,
          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        }}>
          <VelockLogo width={92} />
        </div>

        <button className="floating-btn">
          <Settings size={20} color={C.ink} strokeWidth={2.2} />
        </button>
      </div>

      {/* Search pill */}
      <div style={{
        position: 'absolute', top: 116, left: 20, right: 20, zIndex: 20,
        background: C.white,
        borderRadius: 14,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
      }}>
        <Search size={16} color={C.inkMuted} />
        <span style={{ fontSize: 13, color: C.inkMuted, fontWeight: 500 }}>
          Where do you want to lock your bike?
        </span>
      </div>

      {/* Bottom sheet */}
      <div style={{ position: 'absolute', bottom: 76, left: 0, right: 0, zIndex: 15 }}>
        <div className="bottom-card animate-up">
          <div className="card-handle"></div>

          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-end', marginBottom: 4,
          }}>
            <div>
              <div className="subtle" style={{
                marginBottom: 2,
                fontSize: 10, fontWeight: 600, letterSpacing: 1.2,
              }}>
                NEAREST LOCKERS
              </div>
              <div className="display" style={{
                fontSize: 22, fontWeight: 700, color: C.ink,
                letterSpacing: '-0.3px',
              }}>
                Köln · Innenstadt
              </div>
            </div>
            <span className="pill success">
              <span style={{
                width: 6, height: 6, background: C.success, borderRadius: '50%',
              }}></span>
              41 free
            </span>
          </div>

          <div style={{ marginTop: 10, maxHeight: 220, overflowY: 'auto' }}>
            {stations.map(s => (
              <div key={s.id} className="station-row"
                   onClick={() => onSelectStation(s)}>
                <div className="station-icon-wrap">
                  <LockerIcon size={22} color={C.brand} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: 14, color: C.ink,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{s.name}</div>
                  <div className="subtle" style={{ marginTop: 2, fontSize: 12 }}>
                    {s.distance} · {s.available}/{s.total} lockers free
                  </div>
                </div>
                <ChevronRight size={18} color={C.inkFaint} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="map" navigate={navigate} hasActiveLock={!!activeLock} />
    </>
  );
}

/* =================== MAP BACKGROUND =================== */
function MapBackground() {
  return (
    <svg className="map-svg" viewBox="0 0 380 430" preserveAspectRatio="xMidYMid slice">
      <rect width="380" height="430" fill={C.mapBg} />
      <rect x="0" y="320" width="380" height="110" fill="#15110F" />
      <rect x="240" y="0" width="40" height="180" fill="#15110F" opacity="0.5" />
      <rect x="40" y="220" width="80" height="60" fill="#15110F" opacity="0.5" />

      <g stroke={C.mapStreet} strokeWidth="6" fill="none">
        <line x1="0" y1="120" x2="380" y2="135" />
        <line x1="0" y1="280" x2="380" y2="300" />
        <line x1="180" y1="0" x2="200" y2="430" />
        <line x1="-20" y1="0" x2="120" y2="430" />
        <line x1="280" y1="0" x2="380" y2="200" />
      </g>
      <g stroke={C.mapStreetHi} strokeWidth="2" fill="none">
        <line x1="0" y1="120" x2="380" y2="135" />
        <line x1="0" y1="280" x2="380" y2="300" />
        <line x1="180" y1="0" x2="200" y2="430" />
        <line x1="-20" y1="0" x2="120" y2="430" />
      </g>
      <g stroke="#252220" strokeWidth="1.5" fill="none">
        <line x1="0" y1="60" x2="380" y2="70" />
        <line x1="0" y1="180" x2="380" y2="200" />
        <line x1="0" y1="240" x2="380" y2="260" />
        <line x1="0" y1="360" x2="380" y2="380" />
        <line x1="60" y1="0" x2="80" y2="430" />
        <line x1="240" y1="0" x2="260" y2="430" />
        <line x1="320" y1="0" x2="340" y2="430" />
      </g>

      <g fill="#241F1C">
        <rect x="20" y="20" width="50" height="35" rx="2" />
        <rect x="85" y="20" width="40" height="35" rx="2" />
        <rect x="135" y="80" width="35" height="30" rx="2" />
        <rect x="210" y="20" width="60" height="35" rx="2" />
        <rect x="285" y="20" width="50" height="40" rx="2" />
        <rect x="20" y="140" width="55" height="30" rx="2" />
        <rect x="85" y="140" width="45" height="35" rx="2" />
        <rect x="210" y="150" width="50" height="40" rx="2" />
        <rect x="285" y="140" width="55" height="35" rx="2" />
        <rect x="20" y="190" width="40" height="40" rx="2" />
        <rect x="285" y="195" width="45" height="40" rx="2" />
      </g>

      <g fontFamily="Inter, sans-serif" fontSize="9" fill="#5a5550" fontWeight="500">
        <text x="40" y="100">Hohenzollernring</text>
        <text x="220" y="100">Domplatz</text>
        <text x="50" y="160" transform="rotate(-3 50 160)">Komödienstraße</text>
        <text x="220" y="220">Hohe Straße</text>
        <text x="90" y="320">Nord-Süd-Fahrt</text>
        <text x="240" y="350">Rheinufer</text>
      </g>
    </svg>
  );
}

/* =================== STATION (LOCKERS) SCREEN =================== */
function StationScreen({ time, station, hasSubscription, selectedLocker, setSelectedLocker, onBack, onLock }) {
  const lockers = Array.from({ length: station.total }, (_, i) => ({
    id: i + 1, free: i < station.available,
  }));

  return (
    <div style={{ background: C.offWhite, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="header-red">
        <StatusBar time={time} dark={true} />

        <div style={{
          padding: '8px 24px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <ChevronLeft size={20} color={C.white} />
          </button>
          <VelockLogo width={88} color={C.white} />
          <div style={{ width: 40 }}></div>
        </div>

        <div style={{ padding: '20px 28px 0' }}>
          <div style={{
            fontSize: 10, color: 'rgba(255,255,255,0.7)',
            letterSpacing: 1.5, fontWeight: 600, marginBottom: 6,
          }}>
            STATION · {station.distance.toUpperCase()} AWAY
          </div>
          <div className="display" style={{
            fontSize: 28, fontWeight: 700, color: C.white,
            letterSpacing: '-0.5px', lineHeight: 1.1,
          }}>
            {station.name}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <span className="pill" style={{ background: 'rgba(255,255,255,0.15)', color: C.white }}>
              <CheckCircle2 size={12} />
              {station.available} free
            </span>
            <span className="pill outline">
              <Shield size={12} />
              24/7 monitored
            </span>
            <span className="pill outline">
              <Zap size={12} />
              Fits e-bikes
            </span>
          </div>
        </div>
      </div>

      <div className="scroll-area" style={{ padding: '18px 22px 100px' }}>
        {/* AVAILABLE tile only (RATE removed) */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <div className="stat-tile" style={{ flex: 1 }}>
            <div className="subtle" style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
            }}>AVAILABLE</div>
            <div className="grotesk" style={{
              fontSize: 22, fontWeight: 700, color: C.ink, marginTop: 4,
            }}>
              {station.available}<span style={{
                fontSize: 13, color: C.inkMuted, fontWeight: 500,
              }}>/{station.total}</span>
            </div>
            <div style={{
              height: 6, background: C.cream,
              borderRadius: 3, overflow: 'hidden', marginTop: 6,
            }}>
              <div style={{
                height: '100%',
                width: `${(station.available/station.total)*100}%`,
                background: C.brand,
                borderRadius: 3,
              }}></div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 4,
        }}>
          <div className="display" style={{
            fontSize: 18, fontWeight: 700, color: C.ink,
          }}>Choose a locker</div>
          <span className="subtle" style={{ fontSize: 12 }}>
            {selectedLocker ? `Locker #${String(selectedLocker).padStart(2,'0')}` : 'Tap to select'}
          </span>
        </div>

        <div className="locker-grid">
          {lockers.map(l => {
            const isSelected = selectedLocker === l.id;
            return (
              <button key={l.id}
                      className={`locker ${!l.free ? 'taken' : isSelected ? 'selected' : 'free'}`}
                      onClick={() => l.free && setSelectedLocker(l.id)}
                      disabled={!l.free}>
                <div className="lid"></div>
                <div className="locker-num">{String(l.id).padStart(2, '0')}</div>
                <div className="locker-handle"></div>
                <div className="locker-status">
                  {!l.free ? 'In use' : isSelected ? 'Selected' : 'Free'}
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 14, fontSize: 11, color: C.inkMuted, marginTop: -4 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 10, height: 10, background: C.white,
              border: `1.5px solid ${C.border}`, borderRadius: 3,
            }}></span>
            Available
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 10, height: 10, background: C.cream, borderRadius: 3,
            }}></span>
            In use
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 10, height: 10, background: C.brand, borderRadius: 3,
            }}></span>
            Selected
          </span>
        </div>

        {/* Info card about lockers */}
        <div style={{
          marginTop: 20, padding: 16,
          background: C.white, borderRadius: 16, border: `1px solid ${C.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 36, height: 36, background: C.brandSoft,
              borderRadius: 10, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Package size={18} color={C.brand} />
            </div>
            <div>
              <div style={{
                fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2,
              }}>
                Your whole bike, sealed away
              </div>
              <div style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.45 }}>
                Roll your bike inside, close the door, lock through the app.
                The entire bike — frame, battery and display — is enclosed and out of sight.
              </div>
            </div>
          </div>
        </div>

        {/* Max parking notice */}
        <div style={{
          marginTop: 12, padding: 14,
          background: 'transparent', borderRadius: 12,
          border: `1px dashed ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 12, color: C.inkMuted,
        }}>
          <Calendar size={16} color={C.inkMuted} />
          <span>Max parking time: <strong style={{ color: C.ink }}>14 days</strong></span>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 20px 32px',
        background: `linear-gradient(to top, ${C.offWhite} 70%, transparent)`,
      }}>
        <button className="btn-primary" onClick={onLock} disabled={!selectedLocker}>
          <Lock size={18} />
          {selectedLocker
            ? `Reserve locker #${String(selectedLocker).padStart(2,'0')}`
            : 'Select a locker first'}
        </button>
      </div>
    </div>
  );
}

/* =================== LOCKING SCREEN =================== */
function LockingScreen({ time, progress, lockerId, onCancel }) {
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ background: C.offWhite, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <StatusBar time={time} dark={false} />

      <div style={{ padding: '8px 24px' }}>
        <button onClick={onCancel} style={{
          width: 40, height: 40, borderRadius: '50%',
          background: C.white, border: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <X size={18} color={C.ink} />
        </button>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '12px 32px',
      }}>
        <VelockLogo width={120} />

        <div style={{
          fontSize: 10, color: C.inkMuted, letterSpacing: 1.5,
          fontWeight: 600, marginTop: 28,
        }}>
          OPENING LOCKER #{String(lockerId).padStart(2,'0')}
        </div>
        <div className="display" style={{
          fontSize: 24, fontWeight: 700, color: C.ink,
          marginTop: 6, textAlign: 'center', letterSpacing: '-0.5px',
          maxWidth: 280, lineHeight: 1.2,
        }}>
          Hold your phone<br/>near the door
        </div>

        <div style={{
          width: 200, height: 200, borderRadius: '50%',
          background: C.brand, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 36, boxShadow: '0 20px 40px rgba(154,27,46,0.3)',
        }}>
          <div style={{
            position: 'absolute', inset: -8,
            border: `1px dashed ${C.inkFaint}`,
            borderRadius: '50%',
          }}></div>
          <svg style={{
            position: 'absolute', inset: -8, transform: 'rotate(-90deg)',
          }} viewBox="0 0 200 200" width="216" height="216">
            <circle cx="100" cy="100" r={radius} fill="none"
                    stroke={C.border} strokeWidth="3" />
            <circle cx="100" cy="100" r={radius} fill="none"
                    stroke={C.brand} strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.05s linear' }} />
          </svg>
          <Lock size={56} color={C.white} strokeWidth={1.8} />
        </div>

        <div className="grotesk" style={{
          fontSize: 32, fontWeight: 700, color: C.ink, marginTop: 24,
        }}>
          {progress}%
        </div>
        <div className="subtle" style={{
          marginTop: 6, textAlign: 'center', maxWidth: 240,
        }}>
          {progress < 30 && 'Searching for locker signal…'}
          {progress >= 30 && progress < 70 && `Authenticating with locker #${String(lockerId).padStart(2,'0')}…`}
          {progress >= 70 && progress < 100 && 'Engaging mechanism…'}
          {progress === 100 && 'Locker secured ✓'}
        </div>

        <div style={{
          marginTop: 'auto', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', background: C.white,
          borderRadius: 100, border: `1px solid ${C.border}`,
          fontSize: 12, color: C.inkMuted,
        }}>
          <Shield size={14} color={C.success} />
          End-to-end encrypted connection
        </div>
      </div>
    </div>
  );
}

/* =================== LOCKED SCREEN (NO TIMER) =================== */
function LockedScreen({ time, lock, hasSubscription, onUnlock, navigate }) {
  return (
    <div style={{
      background: C.offWhite, height: '100%', display: 'flex', flexDirection: 'column',
      position: 'relative',
    }}>
      <StatusBar time={time} dark={false} />

      <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <VelockLogo width={88} />
        <div style={{
          display: 'inline-flex', gap: 6, alignItems: 'center',
          padding: '6px 12px', background: C.successSoft,
          border: `1px solid ${C.success}33`,
          borderRadius: 100,
        }}>
          <span style={{
            width: 7, height: 7, background: C.success, borderRadius: '50%',
            boxShadow: `0 0 8px ${C.success}`,
          }}></span>
          <span style={{
            fontSize: 11, fontWeight: 700, color: C.success, letterSpacing: 0.5,
          }}>
            SECURED
          </span>
        </div>
      </div>

      <div className="scroll-area" style={{ padding: '20px 24px 100px' }}>

        {/* Hero locker card */}
        <div style={{
          background: C.white, borderRadius: 24,
          border: `1px solid ${C.border}`,
          padding: '28px 24px',
          marginBottom: 16, textAlign: 'center',
          boxShadow: '0 8px 28px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            fontSize: 10, color: C.inkMuted,
            letterSpacing: 1.5, fontWeight: 600, marginBottom: 12,
          }}>
            YOUR BIKE IS IN
          </div>

          {/* Big locker visual */}
          <div style={{
            width: 110, height: 130, margin: '0 auto 18px',
            background: C.brand, borderRadius: 14,
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
            boxShadow: '0 10px 28px rgba(154,27,46,0.3)',
          }}>
            <div style={{
              position: 'absolute', left: '50%', top: 0,
              transform: 'translateX(-50%)',
              width: 32, height: 4, background: 'rgba(255,255,255,0.3)',
              borderRadius: '0 0 4px 4px',
            }}></div>
            <div className="grotesk" style={{
              fontSize: 32, fontWeight: 700, color: C.white,
              letterSpacing: '-1px',
            }}>
              {String(lock.lockerId).padStart(2, '0')}
            </div>
            <div style={{
              fontSize: 9, color: 'rgba(255,255,255,0.7)',
              letterSpacing: 1, fontWeight: 600, marginTop: 2,
            }}>LOCKER</div>
            <div style={{
              position: 'absolute', right: 10, top: '50%',
              transform: 'translateY(-50%)',
              width: 5, height: 26,
              background: C.white, borderRadius: 3,
            }}></div>
            <Lock size={14} color={C.brand} strokeWidth={2.5} style={{
              position: 'absolute', bottom: 14,
              background: C.white, padding: 4, borderRadius: '50%',
              boxSizing: 'content-box',
            }} />
          </div>

          <div className="display" style={{
            fontSize: 22, fontWeight: 700, color: C.ink,
            letterSpacing: '-0.3px', lineHeight: 1.2,
          }}>
            {lock.station.name}
          </div>
          <div style={{
            fontSize: 13, color: C.inkMuted, marginTop: 4,
          }}>
            {lock.station.distance} from you
          </div>
        </div>

        {/* Two info tiles — no timer */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{
            flex: 1, padding: 14,
            background: C.white, borderRadius: 14,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={13} color={C.brand} />
              <div style={{
                fontSize: 10, color: C.inkMuted,
                fontWeight: 600, letterSpacing: 0.6,
              }}>LOCKED AT</div>
            </div>
            <div className="grotesk" style={{
              fontSize: 16, fontWeight: 700, color: C.ink, marginTop: 6,
            }}>
              {lock.lockedAt}
            </div>
          </div>
          <div style={{
            flex: 1, padding: 14,
            background: C.white, borderRadius: 14,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={13} color={C.brand} />
              <div style={{
                fontSize: 10, color: C.inkMuted,
                fontWeight: 600, letterSpacing: 0.6,
              }}>PICK UP BY</div>
            </div>
            <div className="grotesk" style={{
              fontSize: 16, fontWeight: 700, color: C.ink, marginTop: 6,
            }}>
              {lock.releaseBy}
            </div>
          </div>
        </div>

        {/* Status row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{
            flex: 1, padding: 14,
            background: C.white, borderRadius: 14,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={13} color={C.inkSoft} />
              <div style={{
                fontSize: 10, color: C.inkMuted,
                fontWeight: 600, letterSpacing: 0.6,
              }}>ALERTS</div>
            </div>
            <div className="grotesk" style={{
              fontSize: 16, fontWeight: 700, color: C.ink, marginTop: 6,
            }}>On</div>
          </div>
          <div style={{
            flex: 1, padding: 14,
            background: C.white, borderRadius: 14,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={13} color={C.inkSoft} />
              <div style={{
                fontSize: 10, color: C.inkMuted,
                fontWeight: 600, letterSpacing: 0.6,
              }}>INSURED</div>
            </div>
            <div className="grotesk" style={{
              fontSize: 16, fontWeight: 700, color: C.ink, marginTop: 6,
            }}>€1.500</div>
          </div>
        </div>

        {/* Subscription notice */}
        {hasSubscription && (
          <div style={{
            padding: 14, background: C.brand,
            borderRadius: 14, color: C.white,
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 16,
          }}>
            <Sparkles size={18} color={C.white} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                Covered by VELOCK Pro
              </div>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2,
              }}>
                No hourly cost — lock as long as you need (within 14 days)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom — unlock button */}
      <div style={{
        position: 'absolute', bottom: 76, left: 0, right: 0,
        padding: '16px 20px',
        background: `linear-gradient(to top, ${C.offWhite} 70%, transparent)`,
      }}>
        <button className="btn-primary" onClick={onUnlock}>
          <Unlock size={18} />
          Unlock locker
        </button>
      </div>

      <BottomNav active="lock" navigate={navigate} hasActiveLock={true} />
    </div>
  );
}

/* =================== NO LOCK SCREEN =================== */
function NoLockScreen({ time, navigate }) {
  return (
    <div style={{ background: C.offWhite, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <StatusBar time={time} dark={false} />

      <div style={{ padding: '8px 24px' }}>
        <VelockLogo width={88} />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px', textAlign: 'center',
      }}>
        <div style={{
          width: 110, height: 130, marginBottom: 24,
          background: C.white, border: `2px dashed ${C.border}`,
          borderRadius: 14, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            position: 'absolute', left: '50%', top: 0,
            transform: 'translateX(-50%)',
            width: 30, height: 4, background: C.border,
            borderRadius: '0 0 4px 4px',
          }}></div>
          <LockerIcon size={36} color={C.inkFaint} strokeWidth={1.5} />
          <div style={{
            position: 'absolute', right: 10, top: '50%',
            transform: 'translateY(-50%)',
            width: 5, height: 22,
            background: C.border, borderRadius: 3,
          }}></div>
        </div>

        <div className="display" style={{
          fontSize: 22, fontWeight: 700, color: C.ink,
          letterSpacing: '-0.3px', marginBottom: 8,
        }}>
          No locker reserved
        </div>
        <div className="subtle" style={{
          maxWidth: 260, lineHeight: 1.5, marginBottom: 28,
        }}>
          Find a VELOCK station nearby and tuck your bike safely into its own locker.
        </div>
        <button className="btn-primary" onClick={() => navigate('map')} style={{ maxWidth: 240 }}>
          <MapPin size={18} />
          Find a station
        </button>
      </div>

      <BottomNav active="lock" navigate={navigate} />
    </div>
  );
}

/* =================== PROFILE SCREEN =================== */
function ProfileScreen({ time, hasSubscription, onToggleSubscription, onBack, navigate }) {
  const trips = [
    { from: 'Hauptbahnhof', to: 'Universität',  dist: '3.4 km', time: 'Today, 09:12', cost: hasSubscription ? 'Free' : '€0.83' },
    { from: 'Neumarkt',     to: 'Rudolfplatz',   dist: '1.8 km', time: 'Yesterday',    cost: hasSubscription ? 'Free' : '€0.50' },
    { from: 'Rudolfplatz',  to: 'Hauptbahnhof',  dist: '2.1 km', time: '2 days ago',   cost: hasSubscription ? 'Free' : '€0.67' },
  ];

  return (
    <div style={{ background: C.offWhite, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="header-red">
        <StatusBar time={time} dark={true} />

        <div style={{
          padding: '8px 24px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <ChevronLeft size={20} color={C.white} />
          </button>
          <VelockLogo width={88} color={C.white} />
          <div style={{ width: 40 }}></div>
        </div>

        <div style={{
          padding: '20px 28px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: C.white, color: C.brand,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700, fontSize: 24,
            position: 'relative',
          }}>
            TH
            {hasSubscription && (
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 22, height: 22, borderRadius: '50%',
                background: C.ink, border: `2px solid ${C.brand}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: C.white,
              }}>★</div>
            )}
          </div>
          <div>
            <div className="display" style={{
              fontSize: 20, fontWeight: 700, color: C.white,
              letterSpacing: '-0.2px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Tijn Hollander
              {hasSubscription && (
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 1,
                  padding: '3px 7px', borderRadius: 6,
                  background: C.white, color: C.brand,
                  fontFamily: "'Inter', sans-serif",
                }}>PRO</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
              {hasSubscription ? 'VELOCK Pro member' : 'Member since April 2026'}
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-area" style={{ padding: '20px 22px 100px' }}>

        {/* SUBSCRIPTION CARD */}
        {!hasSubscription ? (
          <div style={{
            background: `linear-gradient(135deg, ${C.brand} 0%, ${C.brandDark} 100%)`,
            borderRadius: 20, padding: 22, color: C.white,
            marginBottom: 24, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -50, right: -50,
              width: 180, height: 180, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{
                padding: '4px 10px', borderRadius: 100,
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: 10, fontWeight: 700, letterSpacing: 1, color: C.white,
              }}>
                ★ VELOCK PRO
              </span>
            </div>

            <div className="display" style={{
              fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px',
              lineHeight: 1.2, marginBottom: 6,
            }}>
              Lock unlimited.<br/>Pay nothing per hour.
            </div>
            <div style={{
              fontSize: 13, color: 'rgba(255,255,255,0.85)',
              marginBottom: 18, lineHeight: 1.45,
            }}>
              Skip the hourly rate. With Pro you can reserve any locker
              at any VELOCK station, up to 14 days per booking.
            </div>

            <div className="grotesk" style={{
              display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 18,
            }}>
              <span style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>€10</span>
              <span style={{
                fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 500,
              }}>/month</span>
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20,
            }}>
              {[
                'Unlimited locker reservations',
                'Priority locker booking',
                'Insured up to €1.500',
                'Cancel anytime',
              ].map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
                }}>
                  <CheckCircle2 size={16} color={C.white} strokeWidth={2.5} />
                  <span style={{ color: 'rgba(255,255,255,0.95)' }}>{f}</span>
                </div>
              ))}
            </div>

            <button onClick={onToggleSubscription} style={{
              width: '100%', padding: 16,
              background: C.white, color: C.brand,
              border: 'none', borderRadius: 14,
              fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              Subscribe to VELOCK Pro
              <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div style={{
            background: C.white,
            border: `1.5px solid ${C.brand}`,
            borderRadius: 20, padding: 20, marginBottom: 24,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: 14,
            }}>
              <div>
                <div style={{
                  display: 'inline-flex', gap: 6, alignItems: 'center',
                  padding: '4px 10px', borderRadius: 100,
                  background: C.brandSoft,
                  fontSize: 10, fontWeight: 700, letterSpacing: 1, color: C.brand,
                  marginBottom: 8,
                }}>
                  ★ ACTIVE · VELOCK PRO
                </div>
                <div className="display" style={{
                  fontSize: 18, fontWeight: 700, color: C.ink,
                }}>
                  All lockers free
                </div>
                <div className="subtle" style={{ marginTop: 2 }}>
                  Renews on 1 June 2026 · €10/month
                </div>
              </div>
              <div className="grotesk" style={{
                fontSize: 22, fontWeight: 700, color: C.brand,
              }}>€0</div>
            </div>

            <button onClick={onToggleSubscription} className="btn-ghost">
              Manage subscription
            </button>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <div className="stat-tile">
            <div className="subtle" style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
            }}>TRIPS</div>
            <div className="grotesk" style={{
              fontSize: 26, fontWeight: 700, color: C.ink, marginTop: 2,
            }}>47</div>
          </div>
          <div className="stat-tile">
            <div className="subtle" style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
            }}>KM RIDDEN</div>
            <div className="grotesk" style={{
              fontSize: 26, fontWeight: 700, color: C.ink, marginTop: 2,
            }}>128</div>
          </div>
          <div className="stat-tile dark">
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 0.5,
              color: 'rgba(255,255,255,0.8)',
            }}>CO₂ SAVED</div>
            <div className="grotesk" style={{
              fontSize: 26, fontWeight: 700, marginTop: 2,
            }}>22kg</div>
          </div>
        </div>

        <div className="display" style={{
          fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 12,
        }}>
          Recent trips
        </div>

        <div style={{
          background: C.white, borderRadius: 16,
          border: `1px solid ${C.border}`, overflow: 'hidden',
        }}>
          {trips.map((t, i) => (
            <div key={i} style={{
              padding: 16,
              borderBottom: i < trips.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 36, height: 36,
                background: C.brandSoft, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Navigation size={16} color={C.brand} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: C.ink,
                }}>
                  {t.from} → {t.to}
                </div>
                <div className="subtle" style={{ marginTop: 2 }}>
                  {t.time} · {t.dist}
                </div>
              </div>
              <div className="grotesk" style={{
                fontSize: 14, fontWeight: 700,
                color: t.cost === 'Free' ? C.success : C.ink,
              }}>
                {t.cost}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20, padding: 18,
          background: C.ink, borderRadius: 16, color: C.white,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
          }}>
            <Shield size={18} />
            <div className="display" style={{ fontWeight: 700, fontSize: 16 }}>
              Insured up to €1.500
            </div>
          </div>
          <div style={{
            fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5,
          }}>
            Every bike sealed in a VELOCK locker is covered by our anti-theft
            guarantee. The full bike — frame, battery and display — is protected
            for as long as it's locked.
          </div>
        </div>
      </div>

      <BottomNav active="profile" navigate={navigate} />
    </div>
  );
}

/* =================== BOTTOM NAV =================== */
function BottomNav({ active, navigate, hasActiveLock = false }) {
  const items = [
    { key: 'map',     label: 'MAP',     icon: MapPin },
    { key: 'lock',    label: 'MY LOCKER', icon: Lock },
    { key: 'profile', label: 'PROFILE', icon: User },
  ];
  return (
    <div className="nav-bar">
      {items.map(it => {
        const Icon = it.icon;
        const isActive = active === it.key;
        const showDot = it.key === 'lock' && hasActiveLock && !isActive;
        return (
          <button key={it.key}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => navigate && navigate(it.key)}>
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              {showDot && (
                <span style={{
                  position: 'absolute', top: -2, right: -4,
                  width: 8, height: 8, borderRadius: '50%',
                  background: C.success, boxShadow: `0 0 6px ${C.success}`,
                }}></span>
              )}
            </div>
            {it.label}
          </button>
        );
      })}
    </div>
  );
}