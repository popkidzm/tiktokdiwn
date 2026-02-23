window.fetchVideo = async () => {
    const urlInput = document.getElementById('tiktokUrl').value;
    const fetchBtn = document.getElementById('fetchBtn');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('resultCard');

    if (!urlInput) return;

    fetchBtn.disabled = true;
    loader.classList.remove('hidden');
    resultCard.classList.add('hidden');

    try {
        const apiUrl = `https://api.giftedtech.co.ke/api/download/tiktok?apikey=gifted&url=${encodeURIComponent(urlInput)}`;
        const { data } = await axios.get(apiUrl);

        if (data.success && data.result) {
            const res = data.result;
            document.getElementById('videoThumb').src = res.cover;
            document.getElementById('videoTitle').innerText = res.title || "TikTok Video";
            document.getElementById('authorName').innerText = "@" + (res.author?.name || "tiktok_user");

            const mp4Btn = document.getElementById('downloadMP4');
            const dlText = document.getElementById('dlText');

            // IMMEDIATE DOWNLOAD LOGIC
            mp4Btn.onclick = async () => {
                dlText.innerText = "Downloading...";
                mp4Btn.disabled = true;
                
                try {
                    await startImmediateDownload(res.video, `TikTok_${res.id}.mp4`);
                    dlText.innerText = "Saved!";
                } catch (e) {
                    // Fallback if CORS blocks direct blob download
                    window.location.href = res.video;
                } finally {
                    setTimeout(() => {
                        dlText.innerText = "Download Video";
                        mp4Btn.disabled = false;
                    }, 2000);
                }
            };

            resultCard.classList.remove('hidden');
        }
    } catch (error) {
        alert("Link error. Please try again.");
    } finally {
        fetchBtn.disabled = false;
        loader.classList.add('hidden');
    }
};

/**
 * Fetches the video as a BLOB and triggers an immediate system download.
 * This prevents opening a new tab.
 */
async function startImmediateDownload(videoUrl, filename) {
    // 1. Fetch the data
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    
    // 2. Create a temporary local URL for the data
    const url = window.URL.createObjectURL(blob);
    
    // 3. Create a hidden link and click it
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // 4. Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
