import React, { useState, useEffect } from 'react';
import { Settings, Lock, Unlock, MapPin, Bike, Clock, Shield, ChevronLeft, Bell, Battery, Wifi, Signal, Navigation, Zap, CheckCircle2, AlertCircle, User, ChevronRight, X, Search } from 'lucide-react';

export default function VelockApp() {
  const [screen, setScreen] = useState('map'); // map | station | locking | locked | profile
  const [selectedStation, setSelectedStation] = useState(null);
  const [lockProgress, setLockProgress] = useState(0);
  const [time, setTime] = useState('9:41');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [activeLock, setActiveLock] = useState(null); // station object when bike is locked

  // Simulate lock progress
  useEffect(() => {
    if (screen === 'locking') {
      const interval = setInterval(() => {
        setLockProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setActiveLock(selectedStation);
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
  }, [screen, selectedStation]);

  // Timer for locked screen
  useEffect(() => {
    if (screen === 'locked') {
      const interval = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedSeconds(0);
    }
  }, [screen]);

  const formatElapsed = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  // Central navigation handler used by bottom nav
  const navigate = (target) => {
    if (target === 'map') {
      setScreen('map');
    } else if (target === 'lock') {
      // If a bike is currently locked, jump to the locked screen
      if (activeLock) {
        setSelectedStation(activeLock);
        setScreen('locked');
      } else {
        setScreen('no-lock');
      }
    } else if (target === 'profile') {
      setScreen('profile');
    }
  };

  const stations = [
    { id: 1, name: 'Köln Hauptbahnhof', distance: '120 m', available: 14, total: 20, x: 52, y: 38 },
    { id: 2, name: 'Domplatz', distance: '340 m', available: 6, total: 12, x: 38, y: 52 },
    { id: 3, name: 'Universität Köln', distance: '780 m', available: 18, total: 24, x: 65, y: 64 },
    { id: 4, name: 'Barbarossaplatz', distance: '1.1 km', available: 3, total: 16, x: 28, y: 72 },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        .phone-frame {
          width: 380px;
          height: 780px;
          background: #0a0a0a;
          border-radius: 50px;
          padding: 12px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 2px #2a2a2a;
          position: relative;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: #0d0d0d;
          border-radius: 40px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .notch {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 30px;
          background: #000;
          border-radius: 20px;
          z-index: 100;
        }

        .status-bar {
          padding: 14px 28px 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          z-index: 50;
          position: relative;
        }

        .status-icons {
          display: flex;
          gap: 5px;
          align-items: center;
        }

        /* Map background */
        .map-bg {
          position: absolute;
          inset: 0;
          background: #1a1a1a;
        }

        .map-svg { width: 100%; height: 100%; }

        .floating-btn {
          width: 44px;
          height: 44px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: transform 0.15s;
          border: none;
        }
        .floating-btn:active { transform: scale(0.92); }

        .station-pin {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
        }
        .station-pin .pin-dot {
          width: 14px;
          height: 14px;
          background: #fff;
          border-radius: 50%;
          border: 3px solid #0a0a0a;
          box-shadow: 0 0 0 1px #fff;
          transition: transform 0.2s;
        }
        .station-pin:hover .pin-dot,
        .station-pin.active .pin-dot {
          transform: scale(1.3);
        }
        .station-pin .pulse {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .you-marker {
          position: absolute;
          left: 50%;
          top: 45%;
          transform: translate(-50%, -50%);
        }
        .you-marker .you-dot {
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          border: 3px solid #0a0a0a;
          position: relative;
          z-index: 2;
        }
        .you-marker .you-cone {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60px;
          height: 60px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle at 50% 50%, rgba(180, 220, 255, 0.6) 0%, transparent 60%);
          clip-path: polygon(50% 50%, 0% 100%, 100% 100%);
          transform-origin: center;
          rotate: 220deg;
        }

        /* Bottom card */
        .bottom-card {
          background: #f5f5f5;
          border-radius: 32px 32px 0 0;
          padding: 20px 24px 28px;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.4);
          position: relative;
          z-index: 10;
        }
        .card-handle {
          width: 40px;
          height: 4px;
          background: #d4d4d4;
          border-radius: 2px;
          margin: 0 auto 16px;
        }

        .station-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid #e5e5e5;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .station-row:active { opacity: 0.6; }
        .station-row:last-child { border-bottom: none; }

        .station-icon-wrap {
          width: 44px;
          height: 44px;
          background: #0d1f2d;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .header-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #0d1f2d;
          letter-spacing: -0.5px;
        }
        .subtle { color: #6b7280; font-size: 13px; }

        /* Big lock button */
        .lock-circle {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: #0d1f2d;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 32px auto 24px;
          position: relative;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .lock-circle:active { transform: scale(0.96); }
        .lock-circle::before {
          content: '';
          position: absolute;
          inset: -8px;
          border: 1px dashed #c4c4c4;
          border-radius: 50%;
        }

        /* Locking animation */
        .lock-progress-ring {
          position: absolute;
          inset: -8px;
          transform: rotate(-90deg);
        }

        .stat-tile {
          background: #fff;
          border: 1px solid #e5e5e5;
          border-radius: 16px;
          padding: 16px;
          flex: 1;
        }
        .stat-tile.dark {
          background: #0d1f2d;
          border-color: #0d1f2d;
          color: #fff;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
        }
        .pill.green { background: #d1fae5; color: #065f46; }
        .pill.amber { background: #fef3c7; color: #92400e; }
        .pill.red { background: #fee2e2; color: #991b1b; }

        .nav-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          border-top: 1px solid #e5e5e5;
          padding: 14px 0 28px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 20;
        }
        .nav-item {
          background: transparent;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #9ca3af;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 12px;
          letter-spacing: 0.5px;
        }
        .nav-item.active { color: #0d1f2d; }

        .home-indicator {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 4px;
          background: #fff;
          border-radius: 2px;
          opacity: 0.4;
          z-index: 30;
        }

        .primary-btn {
          width: 100%;
          background: #0d1f2d;
          color: #fff;
          border: none;
          padding: 16px;
          border-radius: 16px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.15s;
          font-family: inherit;
        }
        .primary-btn:active { transform: scale(0.98); }
        .primary-btn.danger { background: #991b1b; }

        .secondary-btn {
          width: 100%;
          background: transparent;
          color: #0d1f2d;
          border: 1.5px solid #d4d4d4;
          padding: 14px;
          border-radius: 16px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
        }

        .availability-bar {
          height: 6px;
          background: #e5e5e5;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 6px;
        }
        .availability-fill {
          height: 100%;
          background: #0d1f2d;
          border-radius: 3px;
          transition: width 0.3s;
        }

        .scroll-area {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .scroll-area::-webkit-scrollbar { display: none; }

        .pole-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin: 16px 0;
        }
        .pole {
          aspect-ratio: 1;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
        }
        .pole.free {
          background: #fff;
          border: 1.5px solid #d4d4d4;
          color: #0d1f2d;
          cursor: pointer;
        }
        .pole.free:hover { border-color: #0d1f2d; }
        .pole.taken {
          background: #f0f0f0;
          color: #c4c4c4;
        }
        .pole.selected {
          background: #0d1f2d;
          color: #fff;
          border: none;
          box-shadow: 0 4px 12px rgba(13,31,45,0.3);
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-up { animation: slideUp 0.35s ease-out; }
        .animate-in { animation: fadeIn 0.25s ease-out; }
      `}</style>

      <div className="phone-frame">
        <div className="notch"></div>
        <div className="phone-screen">

          {/* MAP SCREEN */}
          {screen === 'map' && <MapScreen
            time={time}
            stations={stations}
            onSelectStation={(s) => { setSelectedStation(s); setScreen('station'); }}
            onProfile={() => setScreen('profile')}
            navigate={navigate}
            activeLock={activeLock}
          />}

          {/* STATION DETAIL */}
          {screen === 'station' && selectedStation && <StationScreen
            time={time}
            station={selectedStation}
            hasSubscription={hasSubscription}
            onBack={() => setScreen('map')}
            onLock={() => setScreen('locking')}
          />}

          {/* LOCKING ANIMATION */}
          {screen === 'locking' && <LockingScreen
            time={time}
            progress={lockProgress}
            onCancel={() => setScreen('station')}
          />}

          {/* LOCKED / ACTIVE */}
          {screen === 'locked' && selectedStation && <LockedScreen
            time={time}
            station={selectedStation}
            elapsed={formatElapsed(elapsedSeconds)}
            hasSubscription={hasSubscription}
            onUnlock={() => {
              setActiveLock(null);
              setScreen('map');
              setSelectedStation(null);
            }}
            navigate={navigate}
          />}

          {/* NO ACTIVE LOCK */}
          {screen === 'no-lock' && <NoLockScreen
            time={time}
            navigate={navigate}
          />}

          {/* PROFILE */}
          {screen === 'profile' && <ProfileScreen
            time={time}
            hasSubscription={hasSubscription}
            onToggleSubscription={() => setHasSubscription(s => !s)}
            onBack={() => setScreen('map')}
            navigate={navigate}
          />}

          <div className="home-indicator"></div>
        </div>
      </div>
    </div>
  );
}

/* =================== STATUS BAR =================== */
function StatusBar({ time, dark = true }) {
  const c = dark ? '#fff' : '#0d1f2d';
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
function MapScreen({ time, stations, onSelectStation, onProfile, navigate, activeLock }) {
  return (
    <>
      {/* Map */}
      <div style={{ position: 'absolute', inset: 0, height: '55%' }}>
        <MapBackground />

        {/* "You are here" cone marker */}
        <div className="you-marker">
          <div className="you-cone"></div>
          <div className="you-dot"></div>
        </div>

        {/* Station pins */}
        {stations.map(s => (
          <div
            key={s.id}
            className="station-pin"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            onClick={() => onSelectStation(s)}
          >
            <div className="pulse"></div>
            <div className="pin-dot"></div>
          </div>
        ))}
      </div>

      <StatusBar time={time} dark={true} />

      {/* Settings button */}
      <button
        className="floating-btn"
        style={{ position: 'absolute', top: 56, right: 20, zIndex: 20 }}
        onClick={onProfile}
      >
        <Settings size={20} color="#0d1f2d" strokeWidth={2.2} />
      </button>

      {/* Search pill */}
      <div style={{
        position: 'absolute',
        top: 56, left: 20, zIndex: 20,
        background: '#fff',
        borderRadius: 100,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        width: 240,
      }}>
        <Search size={16} color="#9ca3af" />
        <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Search a destination…</span>
      </div>

      {/* Bottom sheet */}
      <div style={{
        position: 'absolute',
        bottom: 80, left: 0, right: 0,
        zIndex: 15,
      }}>
        <div className="bottom-card animate-up">
          <div className="card-handle"></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 }}>
            <div>
              <div className="subtle" style={{ marginBottom: 2 }}>NEAREST STATIONS</div>
              <div className="header-title">Köln Innenstadt</div>
            </div>
            <span className="pill green">
              <span style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }}></span>
              41 free
            </span>
          </div>

          <div style={{ marginTop: 12, maxHeight: 240, overflowY: 'auto' }}>
            {stations.map(s => (
              <div key={s.id} className="station-row" onClick={() => onSelectStation(s)}>
                <div className="station-icon-wrap">
                  <Bike size={20} color="#fff" strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: 14, color: '#0d1f2d',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{s.name}</div>
                  <div className="subtle" style={{ marginTop: 2 }}>
                    {s.distance} away · {s.available}/{s.total} poles free
                  </div>
                </div>
                <ChevronRight size={18} color="#9ca3af" />
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
      <defs>
        <pattern id="mapTexture" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="#1a1a1a" />
        </pattern>
      </defs>
      <rect width="380" height="430" fill="#161616" />

      {/* Water/parks (subtle blocks) */}
      <rect x="0" y="320" width="380" height="110" fill="#0e0e0e" />
      <rect x="240" y="0" width="40" height="180" fill="#0e0e0e" opacity="0.5" />
      <rect x="40" y="220" width="80" height="60" fill="#0e0e0e" opacity="0.5" />

      {/* Major roads */}
      <g stroke="#2c2c2c" strokeWidth="6" fill="none">
        <line x1="0" y1="120" x2="380" y2="135" />
        <line x1="0" y1="280" x2="380" y2="300" />
        <line x1="180" y1="0" x2="200" y2="430" />
        <line x1="-20" y1="0" x2="120" y2="430" />
        <line x1="280" y1="0" x2="380" y2="200" />
      </g>
      <g stroke="#3a3a3a" strokeWidth="2" fill="none">
        <line x1="0" y1="120" x2="380" y2="135" />
        <line x1="0" y1="280" x2="380" y2="300" />
        <line x1="180" y1="0" x2="200" y2="430" />
        <line x1="-20" y1="0" x2="120" y2="430" />
      </g>

      {/* Minor streets */}
      <g stroke="#252525" strokeWidth="1.5" fill="none">
        <line x1="0" y1="60" x2="380" y2="70" />
        <line x1="0" y1="180" x2="380" y2="200" />
        <line x1="0" y1="240" x2="380" y2="260" />
        <line x1="0" y1="360" x2="380" y2="380" />
        <line x1="60" y1="0" x2="80" y2="430" />
        <line x1="240" y1="0" x2="260" y2="430" />
        <line x1="320" y1="0" x2="340" y2="430" />
      </g>

      {/* Building blocks */}
      <g fill="#1d1d1d">
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

      {/* Street labels */}
      <g fontFamily="Inter, sans-serif" fontSize="9" fill="#5a5a5a" fontWeight="500">
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

/* =================== STATION SCREEN =================== */
function StationScreen({ time, station, hasSubscription, onBack, onLock }) {
  const [selectedPole, setSelectedPole] = useState(null);
  const poles = Array.from({ length: station.total }, (_, i) => ({
    id: i + 1,
    free: i < station.available,
  }));

  return (
    <div style={{ background: '#f5f5f5', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#0d1f2d', padding: '0 0 28px', borderRadius: '0 0 32px 32px' }}>
        <StatusBar time={time} dark={true} />

        <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <ChevronLeft size={20} color="#fff" />
          </button>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, fontWeight: 600 }}>
            STATION
          </div>
          <div style={{ width: 40 }}></div>
        </div>

        <div style={{ padding: '20px 28px 0' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, fontWeight: 600, marginBottom: 6 }}>
            {station.distance.toUpperCase()} AWAY
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28, fontWeight: 700, color: '#fff',
            letterSpacing: '-0.5px', lineHeight: 1.1,
          }}>
            {station.name}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <span className="pill green">
              <CheckCircle2 size={12} />
              {station.available} free
            </span>
            <span className="pill" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>
              <Shield size={12} />
              24/7 monitored
            </span>
          </div>
        </div>
      </div>

      <div className="scroll-area" style={{ padding: '20px 24px 100px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div className="stat-tile">
            <div className="subtle" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>RATE</div>
            {hasSubscription ? (
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#0d1f2d', marginTop: 4 }}>
                Free<span style={{ fontSize: 13, color: '#10b981', fontWeight: 600, marginLeft: 6 }}>● PRO</span>
              </div>
            ) : (
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#0d1f2d', marginTop: 4 }}>
                €0.50<span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>/hr</span>
              </div>
            )}
          </div>
          <div className="stat-tile">
            <div className="subtle" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>AVAILABILITY</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: '#0d1f2d', marginTop: 4 }}>
              {station.available}<span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>/{station.total}</span>
            </div>
            <div className="availability-bar">
              <div className="availability-fill" style={{ width: `${(station.available/station.total)*100}%` }}></div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8,
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 17, fontWeight: 700, color: '#0d1f2d',
          }}>Choose a pole</div>
          <span className="subtle">{selectedPole ? `Pole #${selectedPole}` : 'Tap to select'}</span>
        </div>

        <div className="pole-grid">
          {poles.map(p => (
            <div
              key={p.id}
              className={`pole ${!p.free ? 'taken' : selectedPole === p.id ? 'selected' : 'free'}`}
              onClick={() => p.free && setSelectedPole(p.id)}
            >
              {p.id.toString().padStart(2, '0')}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, fontSize: 11, color: '#6b7280', marginTop: 4 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, background: '#fff', border: '1.5px solid #d4d4d4', borderRadius: 3 }}></span>
            Free
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 12 }}>
            <span style={{ width: 10, height: 10, background: '#f0f0f0', borderRadius: 3 }}></span>
            Taken
          </span>
        </div>

        <div style={{
          marginTop: 24, padding: 16,
          background: '#fff', borderRadius: 16,
          border: '1px solid #e5e5e5',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 36, height: 36,
              background: '#fef3c7', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Zap size={18} color="#92400e" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0d1f2d', marginBottom: 2 }}>
                Quick tip
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>
                Hold your phone near the selected pole to lock instantly. No keys, no chains.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 20px 32px',
        background: 'linear-gradient(to top, #f5f5f5 70%, transparent)',
      }}>
        <button
          className="primary-btn"
          onClick={onLock}
          disabled={!selectedPole}
          style={{ opacity: selectedPole ? 1 : 0.4 }}
        >
          <Lock size={18} />
          Lock my bike{selectedPole ? ` at #${selectedPole.toString().padStart(2,'0')}` : ''}
        </button>
      </div>
    </div>
  );
}

/* =================== LOCKING SCREEN =================== */
function LockingScreen({ time, progress, onCancel }) {
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ background: '#f5f5f5', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <StatusBar time={time} dark={false} />

      <div style={{ padding: '8px 24px' }}>
        <button onClick={onCancel} style={{
          width: 40, height: 40, borderRadius: '50%',
          background: '#fff', border: '1px solid #e5e5e5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <X size={18} color="#0d1f2d" />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 32px' }}>
        <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: 1.5, fontWeight: 600, marginTop: 20 }}>
          ENGAGING LOCK
        </div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26, fontWeight: 700, color: '#0d1f2d',
          marginTop: 8, textAlign: 'center', letterSpacing: '-0.5px',
        }}>
          Hold your phone near<br/>the pole
        </div>

        <div className="lock-circle" style={{ marginTop: 48 }}>
          <svg className="lock-progress-ring" viewBox="0 0 200 200" width="216" height="216">
            <circle cx="100" cy="100" r={radius} fill="none" stroke="#e5e5e5" strokeWidth="3" />
            <circle
              cx="100" cy="100" r={radius}
              fill="none" stroke="#0d1f2d" strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
            />
          </svg>
          <Lock size={56} color="#fff" strokeWidth={1.8} />
        </div>

        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 32, fontWeight: 700, color: '#0d1f2d',
        }}>
          {progress}%
        </div>
        <div className="subtle" style={{ marginTop: 6, textAlign: 'center', maxWidth: 240 }}>
          {progress < 30 && 'Searching for pole signal...'}
          {progress >= 30 && progress < 70 && 'Authenticating with pole #07...'}
          {progress >= 70 && progress < 100 && 'Engaging mechanism...'}
          {progress === 100 && 'Bike secured ✓'}
        </div>

        <div style={{
          marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', background: '#fff', borderRadius: 100,
          border: '1px solid #e5e5e5', fontSize: 12, color: '#6b7280',
        }}>
          <Shield size={14} color="#10b981" />
          End-to-end encrypted connection
        </div>
      </div>
    </div>
  );
}

/* =================== LOCKED SCREEN =================== */
function LockedScreen({ time, station, elapsed, hasSubscription, onUnlock, navigate }) {
  return (
    <div style={{ background: '#0d1f2d', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <StatusBar time={time} dark={true} />

      <div style={{ flex: 1, padding: '12px 28px 100px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'inline-flex', alignSelf: 'flex-start',
          gap: 6, alignItems: 'center',
          padding: '6px 12px', background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 100,
        }}>
          <span style={{
            width: 8, height: 8, background: '#10b981', borderRadius: '50%',
            boxShadow: '0 0 10px #10b981',
          }}></span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981', letterSpacing: 0.3 }}>
            LOCKED & SECURE
          </span>
        </div>

        <div style={{ marginTop: 32, color: '#fff' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, fontWeight: 600 }}>
            YOUR BIKE IS AT
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 26, fontWeight: 700,
            marginTop: 6, letterSpacing: '-0.5px',
          }}>
            {station.name}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            Pole #07 · {station.distance} away
          </div>
        </div>

        {/* Timer */}
        <div style={{
          marginTop: 36, padding: '32px 24px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24, textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, fontWeight: 600, marginBottom: 12 }}>
            LOCKED FOR
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 56, fontWeight: 700, color: '#fff',
            letterSpacing: '-2px', lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {elapsed}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 12 }}>
            {hasSubscription ? (
              <span>Covered by <strong style={{ color: '#10b981' }}>VELOCK Pro</strong> · €0.00</span>
            ) : (
              <span>Current charge · €{(0.50 * Math.max(elapsed.split(':')[0] * 1 + elapsed.split(':')[1]/60, 0.0167)).toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Status pills */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <div style={{
            flex: 1, padding: 14,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bell size={14} color="#fff" />
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: 0.5 }}>
                ALERTS
              </div>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 6 }}>
              On
            </div>
          </div>
          <div style={{
            flex: 1, padding: 14,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={14} color="#fff" />
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: 0.5 }}>
                SIGNAL
              </div>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 6 }}>
              Strong
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}></div>

        {/* Unlock big button */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onUnlock} className="primary-btn" style={{
            background: '#fff', color: '#0d1f2d',
          }}>
            <Unlock size={18} />
            Unlock bike
          </button>
        </div>
      </div>

      <BottomNav active="lock" dark navigate={navigate} hasActiveLock={true} />
    </div>
  );
}

/* =================== PROFILE SCREEN =================== */
function ProfileScreen({ time, hasSubscription, onToggleSubscription, onBack, navigate }) {
  const trips = [
    { from: 'Hauptbahnhof', to: 'Universität', dist: '3.4 km', time: 'Today, 09:12', cost: hasSubscription ? 'Free' : '€0.83' },
    { from: 'Domplatz', to: 'Barbarossaplatz', dist: '1.8 km', time: 'Yesterday', cost: hasSubscription ? 'Free' : '€0.50' },
    { from: 'Rudolfplatz', to: 'Hauptbahnhof', dist: '2.1 km', time: '2 days ago', cost: hasSubscription ? 'Free' : '€0.67' },
  ];

  return (
    <div style={{ background: '#f5f5f5', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#0d1f2d', borderRadius: '0 0 32px 32px', paddingBottom: 28 }}>
        <StatusBar time={time} dark={true} />

        <div style={{ padding: '8px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <ChevronLeft size={20} color="#fff" />
          </button>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, fontWeight: 600 }}>
            PROFILE
          </div>
          <div style={{ width: 40 }}></div>
        </div>

        <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, color: '#0d1f2d', fontSize: 22,
            position: 'relative',
          }}>
            TH
            {hasSubscription && (
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 22, height: 22, borderRadius: '50%',
                background: '#10b981', border: '2px solid #0d1f2d',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#fff',
              }}>
                ★
              </div>
            )}
          </div>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 20, fontWeight: 700, color: '#fff',
              letterSpacing: '-0.3px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Tijn Hollander
              {hasSubscription && (
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 1,
                  padding: '3px 7px', borderRadius: 6,
                  background: '#10b981', color: '#fff',
                }}>PRO</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              {hasSubscription ? 'VELOCK Pro member' : 'Member since April 2026'}
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-area" style={{ padding: '20px 24px 100px' }}>

        {/* SUBSCRIPTION CARD */}
        {!hasSubscription ? (
          <div style={{
            background: 'linear-gradient(135deg, #0d1f2d 0%, #1a3a52 100%)',
            borderRadius: 20, padding: 22, color: '#fff',
            marginBottom: 24, position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative pattern */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 160, height: 160, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}></div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                padding: '4px 10px', borderRadius: 100,
                background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
                fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#10b981',
              }}>
                ★ VELOCK PRO
              </div>
            </div>

            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px',
              lineHeight: 1.2, marginBottom: 6,
            }}>
              Lock unlimited.<br/>Pay nothing per hour.
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 20, lineHeight: 1.4 }}>
              Skip the hourly rate. With Pro you can lock your bike at any VELOCK station, anytime, as long as you want.
            </div>

            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 6,
              fontFamily: "'Space Grotesk', sans-serif", marginBottom: 16,
            }}>
              <span style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>€10</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>/month</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {[
                'Unlimited locks at any station',
                'Priority pole reservation',
                'Insured up to €1.500',
                'Cancel anytime',
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                  <CheckCircle2 size={16} color="#10b981" strokeWidth={2.5} />
                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onToggleSubscription}
              style={{
                width: '100%', padding: 16,
                background: '#10b981', color: '#fff',
                border: 'none', borderRadius: 14,
                fontWeight: 700, fontSize: 14, letterSpacing: 0.3,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'transform 0.15s',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Subscribe to VELOCK Pro
              <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div style={{
            background: '#fff',
            border: '1.5px solid #10b981',
            borderRadius: 20, padding: 20,
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{
                  display: 'inline-flex', gap: 6, alignItems: 'center',
                  padding: '4px 10px', borderRadius: 100,
                  background: '#d1fae5',
                  fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#065f46',
                  marginBottom: 8,
                }}>
                  ★ ACTIVE · VELOCK PRO
                </div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 18, fontWeight: 700, color: '#0d1f2d',
                }}>
                  All locks free
                </div>
                <div className="subtle" style={{ marginTop: 2 }}>
                  Renews on 1 June 2026 · €10/month
                </div>
              </div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 22, fontWeight: 700, color: '#10b981',
              }}>€0</div>
            </div>

            <button
              onClick={onToggleSubscription}
              style={{
                width: '100%', padding: 12,
                background: 'transparent', color: '#6b7280',
                border: '1px solid #e5e5e5', borderRadius: 12,
                fontWeight: 600, fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Manage subscription
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <div className="stat-tile">
            <div className="subtle" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>TRIPS</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: '#0d1f2d', marginTop: 2 }}>
              47
            </div>
          </div>
          <div className="stat-tile">
            <div className="subtle" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5 }}>KM RIDDEN</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: '#0d1f2d', marginTop: 2 }}>
              128
            </div>
          </div>
          <div className="stat-tile dark">
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: 'rgba(255,255,255,0.6)' }}>CO₂ SAVED</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, marginTop: 2 }}>
              22kg
            </div>
          </div>
        </div>

        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 17, fontWeight: 700, color: '#0d1f2d', marginBottom: 12,
        }}>
          Recent trips
        </div>

        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e5e5', overflow: 'hidden' }}>
          {trips.map((t, i) => (
            <div key={i} style={{
              padding: 16,
              borderBottom: i < trips.length - 1 ? '1px solid #f0f0f0' : 'none',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 36, height: 36,
                background: '#f5f5f5', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Navigation size={16} color="#0d1f2d" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0d1f2d' }}>
                  {t.from} → {t.to}
                </div>
                <div className="subtle" style={{ marginTop: 2 }}>
                  {t.time} · {t.dist}
                </div>
              </div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14, fontWeight: 700,
                color: t.cost === 'Free' ? '#10b981' : '#0d1f2d',
              }}>
                {t.cost}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20, padding: 18,
          background: '#0d1f2d', borderRadius: 16, color: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Shield size={18} />
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15 }}>
              Insured up to €1.500
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            Every locked bike is covered by our anti-theft guarantee while it's docked at a VELOCK pole.
          </div>
        </div>
      </div>

      <BottomNav active="profile" navigate={navigate} />
    </div>
  );
}

/* =================== NO LOCK SCREEN =================== */
function NoLockScreen({ time, navigate }) {
  return (
    <div style={{ background: '#f5f5f5', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <StatusBar time={time} dark={false} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center' }}>
        <div style={{
          width: 110, height: 110, borderRadius: '50%',
          background: '#fff', border: '1px solid #e5e5e5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <Bike size={48} color="#0d1f2d" strokeWidth={1.6} />
        </div>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 22, fontWeight: 700, color: '#0d1f2d',
          letterSpacing: '-0.3px', marginBottom: 8,
        }}>
          No bike locked yet
        </div>
        <div className="subtle" style={{ maxWidth: 260, lineHeight: 1.5, marginBottom: 28 }}>
          Find a VELOCK station nearby and dock your bike to keep it safe.
        </div>
        <button
          className="primary-btn"
          onClick={() => navigate('map')}
          style={{ maxWidth: 240 }}
        >
          <MapPin size={18} />
          Find a station
        </button>
      </div>

      <BottomNav active="lock" navigate={navigate} />
    </div>
  );
}

/* =================== BOTTOM NAV =================== */
function BottomNav({ active, dark = false, navigate, hasActiveLock = false }) {
  const items = [
    { key: 'map', label: 'MAP', icon: MapPin },
    { key: 'lock', label: 'MY BIKE', icon: Lock },
    { key: 'profile', label: 'PROFILE', icon: User },
  ];
  return (
    <div className="nav-bar" style={dark ? {
      background: '#0a1620', borderTop: '1px solid rgba(255,255,255,0.08)',
    } : {}}>
      {items.map(it => {
        const Icon = it.icon;
        const isActive = active === it.key;
        const showDot = it.key === 'lock' && hasActiveLock && !isActive;
        return (
          <button
            key={it.key}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate && navigate(it.key)}
            style={dark ? { color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' } : {}}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
              {showDot && (
                <span style={{
                  position: 'absolute', top: -2, right: -4,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981',
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
