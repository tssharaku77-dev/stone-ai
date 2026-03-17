const KEY = 'AIzaSyB9CTvRXoRARF-DC7Dy5RBi616H5zJfGgc'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください。');

    resArea.innerHTML = '✨ 石の波動とリンクしています...';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    const promptText = type === 'diag' 
        ? `${input} という悩みや状況に対し、力を与えてくれる天然石を1つ選定し、石の視点から神秘的なアドバイスを150文字以内で伝えて。最後に守護力を星で5段階評価して。`
        : `${input} という石について、石言葉、浄化方法、持ち主へのメッセージを教えて。`;

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
        resArea.innerHTML = `<div style="color:#ff6b6b;">【エラー】キーが正しくないか、反映待ちです。内容: ${e.message}</div>`;
    }
}
