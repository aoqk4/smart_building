import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const cosAxisTick = (tickItem) => {
  if (tickItem <= 500) {
    return "안전";
  }
  return "주의";
};

export const SCharts = () => {
  let cnt = 0;

  const [co2, setCo2] = useState([]);

  // const router = Router();

  // router.reload();

  async function getCo2() {
    console.log("ㅇㅇ");
    console.log(cnt);
    axios.get("http://localhost:5000/api/co2").then((res) => {
      setCo2(res.data.data);
    });
  }
  useEffect(() => {
    getCo2();
  }, [cnt]);

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
    } else {
      return (
        hour.substring(-2) +
        ":" +
        minute.substring(-2) +
        "0" +
        ":" +
        second.substring(-2)
      );
    }
  }

  const data = co2
    ? co2.map((ele, idx) => {
        return { x: Unix_timestamp(ele.uTime), y: ele?.co2 };
      })
    : [];
  return (
    <div className="h-[100%] w-[100%]">
      <div className="bg-slate-700 flex flex-wrap text-white">
        <div className="h-[50%] w-[50%]">
          <ScatterChart
            width={800}
            height={610}
            margin={{
              top: 100,
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
            <Scatter name="A Chart" data={data} fill={"yellow"} />
          </ScatterChart>
        </div>
        <div className="bg-slate-700 h-[50%] w-[50%] flex justify-center flex-wrap ">
          {co2?.map((ele, idx) => {
            if (ele.co2 >= 400) {
              return (
                <div
                  key={idx}
                  className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-red-500"
                >
                  {ele.room}
                </div>
              );
            }
            return (
              <div
                key={idx}
                className="font-bold text-xl w-[30%] h-[30%] flex justify-center mt-2 text-green-500"
              >
                {ele.room}
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="bg-red-300"
        onClick={(e) => {
          cnt++;
        }}
      >
        1
      </button>
    </div>
  );
};
