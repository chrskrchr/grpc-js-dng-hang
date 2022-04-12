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
  // fails immediately
  console.log("executing request #1");
  try {
    await ping(client);
  } catch (error) {
    console.log(error);
  }
  console.log("request #1 finished");

  console.log("sleeping...");
  await sleep(1000);

  // hangs indefinitely if we slept for less than `grpc.initial_reconnect_backoff_ms`
  console.log("executing request #2");
  try {
    await ping(client);
  } catch (error) {
    console.log(error);
  }
  console.log("request #2 finished");

  clearTimeout(keepAliveRef);
})();
