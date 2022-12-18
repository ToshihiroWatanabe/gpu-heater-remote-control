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
  const [powerlimit, setPowerLimit] = useState<number>(NaN);
  const [minPowerlimit, setMinPowerLimit] = useState<number>(NaN);
  const [maxPowerlimit, setMaxPowerLimit] = useState<number>(NaN);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    axios
      .get(`${URL_ORIGIN}/api/info/power`)
      .then((res: AxiosResponse<PowerInfo>) => {
        setPowerLimit(res.data.powerLimit);
        setMinPowerLimit(res.data.minPowerLimit);
        setMaxPowerLimit(res.data.maxPowerLimit);
      });
  };

  const onMinusButtonClick = () => {
    if (powerlimit - minPowerlimit < WATT_INTERVAL) {
      return;
    }

    axios.get(`${URL_ORIGIN}/api/pl/${powerlimit - WATT_INTERVAL}`).then(() => {
      fetchInfo();
    });
  };
  const onPlusButtonClick = () => {
    if (maxPowerlimit - powerlimit < WATT_INTERVAL) {
      return;
    }
    axios.get(`${URL_ORIGIN}/api/pl/${powerlimit + WATT_INTERVAL}`).then(() => {
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
        <h1>現在の電力制限</h1>
        <p style={{ fontSize: "5rem", margin: "0" }}>
          {isNaN(powerlimit) ? "取得中" : powerlimit + "W"}
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
