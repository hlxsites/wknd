export default function decorate(block) {
    [...block.firstElementChild.children][0].childNodes[0].classList="";
}