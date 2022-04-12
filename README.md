This repo can be used to reproduce an issue where gRPC requests hang indefinitely if executed when the `ResolvingLoadBalancer` class is in the `TRANSIENT_FAILURE` state.

To reproduce:

1. Run `npm install`
1. Run `npm run start`
1. The script does the following:
    1. Creates a gRPC client with a dummy service definition and a bogus address
    1. Executes a request to the bogus address that fails immediately with the expected error:
        - `Error: 14 UNAVAILABLE: Name resolution failed for target dns:bogus.host`
    1. Sleeps for `1000ms`, which is notably less than the client's configured `2500ms` backoff setting on L38:
        - `"grpc.initial_reconnect_backoff_ms": 2500`
    1. Executes a second request to the bogus address

This second request hangs indefinitely, event after the reconnect backoff has expired and the resolver has been set back to the `IDLE` state.
