"use client";
import { useState } from "react";
import { Upload, Shield, Database, Globe } from "lucide-react";
import { Card, CardHeader, CardContent } from "../../components/ui/card";

const mockDataset = {
  name: "ASEAN Trade Data 2025",
  origin: "ASEAN",
  contributorId: "user_12345",
  uploadTime: "2025-09-28 10:15:00",
  hash: "0xA1B2C3D4E5F6G7H8I9J0",
  aiReport: {
    completeness: 98,
    biasFlag: false,
    anomalyNotes: "No major anomalies detected.",
    reportHash: "0xRPT1234567890"
  },
  blockchain: {
    entryHash: "0xBC1234567890",
    timestamp: "2025-09-28 10:15:01"
  }
};

export default function Contributor() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="max-w-xl mx-auto py-12">
      <Card className="mb-8 shadow-lg rounded-xl">
        <CardHeader className="flex items-center gap-2">
          <Upload className="text-blue-500" />
          <span className="font-bold text-lg">Upload Dataset</span>
        </CardHeader>
        <CardContent>
          {!uploaded ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                setUploaded(true);
              }}
              className="flex flex-col gap-4"
            >
              <input type="file" className="border p-2 rounded" disabled />
              <button type="submit" className="bg-blue-600 text-white py-2 rounded shadow hover:bg-blue-700 flex items-center gap-2 justify-center">
                <Upload size={18} /> Upload Dataset
              </button>
              <span className="text-xs text-gray-500">(Mocked: No actual upload)</span>
            </form>
          ) : (
            <div className="space-y-6">
              <Card className="shadow rounded-lg">
                <CardHeader className="flex gap-2 items-center">
                  <Database className="text-green-500" />
                  <span className="font-semibold">Dataset Summary</span>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div><b>Name:</b> {mockDataset.name}</div>
                    <div><b>Origin:</b> <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 text-blue-800"><Globe size={14} /> {mockDataset.origin}</span></div>
                    <div><b>Contributor ID:</b> {mockDataset.contributorId}</div>
                    <div><b>Upload Time:</b> {mockDataset.uploadTime}</div>
                    <div><b>Dataset Hash:</b> <span className="font-mono text-xs">{mockDataset.hash}</span></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow rounded-lg">
                <CardHeader className="flex gap-2 items-center">
                  <Shield className="text-purple-500" />
                  <span className="font-semibold">AI Quality Report</span>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div><b>Completeness:</b> {mockDataset.aiReport.completeness}%</div>
                    <div><b>Bias Flag:</b> {mockDataset.aiReport.biasFlag ? "Yes" : "No"}</div>
                    <div><b>Anomaly Notes:</b> {mockDataset.aiReport.anomalyNotes}</div>
                    <div><b>Report Hash:</b> <span className="font-mono text-xs">{mockDataset.aiReport.reportHash}</span></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow rounded-lg">
                <CardHeader className="flex gap-2 items-center">
                  <Database className="text-yellow-500" />
                  <span className="font-semibold">Blockchain Entry</span>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div><b>Entry Hash:</b> <span className="font-mono text-xs">{mockDataset.blockchain.entryHash}</span></div>
                    <div><b>Timestamp:</b> {mockDataset.blockchain.timestamp}</div>
                    <div><b>Contributor ID:</b> {mockDataset.contributorId}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
