const KEY = 'AIzaSyB9CTvRXoRARF-DC7Dy5RBi616H5zJfGgc'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('内容を入力してください');

    resArea.innerHTML = '✨ 石の記憶を呼び起こしています...';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: type === 'diag' ? input + "について、石の視点から神秘的なアドバイスを150文字以内でして。最後に相性の良い色を教えて。" : input + "の石言葉と、お手入れ方法を教えて。" }] }]
            })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        resArea.innerHTML = text.replace(/\n/g, '<br>');
    } catch (e) {
        resArea.innerHTML = "接続エラー。キーが正しいか確認してください。";
    }
}
