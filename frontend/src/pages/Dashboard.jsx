import { useState, useEffect } from "react";
import { getMyRequests } from "../services/api";

export default function Dashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await getMyRequests();
            setRequests(data);
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 5000);
        return () => clearInterval(interval);
    }, []);

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

    if (loading) return <div className="card"><p>Loading requests...</p></div>;

    return (
        <div>
            <div className="page-header">
                <h2>My Requests</h2>
                <p className="subtitle">Track the status of your infrastructure requests</p>
            </div>

            {requests.length === 0 ? (
                <div className="card empty-state">
                    <p>No requests yet. Submit one from the Namespace or ArgoCD page.</p>
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
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((r) => (
                                <tr key={r.id}>
                                    <td>#{r.id}</td>
                                    <td className="type-cell">{r.request_type}</td>
                                    <td className="payload-cell">{formatPayload(r.payload)}</td>
                                    <td><span className={statusClass(r.status)}>{r.status}</span></td>
                                    <td className="date-cell">{new Date(r.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
