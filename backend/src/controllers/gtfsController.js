const gtfsService = require('../services/gtfsService');

// Default GTFS URLs for various cities
// Note: Some sources may require browser download due to anti-bot measures
const GTFS_SOURCES = {
  // BMTC GTFS from Vonter GitHub (most up-to-date)
  bmtc_vonter: 'https://github.com/Vonter/bmtc-gtfs/raw/refs/heads/main/gtfs/bmtc.zip',
  // Direct raw.githubusercontent link (alternative)
  bmtc_raw: 'https://raw.githubusercontent.com/Vonter/bmtc-gtfs/refs/heads/main/gtfs/bmtc.zip',
  // Sample GTFS for testing
  sample: 'https://developers.google.com/transit/gtfs/examples/sample-feed.zip',
};

// Import GTFS data from URL
const importGTFS = async (req, res) => {
  try {
    const { url, source } = req.body;
    
    // Determine the URL to use
    let gtfsUrl = url;
    if (!gtfsUrl && source && GTFS_SOURCES[source]) {
      gtfsUrl = GTFS_SOURCES[source];
    }
    
    if (!gtfsUrl) {
      return res.status(400).json({ 
        error: 'GTFS URL is required. Provide either "url" or "source" (e.g., "bmtc")',
        available_sources: Object.keys(GTFS_SOURCES)
      });
    }
    
    console.log(`Starting GTFS import from: ${gtfsUrl}`);
    
    // Start import (this could take a while)
    const result = await gtfsService.importGTFS(gtfsUrl);
    
    res.json(result);
  } catch (error) {
    console.error('GTFS import error:', error);
    res.status(500).json({ 
      error: 'Failed to import GTFS data',
      message: error.message 
    });
  }
};

// Get current data status
const getStatus = async (req, res) => {
  try {
    const stats = await gtfsService.getStatus();
    
    res.json({
      status: 'ok',
      data: stats,
      available_sources: GTFS_SOURCES
    });
  } catch (error) {
    console.error('Error getting status:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
};

// Clear all data
const clearData = async (req, res) => {
  try {
    const result = await gtfsService.clearData();
    res.json(result);
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ error: 'Failed to clear data' });
  }
};

// Get available GTFS sources
const getSources = async (req, res) => {
  res.json({
    sources: Object.entries(GTFS_SOURCES).map(([key, url]) => ({
      id: key,
      name: formatSourceName(key),
      url,
      description: getSourceDescription(key)
    }))
  });
};

// Format source name for display
function formatSourceName(key) {
  const names = {
    bmtc_vonter: 'BMTC Bangalore (Recommended)',
    bmtc_raw: 'BMTC Bangalore (Direct Link)',
    sample: 'Google Sample GTFS',
  };
  return names[key] || key.toUpperCase();
}

// Get description for source
function getSourceDescription(key) {
  const descriptions = {
    bmtc_vonter: 'Latest BMTC data from Vonter/bmtc-gtfs GitHub repo - Recommended',
    bmtc_raw: 'Direct raw.githubusercontent link - Use if main link fails',
    sample: 'Google sample GTFS for testing (small dataset)',
  };
  return descriptions[key] || '';
}

module.exports = {
  importGTFS,
  getStatus,
  clearData,
  getSources
};