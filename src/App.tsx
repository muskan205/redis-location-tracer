import { useState } from "react";
import "./App.css";

const navItems = ["Home", "Trips", "Drivers", "Users", "Support"] as const;

type Tab = (typeof navItems)[number];

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
          <div className="page-empty">Select Drivers or Users to view a form.</div>
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
