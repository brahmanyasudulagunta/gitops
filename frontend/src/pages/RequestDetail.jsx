import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRequest, approveRequest, rejectRequest } from "../services/api";

export default function RequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionStatus, setActionStatus] = useState("");

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const data = await getRequest(id);
                setRequest(data);
            } catch (err) {
                console.error("Failed to fetch request", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [id]);

    const handleApprove = async () => {
        setActionStatus("Approving...");
        const result = await approveRequest(id);
        setRequest({ ...request, status: result.status });
        setActionStatus("Request approved!");
    };

    const handleReject = async () => {
        setActionStatus("Rejecting...");
        const result = await rejectRequest(id);
        setRequest({ ...request, status: result.status });
        setActionStatus("Request rejected.");
    };

    const statusClass = (status) => {
        switch (status) {
            case "PENDING": return "badge badge-pending";
            case "APPROVED": return "badge badge-approved";
            case "REJECTED": return "badge badge-rejected";
            default: return "badge";
        }
    };

    if (loading) return <div className="card"><p>Loading...</p></div>;
    if (!request) return <div className="card"><p>Request not found.</p></div>;

    return (
        <div>
            <div className="page-header">
                <h2>Request #{request.id}</h2>
                <span className={statusClass(request.status)}>{request.status}</span>
            </div>

            <div className="card detail-card">
                <div className="detail-grid">
                    <div className="detail-label">Type</div>
                    <div className="detail-value">{request.request_type}</div>

                    <div className="detail-label">Status</div>
                    <div className="detail-value">
                        <span className={statusClass(request.status)}>{request.status}</span>
                    </div>

                    <div className="detail-label">Submitted</div>
                    <div className="detail-value">{new Date(request.created_at).toLocaleString()}</div>

                    <div className="detail-label">Updated</div>
                    <div className="detail-value">{new Date(request.updated_at).toLocaleString()}</div>
                </div>

                <h3 className="payload-title">Payload</h3>
                <div className="payload-grid">
                    {Object.entries(request.payload).map(([key, value]) => (
                        <div key={key} className="payload-row">
                            <span className="payload-key">{key}</span>
                            <span className="payload-value">{value}</span>
                        </div>
                    ))}
                </div>

                {request.status === "PENDING" && (
                    <div className="detail-actions">
                        <button className="btn-approve" onClick={handleApprove}>Approve</button>
                        <button className="btn-reject" onClick={handleReject}>Reject</button>
                    </div>
                )}

                {actionStatus && <p className="action-status">{actionStatus}</p>}

                <button className="btn-back" onClick={() => navigate("/admin")}>
                    ← Back to Admin
                </button>
            </div>
        </div>
    );
}
