// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'getDivRect') {
//     const el = document.querySelector('#problem_body');
//     if (!el) {
//       sendResponse({ rect: null });
//     } else {
//       const r = el.getBoundingClientRect();
//       el.style.border = '5px solid red';
//       console.log(r);
//       sendResponse({
//         rect: { left: r.left, top: r.top, width: r.width, height: r.height }
//       });
//     }
//     // Return true to indicate async response if needed (not needed here)
//     return true;
//   }
// });


// content-script.js
const target = document.querySelector('#problem_body');
if (target) {
  const rect = target.getBoundingClientRect();
  // Send the rect and devicePixelRatio to background or popup
  browser.runtime.sendMessage({
    action: 'elementRect',
    rect: {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    },
    devicePixelRatio: window.devicePixelRatio
  });
}
