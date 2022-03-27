const express = require("express")
const Queue = require("bull")
const uuid = require("uuid")
const path = require("path")
const socket = require("socket.io")
const app = express();

const generateReportsCSVQueue = new Queue(
    'genereate-reports-csv', 'redis://127.0.0.1:6379'
);

app.use("/reports", express.static(path.join(__dirname, "..", "reports")))

app.get("/generate-reports-csv", async (request, response) => {
    const id = uuid.v4();

    await generateReportsCSVQueue.add({
        reportId: id,
        quantityLines: 1000,
    })

    return response.json({
        reportId: id,
        status: "Waiting on queue to generate report"
    })
})

const server = app.listen(3000, () => {
    console.log("Server is running in port 3000")
})

// Socket setup
const io = socket(server);

io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on("status_generation_report", (data) => {
        console.log(`REPORT ID ${data.reportId} STATUS => ${data.status}`)
    })
});