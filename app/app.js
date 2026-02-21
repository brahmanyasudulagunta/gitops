const express = require("express");
const path = require("path");
const os = require("os");

const app = express();

// Serve the beautiful static UI from the public folder
app.use(express.static(path.join(__dirname, "public")));

// API endpoint that feeds live Kubernetes data to the UI
app.get("/api/info", (req, res) => {
  res.json({
    status: "OK",
    service: "gitops-demo",
    environment: process.env.APP_ENV || "development (local)",
    pod: os.hostname(), // In K8s, the hostname is the Pod Name!
    version: "1.0.0"
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("healthy");
});

app.listen(3002, () => {
  console.log("App running on port 3002");
});
