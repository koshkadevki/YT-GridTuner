(function () {
  console.log("✅ YouTube Grid Changer запущен");

  // Создаем выпадающий список
  const selector = document.createElement("select");
  selector.style.position = "fixed";
  selector.style.top = "10px";
  selector.style.right = "10px";
  selector.style.zIndex = "999999";
  selector.style.padding = "8px 12px";
  selector.style.fontSize = "14px";
  selector.style.borderRadius = "6px";
  selector.style.border = "1px solid #ccc";
  selector.style.backgroundColor = "#fff";
  selector.style.color = "#000";

  for (let i = 1; i <= 8; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = `${i} видео в строке`;
    selector.appendChild(option);
  }

  // Стиль для сетки
  const style = document.createElement("style");
  style.id = "yt-grid-style";
  document.head.appendChild(style);

  function updateGrid(columns) {
    const newStyle = `
      ytd-section-list-renderer [items-layout] > *,
      ytd-browse ytd-two-column-browse-results-renderer [items-layout] > * {
        display: grid !important;
        grid-template-columns: repeat(${columns}, minmax(0, 1fr)) !important;
        gap: 16px !important;
      }

      ytd-grid-video-renderer,
      ytd-video-renderer,
      ytd-rich-item-renderer,
      ytd-shorts-lockups {
        width: calc(100% / ${columns} - 16px) !important;
        margin: 8px !important;
        float: none !important;
        box-sizing: border-box !important;
      }

      ytd-shorts-lockups,
      ytd-shorts-lockups yt-formatted-string,
      ytd-shorts-lockups .style-scope {
        width: 100% !important;
        aspect-ratio: auto !important;
      }

      .title-and-badge.style-scope.ytd-grid-video-renderer,
      .title-and-badge.style-scope.ytd-video-renderer,
      .style-scope.ytd-shorts-lockups #title {
        white-space: normal !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
      }
    `;
    style.textContent = newStyle;
  }

  // Загружаем сохранённое значение из storage
  chrome.storage.local.get(["gridColumns"], (result) => {
    const savedValue = result.gridColumns || 5;

    if (selector) {
      selector.value = savedValue;
    }

    updateGrid(savedValue);
  });

  // При изменении значения — сохраняем и обновляем
  if (selector && selector.addEventListener) {
    selector.addEventListener("change", function () {
      const selectedValue = parseInt(this.value);
      chrome.storage.local.set({ gridColumns: selectedValue }, () => {
        updateGrid(selectedValue);
      });
    });
  }

  // Добавляем селектор на страницу
  if (document.body) {
    document.body.appendChild(selector);
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      document.body.appendChild(selector);
    });
  }

  // Наблюдатель за изменениями DOM
  const observer = new MutationObserver(() => {
    if (!document.body.contains(selector)) {
      document.body.appendChild(selector);
    }
    updateGrid(selector.value);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();