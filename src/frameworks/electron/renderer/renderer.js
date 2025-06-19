const folderPathInput = document.getElementById('folderPath');
const startMonitoringBtn = document.getElementById('startMonitoringBtn');
const stopMonitoringBtn = document.getElementById('stopMonitoringBtn');
const statusText = document.getElementById('statusText');
const logList = document.getElementById('logList');

let isMonitoring = false;

function updateUI() {
  startMonitoringBtn.disabled = !folderPathInput.value || isMonitoring;
  stopMonitoringBtn.disabled = !isMonitoring;
  statusText.textContent = isMonitoring ? 'Monitoring Active' : 'Not Monitoring';
  statusText.className = isMonitoring ? 'text-green-600' : 'text-gray-600';
}

async function selectFolder() {
  try {
    const result = await window.electronAPI.selectFolder();
    if (result.success) {
      folderPathInput.value = result.folderPath;
      logList.innerHTML = '';
      addLog(`Selected folder: ${result.folderPath}`);
    } else {
      addLog(`Error: ${result.message}`, 'text-red-600');
    }
    updateUI();
  } catch (error) {
    addLog(`Error selecting folder: ${error.message}`, 'text-red-600');
  }
}

async function startMonitoring() {
  try {
    const folderPath = folderPathInput.value;
    if (!folderPath) {
      addLog('Error: Please select a folder', 'text-red-600');
      return;
    }
    const result = await window.electronAPI.startMonitoring(folderPath);
    addLog(result.message, result.success ? 'text-green-600' : 'text-red-600');
    if (result.success) {
      isMonitoring = true;
      updateUI();
    }
  } catch (error) {
    addLog(`Error starting monitoring: ${error.message}`, 'text-red-600');
  }
}

async function stopMonitoring() {
  try {
    const result = await window.electronAPI.stopMonitoring();
    addLog(result.message, result.success ? 'text-green-600' : 'text-red-600');
    if (result.success) {
      isMonitoring = false;
      updateUI();
    }
  } catch (error) {
    addLog(`Error stopping monitoring: ${error.message}`, 'text-red-600');
  }
}

function addLog(message, className = 'text-gray-700') {
  const logEntry = document.createElement('div');
  logEntry.className = className;
  logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logList.appendChild(logEntry);
  logList.scrollTop = logList.scrollHeight; // Auto-scroll to bottom
}

window.electronAPI.onLogUpdate((message) => {
  addLog(message, 'text-gray-700');
  updateUI();
});

// Initialize UI
updateUI();