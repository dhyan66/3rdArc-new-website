import fetch from 'node-fetch';

(async () => {
  const res = await fetch('http://localhost:3001/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'test@example.com', message: 'hello' }),
  });
  console.log('status', res.status);
  console.log(await res.text());
})();