// browser.runtime.onMessage.addListener(async (message, sender) => {
//   if (message.action === 'capture') {
//     const { rect, tabId } = message;

//     // Get windowId for the tab
//     const tab = await browser.tabs.get(tabId);

//     const screenshotDataUrl = await browser.tabs.captureVisibleTab(tab.windowId, { format: 'png' });

//     const img = new Image();
//     img.src = screenshotDataUrl;

//     await new Promise((resolve) => {
//       img.onload = resolve;
//     });

//     const canvas = new OffscreenCanvas(rect.width, rect.height);
//     const ctx = canvas.getContext('2d');

//     ctx.drawImage(
//       img,
//       rect.left, rect.top, rect.width, rect.height,
//       0, 0, rect.width, rect.height
//     );

//     const blob = await canvas.convertToBlob();
//     const reader = new FileReader();

//     return new Promise((resolve) => {
//       reader.onloadend = () => resolve(reader.result);
//       reader.readAsDataURL(blob);
//     });
//   }
// });



// background.js
browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === 'elementRect') {
    const { x, y, width, height } = message.rect;
    const dpr = message.devicePixelRatio || 1;

    // Capture visible tab as base64 image
    const screenshotDataUrl = await browser.tabs.captureVisibleTab(sender.tab.windowId, {format: "png"});

    // Create an image element to crop
    const img = new Image();
    img.src = screenshotDataUrl;

    img.onload = () => {
      // Create a canvas to crop the element
      const canvas = new OffscreenCanvas(width * dpr, height * dpr);
      const ctx = canvas.getContext('2d');

      // Draw the cropped part (accounting for device pixel ratio)
      ctx.drawImage(
        img,
        x * dpr, y * dpr, width * dpr, height * dpr,  // source rect on the screenshot
        0, 0, width * dpr, height * dpr               // destination on canvas
      );

      canvas.convertToBlob({ type: 'image/png' }).then(blob => {
        // Do something with the blob, e.g., save, open in new tab, etc.
        // For example, create an object URL:
        const url = URL.createObjectURL(blob);
        browser.tabs.create({ url });  // opens the cropped image in a new tab
      });
    };
  }
});
