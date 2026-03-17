const KEY = 'AIzaSyB9CTvRXoRARF-DC7Dy5RBi616H5zJfGgc'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください');

    resArea.innerHTML = '✨ 接続テスト中...';

    // エラーメッセージの指示通り、まずは「動くモデル」をGoogleに白状させます
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${KEY}`;

    try {
        const listRes = await fetch(listUrl);
        const listData = await listRes.json();

        // 使えるモデルの中から、一番軽い「flash」系統を自動選択
        const model = listData.models.find(m => m.name.includes('flash')) || listData.models[0];
        
        if (!model) throw new Error("利用可能なモデルが1つもありません");

        resArea.innerHTML = `✨ ${model.name} を起動中...`;

        // 判明したモデル名で、バージョンv1を使ってリクエスト
        const runUrl = `https://generativelanguage.googleapis.com/v1/${model.name}:generateContent?key=${KEY}`;
        
        const response = await fetch(runUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: input + "について、石言葉とアドバイスを100文字で教えて" }] }]
            })
        });

        const data = await response.json();
        const resultText = data.candidates[0].content.parts[0].text;
        
        resArea.innerHTML = `
            <div style="font-size:11px; color:gray;">接続成功: ${model.name}</div>
            <div style="margin-top:10px;">${resultText.replace(/\n/g, '<br>')}</div>
        `;

    } catch (e) {
        resArea.innerHTML = `<div style="color:red;">【最終エラー】${e.message}<br>※このエラーが出る場合は、キー自体がGoogle側でまだ有効化（Active）されていません。</div>`;
    }
}
