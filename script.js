const KEY = 'AIzaSyB9CTvRXoRARF-DC7Dy5RBi616H5zJfGgc'; 

async function execute(type) {
    const resArea = document.getElementById('resultArea');
    const input = document.getElementById('stoneInput').value.trim();
    if (!input) return alert('入力してください');

    resArea.innerHTML = '鑑定中...';

    // エラーの元である v1beta を捨て、v1 に固定します
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: input + "について鑑定して" }] }] })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        resArea.innerHTML = data.candidates[0].content.parts[0].text.replace(/\n/g, '<br>');
    } catch (e) {
        resArea.innerHTML = "エラー原因: " + e.message;
    }
}
