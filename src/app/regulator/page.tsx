"use client";
import { useState } from "react";
import { Shield, Database, Globe, Eye } from "lucide-react";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Modal } from "../../components/ui/modal";

const mockDatasets = [
  {
    id: 1,
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
    },
    reuseCount: 2
  },
  {
    id: 2,
    name: "China Export Stats Q3",
    origin: "China",
    contributorId: "user_67890",
    uploadTime: "2025-09-27 09:00:00",
    hash: "0xC1D2E3F4G5H6I7J8K9L0",
    aiReport: {
      completeness: 92,
      biasFlag: true,
      anomalyNotes: "Potential bias detected in region codes.",
      reportHash: "0xRPT0987654321"
    },
    blockchain: {
      entryHash: "0xBC0987654321",
      timestamp: "2025-09-27 09:00:01"
    },
    reuseCount: 5
  }
];

export default function Regulator() {
  const [auditOpen, setAuditOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [reuseCounts, setReuseCounts] = useState(mockDatasets.map(d => d.reuseCount));

  const openAudit = (idx: number) => {
    setSelected(idx);
    setAuditOpen(true);
    setReuseCounts(rc => rc.map((c, i) => (i === idx ? c + 1 : c)));
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Card className="shadow-lg rounded-xl">
        <CardHeader className="flex items-center gap-2">
          <Shield className="text-purple-500" />
          <span className="font-bold text-lg">Regulator Dashboard</span>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 text-left">Dataset</th>
                <th className="p-2 text-left">Origin</th>
                <th className="p-2 text-left">AI Report</th>
                <th className="p-2 text-left">Blockchain</th>
                <th className="p-2 text-center">Reuse Count</th>
              </tr>
            </thead>
            <tbody>
              {mockDatasets.map((d, idx) => (
                <tr key={d.id} className="hover:bg-blue-50 dark:hover:bg-blue-900 cursor-pointer" onClick={() => openAudit(idx)}>
                  <td className="p-2 font-medium flex items-center gap-2">
                    <Database className="text-green-500" size={16} /> {d.name}
                  </td>
                  <td className="p-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${d.origin === "ASEAN" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>
                      <Globe size={12} /> {d.origin}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${d.aiReport.biasFlag ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                      <Shield size={12} /> {d.aiReport.completeness}%
                    </span>
                  </td>
                  <td className="p-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                      <Database size={12} /> Log
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <Badge className="bg-blue-600 text-white">{reuseCounts[idx]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      {auditOpen && selected !== null && (
        <Modal open={auditOpen} onClose={() => setAuditOpen(false)}>
          <Card className="shadow-xl rounded-xl max-w-md mx-auto">
            <CardHeader className="flex items-center gap-2">
              <Eye className="text-blue-500" />
              <span className="font-bold text-lg">Provenance Audit</span>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div><b>Dataset Hash:</b> <span className="font-mono text-xs">{mockDatasets[selected].hash}</span></div>
                <div><b>AI Report Hash:</b> <span className="font-mono text-xs">{mockDatasets[selected].aiReport.reportHash}</span></div>
                <div><b>Blockchain Entry:</b> <span className="font-mono text-xs">{mockDatasets[selected].blockchain.entryHash}</span></div>
                <div><b>Contributor ID:</b> {mockDatasets[selected].contributorId}</div>
                <div><b>Upload Time:</b> {mockDatasets[selected].uploadTime}</div>
                <div><b>Origin:</b> {mockDatasets[selected].origin}</div>
              </div>
            </CardContent>
          </Card>
        </Modal>
      )}
    </div>
  );
}
