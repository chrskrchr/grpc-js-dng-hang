This repo can be used to reproduce an issue where the DNS resolver continues to resolve unknown addresses after the parent request has failed.

To reproduce:

1. Run `npm install`
1. Run `npm run start`
1. The script does the following:
    1. Creates a gRPC client with a dummy service definition and a bogus server address
    1. Executes 250 requests to that bogus address that fail immediately with the expected error:
        - `Error: 14 UNAVAILABLE: Name resolution failed for target dns:bogus.host`

After the requests have completed, you'll continue to see `Looking up DNS hostname bogus.host` entries show up in the logs:

```
...
request #250 finished
sleeping...
2022-04-19T19:25:32.614Z | finished executing requests
D 2022-04-19T19:25:37.148Z | dns_resolver | Looking up DNS hostname bogus.host
D 2022-04-19T19:25:37.150Z | dns_resolver | Resolution error for target dns:bogus.host: getaddrinfo ENOTFOUND bogus.host
D 2022-04-19T19:25:37.150Z | resolving_load_balancer | dns:bogus.host TRANSIENT_FAILURE -> TRANSIENT_FAILURE
D 2022-04-19T19:25:37.151Z | connectivity_state | (1) dns:bogus.host TRANSIENT_FAILURE -> TRANSIENT_FAILURE
D 2022-04-19T19:25:45.234Z | resolving_load_balancer | dns:bogus.host TRANSIENT_FAILURE -> IDLE
D 2022-04-19T19:25:45.234Z | connectivity_state | (1) dns:bogus.host TRANSIENT_FAILURE -> IDLE
D 2022-04-19T19:25:47.295Z | dns_resolver | Looking up DNS hostname bogus.host
D 2022-04-19T19:25:47.297Z | dns_resolver | Resolution error for target dns:bogus.host: getaddrinfo ENOTFOUND bogus.host
D 2022-04-19T19:25:47.297Z | resolving_load_balancer | dns:bogus.host IDLE -> TRANSIENT_FAILURE
D 2022-04-19T19:25:47.297Z | connectivity_state | (1) dns:bogus.host IDLE -> TRANSIENT_FAILURE
D 2022-04-19T19:25:55.634Z | dns_resolver | Looking up DNS hostname bogus.host
D 2022-04-19T19:25:55.636Z | dns_resolver | Resolution error for target dns:bogus.host: getaddrinfo ENOTFOUND bogus.host
D 2022-04-19T19:25:55.636Z | resolving_load_balancer | dns:bogus.host TRANSIENT_FAILURE -> TRANSIENT_FAILURE
D 2022-04-19T19:25:55.636Z | connectivity_state | (1) dns:bogus.host TRANSIENT_FAILURE -> TRANSIENT_FAILURE
D 2022-04-19T19:25:59.676Z | resolving_load_balancer | dns:bogus.host TRANSIENT_FAILURE -> IDLE
D 2022-04-19T19:25:59.676Z | connectivity_state | (1) dns:bogus.host TRANSIENT_FAILURE -> IDLE
D 2022-04-19T19:26:10.272Z | dns_resolver | Looking up DNS hostname bogus.host
D 2022-04-19T19:26:10.273Z | dns_resolver | Resolution error for target dns:bogus.host: getaddrinfo ENOTFOUND bogus.host
D 2022-04-19T19:26:10.274Z | resolving_load_balancer | dns:bogus.host IDLE -> TRANSIENT_FAILURE
D 2022-04-19T19:26:10.274Z | connectivity_state | (1) dns:bogus.host IDLE -> TRANSIENT_FAILURE
D 2022-04-19T19:26:27.807Z | resolving_load_balancer | dns:bogus.host TRANSIENT_FAILURE -> IDLE
D 2022-04-19T19:26:27.807Z | connectivity_state | (1) dns:bogus.host TRANSIENT_FAILURE -> IDLE
D 2022-04-19T19:26:37.727Z | dns_resolver | Looking up DNS hostname bogus.host
D 2022-04-19T19:26:37.728Z | dns_resolver | Resolution error for target dns:bogus.host: getaddrinfo ENOTFOUND bogus.host
D 2022-04-19T19:26:37.728Z | resolving_load_balancer | dns:bogus.host IDLE -> TRANSIENT_FAILURE
D 2022-04-19T19:26:37.728Z | connectivity_state | (1) dns:bogus.host IDLE -> TRANSIENT_FAILURE
D 2022-04-19T19:27:03.690Z | resolving_load_balancer | dns:bogus.host TRANSIENT_FAILURE -> IDLE
D 2022-04-19T19:27:03.690Z | connectivity_state | (1) dns:bogus.host TRANSIENT_FAILURE -> IDLE
D 2022-04-19T19:27:05.471Z | dns_resolver | Looking up DNS hostname bogus.host
D 2022-04-19T19:27:05.473Z | dns_resolver | Resolution error for target dns:bogus.host: getaddrinfo ENOTFOUND bogus.host
D 2022-04-19T19:27:05.473Z | resolving_load_balancer | dns:bogus.host IDLE -> TRANSIENT_FAILURE
D 2022-04-19T19:27:05.473Z | connectivity_state | (1) dns:bogus.host IDLE -> TRANSIENT_FAILURE
```