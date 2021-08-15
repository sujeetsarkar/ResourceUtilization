import io from 'socket.io-client';
import React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export const socket = io('http://localhost:5000/');

function App() {
  const [data, setData] = useState([]);
  const [ram, setRam] = useState([]);
  const [gpu, setGpu] = useState([]);
  useEffect(() => {
    setInterval(() => {
      socket.emit('cpu');
    }, 1000);

    socket.on('cpu', (cpuPercent) => {
      //console.log(cpuPercent);

      setData((currentData) => {
        if(currentData.length > 20){
          return [...currentData, cpuPercent].slice(1);
        }
        return [...currentData, cpuPercent]
      });
    });

    setInterval(() => {
      socket.emit('ram');
    }, 1000);

    socket.on('ram', (ramPercent) => {
      //console.log(ramPercent);
      setRam((currentRamData) => {
        if(currentRamData.length > 20){
          return [...currentRamData, ramPercent].slice(1);
        }
        return [...currentRamData, ramPercent]
      });
    });
    setInterval(() => {
      socket.emit('gpu');
    }, 1000);

    socket.on('gpu', (gpuPercent) => {
      console.log(gpuPercent);
      setGpu((currentGpuData) => {
        if(currentGpuData.length > 20){
          return [...currentGpuData, gpuPercent].slice(1);
        }
        return [...currentGpuData, gpuPercent]
      });
    });
  }, []);

  return (
    <div>
      <div><h1>Resouce Utilization Chart</h1></div>
      <div className="Chart-display">
        <div>
          <LineChart width={500} height={300} data={data}>
            <XAxis dataKey="name" type="number" domain={['dataMax - 20', 'dataMax']} />
            <YAxis label={{ value: 'CPU Percent', angle: -90 }} />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Tooltip />
            <Legend />
            <Line name="CPU Usage" type="monotone" dataKey="value" stroke="#ff0000" />
          </LineChart>
        </div>
        <div>
          <LineChart width={500} height={300} data={ram}>
            <XAxis dataKey="name" type="number" domain={['dataMax - 20', 'dataMax']} />
            <YAxis label={{ value: 'RAM Percent', angle: -90 }} />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Tooltip />
            <Legend />
            <Line name="RAM Usage" type="monotone" dataKey="value" stroke="#008000" />
          </LineChart>
        </div>
        <div>
          <LineChart width={500} height={300} data={gpu}>
            <XAxis dataKey="name" type="number" domain={['dataMax - 20', 'dataMax']} />
            <YAxis label={{ value: 'GPU Percent', angle: -90 }} />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
            <Tooltip />
            <Legend />
            <Line name="GPU Usage" type="monotone" dataKey="value" stroke="#800080" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

export default App;
