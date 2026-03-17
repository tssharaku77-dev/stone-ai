const KEY = 'AIzaSyCQGI4FaAFvLpTyI2Em5IGoAm3_02hNAYI'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return;

    resArea.innerHTML = '✨ 石の記憶を呼び起こしています...';

    // 2026年3月現在、インポート済みプロジェクトで最も安定するURL
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: input + "について鑑定して" }] }] })
        });
        
        const data = await response.json();
        
        if (data.error) {
            // ここでエラーが出た場合、何が原因かハッキリさせます
            throw new Error(data.error.message);
        }
        
        const text = data.candidates[0].content.parts[0].text;
        resArea.innerHTML = `<div style="padding:15px; border-radius:10px; background:rgba(255,255,255,0.1);">${text.replace(/\n/g, '<br>')}</div>`;
        
    } catch (e) {
        resArea.innerHTML = `<div style="color:#ff6b6b;">鑑定エラー: ${e.message}</div>`;
    }
}
