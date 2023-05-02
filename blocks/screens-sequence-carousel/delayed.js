function playCarousel(currentIndex) {
  let index = currentIndex;
  const sequence = document.querySelector('.screens-sequence-carousel');
  [...sequence.children].forEach((row) => {
    row.style.display = 'none';
  });

  if (index === sequence.children.length - 1) {
    index = 0;
  } else index += 1;
  sequence.children[index].style.display = 'block';
  setTimeout(() => {
    playCarousel(index);
  }, 5000);
}
playCarousel(0);
