import { getQueriesForElement, prettyDOM } from '@testing-library/dom';

if (typeof afterEach === 'function' && !process.env.RTL_SKIP_AUTO_CLEANUP) {
  afterEach(() => {
    cleanup();
  });
}

const mountedViews = new Set();

function render(
  View,
  { container, baseElement = container, autoRender = true, ...options } = {},
) {
  // Match react-testing-library's baseElement/container approach exactly:
  if (!baseElement) {
    baseElement = document.body;
  }
  if (!container) {
    container = baseElement.appendChild(document.createElement('div'));
  }
  // if no el is supplied BB will create one in _ensureElement
  const view = new View(options);
  container.appendChild(view.el);

  if (autoRender) {
    // sometimes you might not want to render immediately, eg. wrap render in act
    view.render();
  }

  mountedViews.add({
    view,
    container,
  });

  return {
    view,
    container,
    baseElement,
    debug: (debugEl = baseElement, maxLength, options) =>
      console.log(prettyDOM(debugEl, maxLength, options)),
    unmount: () => cleanupView(view),
    ...getQueriesForElement(baseElement),
  };
}

function cleanup() {
  mountedViews.forEach(cleanupView);
}

function cleanupView(viewData) {
  const { view, container } = viewData;
  view.remove();

  if (container.parentNode === document.body) {
    document.body.removeChild(container);
  }

  mountedViews.delete(viewData);
}

export * from '@testing-library/dom';
export { render, cleanup };
