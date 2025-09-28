"use client";
import { useState } from "react";
import { Shield, Database, Globe, Eye, Search, SortAsc, SortDesc, CheckCircle, AlertTriangle, X, Clock, MessageSquare, Flag, Check, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
// Chart components removed as they're not currently used

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
      reportHash: "0xRPT1234567890",
      biasCategories: [
        { category: "Geographic", score: 15 },
        { category: "Temporal", score: 8 },
        { category: "Demographic", score: 22 }
      ],
      anomalies: [
        { type: "Outlier", severity: "Low", description: "Minor data point deviation" }
      ],
      qualityScore: 92
    },
    blockchain: {
      entryHash: "0xBC1234567890",
      timestamp: "2025-09-28 10:15:01"
    },
    reuseCount: 2,
    status: "approved",
    sharedCrossBorder: false,
    regulatoryNotes: "",
    auditTrail: [
      { event: "Dataset Upload", timestamp: "2025-09-28 10:15:00", user: "user_12345" },
      { event: "AI Analysis Complete", timestamp: "2025-09-28 10:15:30", user: "system" },
      { event: "Blockchain Entry", timestamp: "2025-09-28 10:15:31", user: "system" },
      { event: "First Reuse", timestamp: "2025-09-28 14:30:00", user: "user_67890" }
    ]
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
      reportHash: "0xRPT0987654321",
      biasCategories: [
        { category: "Geographic", score: 35 },
        { category: "Temporal", score: 20 },
        { category: "Demographic", score: 15 }
      ],
      anomalies: [
        { type: "Bias Detection", severity: "High", description: "Geographic bias in region codes" },
        { type: "Data Inconsistency", severity: "Medium", description: "Missing timestamps in 5% of records" }
      ],
      qualityScore: 78
    },
    blockchain: {
      entryHash: "0xBC0987654321",
      timestamp: "2025-09-27 09:00:01"
    },
    reuseCount: 5,
    status: "flagged",
    sharedCrossBorder: true,
    regulatoryNotes: "Flagged for geographic bias review",
    auditTrail: [
      { event: "Dataset Upload", timestamp: "2025-09-27 09:00:00", user: "user_67890" },
      { event: "AI Analysis Complete", timestamp: "2025-09-27 09:00:30", user: "system" },
      { event: "Bias Flagged", timestamp: "2025-09-27 09:01:00", user: "system" },
      { event: "Blockchain Entry", timestamp: "2025-09-27 09:01:01", user: "system" },
      { event: "Cross-Border Share", timestamp: "2025-09-27 11:00:00", user: "user_67890" }
    ]
  },
  {
    id: 3,
    name: "Healthcare Clinical Trials",
    origin: "Singapore",
    contributorId: "user_99999",
    uploadTime: "2025-09-26 15:30:00",
    hash: "0xH1I2J3K4L5M6N7O8P9Q0",
    aiReport: {
      completeness: 95,
      biasFlag: false,
      anomalyNotes: "No major anomalies detected.",
      reportHash: "0xRPT5555555555",
      biasCategories: [
        { category: "Age Group", score: 12 },
        { category: "Gender", score: 18 },
        { category: "Ethnicity", score: 25 }
      ],
      anomalies: [
        { type: "Missing Data", severity: "Low", description: "Patient demographics incomplete" }
      ],
      qualityScore: 88
    },
    blockchain: {
      entryHash: "0xBC5555555555",
      timestamp: "2025-09-26 15:30:01"
    },
    reuseCount: 1,
    status: "pending",
    sharedCrossBorder: false,
    regulatoryNotes: "",
    auditTrail: [
      { event: "Dataset Upload", timestamp: "2025-09-26 15:30:00", user: "user_99999" },
      { event: "AI Analysis Complete", timestamp: "2025-09-26 15:30:30", user: "system" },
      { event: "Blockchain Entry", timestamp: "2025-09-26 15:30:31", user: "system" }
    ]
  }
];

export default function Regulator() {
  const [datasets, setDatasets] = useState(mockDatasets);
  // const [auditOpen, setAuditOpen] = useState(false); // Removed unused state
  const [selected, setSelected] = useState<number | null>(null);
  const [showInspection, setShowInspection] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [showCrossBorder, setShowCrossBorder] = useState(false);
  const [crossBorderDataset, setCrossBorderDataset] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterBias, setFilterBias] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [verifyingLedger, setVerifyingLedger] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  // Filter and sort datasets
  const filteredDatasets = datasets
    .filter(dataset => {
      const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dataset.contributorId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = filterRegion === "all" || dataset.origin === filterRegion;
      const matchesBias = filterBias === "all" || 
                         (filterBias === "low" && !dataset.aiReport.biasFlag) ||
                         (filterBias === "high" && dataset.aiReport.biasFlag);
      return matchesSearch && matchesRegion && matchesBias;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.uploadTime).getTime() - new Date(b.uploadTime).getTime()
          : new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime();
      } else if (sortBy === "bias") {
        return sortOrder === "asc" 
          ? a.aiReport.qualityScore - b.aiReport.qualityScore
          : b.aiReport.qualityScore - a.aiReport.qualityScore;
      }
      return 0;
    });

  const openInspection = (idx: number) => {
    setSelected(idx);
    setShowInspection(true);
  };

  const openAuditTrail = (idx: number) => {
    setSelected(idx);
    setShowAuditTrail(true);
  };

  const handleCrossBorderShare = (idx: number) => {
    setCrossBorderDataset(idx);
    setShowCrossBorder(true);
    
    // Simulate animation delay
    setTimeout(() => {
      setDatasets(prev => prev.map((d, i) => 
        i === idx ? { ...d, sharedCrossBorder: true } : d
      ));
      setShowCrossBorder(false);
      setCrossBorderDataset(null);
    }, 3000);
  };

  const handleVerifyLedger = async (idx: number) => {
    setVerifyingLedger(idx);
    
    // Simulate verification delay
    setTimeout(() => {
      setVerifyingLedger(null);
      setToastMessage("Ledger entry verified. No tampering detected.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };

  const handleApproveDataset = (idx: number) => {
    setDatasets(prev => prev.map((d, i) => 
      i === idx ? { ...d, status: "approved" } : d
    ));
    setToastMessage("Dataset approved successfully.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFlagDataset = (idx: number) => {
    setDatasets(prev => prev.map((d, i) => 
      i === idx ? { ...d, status: "flagged" } : d
    ));
    setToastMessage("Dataset flagged for review.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddNote = (idx: number) => {
    setEditingNote(idx);
    setNoteText(datasets[idx].regulatoryNotes || "");
  };

  const handleSaveNote = (idx: number) => {
    setDatasets(prev => prev.map((d, i) => 
      i === idx ? { ...d, regulatoryNotes: noteText } : d
    ));
    setEditingNote(null);
    setNoteText("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><CheckCircle size={12} /> Approved</Badge>;
      case "flagged":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"><AlertTriangle size={12} /> Flagged</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"><Clock size={12} /> Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Image 
              src="/logo/new logo png.png" 
              alt="TRAIN Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Regulator Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor and audit dataset contributions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/blockchain-explorer">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all duration-200">
                <Database size={20} />
                <span className="font-semibold">Blockchain Explorer</span>
              </button>
            </Link>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredDatasets.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Datasets</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Regions</option>
              <option value="ASEAN">ASEAN</option>
              <option value="China">China</option>
              <option value="Singapore">Singapore</option>
            </select>
            
            <select
              value={filterBias}
              onChange={(e) => setFilterBias(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Bias Levels</option>
              <option value="low">Low Bias</option>
              <option value="high">High Bias</option>
            </select>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="date">Sort by Date</option>
                <option value="bias">Sort by Bias Score</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Datasets Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dataset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Origin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">AI Report</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDatasets.map((dataset, idx) => (
                  <tr key={dataset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Database className="text-blue-500" size={20} />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{dataset.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{dataset.contributorId}</div>
                          {dataset.regulatoryNotes && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              <MessageSquare size={12} className="inline mr-1" />
                              {dataset.regulatoryNotes}
                            </div>
                          )}
                        </div>
                      </div>
                  </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        dataset.origin === "ASEAN" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                        dataset.origin === "China" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" :
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      }`}>
                        <Globe size={12} /> {dataset.origin}
                    </span>
                  </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          dataset.aiReport.biasFlag ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        }`}>
                          <Shield size={12} /> {dataset.aiReport.qualityScore}/100
                        </span>
                        {dataset.sharedCrossBorder && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            <Globe size={12} /> Shared
                    </span>
                        )}
                      </div>
                  </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(dataset.status)}
                  </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openInspection(idx)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="Inspect Dataset"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openAuditTrail(idx)}
                          className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
                          title="View Audit Trail"
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          onClick={() => handleVerifyLedger(idx)}
                          disabled={verifyingLedger === idx}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors disabled:opacity-50"
                          title="Verify Ledger"
                        >
                          {verifyingLedger === idx ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                        </button>
                        <button
                          onClick={() => handleAddNote(idx)}
                          className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-lg transition-colors"
                          title="Add Note"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button
                          onClick={() => handleCrossBorderShare(idx)}
                          disabled={dataset.sharedCrossBorder}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg transition-colors disabled:opacity-50"
                          title="Share Cross-Border"
                        >
                          <ArrowRight size={16} />
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleApproveDataset(idx)}
                            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
                            title="Approve"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleFlagDataset(idx)}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                            title="Flag"
                          >
                            <Flag size={14} />
                          </button>
                        </div>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Dataset Inspection Modal */}
        <AnimatePresence>
          {showInspection && selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowInspection(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dataset Inspection</h2>
                  <button
                    onClick={() => setShowInspection(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Overview Tab */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overview</h3>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Dataset Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Name:</span> {datasets[selected].name}</div>
                          <div><span className="font-medium">Contributor:</span> {datasets[selected].contributorId}</div>
                          <div><span className="font-medium">Origin:</span> {datasets[selected].origin}</div>
                          <div><span className="font-medium">Upload Time:</span> {datasets[selected].uploadTime}</div>
                          <div><span className="font-medium">Reuse Count:</span> {datasets[selected].reuseCount}</div>
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">AI Analysis Summary</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Quality Score:</span>
                            <span className="font-bold">{datasets[selected].aiReport.qualityScore}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Completeness:</span>
                            <span className="font-bold">{datasets[selected].aiReport.completeness}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Bias Flagged:</span>
                            <span className={`font-bold ${datasets[selected].aiReport.biasFlag ? 'text-red-600' : 'text-green-600'}`}>
                              {datasets[selected].aiReport.biasFlag ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Report Tab */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Report</h3>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Bias Analysis</h4>
                        <div className="space-y-2">
                          {datasets[selected].aiReport.biasCategories.map((bias, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="text-sm">{bias.category}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${
                                      bias.score > 30 ? 'bg-red-500' : bias.score > 15 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${bias.score}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{bias.score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Anomalies</h4>
                        <div className="space-y-2">
                          {datasets[selected].aiReport.anomalies.map((anomaly, idx) => (
                            <div key={idx} className="p-2 bg-white dark:bg-gray-800 rounded border-l-4 border-red-400">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{anomaly.type}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  anomaly.severity === 'High' ? 'bg-red-100 text-red-800' :
                                  anomaly.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {anomaly.severity}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{anomaly.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audit Trail Modal */}
        <AnimatePresence>
          {showAuditTrail && selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAuditTrail(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Audit Trail</h2>
                  <button
                    onClick={() => setShowAuditTrail(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                  <div className="space-y-4">
                    {datasets[selected].auditTrail.map((event, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Clock className="text-blue-600 dark:text-blue-400" size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">{event.event}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{event.timestamp}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">User: {event.user}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cross-Border Animation Modal */}
        <AnimatePresence>
          {showCrossBorder && crossBorderDataset !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Sharing Dataset Cross-Border
                  </h3>
                  
                  {/* Mini Map Animation */}
                  <div className="relative h-32 bg-gradient-to-r from-blue-50 to-red-50 dark:from-blue-900/20 dark:to-red-900/20 rounded-lg mb-4">
                    <div className="absolute top-4 left-4 w-12 h-8 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">ASEAN</span>
                    </div>
                    <div className="absolute top-4 right-4 w-12 h-8 bg-red-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">China</span>
                    </div>
                    
                    <motion.div
                      animate={{ x: [0, 200, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute top-1/2 left-1/4 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Database className="text-white" size={12} />
                    </motion.div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    Dataset is being shared across ASEAN-China border...
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note Editing Modal */}
        <AnimatePresence>
          {editingNote !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setEditingNote(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Add Regulatory Note
                </h3>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your regulatory notes..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleSaveNote(editingNote)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => setEditingNote(null)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm"
            >
              <div className="flex items-center gap-3">
                <CheckCircle size={20} />
                <span className="text-sm font-medium">{toastMessage}</span>
              </div>
            </motion.div>
      )}
        </AnimatePresence>
      </div>
    </div>
  );
}
