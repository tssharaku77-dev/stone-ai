async function execute(type) {
    const inputElement = document.getElementById('stoneInput');
    const resultArea = document.getElementById('resultArea');
    const input = inputElement.value.trim();
    if (!input) return alert('内容を入力してください。');

    resultArea.innerHTML = '<div class="loading">鑑定中...</div>';

    try {
        // 直接Googleを叩かず、自分のサーバー（Vercel）のAPIを叩くようにします
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: input, type: type })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        // 鑑定書風のレイアウトで表示
        resultArea.innerHTML = `
            <div class="result-card">
                <h3>✨ 鑑定結果 ✨</h3>
                <p>${data.text.replace(/\n/g, '<br>')}</p>
                <div class="share-btn" onclick="location.href='https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}'">SNSで結果をシェアする</div>
            </div>
        `;
    } catch (e) {
        resultArea.innerHTML = `<p class="error">共鳴エラー: ${e.message}</p>`;
    }
}
