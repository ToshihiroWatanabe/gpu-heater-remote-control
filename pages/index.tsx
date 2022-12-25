import Head from "next/head";
import axios, { AxiosResponse } from "axios";
import getConfig from "next/config";
import { useEffect, useRef, useState } from "react";

const { publicRuntimeConfig } = getConfig();

const axiosInstance = axios.create({
  baseURL: `http://${publicRuntimeConfig.ipAddress}:${process.env.PORT}`,
});

export default function Index() {
  const abortControllerRef = useRef(new AbortController());
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
  const onRangeInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    for (let i = 0; i < 10; i++) {
      abortControllerRef.current.abort();
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    abortControllerRef.current = new AbortController();
    axiosInstance
      .get(`/api/pl?watt=${e.target.value}`, {
        responseType: "text",
        signal: abortControllerRef.current.signal,
      })
      .then(() => {
        fetchInfo();
      })
      .catch((e) => {});
  };

  return (
    <>
      <Head>
        <title>GPU暖房リモコン</title>
        <meta name="description" content="GPU暖房のリモコンです。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <main style={{ height: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ margin: "1rem 1rem 0 1rem" }}>
            <p>GPU温度</p>
            <p style={{ marginTop: "-1rem" }}>
              {gpuCurrentTemp > 0 ? gpuCurrentTemp + "℃" : "取得中"}
            </p>
          </div>
          <div style={{ margin: "1rem 1rem 0 1rem" }}>
            <p>消費電力</p>
            <p style={{ marginTop: "-1rem" }}>
              {powerDraw > 0 ? powerDraw + "W" : "取得中"}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            fetchInfo();
          }}
          type="button"
          className="btn btn-light"
          style={{ marginBottom: "1rem" }}
        >
          最新の情報に更新
        </button>
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
            {!isNaN(temporaryRangeInputValue) && temporaryRangeInputValue}
          </div>
          <input
            onInput={(e: React.FocusEvent<HTMLInputElement>) =>
              onRangeInputFocus(e)
            }
            onClick={() => onRangeInputBlur()}
            onTouchEnd={() => {
              onRangeInputBlur();
            }}
            onChange={(e) => onRangeInputChange(e)}
            disabled={!(powerLimit > 0)}
            type="range"
            value={rangeInputValue > 0 ? rangeInputValue : undefined}
            min={minPowerLimit > 0 ? minPowerLimit : undefined}
            max={maxPowerLimit > 0 ? maxPowerLimit : undefined}
            step="5"
            style={{ width: "240px", margin: "0" }}
            className="form-range"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "240px",
              padding: "0",
            }}
          >
            <span>低</span>
            <span>高</span>
          </div>
        </div>
      </main>
    </>
  );
}
