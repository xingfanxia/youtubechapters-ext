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
    .then(response => response.text())
    .then(markdown => {
        console.log(markdown)
        chrome.tabs.create({ url: 'markdown_renderer.html' }, function(tab) {
            // Wait for the new tab to be fully loaded to ensure the message listener is ready
            chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    chrome.tabs.onUpdated.removeListener(listener);
                    chrome.tabs.sendMessage(tab.id, { action: "renderMarkdown", markdown: markdown });
                }
            });
        });
    })
    .catch(error => console.error('Error:', error));
});