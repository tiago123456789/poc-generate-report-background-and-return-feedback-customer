require("dotenv").config()
const express = require("express")
const Queue = require("bull")
const uuid = require("uuid")
const path = require("path")
const socket = require("socket.io")
const cors = require("cors")
const app = express();

const generateReportsCSVQueue = new Queue(
    process.env.QUEUE_REPORT_CSV, process.env.REDIS_URL
);

app.use(cors());

app.use("/reports", express.static(path.join(__dirname, "..", "reports")))

app.get("/generate-reports-csv", async (request, response) => {
    const id = uuid.v4();

    await generateReportsCSVQueue.add({
        reportId: id,
        quantityLines: 1000000,
    })

    return response.json({
        reportId: id,
        status: "Waiting on queue to generate report"
    })
})

const server = app.listen(process.env.PORT, () => {
    console.log("Server is running in port 3000")
})

const io = socket(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", function (socket) {
    socket.on("status_generation_report", (data) => {
        io.emit(`status_generation_report_${data.reportId}`, data)
    })
});