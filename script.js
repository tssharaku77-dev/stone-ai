// 新しく作った「無料専用アカウント」のキーをここに貼るだけ！
const KEY = 'AIzaSyB9CTvRXoRARF-DC7Dy5RBi616H5zJfGgc'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return;

    resArea.innerHTML = '鑑定中...';

    // 2026年最新のGemini 3 Flash 接続URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: type === 'diag' ? input + "に合う石を1つ選び、150文字以内でアドバイスして。最後に守護力を星5つで評価して。" : input + "の石言葉、産地、浄化方法を教えて。" }] }]
            })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        // 鑑定結果をカッコよく表示
        resArea.innerHTML = `<div style="background:rgba(255,255,255,0.1); padding:20px; border-radius:15px; border:1px solid #4af;">${text.replace(/\n/g, '<br>')}</div>`;

    } catch (e) {
        resArea.innerHTML = "エラー：キーを確認してください。";
    }
}
