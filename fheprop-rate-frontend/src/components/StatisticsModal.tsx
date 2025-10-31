"use client";

import { useState, useEffect } from "react";
import { X, BarChart3 } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { designTokens } from "@/design-tokens";

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  projectName: string;
  // Project data with statistics
  project?: {
    id: number;
    name: string;
    statistics?: {
      dimensions: {
        location: number;
        quality: number;
        amenities: number;
        transport: number;
        value: number;
        potential: number;
      };
    };
  };
  onRefreshStats?: () => void;
}

export function StatisticsModal({
  isOpen,
  onClose,
  projectId,
  projectName,
  project,
  onRefreshStats
}: StatisticsModalProps) {
  const [activeTab, setActiveTab] = useState<'radar'>('radar');

  // Mock data for demonstration
  const defaultStats = {
    dimensions: {
      location: 7.8,
      quality: 8.2,
      amenities: 6.9,
      transport: 7.5,
      value: 8.1,
      potential: 7.3,
    },
  };

  const stats = project?.statistics || defaultStats;

  const radarData = Object.entries(stats.dimensions).map(([key, value]) => ({
    dimension: key.charAt(0).toUpperCase() + key.slice(1),
    score: value,
    fullMark: 10,
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Rating Analytics</h2>
            <p className="text-muted">
              Project: {projectName}
              <span className="ml-2 text-green-600 text-xs">🔓 Live Statistics</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'radar'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Dimension Scores
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'radar' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Average Scores by Dimension</h3>
              <p className="text-sm text-muted">
                Radar chart showing average ratings across all dimensions (1-10 scale)
              </p>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" />
                    <PolarRadiusAxis domain={[0, 10]} />
                    <Radar
                      name="Average Score"
                      dataKey="score"
                      stroke={designTokens.colors.light.primary}
                      fill={designTokens.colors.light.primary}
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-surface/50">
          <div className="flex items-center justify-between text-sm text-muted">
            <div className="flex items-center gap-4">
              <span>Statistics are computed from decrypted rating data</span>
              <button
                className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors"
                onClick={() => {
                  if (onRefreshStats) {
                    onRefreshStats();
                    console.log("Refresh statistics triggered");
                  } else {
                    console.log("Refresh statistics clicked - onRefreshStats not provided");
                  }
                }}
              >
                🔄 Refresh Statistics
              </button>
            </div>
            <span>Privacy-protected analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
