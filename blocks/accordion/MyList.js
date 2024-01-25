/* eslint-disable object-curly-spacing */
import {
  h,
} from '../../scripts/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

// Function to convert keys into readable questions
const toQuestion = (key) => key.replace(/-/g, ' ').toUpperCase();

const MyList = ({ list, resolve }) => {
  const detailItems = Object.entries(list).map(([key, value]) => html`
    <details class="accordion-item">
      <summary class="accordion-item-label">${toQuestion(key)}</summary>
      <div class="accordion-item-body">${value}</div>
    </details>
  `);
  resolve();
  return html`${detailItems}`;
};

export default MyList;
