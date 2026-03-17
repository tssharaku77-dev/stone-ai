// 【重要】警告が出ていない、新しいプロジェクトのキーに書き換えてください
const KEY = 'AIzaSyCQGI4FaAFvLpTyI2Em5IGoAm3_02hNAYI'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください');

    resArea.innerHTML = '✨ 石の波動を解析中...';

    // 2026年最新の指定：モデル名の後ろに -latest を付けるのが最も確実です
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: input + "について、石の視点から鑑定して。" }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            // エラーが出た場合、詳細を表示します
            throw new Error(data.error.message);
        }

        const text = data.candidates[0].content.parts[0].text;
        resArea.innerHTML = `<div style="line-height:1.8; background:rgba(255,255,255,0.1); padding:15px; border-radius:10px;">${text.replace(/\n/g, '<br>')}</div>`;

    } catch (e) {
        // もしFlashがダメな場合のバックアップ案：gemini-proを試す
        resArea.innerHTML = `再接続中...`;
        const retryUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${KEY}`;
        try {
            const res2 = await fetch(retryUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: input + "について鑑定して" }] }] })
            });
            const data2 = await res2.json();
            resArea.innerHTML = data2.candidates[0].content.parts[0].text.replace(/\n/g, '<br>');
        } catch (e2) {
            resArea.innerHTML = `<div style="color:#ff6b6b;">エラー: ${e.message}。キーが正しくコピーされているか、AI StudioでActiveになっているか再確認してください。</div>`;
        }
    }
}
