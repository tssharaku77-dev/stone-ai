const KEY = 'AIzaSyB9CTvRXoRARF-DC7Dy5RBi616H5zJfGgc'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください');

    resArea.innerHTML = '✨ 稼働可能なAIモデルを自動探索中...';

    // 試行するモデルの全リスト
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-1.0-pro'
    ];

    const promptText = type === 'diag' ? `${input}に合う石を1つ選んでアドバイスして` : `${input}の石言葉を教えて`;

    // 全てのモデルに対して同時に接続を試みる（一番早いものを採用）
    const requests = models.map(async (model) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        });
        const data = await response.json();
        if (data.error) throw new Error(`${model}: ${data.error.message}`);
        return { model, text: data.candidates[0].content.parts[0].text };
    });

    try {
        // 最初に成功したモデルの結果を採用
        const result = await Promise.any(requests);
        resArea.innerHTML = `
            <div style="font-size:0.8em; color:#888; margin-bottom:5px;">使用モデル: ${result.model}</div>
            <div style="background:rgba(255,255,255,0.1); padding:15px; border-radius:10px;">
                ${result.text.replace(/\n/g, '<br>')}
            </div>
        `;
    } catch (aggregateError) {
        // 全てのモデルが全滅した場合
        console.error(aggregateError);
        resArea.innerHTML = `
            <div style="color:#ff6b6b; padding:10px; border:1px solid red;">
                【全モデル接続失敗】<br>
                原因：${aggregateError.errors[0]}<br><br>
                ※キーがActiveか、AI Studioで規約同意済みか確認してください。
            </div>
        `;
    }
}
