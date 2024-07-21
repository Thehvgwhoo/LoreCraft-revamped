document.addEventListener('DOMContentLoaded', () => {
    const checkServerButton = document.getElementById('check-server');
    const statusDisplay = document.getElementById('status');
    const playersOnlineDisplay = document.getElementById('players-online');
    const tpsDisplay = document.getElementById('tps');
    const tpsBar = document.getElementById('tps-bar');
    const versionDisplay = document.getElementById('version');
    const motdDisplay = document.getElementById('motd');
    const loadingScreen = document.getElementById('loading-screen');
    const serverChecker = document.getElementById('server-checker');

    const serverIp = '94.130.66.225'; // Replace with your specific server IP

    checkServerButton.addEventListener('click', () => {
        showLoadingScreen();
        fetchServerData(serverIp);
    });

    async function fetchServerData(serverIp) {
        try {
            const response = await fetch(`https://api.mcsrvstat.us/2/${serverIp}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayServerData(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            displayError();
        } finally {
            hideLoadingScreen();
        }
    }

    function displayServerData(data) {
        if (data.online) {
            statusDisplay.textContent = 'Online';
            playersOnlineDisplay.textContent = `${data.players.online} / ${data.players.max}`;
            tpsDisplay.textContent = data.tps ? data.tps : 'N/A';
            updateTpsBar(data.tps);
            versionDisplay.textContent = data.version;
            motdDisplay.innerHTML = data.motd.clean.join('<br>');
        } else {
            displayError();
        }
    }

    function updateTpsBar(tps) {
        const maxTps = 20;
        const tpsPercentage = (tps / maxTps) * 100;
        tpsBar.style.width = `${tpsPercentage}%`;
        if (tpsPercentage > 75) {
            tpsBar.style.background = 'green';
        } else if (tpsPercentage > 50) {
            tpsBar.style.background = 'yellow';
        } else {
            tpsBar.style.background = 'red';
        }
    }

    function displayError() {
        statusDisplay.textContent = 'Offline';
        playersOnlineDisplay.textContent = 'N/A';
        tpsDisplay.textContent = 'N/A';
        updateTpsBar(0);
        versionDisplay.textContent = 'N/A';
        motdDisplay.textContent = 'N/A';
    }

    function showLoadingScreen() {
        loadingScreen.style.display = 'flex';
        serverChecker.style.display = 'none';
    }

    function hideLoadingScreen() {
        loadingScreen.style.display = 'none';
        serverChecker.style.display = 'block';
    }
});
