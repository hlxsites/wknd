import { collectionName } from '../../scripts/collection-name.js';

/**
 * @param {HTMLElement} $block
 */
export default function decorate() {
  const originalContainer = document.querySelector('.landing-page-collection.block');
  // Create a new wrapper div
  const leftWrapperDiv = document.createElement('div');
  leftWrapperDiv.className = 'leftWrapper';

  // Move the last three child divs to the wrapper div
  Array.from(originalContainer.children).slice(3).forEach((child) => {
    leftWrapperDiv.appendChild(child.cloneNode(true));
  });

  // Remove the last three child divs from the original container
  Array.from(originalContainer.children).slice(3).forEach((child) => {
    originalContainer.removeChild(child);
  });

  const rightWrapperDiv = document.createElement('div');
  rightWrapperDiv.className = 'rightWrapper';
  // Move the last three child divs to the wrapper div
  Array.from(originalContainer.children).slice(0, 2).forEach((child) => {
    rightWrapperDiv.appendChild(child.cloneNode(true));
  });

  // Remove the last three child divs from the original container
  Array.from(originalContainer.children).slice(0, 2).forEach((child) => {
    originalContainer.removeChild(child);
  });
  // Append the wrapper div to the original container
  originalContainer.appendChild(leftWrapperDiv);
  originalContainer.appendChild(rightWrapperDiv);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'wrapper';
  // Move the last three child divs to the wrapper div
  Array.from(originalContainer.children).slice(-2).forEach((child) => {
    wrapperDiv.appendChild(child.cloneNode(true));
  });

  // Remove the last three child divs from the original container
  Array.from(originalContainer.children).slice(-2).forEach((child) => {
    originalContainer.removeChild(child);
  });
  originalContainer.appendChild(wrapperDiv);

  const element = document.querySelector('.leftWrapper > div:nth-child(3) div');
  //  Get the text content and split it into words
  const words = element.textContent.split(' ');
  words[2] = `<i style="font-weight: 100;">${words[2]}</i>`;
  element.innerHTML = words.join(' ');
  //  update custom name
  const customName = document.getElementById('custom-name');
  const discountCustomName = document.querySelector('.landing-page-discount > div:nth-child(2) h2');
  const discountWords = discountCustomName.textContent.split('CUSTOM NAME');
  discountWords[0] = collectionName;
  discountCustomName.innerHTML = discountWords.join(' ');
  customName.innerHTML = collectionName;
}
