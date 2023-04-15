export default function decorate(block) {
  [...block.children].forEach((row, i) => {
    const classes = ['image', 'text'];
    classes.forEach((e, j) => {
      row.children[j].classList.add(`screens-sequence-carousel-${e}`);
    });
  });
}