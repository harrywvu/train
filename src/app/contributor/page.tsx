"use client";

import React, { useState } from "react";
import { Upload, Shield, Database, Globe, Search, User, TrendingUp, BarChart3, ChevronLeft, ChevronRight, Share2, Eye, MessageCircle, Heart, Download, Bell, Award, CheckCircle, X, Copy, Star, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// Card components removed as they're not currently used
import AuditModal from "../../components/ui/audit-modal";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Cell as PieCell } from "recharts";

interface Dataset {
  name: string;
  origin: string;
  contributorId: string;
  uploadTime: string;
  hash: string;
  aiReport: {
    completeness: number;
    biasFlag: boolean;
    anomalyNotes: string;
    reportHash: string;
    biasCategories: { category: string; score: number }[];
    anomalies: { type: string; severity: string; description: string }[];
    qualityScore: number;
  };
  blockchain: {
    entryHash: string;
    timestamp: string;
  };
  shared: boolean;
  sharedCrossBorder: boolean;
  reuseCount: number;
  credits: number;
}

const initialDataset: Dataset = {
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
  shared: false,
  sharedCrossBorder: false,
  reuseCount: 3,
  credits: 15
};

const mockDatasetTemplates = [
  {
    name: "Healthcare Clinical Trials Q3 2025",
    origin: "Singapore",
    aiReport: {
      completeness: 94,
      biasFlag: false,
      biasCategories: [
        { category: "Age Group", score: 12 },
        { category: "Gender", score: 18 },
        { category: "Ethnicity", score: 25 }
      ],
      anomalies: [
        { type: "Missing Data", severity: "Medium", description: "Patient demographics incomplete" }
      ],
      qualityScore: 88
    }
  },
  {
    name: "Financial Transaction Records",
    origin: "Malaysia",
    aiReport: {
      completeness: 99,
      biasFlag: true,
      biasCategories: [
        { category: "Transaction Size", score: 35 },
        { category: "Time Period", score: 20 },
        { category: "Geographic", score: 15 }
      ],
      anomalies: [
        { type: "Fraud Detection", severity: "High", description: "Suspicious transaction patterns" },
        { type: "Data Inconsistency", severity: "Medium", description: "Currency conversion errors" }
      ],
      qualityScore: 85
    }
  },
  {
    name: "Environmental Sensor Data",
    origin: "Thailand",
    aiReport: {
      completeness: 87,
      biasFlag: false,
      biasCategories: [
        { category: "Location", score: 10 },
        { category: "Time", score: 5 },
        { category: "Equipment", score: 8 }
      ],
      anomalies: [
        { type: "Sensor Malfunction", severity: "Low", description: "Temperature readings inconsistent" }
      ],
      qualityScore: 91
    }
  },
  {
    name: "Supply Chain Logistics",
    origin: "Vietnam",
    aiReport: {
      completeness: 96,
      biasFlag: false,
      biasCategories: [
        { category: "Route", score: 14 },
        { category: "Carrier", score: 22 },
        { category: "Product Type", score: 18 }
      ],
      anomalies: [
        { type: "Delay Pattern", severity: "Medium", description: "Recurring delays in specific routes" }
      ],
      qualityScore: 89
    }
  }
];

export default function Contributor() {
  const [datasets, setDatasets] = useState<Dataset[]>([initialDataset]);
  const [showAudit, setShowAudit] = useState(false);
  const [auditDataset, setAuditDataset] = useState<Dataset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Global");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAIReport, setShowAIReport] = useState(false);
  const [showBlockchainDrawer, setShowBlockchainDrawer] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [totalCredits, setTotalCredits] = useState(15);
  const [totalUploads, setTotalUploads] = useState(1);

  const categories = [
    { name: "Global", icon: Globe },
    { name: "Business", icon: BarChart3 },
    { name: "Entertainment", icon: Heart },
    { name: "Sports", icon: TrendingUp },
    { name: "Health", icon: Shield }
  ];

  const tags = ["#Politics", "#Science", "#Movies", "#Technology"];
  const filters = ["Donald Trump", "USA", "Politics", "2020"];

  function handleUpload() {
    const template = mockDatasetTemplates[Math.floor(Math.random() * mockDatasetTemplates.length)];
    const newDataset: Dataset = {
      name: template.name,
      origin: template.origin,
      contributorId: "user_" + Math.random().toString(16).slice(2, 8),
      uploadTime: new Date().toISOString().slice(0, 19).replace("T", " "),
      hash: "0x" + Math.random().toString(16).slice(2, 18).toUpperCase(),
      aiReport: {
        ...template.aiReport,
        anomalyNotes: template.aiReport.anomalies.length > 0 ? "Anomalies detected in analysis." : "No major anomalies detected.",
        reportHash: "0xRPT" + Math.random().toString(16).slice(2, 12).toUpperCase()
      },
      blockchain: {
        entryHash: "0xBC" + Math.random().toString(16).slice(2, 12).toUpperCase(),
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " ")
      },
      shared: false,
      sharedCrossBorder: false,
      reuseCount: 0,
      credits: Math.floor(Math.random() * 10) + 5
    };
    setDatasets([...datasets, newDataset]);
    setTotalUploads(prev => prev + 1);
    setTotalCredits(prev => prev + newDataset.credits);
  }

  function handleViewAIReport(dataset: Dataset) {
    setSelectedDataset(dataset);
    setShowAIReport(true);
  }

  function handleViewBlockchain(dataset: Dataset) {
    setSelectedDataset(dataset);
    setShowBlockchainDrawer(true);
  }

  function handleCrossBorderToggle(idx: number) {
    const updated = [...datasets];
    updated[idx].sharedCrossBorder = !updated[idx].sharedCrossBorder;
    setDatasets(updated);
  }

  function handleIncrementReuse(idx: number) {
    const updated = [...datasets];
    updated[idx].reuseCount += 1;
    setDatasets(updated);
    setToastMessage(`Your dataset "${updated[idx].name}" was reused! +1 credit`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function handleDownloadReport(dataset: Dataset) {
    const reportData = {
      datasetName: dataset.name,
      aiReport: dataset.aiReport,
      blockchain: dataset.blockchain,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.name.replace(/\s+/g, '_')}_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleRequestFeedback(dataset: Dataset) {
    setToastMessage(`Feedback request sent for "${dataset.name}". Regulator feedback pending.`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function handleShare(idx: number) {
    const updated = [...datasets];
    updated[idx].shared = true;
    setDatasets(updated);
  }

  function handleAudit(dataset: Dataset) {
    setAuditDataset(dataset);
    setShowAudit(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <style jsx>{`
        @keyframes flow {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
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
                Contributor Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage and track your dataset contributions
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
          <button
            type="button"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-all duration-200"
            onClick={handleUpload}
          >
              <Upload size={20} />
            <span className="font-semibold">Upload Dataset</span>
          </button>
        </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Featured Article Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 h-64 md:h-auto">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                    <Database className="text-blue-600 dark:text-blue-400" size={64} />
                  </div>
                </div>
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-accolade-serial font-bold text-gray-900 dark:text-white mb-3">
                      ASEAN Trade Data Analysis Shows 15% Growth in Q3 2025
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      Comprehensive analysis of ASEAN trade patterns reveals significant growth in cross-border data sharing and economic integration across member states.
                    </p>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="text-white" size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-proxima font-medium text-gray-900 dark:text-white">Alex Morrison</p>
                        <p className="text-xs font-proxima text-gray-500 dark:text-gray-400">Sep 28, 2025</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <Share2 size={16} />
                      <span className="text-sm">Share</span>
                    </button>
                      <button
                      onClick={() => handleAudit(datasets[0])}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                      </button>
                  </div>
                </div>
                    </div>
              </motion.div>

            {/* Secondary Article Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="flex">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center">
                  <BarChart3 className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-accolade-serial font-semibold text-gray-900 dark:text-white mb-2">
                    Data Quality Metrics Show 98% Accuracy Rate
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <User className="text-white" size={12} />
                    </div>
                      <div>
                      <p className="text-sm font-proxima font-medium text-gray-900 dark:text-white">Sarah Chen</p>
                      <p className="text-xs font-proxima text-gray-500 dark:text-gray-400">Sep 27, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
              </motion.div>

            {/* Dataset Cards */}
            {datasets.map((dataset, idx) => (
              <motion.div
                key={dataset.hash}
                whileHover={{ scale: 1.02 }}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 ${
                  dataset.sharedCrossBorder ? "ring-2 ring-green-400 bg-green-50 dark:bg-green-900/20" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Database className="text-blue-500" size={24} />
                    <h3 className="font-accolade-serial font-semibold text-lg text-gray-900 dark:text-white">Dataset Summary</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-xs font-proxima font-medium">
                      {dataset.reuseCount} reuses
                    </span>
                    {dataset.sharedCrossBorder && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-xs font-proxima font-medium flex items-center gap-1">
                        <Globe size={12} />
                        Shared Cross-Border
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Name:</span>
                    <span className="font-proxima font-medium text-gray-900 dark:text-white">{dataset.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Origin:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-proxima font-medium ${
                      dataset.origin === "ASEAN" 
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}>
                      {dataset.origin}
                    </span>
                  </div>
                  
                  {/* Interactive AI Analysis Panel */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="text-purple-600 dark:text-purple-400" size={18} />
                      <h4 className="font-accolade-serial font-semibold text-gray-900 dark:text-white">AI Analysis</h4>
                    </div>
                    
                    {/* Quality Score with Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-proxima font-medium text-gray-700 dark:text-gray-300">Overall Quality</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-proxima font-bold ${
                            dataset.aiReport.qualityScore >= 90 ? 'text-green-600 dark:text-green-400' :
                            dataset.aiReport.qualityScore >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {dataset.aiReport.qualityScore}/100
                          </span>
                          <div className={`w-3 h-3 rounded-full ${
                            dataset.aiReport.qualityScore >= 90 ? 'bg-green-500' :
                            dataset.aiReport.qualityScore >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            dataset.aiReport.qualityScore >= 90 ? 'bg-green-500' :
                            dataset.aiReport.qualityScore >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${dataset.aiReport.qualityScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Completeness with Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-proxima font-medium text-gray-700 dark:text-gray-300">Completeness</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-proxima font-bold ${
                            dataset.aiReport.completeness >= 95 ? 'text-green-600 dark:text-green-400' :
                            dataset.aiReport.completeness >= 80 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {dataset.aiReport.completeness}%
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            dataset.aiReport.completeness >= 95 ? 'bg-green-500' :
                            dataset.aiReport.completeness >= 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-1000 ${
                            dataset.aiReport.completeness >= 95 ? 'bg-green-500' :
                            dataset.aiReport.completeness >= 80 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${dataset.aiReport.completeness}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Bias Analysis Mini Chart */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-proxima font-medium text-gray-700 dark:text-gray-300">Bias Analysis</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          dataset.aiReport.biasFlag ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        }`}>
                          {dataset.aiReport.biasFlag ? 'Flagged' : 'Clean'}
                        </span>
                      </div>
                      <div className="h-20">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dataset.aiReport.biasCategories}>
                            <XAxis dataKey="category" hide />
                            <YAxis hide />
                            <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                              {dataset.aiReport.biasCategories.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={
                                    entry.score > 30 ? '#ef4444' : 
                                    entry.score > 15 ? '#f59e0b' : '#10b981'
                                  } 
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Anomaly Count with Visual Indicator */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Anomalies</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${
                          dataset.aiReport.anomalies.length === 0 ? 'text-green-600 dark:text-green-400' :
                          dataset.aiReport.anomalies.length <= 2 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {dataset.aiReport.anomalies.length}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          dataset.aiReport.anomalies.length === 0 ? 'bg-green-500' :
                          dataset.aiReport.anomalies.length <= 2 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Credits Earned:</span>
                    <span className="font-proxima font-medium text-gray-900 dark:text-white">{dataset.credits}</span>
                  </div>
                </div>

                {/* Cross-Border Toggle */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm font-proxima font-medium text-gray-700 dark:text-gray-300">Share with ASEAN-China Ledger</span>
                  <button
                    onClick={() => handleCrossBorderToggle(idx)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      dataset.sharedCrossBorder ? "bg-green-600" : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        dataset.sharedCrossBorder ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => handleViewAIReport(dataset)}
                    className="px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors flex items-center gap-2"
                  >
                    <BarChart3 size={16} />
                    <span className="text-sm">View Report</span>
                  </button>
                  <button
                    onClick={() => handleViewBlockchain(dataset)}
                    className="px-3 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors flex items-center gap-2"
                  >
                    <Database size={16} />
                    <span className="text-sm">Ledger Entry</span>
                  </button>
                  <button
                    onClick={() => handleDownloadReport(dataset)}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    <span className="text-sm">Download</span>
                  </button>
                  <button
                    onClick={() => handleRequestFeedback(dataset)}
                    className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors flex items-center gap-2"
                  >
                    <Bell size={16} />
                    <span className="text-sm">Feedback</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare(idx)}
                    disabled={dataset.shared}
                    className={`flex-1 px-4 py-2 rounded-lg font-proxima font-medium transition-colors ${
                      dataset.shared
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {dataset.shared ? "Shared" : "Share Dataset"}
                  </button>
                  <button
                    onClick={() => handleIncrementReuse(idx)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Star size={16} />
                    <span className="text-sm">Simulate Reuse</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search for articles"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Search size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                    {tag}
                        </span>
                ))}
              </div>
            </div>

            {/* Contributor Stats Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Alex Morrison</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Senior Data Contributor</p>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalUploads}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Uploads</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalCredits}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Credits</p>
                </div>
              </div>

              {/* Average AI Score */}
              <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Avg AI Score</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(datasets.reduce((acc, d) => acc + d.aiReport.qualityScore, 0) / datasets.length)}/100
                        </span>
                      </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(datasets.reduce((acc, d) => acc + d.aiReport.qualityScore, 0) / datasets.length)}%` }}
                  ></div>
                </div>
              </div>

              {/* Badge Progress */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="text-yellow-500" size={16} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Badge Progress</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Trusted Contributor</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{totalCredits}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((totalCredits / 5) * 100, 100)}%` }}
                    ></div>
                  </div>
                  {totalCredits >= 5 && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle size={12} />
                      <span>Unlocked!</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={16} />
                  <span className="text-sm">Chat</span>
                </button>
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Heart size={16} />
                  <span className="text-sm">Follow</span>
                </button>
              </div>
            </div>

            {/* Cross-Border Visualization */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="text-blue-600 dark:text-blue-400" size={18} />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Cross-Border Data Flow</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">ASEAN-China Data Sharing Network</p>
              </div>
              
              {/* Map Visualization */}
              <div className="relative p-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
                <div className="relative h-48 w-full">
                  {/* ASEAN Region */}
                  <div className="absolute top-4 left-4 w-20 h-16 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-white text-xs font-bold text-center">
                      <div>ASEAN</div>
                      <div className="text-xs opacity-80">Region</div>
                    </div>
                  </div>
                  
                  {/* China */}
                  <div className="absolute top-8 right-4 w-16 h-20 bg-red-500 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-white text-xs font-bold text-center">
                      <div>China</div>
                    </div>
                  </div>
                  
                  {/* Data Flow Lines */}
                  {datasets.filter(d => d.sharedCrossBorder).map((dataset, idx) => (
                    <motion.div
                      key={dataset.hash}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ 
                        duration: 2, 
                        delay: idx * 0.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="absolute"
                      style={{
                        top: '50%',
                        left: '30%',
                        width: '40%',
                        height: '2px',
                        background: 'linear-gradient(90deg, #3b82f6, #10b981, #3b82f6)',
                        backgroundSize: '200% 100%',
                        animation: 'flow 3s linear infinite'
                      }}
                    >
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse">
                        <Database className="text-white" size={8} />
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Connection Points */}
                  <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
                  
                  {/* Flow Indicators */}
                  {datasets.filter(d => d.sharedCrossBorder).length > 0 && (
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                        <Zap className="text-green-600 dark:text-green-400" size={12} />
                        <span>{datasets.filter(d => d.sharedCrossBorder).length} Active</span>
                    </div>
              </motion.div>
                  )}
                </div>
                
                {/* Statistics */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {datasets.filter(d => d.sharedCrossBorder).length}
                    </div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Shared</div>
                  </div>
                  <div className="text-center p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {datasets.filter(d => d.sharedCrossBorder).reduce((acc, d) => acc + d.reuseCount, 0)}
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">Reuses</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Short Film Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center">
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={32} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Visualization Demo</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Eye size={16} />
                  <span>80,989 views</span>
                </div>
              </div>
            </div>

            {/* Navigation and Filters */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <span
                  key={filter}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    index === filters.length - 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Report Modal */}
        <AnimatePresence>
          {showAIReport && selectedDataset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAIReport(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Analysis Report</h2>
                      <button
                    onClick={() => setShowAIReport(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                    <X size={20} />
                      </button>
                    </div>
                
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Summary Tab */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Summary</h3>
                      
                      {/* Quality Score */}
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Quality Score</span>
                          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedDataset.aiReport.qualityScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className="bg-purple-600 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${selectedDataset.aiReport.qualityScore}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Completeness */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-proxima font-medium text-gray-700 dark:text-gray-300">Completeness</span>
                          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{selectedDataset.aiReport.completeness}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${selectedDataset.aiReport.completeness}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Bias Analysis with Interactive Chart */}
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Bias Analysis</h4>
                        <div className="space-y-3">
                          {selectedDataset.aiReport.biasCategories.map((bias, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{bias.category}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-proxima font-bold ${
                                    bias.score > 30 ? 'text-red-600 dark:text-red-400' :
                                    bias.score > 15 ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-green-600 dark:text-green-400'
                                  }`}>
                                    {bias.score}%
                                  </span>
                                  <div className={`w-3 h-3 rounded-full ${
                                    bias.score > 30 ? 'bg-red-500' :
                                    bias.score > 15 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}></div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-1000 ${
                                    bias.score > 30 ? 'bg-red-500' :
                                    bias.score > 15 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${bias.score}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Bias Distribution Chart */}
                        <div className="mt-4 h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={selectedDataset.aiReport.biasCategories} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                              <XAxis dataKey="category" fontSize={12} />
                              <YAxis fontSize={12} />
                              <Tooltip 
                                formatter={(value) => [`${value}%`, 'Bias Score']}
                                labelStyle={{ color: '#374151' }}
                                contentStyle={{ 
                                  backgroundColor: '#f9fafb', 
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px'
                                }}
                              />
                              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                {selectedDataset.aiReport.biasCategories.map((entry, index) => (
                                  <Cell 
                                    key={`cell-${index}`} 
                                    fill={
                                      entry.score > 30 ? '#ef4444' : 
                                      entry.score > 15 ? '#f59e0b' : '#10b981'
                                    } 
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Details Tab */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Analysis</h3>
                      
                      {/* Anomalies */}
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Detected Anomalies</h4>
                        <div className="space-y-2">
                          {selectedDataset.aiReport.anomalies.map((anomaly, idx) => (
                            <div key={idx} className="p-2 bg-white dark:bg-gray-800 rounded border-l-4 border-red-400">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{anomaly.type}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  anomaly.severity === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100' :
                                  anomaly.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                }`}>
                                  {anomaly.severity}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{anomaly.description}</p>
            </div>
          ))}
        </div>
                      </div>

                      {/* Comprehensive Analysis Charts */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Bias Distribution Pie Chart */}
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Bias Distribution</h4>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={selectedDataset.aiReport.biasCategories}
                                dataKey="score"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#8884d8"
                              >
                                {selectedDataset.aiReport.biasCategories.map((entry, index) => (
                                  <PieCell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#10b981'][index % 3]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value) => [`${value}%`, 'Bias Score']}
                                labelStyle={{ color: '#374151' }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Quality Metrics Overview */}
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Quality Metrics</h4>
                          <div className="space-y-4">
                            {/* Completeness */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-proxima font-medium text-gray-700 dark:text-gray-300">Completeness</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-proxima font-bold ${
                                    selectedDataset.aiReport.completeness >= 95 ? 'text-green-600 dark:text-green-400' :
                                    selectedDataset.aiReport.completeness >= 80 ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-red-600 dark:text-red-400'
                                  }`}>
                                    {selectedDataset.aiReport.completeness}%
                                  </span>
                                  <div className={`w-3 h-3 rounded-full ${
                                    selectedDataset.aiReport.completeness >= 95 ? 'bg-green-500' :
                                    selectedDataset.aiReport.completeness >= 80 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}></div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-1000 ${
                                    selectedDataset.aiReport.completeness >= 95 ? 'bg-green-500' :
                                    selectedDataset.aiReport.completeness >= 80 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${selectedDataset.aiReport.completeness}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            {/* Quality Score */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality Score</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-proxima font-bold ${
                                    selectedDataset.aiReport.qualityScore >= 90 ? 'text-green-600 dark:text-green-400' :
                                    selectedDataset.aiReport.qualityScore >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-red-600 dark:text-red-400'
                                  }`}>
                                    {selectedDataset.aiReport.qualityScore}/100
                        </span>
                                  <div className={`w-3 h-3 rounded-full ${
                                    selectedDataset.aiReport.qualityScore >= 90 ? 'bg-green-500' :
                                    selectedDataset.aiReport.qualityScore >= 70 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}></div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-1000 ${
                                    selectedDataset.aiReport.qualityScore >= 90 ? 'bg-green-500' :
                                    selectedDataset.aiReport.qualityScore >= 70 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${selectedDataset.aiReport.qualityScore}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Anomalies */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-proxima font-medium text-gray-700 dark:text-gray-300">Anomalies</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-proxima font-bold ${
                                    selectedDataset.aiReport.anomalies.length === 0 ? 'text-green-600 dark:text-green-400' :
                                    selectedDataset.aiReport.anomalies.length <= 2 ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-red-600 dark:text-red-400'
                                  }`}>
                                    {selectedDataset.aiReport.anomalies.length}
                        </span>
                                  <div className={`w-3 h-3 rounded-full ${
                                    selectedDataset.aiReport.anomalies.length === 0 ? 'bg-green-500' :
                                    selectedDataset.aiReport.anomalies.length <= 2 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Anomaly Severity Chart */}
                      {selectedDataset.aiReport.anomalies.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Anomaly Severity Distribution</h4>
                          <div className="h-32">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { severity: 'High', count: selectedDataset.aiReport.anomalies.filter(a => a.severity === 'High').length },
                                { severity: 'Medium', count: selectedDataset.aiReport.anomalies.filter(a => a.severity === 'Medium').length },
                                { severity: 'Low', count: selectedDataset.aiReport.anomalies.filter(a => a.severity === 'Low').length }
                              ]}>
                                <XAxis dataKey="severity" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip 
                                  formatter={(value) => [`${value}`, 'Anomalies']}
                                  labelStyle={{ color: '#374151' }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                  <Cell fill="#ef4444" />
                                  <Cell fill="#f59e0b" />
                                  <Cell fill="#10b981" />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blockchain Drawer */}
        <AnimatePresence>
          {showBlockchainDrawer && selectedDataset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50"
              onClick={() => setShowBlockchainDrawer(false)}
            >
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-l-xl shadow-2xl w-96 h-full max-h-screen overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Blockchain Ledger Entry</h2>
                  <button
                    onClick={() => setShowBlockchainDrawer(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dataset Hash</h3>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                        {selectedDataset.hash}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedDataset.hash)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Report Hash</h3>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                        {selectedDataset.aiReport.reportHash}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedDataset.aiReport.reportHash)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Blockchain Entry Hash</h3>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                        {selectedDataset.blockchain.entryHash}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(selectedDataset.blockchain.entryHash)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contributor ID</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedDataset.contributorId}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedDataset.blockchain.timestamp}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Time</span>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedDataset.uploadTime}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Blockchain Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Verified & Immutable</span>
                    </div>
                  </div>
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

        <AuditModal open={showAudit} onClose={() => setShowAudit(false)} dataset={auditDataset} />
      </div>
    </div>
  );
}