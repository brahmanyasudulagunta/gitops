import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRequests, approveRequest, rejectRequest } from "../services/api";

export default function AdminDashboard() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchRequests = async () => {
        try {
            const status = filter === "ALL" ? null : filter;
            const data = await getRequests(status);
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const handleApprove = async (e, id) => {
        e.stopPropagation();
        await approveRequest(id);
        fetchRequests();
    };

    const handleReject = async (e, id) => {
        e.stopPropagation();
        await rejectRequest(id);
        fetchRequests();
    };

    const statusClass = (status) => {
        switch (status) {
            case "PENDING": return "badge badge-pending";
            case "APPROVED": return "badge badge-approved";
            case "REJECTED": return "badge badge-rejected";
            default: return "badge";
        }
    };

    const formatPayload = (payload) => {
        return Object.entries(payload)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
    };

    const filters = ["ALL", "PENDING", "APPROVED", "REJECTED"];

    return (
        <div>
            <div className="page-header">
                <h2>Admin Dashboard</h2>
                <p className="subtitle">Manage infrastructure requests</p>
            </div>

            <div className="filter-tabs">
                {filters.map((f) => (
                    <button
                        key={f}
                        className={`filter-btn ${filter === f ? "active" : ""}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="card"><p>Loading...</p></div>
            ) : requests.length === 0 ? (
                <div className="card empty-state">
                    <p>No {filter.toLowerCase()} requests found.</p>
                </div>
            ) : (
                <div className="card">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Type</th>
                                <th>Details</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r) => (
                                <tr
                                    key={r.id}
                                    className="clickable-row"
                                    onClick={() => navigate(`/admin/requests/${r.id}`)}
                                >
                                    <td>#{r.id}</td>
                                    <td className="type-cell">{r.request_type}</td>
                                    <td className="payload-cell">{formatPayload(r.payload)}</td>
                                    <td><span className={statusClass(r.status)}>{r.status}</span></td>
                                    <td className="date-cell">{new Date(r.created_at).toLocaleDateString()}</td>
                                    <td className="actions-cell">
                                        {r.status === "PENDING" && (
                                            <>
                                                <button
                                                    className="btn-approve"
                                                    onClick={(e) => handleApprove(e, r.id)}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={(e) => handleReject(e, r.id)}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
