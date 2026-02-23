window.fetchVideo = async () => {
    const urlInput = document.getElementById('tiktokUrl').value;
    const fetchBtn = document.getElementById('fetchBtn');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('resultCard');

    if (!urlInput) return alert("Please paste a TikTok link!");

    // UI Feedback
    fetchBtn.disabled = true;
    loader.classList.remove('hidden');
    resultCard.classList.add('hidden');

    try {
        // Using your GiftedTech API
        const apiUrl = `https://api.giftedtech.co.ke/api/download/tiktok?apikey=gifted&url=${encodeURIComponent(urlInput)}`;
        const { data } = await axios.get(apiUrl);

        if (data.success && data.result) {
            const res = data.result;

            // Update UI elements based on API result
            document.getElementById('videoThumb').src = res.cover;
            document.getElementById('videoTitle').innerText = res.title || "TikTok Video";
            document.getElementById('authorName').innerText = "@" + (res.author?.name || "tiktok_user");

            // Setup Download Buttons
            const mp4Btn = document.getElementById('downloadMP4');
            const mp3Btn = document.getElementById('downloadMP3');

            // Force download using blob to avoid browser 'failed' errors
            mp4Btn.onclick = () => downloadMedia(res.video, `video_${res.id}.mp4`);
            mp3Btn.onclick = () => downloadMedia(res.music, `audio_${res.id}.mp3`);

            resultCard.classList.remove('hidden');
        } else {
            alert("API Error: " + (data.message || "Could not fetch video. Check the link."));
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("Server Error. Make sure the TikTok link is public.");
    } finally {
        fetchBtn.disabled = false;
        loader.classList.add('hidden');
    }
};

/**
 * Handles the actual file download by opening in a new tab.
 * This is the most reliable method for TikTok CDN links on mobile.
 */
function downloadMedia(fileUrl, fileName) {
    if (!fileUrl) return alert("File link not found.");
    
    // Attempting direct download via hidden link
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank"; // Fallback for browsers that block auto-download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
