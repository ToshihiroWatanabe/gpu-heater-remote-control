import childProcess from "child_process";
import util from "util";
import type { NextApiRequest, NextApiResponse } from "next";

const exec = util.promisify(childProcess.exec);

/**
 * 情報を取得するAPI
 */
export default async function infoApi(
  req: NextApiRequest,
  res: NextApiResponse<Info | { error: string }>
) {
  const result = await exec("powershell.exe nvidia-smi -q");
  if (result.stderr) {
    console.error(result.stderr);
    res.status(500).json({ error: result.stderr });
  }
  const lines = result.stdout.replace(/ +/g, "").split(/\r\n|\n/);
  const info: Info = {
    gpuCurrentTemp: NaN,
    powerDraw: NaN,
    powerLimit: NaN,
    minPowerLimit: NaN,
    maxPowerLimit: NaN,
  };
  for (const line of lines) {
    if (line.startsWith("GPUCurrentTemp:")) {
      info.gpuCurrentTemp = parseInt(line.replace(/[^0-9\.]/g, ""));
    } else if (line.startsWith("PowerDraw:")) {
      info.powerDraw = parseInt(line.replace(/[^0-9\.]/g, ""));
    } else if (line.startsWith("PowerLimit:")) {
      info.powerLimit = parseInt(line.replace(/[^0-9\.]/g, ""));
    } else if (line.startsWith("MinPowerLimit:")) {
      info.minPowerLimit = parseInt(line.replace(/[^0-9\.]/g, ""));
    } else if (line.startsWith("MaxPowerLimit:")) {
      info.maxPowerLimit = parseInt(line.replace(/[^0-9\.]/g, ""));
    }
  }
  res.status(200).json(info);
}
