import childProcess from "child_process";
import util from "util";
import type { NextApiRequest, NextApiResponse } from "next";

const exec = util.promisify(childProcess.exec);

/**
 * 電力に関する情報を取得するAPI
 */
export default async function powerInfoApi(
  req: NextApiRequest,
  res: NextApiResponse<PowerInfo | { error: string }>
) {
  const result = await exec("powershell nvidia-smi -q -d POWER");
  if (result.stderr) {
    console.error(result.stderr);
    res.status(500).json({ error: result.stderr });
  }
  const lines = result.stdout.replace(/ +/g, "").split(/\r\n|\n/);
  const powerInfo: PowerInfo = {
    powerLimit: NaN,
    minPowerLimit: NaN,
    maxPowerLimit: NaN,
  };
  for (const line of lines) {
    if (line.startsWith("PowerLimit:")) {
      powerInfo.powerLimit = parseInt(line.replace(/[^0-9\.]/g, ""));
    } else if (line.startsWith("MinPowerLimit:")) {
      powerInfo.minPowerLimit = parseInt(line.replace(/[^0-9\.]/g, ""));
    } else if (line.startsWith("MaxPowerLimit:")) {
      powerInfo.maxPowerLimit = parseInt(line.replace(/[^0-9\.]/g, ""));
    }
  }
  res.status(200).json(powerInfo);
}
