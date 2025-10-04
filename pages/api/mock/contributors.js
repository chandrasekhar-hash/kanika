import { SAMPLE_DATA } from "../../../data/sampleData";

export default function handler(req, res) {
  res.status(200).json(SAMPLE_DATA);
}
