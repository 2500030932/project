import React, { useState, useCallback, memo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";
import Login from "./Login";
import "./App.css";

/* =========================
   Status Badge
========================= */
const StatusBadge = memo(({ status }) => {
  const className = status.toLowerCase().replace(/\s+/g, "-");
  return <span className={`status-badge ${className}`}>{status}</span>;
});

/* =========================
   Request Card
========================= */
const RequestCard = memo(({ request }) => (
  <div className="request-card">
    <h3>{request.title}</h3>
    <p>{request.description}</p>
    <StatusBadge status={request.status} />
    <Link to={`/request/${request.id}`} className="view-btn">
      View Details
    </Link>
  </div>
));

/* =========================
   Request List
========================= */
const RequestList = ({ requests }) => (
  <div className="container">
    <h2>All Service Requests</h2>

    {requests.length === 0 ? (
      <p className="empty">No requests available.</p>
    ) : (
      <div className="request-grid">
        {requests.map((req) => (
          <RequestCard key={req.id} request={req} />
        ))}
      </div>
    )}
  </div>
);

/* =========================
   Request Detail
========================= */
const RequestDetail = ({ requests, updateStatus }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const request = requests.find((r) => r.id === parseInt(id));

  if (!request) return <div className="not-found">Request Not Found</div>;

  return (
    <div className="container">
      <h2>{request.title}</h2>
      <p><strong>Description:</strong> {request.description}</p>
      <p><strong>Status:</strong> <StatusBadge status={request.status} /></p>

      <div className="button-group">
        {request.status !== "In Progress" && (
          <button onClick={() => updateStatus(request.id, "In Progress")}>
            Mark In Progress
          </button>
        )}
        {request.status !== "Resolved" && (
          <button onClick={() => updateStatus(request.id, "Resolved")}>
            Mark Resolved
          </button>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate("/")}>
        Back
      </button>
    </div>
  );
};

/* =========================
   Create Request
========================= */
const CreateRequest = ({ addRequest }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;
    addRequest(formData);
    navigate("/");
  };

  return (
    <div className="container">
      <h2>Create New Request</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

/* =========================
   Main App
========================= */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [requests, setRequests] = useState([
    {
      id: 1,
      title: "Fix Printer",
      description: "Printer not working in office.",
      status: "Pending",
    },
  ]);

  const addRequest = useCallback((data) => {
    setTimeout(() => {
      setRequests((prev) => [
        ...prev,
        { id: prev.length + 1, ...data, status: "Pending" },
      ]);
    }, 500);
  }, []);

  const updateStatus = useCallback((id, status) => {
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status } : req
        )
      );
    }, 500);
  }, []);

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <Login setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <>
          <nav className="navbar">
            <h1>Service Request Manager</h1>
            <div>
              <Link to="/">Home</Link>
              <Link to="/create">Create</Link>
              <button onClick={() => setIsAuthenticated(false)}>
                Logout
              </button>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<RequestList requests={requests} />} />
            <Route
              path="/request/:id"
              element={
                <RequestDetail
                  requests={requests}
                  updateStatus={updateStatus}
                />
              }
            />
            <Route
              path="/create"
              element={<CreateRequest addRequest={addRequest} />}
            />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;