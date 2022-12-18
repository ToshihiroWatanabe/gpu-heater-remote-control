import childProcess from "child_process";
import util from "util";
import type { NextApiRequest, NextApiResponse } from "next";

const exec = util.promisify(childProcess.exec);

/**
 * 電力制限をするAPI
 */
export default async function powerLimitApi(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { watt } = req.query;
  const result = await exec("powershell nvidia-smi -pl " + watt);
  if (result.stderr) {
    console.error(result.stderr);
    res.status(500).send(result.stderr);
  }
  res.status(200).send(result.stdout);
}
