//is-text_line
function getLines(element) {
  const range = document.createRange();
  const lines = [];
  let lineStart = 0;
  let lastOffsetTop = null;
  const text = element.textContent.trim();

  // 全ての文字を走査
  for (let i = 0; i < text.length; i++) {
      range.setStart(element.firstChild, i);   // i番目の文字にRangeの開始位置を設定
      range.setEnd(element.firstChild, i + 1); // i+1番目の文字にRangeの終了位置を設定

      const rect = range.getBoundingClientRect(); // 現在の文字の位置情報を取得

      // 初めてのループで行の開始位置を記録
      if (lastOffsetTop === null) {
          lastOffsetTop = rect.top;
      }

      // 行が変わったら、前の行のテキストを保存
      if (rect.top !== lastOffsetTop) {
          lines.push(text.substring(lineStart, i)); // 前の行を保存
          lineStart = i; // 新しい行の開始位置を更新
          lastOffsetTop = rect.top; // 現在の行の位置を記録
      }
  }
  // 最後の行を保存
  lines.push(text.substring(lineStart));
  return lines;
}
function splitIntoLinesForCTextWLine() {
  // 全ての.c-text_w_line要素を取得
  const textElements = document.querySelectorAll('.is-text_line');

  // 各要素に対して処理を実行
  textElements.forEach((element) => {
      const lines = getLines(element); // 行ごとのテキストを取得

              // アクセシビリティ用のテキストがすでに存在するか確認
              const hasAccessibilityText = element.nextSibling && element.nextSibling.classList && element.nextSibling.classList.contains('u-accessibility');

              if (!hasAccessibilityText) {
                  // アクセシビリティ用のテキストを作成し、要素の兄弟要素として追加
                  const accessibilityText = document.createElement('span');
                  accessibilityText.classList.add('u-accessibility');
                  accessibilityText.textContent = element.textContent.trim();
                  element.insertAdjacentElement('afterend', accessibilityText);
              }
              element.innerHTML = ""; // 元のテキストをクリア

      // 各行をspanタグで包んで挿入
      lines.forEach(line => {
          const span = document.createElement('span');
          span.textContent = line;
          span.classList.add('line'); // 任意のクラスを追加
          span.classList.add('is-text_split'); // 任意のクラスを追加
          element.appendChild(span);
          element.appendChild(document.createElement('br')); // 行の間に改行を追加
      });
  });
}
splitIntoLinesForCTextWLine();

//is-text_split
const textElements = document.querySelectorAll(".is-text_split");
const delayTime = 100;

textElements.forEach(textOneByOne => {
    let getText = textOneByOne.textContent.trim();
    textOneByOne.textContent = "";
    const newText = getText.split("").map((elem, index) => {
        return `<span aria-hidden='true' class='is-text-each' style="transition-delay: ${delayTime * index + 600 }ms">${elem}</span>`;
    }).join("");
    textOneByOne.insertAdjacentHTML("beforeend", newText);

    // ひとつ親の要素の兄弟要素にu-accessibilityがあるか確認
    const parentSibling = textOneByOne.parentNode.nextSibling;
    const isAccessibilityExists = parentSibling && parentSibling.classList && parentSibling.classList.contains('u-accessibility');

    // u-accessibilityが存在しない場合のみ、アクセシビリティテキストを追加
    if (!isAccessibilityExists) {
        const accessibilityText = document.createElement("span");
        accessibilityText.classList.add("u-accessibility");
        accessibilityText.textContent = getText;
        textOneByOne.parentNode.insertBefore(accessibilityText, textOneByOne.nextSibling);
    }
    // const accessibilityText = document.createElement("span");
    // accessibilityText.classList.add("u-accessibility");
    // accessibilityText.textContent = getText;
    // textOneByOne.parentNode.insertBefore(accessibilityText, textOneByOne.nextSibling);
});

//is-target
  const targets = document.querySelectorAll('.is-target');
  const options = {
      root: null,
      rootMargin: '-30% 0px',
      threshold: 0
  };
  const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('is-active');
          }
      });
  };
  const observer = new IntersectionObserver(observerCallback, options);
  targets.forEach(target => {
      observer.observe(target);
  });
