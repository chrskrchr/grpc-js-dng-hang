const Path = require("path");
const Grpc = require("@grpc/grpc-js");
const ProtoLoader = require("@grpc/proto-loader");

function ping(client) {
  return new Promise((resolve, reject) => {
    client.ping({}, function (err, response) {
      if (err) {
        reject(err);
        return;
      }
      resolve(response.message);
    });
  });
}

function sleep(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

// create a handle that prevents the process from exiting while our async functions are running
const keepAliveRef = setTimeout(() => {}, 1_000_000);

var PROTO_PATH = Path.join(__dirname, "service.proto");
var packageDefinition = ProtoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const { PingAPI } = Grpc.loadPackageDefinition(packageDefinition);

const client = new PingAPI("bogus.host", Grpc.credentials.createInsecure(), {
  "grpc.initial_reconnect_backoff_ms": 2500,
});

(async function main() {
  const RUNS = 250;
  for (let i = 1; i <= RUNS; i++) {
    console.log(`executing request #${i}`);
    try {
      await ping(client);
    } catch (error) {
      console.log(error);
    }
    console.log(`request #${i} finished`);

    console.log("sleeping...");
    await sleep(66);
  }

  console.log(`${new Date().toISOString()} | finished executing requests`);
})();
