import * as http from 'http';
import { handler } from './handler';

startServer(handler);

function startServer(requestHandler: any) {
    const port = 3000;

    const server = http.createServer((request, response) => {
        if (request.method !== 'POST') {
            response.writeHead(200);
            response.end('Dialog server OK');
            return;
        }

        let body = '';

        request.on('data', (data) => {
            body += data.toString();
        });

        request.on('end', async () => {
            try {
                const reply = await requestHandler(JSON.parse(body));

                response.setHeader('Content-Type', 'application/json');
                response.writeHead(200);
                response.end(JSON.stringify(reply));
            } catch (error) {
                console.log(`${new Date().toISOString()} Handle request error.`, error);
                response.writeHead(400);
                response.end('400 Bad request');
            }
        });
    });

    server.listen(port, () => {
        console.log(`Dialog server is listening on ${port}`);
    });

    server.on('close', () => {
        console.log(`Dialog server is closing...`);
    });

    process.on('SIGINT', () => server.close());

    return server;
}
