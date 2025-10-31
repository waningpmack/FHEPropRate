"use client";

import { useRef, useState } from "react";
import { useMetaMask } from "@/hooks/metamask/useMetaMaskProvider";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFhevm } from "@/fhevm/useFhevm";
import { usePropertyRating } from "@/hooks/usePropertyRating";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { Star, Plus, Building, MapPin, Users, BarChart3 } from "lucide-react";
import { StatisticsModal } from "@/components/StatisticsModal";

export default function Home() {
  const { isConnected, connect, chainId, accounts } = useMetaMask();
  const { ethersSigner, ethersReadonlyProvider } = useMetaMaskEthersSigner();
  const { instance, status } = useFhevm();

  console.log("[Home] isConnected:", isConnected);
  console.log("[Home] chainId:", chainId);
  console.log("[Home] accounts:", accounts);
  console.log("[Home] ethersReadonlyProvider:", !!ethersReadonlyProvider);

  const sameChain = useRef((cid: number | undefined) => cid === chainId);
  const sameSigner = useRef((signer: any) => signer === ethersSigner);

  const fhevmDecryptionSignatureStorage = useInMemoryStorage();

  const {
    canCreateProject,
    canSubmitRating,
    createProject,
    submitRating,
    getProjectStatistics,
    refreshProjects,
    projects,
    message,
    isCreating,
    isRating,
    isRefreshing,
    isDeployed
  } = usePropertyRating({
    instance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: undefined,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [statsProject, setStatsProject] = useState<any>(null);
  const [ratings, setRatings] = useState({
    location: 5,
    quality: 5,
    amenities: 5,
    transport: 5,
    value: 5,
    potential: 5,
  });

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    location: "",
    dimensions: '["Location", "Quality", "Amenities", "Transport", "Value", "Potential"]',
    duration: 7, // days
  });

  const handleCreateProject = async () => {
    if (!createForm.name || !createForm.description || !createForm.location) return;

    console.log("[Home] Creating project with form:", createForm);

    const durationSeconds = createForm.duration * 24 * 60 * 60; // Convert days to seconds
    console.log("[Home] Duration seconds:", durationSeconds);

    try {
      const success = await createProject(
        createForm.name,
        createForm.description,
        createForm.location,
        createForm.dimensions,
        durationSeconds
      );

      if (success) {
        console.log("[Home] Project created successfully");

        setCreateForm({
          name: "",
          description: "",
          location: "",
          dimensions: '["Location", "Quality", "Amenities", "Transport", "Value", "Potential"]',
          duration: 7,
        });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("[Home] Failed to create project:", error);
      // Don't reset form on error so user can retry
    }
  };

  const handleSubmitRating = async () => {
    if (!selectedProject) return;

    await submitRating(
      selectedProject.id,
      ratings.location,
      ratings.quality,
      ratings.amenities,
      ratings.transport,
      ratings.value,
      ratings.potential
    );

    setSelectedProject(null);
    setRatings({
      location: 5,
      quality: 5,
      amenities: 5,
      transport: 5,
      value: 5,
      potential: 5,
    });
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium w-20">{label}:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`w-6 h-6 ${star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          >
            <Star className="w-full h-full" />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted ml-2">{value}/10</span>
    </div>
  );

  if (!isConnected) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FHEPropRate
          </h1>
            <p className="text-xl text-muted">Privacy-Preserving Property Rating</p>
            <p className="text-sm text-muted max-w-md">
              Rate properties anonymously using Full Homomorphic Encryption.
              Your ratings stay private while contributing to transparent statistics.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={connect}
              className="w-full px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              🔐 Connect Wallet
            </button>

            <button
              onClick={() => {
                // Force mock mode by setting localStorage flag
                localStorage.setItem('forceMockMode', 'true');
                window.location.reload();
              }}
              className="w-full px-8 py-3 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              🧪 Use Local Development Mode
            </button>
          </div>

          <div className="text-xs text-muted">
            Connect wallet for real FHE encryption, or use local mode for testing
          </div>
        </div>
      </div>
    );
  }

  if (!isDeployed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Contract Not Deployed</h2>
          <p className="text-muted">
            PropertyRatingContract is not deployed on this network (chainId: {chainId}).
          </p>
          <p className="text-sm text-muted">
            For local development, deploy to localhost network.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-surface/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">FHEPropRate</h1>
              <p className="text-xs text-muted">Connected: {accounts?.[0]?.slice(0, 6)}...{accounts?.[0]?.slice(-4)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted">
              Chain: {chainId === 31337 ? 'Localhost (Mock)' : chainId === 11155111 ? 'Sepolia' : `Chain ${chainId}`}
            </div>
            <div className="text-sm text-muted">
              FHEVM: {status || 'Ready'}
            </div>
            {chainId === 31337 && (
              <button
                onClick={() => {
                  localStorage.removeItem('forceMockMode');
                  window.location.reload();
                }}
                className="px-3 py-1 text-xs bg-slate-600 hover:bg-slate-700 text-white rounded transition-colors"
              >
                Switch to Real Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Status Messages */}
        {message && (
          <div className="mb-6 p-4 bg-surface rounded-lg border">
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Create Project Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            disabled={!canCreateProject}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Rating Project
          </button>
        </div>

        {/* Create Project Form */}
        {showCreateForm && (
          <div className="mb-8 p-6 bg-surface rounded-lg border space-y-4">
            <h3 className="text-lg font-semibold">Create New Rating Project</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="e.g., Downtown Luxury Condo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={createForm.location}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-2 border rounded-md bg-background"
                  placeholder="e.g., 123 Main St, Downtown"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded-md bg-background"
                  rows={3}
                  placeholder="Describe the property and what you're seeking ratings for..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration (days)</label>
                <input
                  type="number"
                  value={createForm.duration}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 7 }))}
                  className="w-full p-2 border rounded-md bg-background"
                  min="1"
                  max="365"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateProject}
                disabled={isCreating || !createForm.name || !createForm.description || !createForm.location}
                className="px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Project'}
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border rounded-lg hover:bg-surface"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Rating Projects</h2>
            <div className="text-sm text-muted">
              Found {projects.length} projects
            </div>
            <button
              onClick={refreshProjects}
              disabled={isRefreshing}
              className="px-3 py-1 text-sm border rounded hover:bg-surface disabled:opacity-50"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No rating projects yet. Create the first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <div key={project.id} className="p-6 bg-surface rounded-lg border space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted mt-1">
                      <MapPin className="w-3 h-3" />
                      {project.location}
                    </div>
                  </div>

                  <p className="text-sm text-muted line-clamp-2">{project.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Creator: {project.creator.slice(0, 6)}...{project.creator.slice(-4)}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      Date.now() / 1000 < project.deadline
                        ? 'bg-success/20 text-success'
                        : 'bg-error/20 text-error'
                    }`}>
                      {Date.now() / 1000 < project.deadline ? 'Active' : 'Expired'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      disabled={!canSubmitRating || Date.now() / 1000 > project.deadline}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Rate This Property
                    </button>
                    {accounts && project.creator.toLowerCase() === accounts[0].toLowerCase() && (
                      <button
                        onClick={async () => {
                          console.log("[page] Fetching statistics for project:", project.id);
                          const stats = await getProjectStatistics(project.id);
                          console.log("[page] Statistics received:", stats);
                          setStatsProject({
                            ...project,
                            statistics: stats
                          });
                        }}
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                        title="View Statistics"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full space-y-6">
              <div>
                <h3 className="text-xl font-bold">Rate: {selectedProject.name}</h3>
                <p className="text-sm text-muted">{selectedProject.location}</p>
              </div>

              <div className="space-y-4">
                <StarRating
                  label="Location"
                  value={ratings.location}
                  onChange={(v) => setRatings(prev => ({ ...prev, location: Number(v) }))}
                />
                <StarRating
                  label="Quality"
                  value={ratings.quality}
                  onChange={(v) => setRatings(prev => ({ ...prev, quality: Number(v) }))}
                />
                <StarRating
                  label="Amenities"
                  value={ratings.amenities}
                  onChange={(v) => setRatings(prev => ({ ...prev, amenities: Number(v) }))}
                />
                <StarRating
                  label="Transport"
                  value={ratings.transport}
                  onChange={(v) => setRatings(prev => ({ ...prev, transport: Number(v) }))}
                />
                <StarRating
                  label="Value"
                  value={ratings.value}
                  onChange={(v) => setRatings(prev => ({ ...prev, value: Number(v) }))}
                />
                <StarRating
                  label="Potential"
                  value={ratings.potential}
                  onChange={(v) => setRatings(prev => ({ ...prev, potential: Number(v) }))}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitRating}
                  disabled={isRating}
                  className="flex-1 px-4 py-2 bg-success text-success-foreground rounded-lg hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRating ? 'Submitting...' : 'Submit Rating'}
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-surface"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Modal */}
        <StatisticsModal
          isOpen={!!statsProject}
          onClose={() => setStatsProject(null)}
          projectId={statsProject?.id || 0}
          projectName={statsProject?.name || ""}
          project={statsProject}
          onRefreshStats={async () => {
            if (statsProject) {
              console.log("[page] Refreshing statistics for project:", statsProject.id);
              const updatedStats = await getProjectStatistics(statsProject.id);
              console.log("[page] Updated statistics received:", updatedStats);
              setStatsProject({
                ...statsProject,
                statistics: updatedStats
              });
            }
          }}
        />
      </main>
    </div>
  );
}
