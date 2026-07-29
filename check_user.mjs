import https from 'https';

const gql = `query {
  users(where: {email: {_eq: "vivecablah@gmail.com"}}) {
    id
    email
    displayName
    defaultRole
    roles {
      role
    }
    createdAt
  }
}`;
console.log('GraphQL Query:');
console.log(gql);
console.log('---');

const body = JSON.stringify({ query: gql });

const options = {
  hostname: 'ukuqslqvwovrukooziwf.hasura.ap-south-1.nhost.run',
  path: '/v1/graphql',
  method: 'POST',
  rejectUnauthorized: false,
  headers: {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': 'admin12345',
    'Content-Length': Buffer.byteLength(body),
  },
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('');
    try {
      const parsed = JSON.parse(data);
      console.log('Response:', JSON.stringify(parsed, null, 2));
    } catch {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(body);
req.end();
