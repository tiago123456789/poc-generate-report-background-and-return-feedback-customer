const Queue = require("bull")
const { io } = require("socket.io-client");
const fs = require("fs");

const socket = io(process.env.CLIENT_URL_SOCKET); 

const generateReportsCSVQueue = new Queue(
    process.env.QUEUE_REPORT_CSV, process.env.REDIS_URL
);

const sleep = (seconds) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), seconds * 1000);
    })
}

generateReportsCSVQueue.process(async (job, done) => {
    const data = job.data;

    await sleep(2)
    socket.emit("status_generation_report", {
        ...data, 
        status: `Iniciando geração do relatório...` 
    })

    await sleep(2)
    socket.emit("status_generation_report", {
        ...data, 
        status: `Preparando relatório...` 
    })

    await sleep(2)
    socket.emit("status_generation_report", {
        ...data, 
        status: `Gerando relatório...` 
    })
    const headers = "firstname,lastname,email,address"
    let lines = ""
    for(let index = 0; index <= data.quantityLines; index++) {
        lines += `firstname${index},lastname${index},firstname${index}@gmail.com,rua teste${index}\n`
    }

    lines = `${headers}\n${lines}`

    await sleep(2)
    socket.emit("status_generation_report", {
        ...data, 
        status: `Geração do relatório finalizou.` 
    })

    sleep(2)
    socket.emit("status_generation_report", {
        ...data, 
        status: `Gerando link do relatório...` 
    })

    await sleep(2)
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