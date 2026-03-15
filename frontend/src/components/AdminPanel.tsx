import { useState, useEffect } from 'react';
import { gtfsApi, GTFSStatus, GTFSSource, GTFSImportResult } from '../services/api';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [status, setStatus] = useState<GTFSStatus | null>(null);
  const [sources, setSources] = useState<GTFSSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('bmtc_vonter');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [useCustomUrl, setUseCustomUrl] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<GTFSImportResult | null>(null);
  const [clearResult, setClearResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearConfirmChecked, setClearConfirmChecked] = useState(false);

  // Load status and sources on mount
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statusData, sourcesData] = await Promise.all([
        gtfsApi.getStatus(),
        gtfsApi.getSources(),
      ]);
      setStatus(statusData);
      setSources(sourcesData.sources);
    } catch (err) {
      setError('Failed to load data status');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);
    setImportResult(null);
    setClearResult(null); // Clear old clear result when importing

    try {
      const urlOrSource = useCustomUrl ? customUrl : selectedSource;
      const result = await gtfsApi.import(urlOrSource, !useCustomUrl);
      setImportResult(result);
      // Refresh status after import
      const newStatus = await gtfsApi.getStatus();
      setStatus(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearData = async () => {
    setIsClearing(true);
    setError(null);
    setClearResult(null);
    setImportResult(null);

    try {
      const result = await gtfsApi.clearData();
      setClearResult(result);
      // Refresh status after clearing
      const newStatus = await gtfsApi.getStatus();
      setStatus(newStatus);
      // Reset confirm state
      setShowClearConfirm(false);
      setClearConfirmChecked(false);
    } catch (err) {
      console.error('Clear data error:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear data');
    } finally {
      setIsClearing(false);
    }
  };

  const handleCancelClear = () => {
    setShowClearConfirm(false);
    setClearConfirmChecked(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-xl border border-gray-800 shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <div>
              <h2 className="font-semibold text-white">Admin Panel</h2>
              <p className="text-xs text-gray-500">Manage GTFS Data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Current Data Status */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
              Current Data Status
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <svg className="animate-spin h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : status ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700/50">
                  <p className="text-2xl font-bold text-cyan-400">{status.data.stops.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Stops</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700/50">
                  <p className="text-2xl font-bold text-purple-400">{status.data.routes.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Routes</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center border border-gray-700/50">
                  <p className="text-2xl font-bold text-green-400">{status.data.route_stops.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Route Stops</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* GTFS Import */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">
              Import GTFS Data
            </h3>
            
            {/* Source Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="predefined"
                  checked={!useCustomUrl}
                  onChange={() => setUseCustomUrl(false)}
                  className="text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="predefined" className="text-sm text-gray-300">
                  Use predefined source
                </label>
              </div>
              
              {!useCustomUrl && (
                <div className="space-y-2">
                  {sources.map((source) => (
                    <label
                      key={source.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedSource === source.id
                          ? 'bg-cyan-500/10 border-cyan-500/50'
                          : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gtfsSource"
                        value={source.id}
                        checked={selectedSource === source.id}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        className="mt-1 text-cyan-500 focus:ring-cyan-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${selectedSource === source.id ? 'text-cyan-400' : 'text-white'}`}>
                          {source.name}
                        </p>
                        {(source as any).description && (
                          <p className="text-xs text-gray-500 mt-0.5">{(source as any).description}</p>
                        )}
                        <p className="text-xs text-gray-600 truncate mt-1">{source.url}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="custom"
                  checked={useCustomUrl}
                  onChange={() => setUseCustomUrl(true)}
                  className="text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="custom" className="text-sm text-gray-300">
                  Use custom URL
                </label>
              </div>
              
              {useCustomUrl && (
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://transitfeeds.com/p/..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
                />
              )}
            </div>

            {/* Import Button */}
            <button
              onClick={handleImport}
              disabled={isImporting || (useCustomUrl && !customUrl)}
              className={`w-full mt-4 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                isImporting || (useCustomUrl && !customUrl)
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
              }`}
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Importing... (this may take a minute)
                </>
              ) : (
                <>
                  <span>📥</span>
                  Import GTFS Data
                </>
              )}
            </button>
          </div>

          {/* Import Result */}
          {importResult && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <span>✅</span>
                <span className="font-medium">Import Successful!</span>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <p>Stops imported: <span className="text-cyan-400">{importResult.stats.stops.toLocaleString()}</span></p>
                <p>Routes imported: <span className="text-purple-400">{importResult.stats.routes.toLocaleString()}</span></p>
                <p>Route stops imported: <span className="text-green-400">{importResult.stats.route_stops.toLocaleString()}</span></p>
                <p className="text-xs text-gray-600 mt-2">
                  Imported at: {new Date(importResult.imported_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <span>❌</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Clear Result */}
          {clearResult && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <span>✅</span>
                <span className="font-medium">Data Cleared Successfully!</span>
              </div>
              <div className="text-sm text-gray-400">
                <p>All stops, routes, and route stops have been removed from the database.</p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700/50">
                    <p className="text-xl font-bold text-cyan-400">{status?.data.stops || 0}</p>
                    <p className="text-xs text-gray-500">Stops</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700/50">
                    <p className="text-xl font-bold text-purple-400">{status?.data.routes || 0}</p>
                    <p className="text-xs text-gray-500">Routes</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700/50">
                    <p className="text-xl font-bold text-green-400">{status?.data.route_stops || 0}</p>
                    <p className="text-xs text-gray-500">Route Stops</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="border-t border-gray-800 pt-4">
            <h3 className="text-sm font-medium text-red-400 mb-3 uppercase tracking-wide">
              Danger Zone
            </h3>
            
            {!showClearConfirm ? (
              <>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                >
                  🗑️ Clear All Data
                </button>
                <p className="text-xs text-gray-600 mt-2">
                  This will remove all stops, routes, and route stops from the database.
                </p>
              </>
            ) : (
              <div className="bg-red-500/5 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="font-medium text-red-400 mb-1">Are you sure?</h4>
                    <p className="text-sm text-gray-400">
                      This action will permanently delete all {status?.data.stops.toLocaleString() || 0} stops, {status?.data.routes.toLocaleString() || 0} routes, and {status?.data.route_stops.toLocaleString() || 0} route stops from the database.
                    </p>
                    <p className="text-sm text-red-400 mt-2 font-medium">
                      This cannot be undone!
                    </p>
                  </div>
                </div>
                
                {/* Confirmation checkbox */}
                <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors mb-4">
                  <input
                    type="checkbox"
                    checked={clearConfirmChecked}
                    onChange={(e) => setClearConfirmChecked(e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-300">
                    I understand this will delete all data and cannot be undone
                  </span>
                </label>
                
                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelClear}
                    disabled={isClearing}
                    className="flex-1 px-4 py-2 rounded-lg text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearData}
                    disabled={isClearing || !clearConfirmChecked}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${
                      isClearing || !clearConfirmChecked
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                        : 'bg-red-600 text-white hover:bg-red-500 border border-red-500'
                    }`}
                  >
                    {isClearing ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      <>
                        🗑️ Delete All Data
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}