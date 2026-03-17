const KEY = 'AIzaSyB9CTvRXoRARF-DC7Dy5RBi616H5zJfGgc'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください');

    resArea.innerHTML = '✨ あなたのキーで動くAIを探しています...';

    try {
        // 1. まず、あなたのキーで「今使えるモデルの一覧」をGoogleに直接聞く
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`;
        const listRes = await fetch(listUrl);
        const listData = await listRes.json();

        if (!listData.models) {
            throw new Error("使えるモデルが見つかりません。キーの設定を確認してください。");
        }

        // 2. 「generateContent」に対応しているモデルを1つ見つける
        const targetModel = listData.models.find(m => m.supportedGenerationMethods.includes('generateContent'));

        if (!targetModel) {
            throw new Error("実行可能なモデルがありません。");
        }

        const modelName = targetModel.name; // 例: models/gemini-pro
        resArea.innerHTML = `✨ ${modelName} に接続中...`;

        // 3. 見つかったモデルで実行する
        const runUrl = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${KEY}`;
        const runRes = await fetch(runUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: input + "について、石の鑑定をして。" }] }] })
        });

        const runData = await runRes.json();
        const text = runData.candidates[0].content.parts[0].text;
        
        resArea.innerHTML = `
            <div style="font-size:0.8em; color:#888;">成功モデル: ${modelName}</div>
            <div style="margin-top:10px;">${text.replace(/\n/g, '<br>')}</div>
        `;

    } catch (e) {
        resArea.innerHTML = `<div style="color:#ff6b6b;">致命的エラー: ${e.message}</div>`;
    }
}
