import { useState } from "react";
import "./App.css";

const navItems = ["Home", "Trips", "Drivers", "Users", "Support"] as const;

type Tab = (typeof navItems)[number];

const analyticsSeries = [28, 34, 31, 45, 52, 49, 58, 63, 61, 72, 78, 84] as const;
const analyticsLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const [driverLocation, setDriverLocation] = useState({
    currentLocation: "",
    landmark: "",
    latitude: "",
    longitude: "",
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMessage, setGpsMessage] = useState("Click Use GPS to auto-fill coordinates.");

  const chartWidth = 520;
  const chartHeight = 220;
  const chartPadding = 22;
  const chartMin = Math.min(...analyticsSeries);
  const chartMax = Math.max(...analyticsSeries);
  const chartSpan = chartMax - chartMin || 1;
  const chartPoints = analyticsSeries
    .map((value, index) => {
      const x =
        chartPadding + (index * (chartWidth - chartPadding * 2)) / (analyticsSeries.length - 1);
      const y =
        chartHeight -
        chartPadding -
        ((value - chartMin) * (chartHeight - chartPadding * 2)) / chartSpan;
      return `${x},${y}`;
    })
    .join(" ");

  const analyticsCards = [
    { label: "Rides completed", value: "1,284", delta: "+18%" },
    { label: "Active drivers", value: "142", delta: "+9%" },
    { label: "Avg. response", value: "4.8 min", delta: "-12%" },
    { label: "Support tickets", value: "27", delta: "-5%" },
  ] as const;

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage("Geolocation is not supported in this browser.");
      return;
    }

    setGpsLoading(true);
    setGpsMessage("Fetching location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDriverLocation((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setGpsMessage("Location fetched successfully.");
        setGpsLoading(false);
      },
      () => {
        setGpsMessage("Unable to fetch location. Please allow location access.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <main className={collapsed ? "shell collapsed" : "shell"}>
      <aside className="navbar">
        <div className="navbar-top">
          <div className="brand">
            <div className="brand-mark">RO</div>
            <div className="brand-copy">
              <span className="eyebrow">RideOps</span>
              <h1>Ride Dashboard</h1>
            </div>
          </div>

          <button type="button" className="btn btn-ghost toggle-btn" onClick={() => setCollapsed((value) => !value)}>
            {collapsed ? "Open" : "Collapse"}
          </button>
        </div>

        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              className={activeTab === item ? "nav-link active" : "nav-link"}
              type="button"
              onClick={() => setActiveTab(item)}
              key={item}
            >
              <span className="nav-bullet" />
              <span className="nav-text">{item}</span>
            </button>
          ))}
        </nav>

        <div className="navbar-bottom">
          <span className="status-dot" />
          <p>System online</p>
        </div>
      </aside>

      <section className="page">
        {activeTab === "Home" && (
          <section className="analytics-panel">
            <div className="analytics-hero">
              <div>
                <span className="eyebrow">Analytics</span>
                <h2>Weekly operations snapshot</h2>
                <p>Track activity, driver coverage, and demand patterns from one place.</p>
              </div>

              <div className="analytics-badge">
                <span>Live trend</span>
                <strong>+14.2%</strong>
                <small>vs last week</small>
              </div>
            </div>

            <div className="analytics-grid">
              <div className="analytics-chart-card">
                <div className="analytics-chart-header">
                  <div>
                    <span className="chart-label">Ride volume</span>
                    <strong>Demand over the last 12 days</strong>
                  </div>
                  <div className="chart-legend">
                    {analyticsLabels.map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                </div>

                <svg className="analytics-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Ride volume line chart">
                  <defs>
                    <linearGradient id="analytics-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="analytics-line" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1d4ed8" />
                      <stop offset="100%" stopColor="#0f766e" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M ${chartPoints} L ${chartWidth - chartPadding},${chartHeight - chartPadding} L ${chartPadding},${chartHeight - chartPadding} Z`}
                    fill="url(#analytics-fill)"
                    opacity="0.95"
                  />
                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="url(#analytics-line)"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {analyticsSeries.map((value, index) => {
                    const x =
                      chartPadding +
                      (index * (chartWidth - chartPadding * 2)) / (analyticsSeries.length - 1);
                    const y =
                      chartHeight -
                      chartPadding -
                      ((value - chartMin) * (chartHeight - chartPadding * 2)) / chartSpan;

                    return <circle key={`${value}-${index}`} cx={x} cy={y} r="5" />;
                  })}
                </svg>
              </div>

              <div className="analytics-stats">
                {analyticsCards.map((card) => (
                  <article className="analytics-stat" key={card.label}>
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                    <small>{card.delta}</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="activity-strip">
              <div className="activity-card">
                <span className="chart-label">Recent activity</span>
                <ul>
                  <li>12 new trips created in the last hour</li>
                  <li>Driver supply is strongest in the downtown zone</li>
                  <li>Two support cases were resolved in under 10 minutes</li>
                </ul>
              </div>
              <div className="activity-card activity-accent">
                <span className="chart-label">Insights</span>
                <p>Morning demand is climbing fastest between 8:00 and 10:00 AM. Consider surfacing more drivers during that window.</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "Drivers" && (
          <section className="driver-card" id="drivers">
            <div className="driver-copy">
              <span className="eyebrow">Driver</span>
              <h2>Add location</h2>
              <p>Use this form to add or update your live locations as a driver.</p>

              <div className="form-note">
                <span>Quick tips</span>
                <ul>
                  <li>Keep the current location short and exact</li>
                  <li>Use a landmark for faster matching</li>
                  <li>Latitude and longitude help improve accuracy</li>
                </ul>
              </div>
            </div>

            <form className="driver-form">
              <div className="form-grid">
                <label>
                  Current location
                  <input
                    type="text"
                    placeholder="Enter current location"
                    value={driverLocation.currentLocation}
                    onChange={(event) =>
                      setDriverLocation((prev) => ({ ...prev, currentLocation: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Landmark
                  <input
                    type="text"
                    placeholder="Nearby landmark"
                    value={driverLocation.landmark}
                    onChange={(event) =>
                      setDriverLocation((prev) => ({ ...prev, landmark: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Latitude
                  <input
                    type="text"
                    placeholder="12.9716"
                    value={driverLocation.latitude}
                    onChange={(event) =>
                      setDriverLocation((prev) => ({ ...prev, latitude: event.target.value }))
                    }
                  />
                </label>
                <label>
                  Longitude
                  <input
                    type="text"
                    placeholder="77.5946"
                    value={driverLocation.longitude}
                    onChange={(event) =>
                      setDriverLocation((prev) => ({ ...prev, longitude: event.target.value }))
                    }
                  />
                </label>
              </div>
              <p className="gps-message">{gpsMessage}</p>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={fetchCurrentLocation} disabled={gpsLoading}>
                  {gpsLoading ? "Fetching..." : "Use GPS"}
                </button>
                <button type="submit" className="btn btn-primary">
                  Save location
                </button>
              </div>
            </form>
          </section>
        )}

        {activeTab === "Users" && (
          <section className="driver-card user-card" id="users">
            <div className="driver-copy">
              <span className="eyebrow">User</span>
              <h2>Add ride request</h2>
              <p>Use this form to add pickup and dropoff locations as a rider.</p>

              <div className="form-note">
                <span>Trip details</span>
                <ul>
                  <li>Enter pickup and dropoff clearly</li>
                  <li>Select the vehicle type you want</li>
                  <li>Add a bid if you want faster matching</li>
                </ul>
              </div>
            </div>

            <form className="driver-form">
              <div className="form-grid">
                <label>
                  Pickup location
                  <input type="text" placeholder="Enter pickup location" />
                </label>
                <label>
                  Dropoff location
                  <input type="text" placeholder="Enter dropoff location" />
                </label>
                <label>
                  Ride type
                  <select defaultValue="sedan">
                    <option value="mini">Mini</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                  </select>
                </label>
                <label>
                  Bid
                  <input type="text" placeholder="Enter bid amount" />
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary">
                  Preview route
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit request
                </button>
              </div>
            </form>
          </section>
        )}

        {activeTab !== "Drivers" && activeTab !== "Users" && (
          activeTab !== "Home" && <div className="page-empty">Select Drivers or Users to view a form.</div>
        )}

        <footer className="footer">
          <div>
            <strong>RideOps</strong>
            <p>Navigation shell with a collapsible sidebar and simple footer.</p>
          </div>

          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#trips">Trips</a>
            <a href="#drivers">Drivers</a>
            <a href="#support">Support</a>
          </div>
        </footer>
      </section>
    </main>
  );
}

export default App;
