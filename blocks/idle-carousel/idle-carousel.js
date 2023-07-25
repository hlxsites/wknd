function createVideoElement(url, type) {
  const media = document.createElement('video');
  media.classList.add('sequence-element-video');
  const source = document.createElement('source');
  source.src = url;
  source.type = type;
  media.append(source);
  return media;
}

export default async function decorate(block) {
  const carouselElements = [...block.children];
  const sequence = document.createElement('div');
  sequence.classList.add('sequence');
  carouselElements.forEach((carouselElement) => {
    const type = carouselElement.children[0].textContent;
    const sequenceElement = document.createElement('div');
    sequenceElement.classList.add('sequence-element', 'fadeIn');
    sequenceElement.setAttribute('duration', carouselElement.children[2].textContent);
    let media;
    if (type === 'img') {
      media = carouselElement.querySelector('img');
      media.classList.add('sequence-element-video');
    } else {
      const url = carouselElement.children[1].textContent;
      media = createVideoElement(url, type);
    }
    sequenceElement.append(media);
    sequence.append(sequenceElement);
  });
  block.textContent = '';
  block.append(sequence);
  // add tooltip
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  // var svg = document.createElement('svg'); //Get svg element
  // svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
  // svg.setAttribute('fill', "#EEE");
  // svg.setAttribute('viewBox', "0 0 24 24");
  // var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
  // newElement.setAttribute("d",tooltipSvg); //Set path's data
  // svg.appendChild(newElement);
  // tooltip.append(svg);
  const handClick = new Image();
  handClick.src = 'https://main--wknd--hlxscreens.hlx.live/screens-demo/media_13828d4ce2feb1b173bec8680847539ad592ee955.png';
  tooltip.append(handClick);
  tooltip.append('Touch Me!');
  block.append(tooltip);
}
