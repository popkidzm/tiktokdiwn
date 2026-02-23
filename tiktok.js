async function downloadVideo() {
    const tiktokUrl = document.getElementById('tiktokUrl').value;
    const dlBtn = document.getElementById('dlBtn');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('resultCard');

    if (!tiktokUrl) {
        alert("Please paste a valid TikTok URL");
        return;
    }

    // UI States
    dlBtn.disabled = true;
    loader.classList.remove('hidden');
    resultCard.classList.add('hidden');

    try {
        const apiUrl = `https://jawad-tech.vercel.app/download/tiktok?url=${encodeURIComponent(tiktokUrl)}`;
        const { data } = await axios.get(apiUrl);

        // Map the API response data
        // Note: Assuming the API returns an object with video info. 
        // Adjust these keys based on your actual API response structure
        if (data.status === true || data.result) {
            const videoData = data.result || data; // Fallback depending on JSON structure
            
            document.getElementById('videoThumb').src = videoData.cover || videoData.thumbnail;
            document.getElementById('videoTitle').innerText = videoData.title || "Ready to Download";
            document.getElementById('authorName').innerText = "@" + (videoData.author?.nickname || "tiktok_user");
            
            // Set Download Link
            const videoUrl = videoData.video || videoData.url || videoData.hd_play;
            const downloadLink = document.getElementById('hdDownload');
            downloadLink.href = videoUrl;
            
            // Show Result
            resultCard.classList.remove('hidden');
        } else {
            alert("Could not fetch video. Please check the link.");
        }

    } catch (error) {
        console.error("Download Error:", error);
        alert("API Error: Make sure your TikTok link is public and the API is online.");
    } finally {
        dlBtn.disabled = false;
        loader.classList.add('hidden');
    }
}

function resetForm() {
    document.getElementById('tiktokUrl').value = "";
    document.getElementById('resultCard').classList.add('hidden');
}
