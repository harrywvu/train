"use client";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Shield } from "lucide-react";

interface AuditModalProps {
  open: boolean;
  onClose: () => void;
  dataset: {
    hash: string;
    aiReport?: { reportHash: string };
    blockchain?: { entryHash: string };
    contributorId: string;
    uploadTime: string;
    origin: string;
  } | null;
}

export default function AuditModal({ open, onClose, dataset }: AuditModalProps) {
  if (!open || !dataset) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 relative min-w-[320px] max-w-[90vw]">
        <button
          className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <Card className="shadow-xl">
          <CardHeader className="flex gap-2 items-center">
            <Shield className="text-blue-500" />
            <span className="font-bold text-lg">Blockchain Audit Record</span>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <div><b>Dataset Hash:</b> <span className="font-mono text-xs">{dataset.hash}</span></div>
              <div><b>AI Report Hash:</b> <span className="font-mono text-xs">{dataset.aiReport?.reportHash}</span></div>
              <div><b>Blockchain Entry:</b> <span className="font-mono text-xs">{dataset.blockchain?.entryHash}</span></div>
              <div><b>Contributor ID:</b> {dataset.contributorId}</div>
              <div><b>Upload Time:</b> {dataset.uploadTime}</div>
              <div><b>Origin:</b> {dataset.origin}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
