const KEY = 'AIzaSyB9CTvRXoRARF-DC7Dy5RBi616H5zJfGgc'; // キーはこれで合っています

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください。');

    resArea.innerHTML = '✨ 石の波動とリンクしています...';

    // 【ここを修正】v1beta ではなく v1 を使い、モデル名を最新の指定に変更します
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    const promptText = type === 'diag' 
        ? `${input} という悩みに対し、力を与えてくれる天然石を1つ選び、石の視点からアドバイスして。`
        : `${input} という石について、石言葉、浄化方法を教えて。`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const result = data.candidates[0].content.parts[0].text;
        resArea.innerHTML = `<div>${result.replace(/\n/g, '<br>')}</div>`;

    } catch (e) {
        // エラー内容が詳しくわかるようにします
        resArea.innerHTML = `<div style="color:#ff6b6b;">接続エラー: ${e.message}</div>`;
    }
}
