import Head from "next/head";
import axios, { AxiosResponse } from "axios";
import getConfig from "next/config";
import { useEffect, useState } from "react";

const { publicRuntimeConfig } = getConfig();

const axiosInstance = axios.create({
  baseURL: `http://${publicRuntimeConfig.ipAddress}:${process.env.PORT}`,
});

export default function Index() {
  const [gpuCurrentTemp, setGpuCurrentTemp] = useState<number>(NaN);
  const [powerDraw, setPowerDraw] = useState<number>(NaN);
  const [powerLimit, setPowerLimit] = useState<number>(NaN);
  const [minPowerLimit, setMinPowerLimit] = useState<number>(NaN);
  const [maxPowerLimit, setMaxPowerLimit] = useState<number>(NaN);
  const [temporaryRangeInputValue, setTemporaryRangeInputValue] =
    useState<number>(NaN);
  const [rangeInputValue, setRangeInputValue] = useState<number>(50);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    axiosInstance.get("/api/info").then((res: AxiosResponse<Info>) => {
      setGpuCurrentTemp(res.data.gpuCurrentTemp);
      setPowerDraw(res.data.powerDraw);
      setPowerLimit(res.data.powerLimit);
      setMinPowerLimit(res.data.minPowerLimit);
      setMaxPowerLimit(res.data.maxPowerLimit);
      setRangeInputValue(res.data.powerLimit);
    });
  };
  const onRangeInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setRangeInputValue(parseInt(e.target.value));
    setTemporaryRangeInputValue(parseInt(e.target.value));
  };
  const onRangeInputBlur = () => {
    setTemporaryRangeInputValue(NaN);
  };
  const onRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    axiosInstance
      .get(`/api/pl?watt=${e.target.value}`, {
        responseType: "text",
      })
      .then(() => {
        fetchInfo();
      });
  };

  return (
    <>
      <Head>
        <title>GPU暖房リモコン</title>
        <meta name="description" content="GPU暖房のリモコンです。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <main>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ margin: "1rem" }}>
            <p>GPU温度</p>
            <p style={{ marginTop: "-1rem" }}>
              {gpuCurrentTemp > 0 ? gpuCurrentTemp + "℃" : "取得中"}
            </p>
          </div>
          <div style={{ margin: "1rem" }}>
            <p>消費電力</p>
            <p style={{ marginTop: "-1rem" }}>
              {powerDraw > 0 ? powerDraw + "W" : "取得中"}
            </p>
          </div>
        </div>
        <h1>電力制限</h1>
        <p style={{ fontSize: "5rem", margin: "-1rem 0 -1rem 0" }}>
          {powerLimit > 0 ? powerLimit : "取得中"}
          <span style={{ fontSize: "4rem" }}>{powerLimit > 0 ? "W" : ""}</span>
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ height: "1rem", marginBottom: "1rem" }}>
            {temporaryRangeInputValue > 0 && temporaryRangeInputValue}
          </div>
          <input
            onInput={(e: React.FocusEvent<HTMLInputElement>) =>
              onRangeInputFocus(e)
            }
            onBlur={() => onRangeInputBlur()}
            onChange={(e) => onRangeInputChange(e)}
            disabled={!(powerLimit > 0)}
            type="range"
            value={rangeInputValue > 0 ? rangeInputValue : undefined}
            min={minPowerLimit > 0 ? minPowerLimit : undefined}
            max={maxPowerLimit > 0 ? maxPowerLimit : undefined}
            step="5"
            list="tickmarks"
            style={{ width: "240px", margin: "0" }}
            className="form-range"
          />
          <datalist
            id="tickmarks"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              writingMode: "vertical-lr",
              width: "240px",
              padding: "0",
            }}
          >
            <option label="低"></option>
            <option label="高"></option>
          </datalist>
        </div>
      </main>
    </>
  );
}
