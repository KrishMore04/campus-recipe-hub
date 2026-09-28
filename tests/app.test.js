const test = require("node:test");
const assert = require("node:assert");
const http = require("http");
const app = require("../server");

let server;
let baseUrl;

test.before(async () => {
    server = http.createServer(app);

    await new Promise(resolve => {
        server.listen(0, resolve);
    });

    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
});

test.after(async () => {
    await new Promise(resolve => {
        server.close(resolve);
    });
});

test("health route returns status ok", async () => {
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(data.status, "ok");
});

test("valid recipe can be added", async () => {
    const response = await fetch(`${baseUrl}/api/recipes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "Paneer Roll",
            category: "Snacks",
            ingredients: "Paneer, roti, onion, spices",
            instructions: "Prepare the filling and roll it in the roti."
        })
    });

    const data = await response.json();

    assert.strictEqual(response.status, 201);
    assert.strictEqual(data.name, "Paneer Roll");
});

test("invalid recipe is rejected", async () => {
    const response = await fetch(`${baseUrl}/api/recipes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: "",
            category: "Snacks",
            ingredients: "Bread",
            instructions: "Toast it."
        })
    });

    const data = await response.json();

    assert.strictEqual(response.status, 400);
    assert.strictEqual(data.error, "All fields are required.");
});