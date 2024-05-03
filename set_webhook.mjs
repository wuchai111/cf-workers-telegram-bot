import process from "process";

const sha256 = async (text) =>
  crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(text))
    .then((array_buffer) =>
      Array.from(new Uint8Array(array_buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );

const base_url = process.argv[2];
const token = process.argv[3];
const path = await sha256(token);
const url = base_url + path;
console.log(url);
fetch(url + '?command=set').then((response) => response.json()).then(console.log);
