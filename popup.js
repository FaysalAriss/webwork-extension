document.getElementById('capture').addEventListener('click', async () => {

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

  // Ask content script for bounding rect
  const response = await browser.tabs.sendMessage(tab.id, { action: 'getDivRect' });

  if (!response || !response.rect) {
    alert("Div #problem_body not found!");
    return;
  }

  const divRect = response.rect;

  // Ask background to capture and crop
  const imageDataUrl = await browser.runtime.sendMessage({ action: 'capture', rect: divRect, tabId: tab.id });

  if (imageDataUrl) {
    const img = document.createElement('img');
    img.src = imageDataUrl;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    resultDiv.appendChild(img);
  }
});
