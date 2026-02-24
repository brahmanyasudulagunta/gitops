import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../services/api";

export default function ArgoCD() {
  const [form, setForm] = useState({
    app_name: "",
    namespace: "",
    image: "",
  });
  const [status, setStatus] = useState("");
  const [requestId, setRequestId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting request...");
    setRequestId(null);

    try {
      const result = await createApplication(form);
      setStatus(result.status);
      setRequestId(result.id);
      setForm({ app_name: "", namespace: "", image: "" });
    } catch {
      setStatus("Error submitting request");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Create ArgoCD Application</h2>
        <p className="subtitle">Submit an application deployment request for admin approval</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <label htmlFor="app_name">Application Name</label>
          <input
            id="app_name"
            type="text"
            placeholder="e.g. my-api"
            value={form.app_name}
            onChange={(e) => setForm({ ...form, app_name: e.target.value })}
            required
          />
          <label htmlFor="namespace">Namespace</label>
          <input
            id="namespace"
            type="text"
            placeholder="e.g. payments"
            value={form.namespace}
            onChange={(e) => setForm({ ...form, namespace: e.target.value })}
            required
          />
          <label htmlFor="image">Docker Image</label>
          <input
            id="image"
            type="text"
            placeholder="e.g. username/app:v1"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
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
