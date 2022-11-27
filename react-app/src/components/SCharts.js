import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const cosAxisTick = (tickItem) => {
  if (tickItem <= 500) {
    return "안전";
  }
  return "주의";
};

export const SCharts = (props) => {
  const [val, setVal] = useState("co2");

  const [co2, setCo2] = useState([]);

  const [humi, setHumi] = useState([]);

  const [light, setLight] = useState([]);

  const [temp, setTemp] = useState([]);

  const [roomData, setRoomData] = useState([]);

  const savedCallback = useRef();

  async function getSensor(sName) {
    axios.get(`http://localhost:5000/api/${sName}`).then((res) => {
      switch (sName) {
        case "co2":
          setCo2(res.data.data);
          break;
        case "humi":
          setHumi(res.data.data);
          break;
        case "light":
          setLight(res.data.data);
          break;
        case "temper":
          setTemp(res.data.data);
          break;
      }
    });
  }

  async function getRoomData() {
    axios.get(`http://localhost:5000/api/roomdata`).then((res) => {
      setRoomData(res.data.data);
    });
  }

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
      savedCallback.current = callback;
    });

    useEffect(() => {
      const tick = () => {
        savedCallback.current();
      };
      const timerId = setInterval(tick, delay);

      return () => clearInterval(timerId);
    }, [delay]);
  };

  useEffect(() => {
    getSensor("co2");
    getRoomData();
  }, []);

  useInterval(() => {
    getSensor("co2");
    getRoomData();
  }, 5000);
  function Unix_timestamp(t) {
    let date = new Date(t * 1000);
    let hour = "" + date.getHours();
    let minute = "" + date.getMinutes();
    let second = "" + date.getSeconds();
    if (minute.length === 2) {
      return (
        hour.substring(-2) +
        ":" +
        minute.substring(-2) +
        ":" +
        second.substring(-2)
      );
    } else if (second.length === 1) {
      return (
        hour.substring(-2) +
        ":" +
        minute.substring(-2) +
        ":" +
        "0" +
        second.substring(-2)
      );
    } else if (second.length === 1 && minute.length === 1) {
      return (
        hour.substring(-2) +
        ":" +
        "0" +
        minute.substring(-2) +
        ":" +
        "0" +
        second.substring(-2)
      );
    } else {
      return (
        hour.substring(-2) +
        ":" +
        "0" +
        minute.substring(-2) +
        ":" +
        second.substring(-2)
      );
    }
  }

  const dataCo2 = co2
    ? co2.map((ele, idx) => {
        return { x: Unix_timestamp(ele.uTime), y: ele?.co2, z: ele?.room };
      })
    : [];

  const dataHumi = humi
    ? humi.map((ele, idx) => {
        return { x: Unix_timestamp(ele.uTime), y: ele?.humi, z: ele?.room };
      })
    : [];

  const dataLight = light
    ? light.map((ele, idx) => {
        return { x: Unix_timestamp(ele.uTime), y: ele?.light, z: ele?.room };
      })
    : [];

  const dataTemp = temp
    ? temp.map((ele, idx) => {
        return { x: Unix_timestamp(ele.uTime), y: ele?.temper, z: ele?.room };
      })
    : [];
  return (
    <div className="h-[70vh] w-[100%] bg-slate-700">
      <select
        onChange={(event) => {
          setVal(event.currentTarget.value);
          getSensor(event.currentTarget.value);
        }}
      >
        <option value="co2">Co2</option>
        <option value="humi">Humi</option>
        <option value="light">Light</option>
        <option value="temper">Temp</option>
      </select>
      {val === "co2" && (
        <div className="bg-slate-700 flex flex-wrap text-white">
          <div className="h-[50%] w-[50%]">
            <ScatterChart
              width={800}
              height={610}
              margin={{
                top: 0,
                right: 20,
                bottom: 20,
                left: 70,
              }}
            >
              <CartesianGrid />
              <XAxis dataKey="x" name="Time" tick={{ fill: "white" }} />
              <YAxis
                dataKey="y"
                name="co2"
                tickFormatter={cosAxisTick}
                tick={{ fill: "white" }}
              />
              <ZAxis dataKey="z" range={30} name="room" unit="호" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="A Chart" data={dataCo2} fill={"yellow"} />
            </ScatterChart>
          </div>
          <div className="bg-slate-700 h-[50%] w-[50%] flex justify-center flex-wrap ">
            {co2?.map((ele, idx) => {
              if (ele.co2 >= 400) {
                return (
                  <div
                    key={idx}
                    className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-red-500 "
                  >
                    {ele.room}
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-green-500 "
                >
                  {ele.room}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {val === "humi" && (
        <div className="bg-slate-700 flex flex-wrap text-white">
          <div className="h-[50%] w-[50%]">
            <ScatterChart
              width={800}
              height={610}
              margin={{
                top: 0,
                right: 20,
                bottom: 20,
                left: 70,
              }}
            >
              <CartesianGrid />
              <XAxis dataKey="x" name="Time" tick={{ fill: "white" }} />
              <YAxis
                dataKey="y"
                name="Humidity"
                tickFormatter={cosAxisTick}
                tick={{ fill: "white" }}
              />
              <ZAxis dataKey="z" range={30} name="room" unit="호" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="A Chart" data={dataHumi} fill={"yellow"} />
            </ScatterChart>
          </div>
          <div className="bg-slate-700 h-[50%] w-[50%] flex justify-center flex-wrap ">
            {humi?.map((ele, idx) => {
              if (ele.humi >= 400) {
                return (
                  <div
                    key={idx}
                    className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-red-500 "
                  >
                    {ele.room}
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-green-500 "
                >
                  {ele.room}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {val === "light" && (
        <div className="bg-slate-700 flex flex-wrap text-white">
          <div className="h-[50%] w-[50%]">
            <ScatterChart
              width={800}
              height={610}
              margin={{
                top: 0,
                right: 20,
                bottom: 20,
                left: 70,
              }}
            >
              <CartesianGrid />
              <XAxis dataKey="x" name="Time" tick={{ fill: "white" }} />
              <YAxis
                dataKey="y"
                name="Light"
                tickFormatter={cosAxisTick}
                tick={{ fill: "white" }}
              />
              <ZAxis dataKey="z" range={30} name="room" unit="호" />
              <Tooltip cursor={{ strokeDasharray: "5 5" }} />
              <Scatter name="A Chart" data={dataLight} fill={"yellow"} />
            </ScatterChart>
          </div>
          <div className="bg-slate-700 h-[50%] w-[50%] flex justify-center flex-wrap ">
            {light?.map((ele, idx) => {
              if (ele.light >= 400) {
                return (
                  <div
                    key={idx}
                    className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-red-500 "
                  >
                    {ele.room}
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-green-500 "
                >
                  {ele.room}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {val === "temper" && (
        <div className="bg-slate-700 flex flex-wrap text-white">
          <div className="h-[50%] w-[50%]">
            <ScatterChart
              width={800}
              height={610}
              margin={{
                top: 0,
                right: 20,
                bottom: 20,
                left: 70,
              }}
            >
              <CartesianGrid />
              <XAxis dataKey="x" name="Time" tick={{ fill: "white" }} />
              <YAxis
                dataKey="y"
                name="Temp"
                tickFormatter={cosAxisTick}
                tick={{ fill: "white" }}
              />
              <ZAxis dataKey="z" range={30} name="room" unit="호" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="A Chart" data={dataTemp} fill={"yellow"} />
            </ScatterChart>
          </div>
          <div className="bg-slate-700 h-[50%] w-[50%] flex justify-center flex-wrap ">
            {temp?.map((ele, idx) => {
              if (ele.light >= 400) {
                return (
                  <div
                    key={idx}
                    className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-red-500 "
                  >
                    {ele.room}
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-green-500 "
                >
                  {ele.room}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* <div className="bg-slate-700 flex flex-wrap text-white">
        <div className="h-[50%] w-[50%]">
          <ScatterChart
            width={800}
            height={610}
            margin={{
              top: 0,
              right: 20,
              bottom: 20,
              left: 70,
            }}
          >
            <CartesianGrid />
            <XAxis dataKey="x" name="Time" tick={{ fill: "white" }} />
            <YAxis
              dataKey="y"
              name="co2"
              tickFormatter={cosAxisTick}
              tick={{ fill: "white" }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter name="A Chart" data={dataCo2} fill={"yellow"} />
          </ScatterChart>
        </div>
        <div className="bg-slate-700 h-[50%] w-[50%] flex justify-center flex-wrap ">
          {co2?.map((ele, idx) => {
            if (ele.co2 >= 400) {
              return (
                <div
                  key={idx}
                  className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-red-500 "
                >
                  {ele.room}
                </div>
              );
            }
            return (
              <div
                key={idx}
                className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-green-500 "
              >
                {ele.room}
              </div>
            );
          })}
        </div>
      </div> */}
      <table className="w-[100%] h-[50%] bg-slate-700">
        <thead className="text-white">
          <tr>
            <td className="bg-black border-white border-2 pl-6">Time</td>
            <td className="bg-black border-white border-2 pl-6">Room</td>
            <td className="bg-red-500 border-white border-2 pl-6">Co2</td>
            <td className="bg-orange-500 border-white border-2 pl-6">Humi</td>
            <td className="bg-yellow-500 border-white border-2 pl-6">Light</td>
            <td className="bg-green-500 border-white border-2 pl-6">Temp</td>
          </tr>
        </thead>
        <tbody>
          {roomData?.map((ele, idx) => {
            return (
              <tr className="text-white font-bold font-mono" key={idx}>
                <td className="bg-black border-white border-2 pl-6">
                  {Unix_timestamp(ele.uTime)}
                </td>
                <td className="bg-black border-white border-2 pl-6">
                  {ele.room}
                </td>
                <td className="bg-black border-white border-2 pl-6">
                  {ele.co2}
                </td>
                <td className="bg-black border-white border-2 pl-6">
                  {ele.humi}
                </td>
                <td className="bg-black border-white border-2 pl-6">
                  {ele.light}
                </td>
                <td className="bg-black border-white border-2 pl-6">
                  {ele.temper}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
