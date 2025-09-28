"use client";

import React, { useState, useEffect } from "react";
import { Database, Globe, User, Clock, Hash, ArrowRight, Grid, List, X } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
// Chart components removed as they're not currently used

interface BlockchainBlock {
  id: number;
  blockNumber: number;
  datasetHash: string;
  contributorId: string;
  aiScore: number;
  timestamp: string;
  datasetName: string;
  origin: string;
  reuseCount: number;
  aiReport: {
    completeness: number;
    biasFlag: boolean;
    qualityScore: number;
    biasCategories: { category: string; score: number }[];
    anomalies: { type: string; severity: string; description: string }[];
  };
  previousHash: string;
  nonce: number;
}

const mockBlocks: BlockchainBlock[] = [
  {
    id: 1,
    blockNumber: 1,
    datasetHash: "0xA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0",
    contributorId: "user_12345",
    aiScore: 92,
    timestamp: "2025-09-28 10:15:00",
    datasetName: "ASEAN Trade Data 2025",
    origin: "ASEAN",
    reuseCount: 3,
    aiReport: {
      completeness: 98,
      biasFlag: false,
      qualityScore: 92,
      biasCategories: [
        { category: "Geographic", score: 15 },
        { category: "Temporal", score: 8 },
        { category: "Demographic", score: 22 }
      ],
      anomalies: [
        { type: "Outlier", severity: "Low", description: "Minor data point deviation" }
      ]
    },
    previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    nonce: 12345
  },
  {
    id: 2,
    blockNumber: 2,
    datasetHash: "0xC1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0",
    contributorId: "user_67890",
    aiScore: 78,
    timestamp: "2025-09-28 11:30:00",
    datasetName: "China Export Stats Q3",
    origin: "China",
    reuseCount: 5,
    aiReport: {
      completeness: 92,
      biasFlag: true,
      qualityScore: 78,
      biasCategories: [
        { category: "Geographic", score: 35 },
        { category: "Temporal", score: 20 },
        { category: "Demographic", score: 15 }
      ],
      anomalies: [
        { type: "Bias Detection", severity: "High", description: "Geographic bias in region codes" },
        { type: "Data Inconsistency", severity: "Medium", description: "Missing timestamps in 5% of records" }
      ]
    },
    previousHash: "0xA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0",
    nonce: 23456
  },
  {
    id: 3,
    blockNumber: 3,
    datasetHash: "0xH1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0",
    contributorId: "user_99999",
    aiScore: 88,
    timestamp: "2025-09-28 14:45:00",
    datasetName: "Healthcare Clinical Trials",
    origin: "Singapore",
    reuseCount: 1,
    aiReport: {
      completeness: 95,
      biasFlag: false,
      qualityScore: 88,
      biasCategories: [
        { category: "Age Group", score: 12 },
        { category: "Gender", score: 18 },
        { category: "Ethnicity", score: 25 }
      ],
      anomalies: [
        { type: "Missing Data", severity: "Low", description: "Patient demographics incomplete" }
      ]
    },
    previousHash: "0xC1D2E3F4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0",
    nonce: 34567
  }
];

export default function BlockchainExplorer() {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>(mockBlocks);
  const [viewMode, setViewMode] = useState<"chain" | "timeline">("chain");
  const [selectedBlock, setSelectedBlock] = useState<BlockchainBlock | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  // Simulate new block addition
  useEffect(() => {
    const addNewBlock = () => {
      const newId = Date.now() + Math.random() * 1000; // Unique ID based on timestamp + random
      setBlocks(prev => {
        const newBlock: BlockchainBlock = {
          id: newId,
          blockNumber: prev.length + 1,
          datasetHash: `0x${Math.random().toString(16).slice(2, 42)}`,
          contributorId: `user_${Math.random().toString(16).slice(2, 8)}`,
          aiScore: Math.floor(Math.random() * 30) + 70,
          timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
          datasetName: `Dataset ${prev.length + 1}`,
          origin: ["ASEAN", "China", "Singapore"][Math.floor(Math.random() * 3)],
          reuseCount: Math.floor(Math.random() * 10),
          aiReport: {
            completeness: Math.floor(Math.random() * 20) + 80,
            biasFlag: Math.random() > 0.7,
            qualityScore: Math.floor(Math.random() * 30) + 70,
            biasCategories: [
              { category: "Geographic", score: Math.floor(Math.random() * 40) },
              { category: "Temporal", score: Math.floor(Math.random() * 30) },
              { category: "Demographic", score: Math.floor(Math.random() * 35) }
            ],
            anomalies: Math.random() > 0.5 ? [
              { type: "Outlier", severity: "Low", description: "Minor data point deviation" }
            ] : []
          },
          previousHash: prev[prev.length - 1]?.datasetHash || "0x0000000000000000000000000000000000000000000000000000000000000000",
          nonce: Math.floor(Math.random() * 100000)
        };
        return [...prev, newBlock];
      });
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        addNewBlock();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleBlockClick = (block: BlockchainBlock) => {
    setSelectedBlock(block);
    setShowModal(true);
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-100";
    if (score >= 80) return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-100";
    return "text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-100";
  };

  const getOriginColor = (origin: string) => {
    switch (origin) {
      case "ASEAN": return "text-blue-500";
      case "China": return "text-red-500";
      case "Singapore": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Image 
              src="/logo/new logo png.png" 
              alt="TRAIN Logo" 
              width={48} 
              height={48}
              className="object-contain"
            />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Blockchain Explorer
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Immutable dataset provenance and trust verification
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{blocks.length}</div>
              <div className="text-sm text-gray-300">Total Blocks</div>
            </div>
            
            <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
              <button
                onClick={() => setViewMode("chain")}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === "chain" 
                    ? "bg-blue-500 text-white shadow-lg" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Grid size={16} className="inline mr-2" />
                Chain View
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-4 py-2 rounded-md transition-all ${
                  viewMode === "timeline" 
                    ? "bg-blue-500 text-white shadow-lg" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <List size={16} className="inline mr-2" />
                Timeline View
              </button>
            </div>
          </div>
        </div>

        {/* Blockchain Visualization */}
        <div className="relative">
          {viewMode === "chain" ? (
            <div className="flex items-center justify-center h-[500px] overflow-x-auto scrollbar-hide">
              <div className="flex items-center space-x-8 min-w-max px-4">
                {blocks.map((block, index) => (
                  <React.Fragment key={block.id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, x: 100 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`relative cursor-pointer group ${
                        hoveredBlock === block.id ? "z-10" : ""
                      }`}
                      onMouseEnter={() => setHoveredBlock(block.id)}
                      onMouseLeave={() => setHoveredBlock(null)}
                      onClick={() => handleBlockClick(block)}
                    >
                      {/* Block Card */}
                      <Card className="w-72 sm:w-80 h-48 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-blue-500/30 shadow-2xl group-hover:border-blue-400 group-hover:shadow-blue-500/25 transition-all duration-300 flex-shrink-0">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Database className="text-blue-400" size={20} />
                              <span className="text-white font-bold">Block #{block.blockNumber}</span>
                            </div>
                            <Badge className={`${getScoreColor(block.aiScore)} border-0`}>
                              {block.aiScore}/100
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Hash className="text-gray-400" size={14} />
                              <span className="text-gray-300 text-sm font-mono">
                                {truncateHash(block.datasetHash)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <User className="text-gray-400" size={14} />
                              <span className="text-gray-300 text-sm">{block.contributorId}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Globe className={`${getOriginColor(block.origin)}`} size={14} />
                              <span className="text-gray-300 text-sm">{block.origin}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="text-gray-400" size={14} />
                              <span className="text-gray-300 text-sm">{block.timestamp}</span>
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-gray-700">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>Reuses: {block.reuseCount}</span>
                              <span>Nonce: {block.nonce}</span>
                            </div>
                          </div>
                        </CardContent>
                        
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </Card>
                      
                      {/* Tooltip */}
                      <AnimatePresence>
                        {hoveredBlock === block.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full z-20"
                          >
                            <div className="bg-gray-800 border border-blue-500/50 rounded-lg p-3 shadow-xl min-w-64">
                              <div className="text-white font-semibold mb-2 truncate">{block.datasetName}</div>
                              <div className="text-gray-300 text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span>Origin:</span>
                                  <span className="text-white">{block.origin}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>AI Score:</span>
                                  <span className="text-white">{block.aiScore}/100</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Reuse Count:</span>
                                  <span className="text-white">{block.reuseCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Bias Flagged:</span>
                                  <span className={block.aiReport.biasFlag ? "text-red-400" : "text-green-400"}>
                                    {block.aiReport.biasFlag ? "Yes" : "No"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    
                    {/* Connection Arrow */}
                    {index < blocks.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                        className="flex items-center"
                      >
                        <div className="relative">
                          <ArrowRight className="text-blue-400 w-8 h-8 animate-pulse" />
                          <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm animate-pulse" />
                        </div>
                      </motion.div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto px-4">
              {blocks.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="cursor-pointer"
                  onClick={() => handleBlockClick(block)}
                >
                  <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border border-blue-500/30 hover:border-blue-400 transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Database className="text-blue-400" size={24} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-bold text-lg">Block #{block.blockNumber}</div>
                            <div className="text-gray-300 text-sm truncate">{block.datasetName}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                          <div className="text-right">
                            <div className="text-white font-semibold">{block.contributorId}</div>
                            <div className="text-gray-400 text-sm">{block.timestamp}</div>
                          </div>
                          <Badge className={`${getScoreColor(block.aiScore)} border-0`}>
                            {block.aiScore}/100
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Block Detail Modal */}
        <AnimatePresence>
          {showModal && selectedBlock && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-blue-500/30 mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                  <h2 className="text-2xl font-bold text-white">Block #{selectedBlock.blockNumber} Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Block Information */}
                    <div className="space-y-6">
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Block Information</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Block Number:</span>
                            <span className="text-white font-mono">#{selectedBlock.blockNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Dataset Hash:</span>
                            <span className="text-white font-mono text-xs">{selectedBlock.datasetHash}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Previous Hash:</span>
                            <span className="text-white font-mono text-xs">{selectedBlock.previousHash}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Nonce:</span>
                            <span className="text-white font-mono">{selectedBlock.nonce}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Timestamp:</span>
                            <span className="text-white">{selectedBlock.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Dataset Information</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Name:</span>
                            <span className="text-white">{selectedBlock.datasetName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Contributor:</span>
                            <span className="text-white">{selectedBlock.contributorId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Origin:</span>
                            <span className={`${getOriginColor(selectedBlock.origin)}`}>{selectedBlock.origin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Reuse Count:</span>
                            <span className="text-white">{selectedBlock.reuseCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Report */}
                    <div className="space-y-6">
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">AI Analysis Report</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Quality Score:</span>
                            <Badge className={`${getScoreColor(selectedBlock.aiScore)} border-0`}>
                              {selectedBlock.aiScore}/100
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Completeness:</span>
                            <span className="text-white">{selectedBlock.aiReport.completeness}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Bias Flagged:</span>
                            <span className={`${selectedBlock.aiReport.biasFlag ? 'text-red-400' : 'text-green-400'}`}>
                              {selectedBlock.aiReport.biasFlag ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Bias Analysis</h3>
                        <div className="space-y-2">
                          {selectedBlock.aiReport.biasCategories.map((bias, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="text-gray-400 text-sm">{bias.category}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-600 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${
                                      bias.score > 30 ? 'bg-red-500' : bias.score > 15 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${bias.score}%` }}
                                  ></div>
                                </div>
                                <span className="text-white text-sm">{bias.score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedBlock.aiReport.anomalies.length > 0 && (
                        <div className="bg-gray-700/50 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-4">Detected Anomalies</h3>
                          <div className="space-y-2">
                            {selectedBlock.aiReport.anomalies.map((anomaly, idx) => (
                              <div key={idx} className="p-2 bg-gray-600 rounded border-l-4 border-red-400">
                                <div className="flex items-center justify-between">
                                  <span className="text-white text-sm font-medium">{anomaly.type}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    anomaly.severity === 'High' ? 'bg-red-100 text-red-800' :
                                    anomaly.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {anomaly.severity}
                                  </span>
                                </div>
                                <p className="text-gray-300 text-xs mt-1">{anomaly.description}</p>
                              </div>
                            ))}
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
      </div>
    </div>
  );
}
