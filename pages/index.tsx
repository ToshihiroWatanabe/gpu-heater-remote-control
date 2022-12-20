import Head from "next/head";
import axios, { AxiosResponse } from "axios";
import getConfig from "next/config";
import { useEffect, useState } from "react";

const { publicRuntimeConfig } = getConfig();

const URL_ORIGIN = `http://${publicRuntimeConfig.ipAddress}:${process.env.PORT}`;

/** 一度に上下するワット数 */
const WATT_INTERVAL = 50;

const buttonStyle = {
  fontSize: "3rem",
  width: "6rem",
  height: "6rem",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "3rem",
};

export default function Index() {
  const [gpuCurrentTemp, setGpuCurrentTemp] = useState<number>(NaN);
  const [powerDraw, setPowerDraw] = useState<number>(NaN);
  const [powerLimit, setPowerLimit] = useState<number>(NaN);
  const [minPowerLimit, setMinPowerLimit] = useState<number>(NaN);
  const [maxPowerLimit, setMaxPowerLimit] = useState<number>(NaN);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    axios.get(`${URL_ORIGIN}/api/info`).then((res: AxiosResponse<Info>) => {
      setGpuCurrentTemp(res.data.gpuCurrentTemp);
      setPowerDraw(res.data.powerDraw);
      setPowerLimit(res.data.powerLimit);
      setMinPowerLimit(res.data.minPowerLimit);
      setMaxPowerLimit(res.data.maxPowerLimit);
    });
  };

  const onMinusButtonClick = () => {
    if (powerLimit - minPowerLimit < WATT_INTERVAL) {
      return;
    }

    axios.get(`${URL_ORIGIN}/api/pl/${powerLimit - WATT_INTERVAL}`).then(() => {
      fetchInfo();
    });
  };
  const onPlusButtonClick = () => {
    if (maxPowerLimit - powerLimit < WATT_INTERVAL) {
      return;
    }
    axios.get(`${URL_ORIGIN}/api/pl/${powerLimit + WATT_INTERVAL}`).then(() => {
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
            <p>{gpuCurrentTemp > 0 ? gpuCurrentTemp + "℃" : "取得中"}</p>
          </div>
          <div style={{ margin: "1rem" }}>
            <p>消費電力</p>
            <p>{powerDraw > 0 ? powerDraw + "W" : "取得中"}</p>
          </div>
        </div>
        <h1>電力制限</h1>
        <p style={{ fontSize: "5rem", margin: "0" }}>
          {powerLimit > 0 ? powerLimit + "W" : "取得中"}
        </p>
        <button style={buttonStyle} onClick={() => onMinusButtonClick()}>
          －
        </button>
        <span style={{ margin: "1rem" }}></span>
        <button style={buttonStyle} onClick={() => onPlusButtonClick()}>
          ＋
        </button>
      </main>
    </>
  );
}
