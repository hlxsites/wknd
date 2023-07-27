// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// eslint-disable-next-line import/no-cycle
import { onNavigate } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

function playVideo(divWrappingVideo) {
  divWrappingVideo.firstElementChild.muted = true;
  setTimeout(() => {
    divWrappingVideo.firstElementChild.play();
  }, 300);
}

function stopVideo(divWrappingVideo) {
  divWrappingVideo.firstElementChild.pause();
  divWrappingVideo.firstElementChild.load();
}

function deactivateCurrentElement(divWrapping) {
  if (divWrapping.classList.contains('active')) {
    divWrapping.classList.remove('active');
  }
  if (divWrapping.querySelectorAll('img').length === 0) {
    stopVideo(divWrapping);
  }
}

function activateNextElement(divWrapping) {
  if (!divWrapping.classList.contains('active')) divWrapping.classList.add('active');
  if (divWrapping.querySelectorAll('img').length === 0) {
    playVideo(divWrapping);
  }
}

let carouselTimeout;
let currentPlaying = 0;
let idleTimer;

function handleTransition(sequence) {
  deactivateCurrentElement(sequence.children[currentPlaying], currentPlaying);
  currentPlaying += 1;
  if (currentPlaying === sequence.childElementCount) {
    currentPlaying = 0;
  }
  activateNextElement(sequence.children[currentPlaying]);
  const switchTimeout = sequence.children[currentPlaying].getAttribute('duration') || 8000;
  console.log(switchTimeout);
  carouselTimeout = setTimeout(handleTransition, switchTimeout, sequence);
}

function startCarousel(sequence) {
  sequence.classList.add('idle');
  currentPlaying = 0;
  activateNextElement(sequence.children[currentPlaying]);
  const switchTimeout = sequence.children[currentPlaying].getAttribute('duration') || 8000;
  console.log(switchTimeout);
  carouselTimeout = setTimeout(handleTransition, switchTimeout, sequence);
}

function idleHandler() {
  const carousels = document.querySelectorAll('.sequence');
  carousels.forEach((sequence) => {
    if (!sequence.classList.contains('idle')) {
      onNavigate('idle-carousel-container');
      startCarousel(sequence);
    }
  });
}

function stopCarousel(sequence) {
  sequence.classList.remove('idle');
  // eslint-disable-next-line no-restricted-syntax
  for (const item of sequence.children) {
    deactivateCurrentElement(item);
  }
}

function interactionEventHandler() {
  const carousels = document.querySelectorAll('.sequence');
  carousels.forEach((sequence) => {
    if (sequence.classList.contains('idle')) {
      onNavigate('category-container');
      stopCarousel(sequence);
      clearTimeout(carouselTimeout);
    }
  });
}

const activityDetector = () => {
  idleHandler();
  const resetTimer = () => {
    interactionEventHandler();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(idleHandler, 80000);
  };
  window.onload = resetTimer;
  document.onclick = resetTimer;
  document.onkeydown = resetTimer;
};
activityDetector();
