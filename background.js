chrome.action.onClicked.addListener((tab) => {
    const url = new URL(tab.url);
    const videoId = url.searchParams.get("v");
    const apiUrl = 'https://summ.xiax.xyz/youtube_markdown';
    const data = {
        use_cache: false,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        use_sse: false
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test',
            'accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        const markdown = data.markdown; // Assuming the API response contains the markdown in a property named markdown
        const blob = new Blob([markdown], {type: 'text/markdown'});
        const markdownUrl = URL.createObjectURL(blob);

        chrome.tabs.create({ url: markdownUrl });
    })
    .catch(error => console.error('Error:', error));
});