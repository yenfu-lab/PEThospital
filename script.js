const scriptUrl = 'https://script.google.com/macros/s/AKfycbxydsjQXQm5LJFMlBmX9jF208J9QEiY9YkqdMDdgkBO64t7sZWGjgOZ7yuJ8VTGZxBp/exec';

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(div => div.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

function createTable(tableId, data) {
  const table = document.getElementById(tableId);
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const preview = document.getElementById('preview-container');

  thead.innerHTML = '';
  tbody.innerHTML = '';
  if (preview) preview.innerHTML = '';

  if (data.length === 0) return;

  const allHeaders = Object.keys(data[0]);
  const isResourceTable = (tableId === 'resource-table');

  const headers = allHeaders.filter(h => !h.includes('(X)'));
  const trHead = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h.replace(/\(X\)/g, '').trim(); // 去除 (X) 字樣後顯示
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  // 顯示表頭
  //const headerRow = headers.concat(isResourceTable ? ['操作'] : []);
  //thead.innerHTML = '<tr>' + headerRow.map(h => `<th>${h}</th>`).join('') + '</tr>';

  // 顯示每筆資料
  data.forEach(row => {
  const tr = document.createElement('tr');
  headers.forEach(h => {
    const td = document.createElement('td');
    const val = row[h];

    if (typeof val === 'string' && val.startsWith('http')) {
      // 網址連結欄位，自動加超連結
      //td.innerHTML = `<a href="${val}" target="_blank">前往</a>`;
      const btn = document.createElement('button');
      btn.textContent = '查看';
      btn.onclick = () => {
        const encodedFilename = encodeURIComponent(val);
        window.open(val, '_blank');
        const preview = document.getElementById('preview-container');
        preview.innerHTML = `<a href="${val}" target="_blank">前往</a>`;
      };
      td.appendChild(btn);
    } else if (h === '資源連結') {
      // 如果是學習資源的PDF/圖片檔案，顯示查看按鈕
      const btn = document.createElement('button');
      btn.textContent = '查看';
      btn.onclick = () => {
        const encodedFilename = encodeURIComponent(val);
        const url = `PDF/${encodedFilename}`;

        // 同時開啟新分頁
        window.open(url, '_blank');

        // 預覽嵌入
        const preview = document.getElementById('preview-container');
        preview.innerHTML = '';

        if (val.endsWith('.pdf')) {
          preview.innerHTML = `<iframe src="${url}" width="100%" height="600px"></iframe>`;
        } else if (/\.(jpg|jpeg|png|webp)$/i.test(val)) {
          preview.innerHTML = `<img src="${url}" style="max-width:100%; max-height:600px;">`;
        } else {
          preview.innerHTML = `<p>不支援的格式：<a href="${url}" target="_blank">點此開啟</a></p>`;
        }
      };
      td.appendChild(btn);
    } else {
      // 一般文字欄位
      td.textContent = val || '';
    }

    tr.appendChild(td);
  });

  tbody.appendChild(tr);
});
}


function loadData(type, tableId) {
  fetch(`${scriptUrl}?type=${type}`)
    .then(res => res.json())
    .then(data => createTable(tableId, data))
    .catch(err => console.error(err));
}

// Load both on page load
loadData('hospital', 'hospital-table');
loadData('learning', 'resource-table');


