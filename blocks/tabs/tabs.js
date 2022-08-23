/**
 * @param {HTMLElement} $block
 */
export default function decorate($block) {
  const $tabsContainer = $block.parentElement.parentElement;
  const $sections = document.querySelectorAll('[data-tab]');
  const $toggleContainer = $block.querySelector('ul');

  // move the tab's default content after the tab-block
  const tabs = [...$sections].map(($tab, idx) => {
    const tabName = $tab.dataset.tab.toLowerCase().trim();
    const $el = $tab.querySelector('.default-content-wrapper');
    if (idx > 0) {
      $el.classList.add('hidden');
    }
    $tabsContainer.append($el);
    $tab.remove();
    return {
      tabName,
      $el,
    };
  });

  const $ul = document.createElement('ul');

  Array.from($toggleContainer.children).forEach(($toggle, index) => {
    const $button = document.createElement('button');
    const tabName = $toggle.textContent.toLowerCase().trim();

    $button.textContent = $toggle.textContent;
    $toggle.replaceChildren($button);
    $ul.append($toggle);

    $button.addEventListener('click', () => {
      const $activeButton = $block.querySelector('button.active');
      const blockPosition = $block.getBoundingClientRect().top;
      const offsetPosition = blockPosition + window.scrollY - 80;

      if ($activeButton !== $toggle) {
        $activeButton.classList.remove('active');
        $button.classList.add('active');

        tabs.forEach((tab) => {
          if (tabName === tab.tabName) {
            tab.$el.classList.remove('hidden');
          } else {
            tab.$el.classList.add('hidden');
          }

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        });
      }
    });

    if (index === 0) {
      $button.classList.add('active');
    }
  });

  $block.replaceChildren($ul);
}
