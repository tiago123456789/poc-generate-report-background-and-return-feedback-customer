const Queue = require("bull")
const { io } = require("socket.io-client");
const fs = require("fs")
const socket = io("http://localhost:3000"); 


const generateReportsCSVQueue = new Queue(
    'genereate-reports-csv', 'redis://127.0.0.1:6379'
);

generateReportsCSVQueue.process((job, done) => {
    const data = job.data
    socket.emit("status_generation_report", {
        ...data, 
        status: `Init generation report ${data.reportId}` 
    })

    socket.emit("status_generation_report", {
        ...data, 
        status: `Starting generation report ${data.reportId}` 
    })

    const headers = "firstname,lastname,email,address"
    let lines = ""
    for(let index = 0; index <= data.quantityLines; index++) {
        lines += `firstname${index},lastname${index},firstname${index}@gmail.com,rua teste${index}\n`
    }

    lines = `${headers}\n${lines}`

    socket.emit("status_generation_report", {
        ...data, 
        status: `Finish generation report ${data.reportId}` 
    })
    socket.emit("status_generation_report", {
        ...data, 
        status: `Creating report ${data.reportId}` 
    })
    fs.writeFileSync(
        `./reports/${data.reportId}.csv`, lines
    )
    socket.emit("status_generation_report", {
        ...data, 
        status: `Created report ${data.reportId}`,
        linkReport: `http://localhost:3000/reports/${data.reportId}.csv`
    })
    done()
})