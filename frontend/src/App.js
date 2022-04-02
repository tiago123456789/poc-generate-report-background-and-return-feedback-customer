import React, { useEffect, useState } from "react";
import axios from "axios"
import './App.css';
import websocket from "./services/websocket"

function App() {
  const [statusReport, setStatusReport] = useState(null);
  const [linkReport, setLinkReport] = useState(null)

  const resetStatusAndLink = () => {
    setStatusReport(null)
    setLinkReport(null)
  }

  const generateReportCSV = async () => {
    resetStatusAndLink()
    const response = await axios.get(`${process.env.REACT_APP_URL_SERVER}/generate-reports-csv`)
    const data = response.data;
    websocket.listen(`status_generation_report_${data.reportId}`, (data) => {
      if (data.linkReport) {
        setStatusReport(null)
        setLinkReport(data.linkReport)
      } else {
        setLinkReport(null)
        setStatusReport(data.status)
      }
      console.log(data)
    })
  }

  useEffect(() => {
    websocket.init()

    return () => {
      websocket.disconnect()
    }
  }, [])

  return (
    <div className="App">
      <br />
      <button onClick={() => generateReportCSV()} style={{
        cursor: "pointer",
        fontSize: "18px",
        padding: "10px",
        border: "1px solid blue",
        backgroundColor: "blue",
        color: "white"
      }}>Generate report CSV</button>
      { statusReport &&
        <>
          <h1>Report status</h1>
          <p>{statusReport}</p>
        </>
      }
      { linkReport &&
        <>
          <h1>Link download</h1>
          <a href={linkReport} target="_blank">Download</a>
        </>
      }

    </div>
  );
}

export default App;
