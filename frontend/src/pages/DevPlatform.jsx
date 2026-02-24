import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNamespace } from "../services/api";

export default function DevPlatform() {
  const [namespace, setNamespace] = useState("");
  const [status, setStatus] = useState("");
  const [requestId, setRequestId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting request...");
    setRequestId(null);

    try {
      const result = await createNamespace(namespace);
      setStatus(result.status);
      setRequestId(result.id);
      setNamespace("");
    } catch (err) {
      setStatus("Error submitting request");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Create Namespace</h2>
        <p className="subtitle">Submit a namespace creation request for admin approval</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <label htmlFor="namespace">Namespace Name</label>
          <input
            id="namespace"
            type="text"
            placeholder="e.g. payments, auth-service"
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary">Submit Request</button>
        </form>

        {status && (
          <div className="status-message">
            <p>{status}</p>
            {requestId && (
              <p className="request-id">
                Request ID: <strong>#{requestId}</strong> —{" "}
                <span className="link" onClick={() => navigate("/")}>
                  View on Dashboard
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
