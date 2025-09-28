"use client";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Database, Shield } from "lucide-react";
import Image from "next/image";

const ledgerEntries = [
  {
    hash: "0xA1B2C3D4E5F6G7H8I9J0",
    contributorId: "user_12345",
    timestamp: "2025-09-28 10:15:01",
    aiScore: 98,
    bias: 2,
  },
  {
    hash: "0xC1D2E3F4G5H6I7J8K9L0",
    contributorId: "user_67890",
    timestamp: "2025-09-27 09:00:01",
    aiScore: 92,
    bias: 12,
  },
];

export default function Ledger() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="flex items-center gap-4 mb-6">
        <Image 
          src="/logo/new logo png.png" 
          alt="TRAIN Logo" 
          width={32} 
          height={32}
          className="object-contain"
        />
        <h2 className="text-2xl font-accolade-serial font-bold flex items-center gap-2">
          <Database className="text-yellow-500" /> Blockchain Ledger Explorer
        </h2>
      </div>
      <div className="space-y-6">
        {ledgerEntries.map((entry, idx) => (
          <Card key={entry.hash} className="flex flex-col gap-2 shadow-lg">
            <CardHeader className="flex gap-2 items-center">
              <Shield className="text-blue-500" />
              <span className="font-proxima font-semibold">Entry {ledgerEntries.length - idx}</span>
            </CardHeader>
            <CardContent>
              <div className="text-sm grid grid-cols-2 gap-2 font-proxima">
                <div><b>Dataset Hash:</b> <span className="font-mono text-xs">{entry.hash}</span></div>
                <div><b>Contributor ID:</b> {entry.contributorId}</div>
                <div><b>Timestamp:</b> {entry.timestamp}</div>
                <div><b>AI Score:</b> <span className={`font-bold ${entry.aiScore > 95 ? 'text-green-600' : entry.aiScore > 90 ? 'text-yellow-600' : 'text-red-600'}`}>{entry.aiScore}</span></div>
                <div><b>Bias:</b> <span className={`font-bold ${entry.bias < 5 ? 'text-green-600' : entry.bias < 10 ? 'text-yellow-600' : 'text-red-600'}`}>{entry.bias}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
