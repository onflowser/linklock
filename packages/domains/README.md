# Flow domains

This package handles retrieval of flow account infos using well-known Flow domain systems FlowNS (https://www.flowns.org) and Find (https://find.xyz).

## Usage

### Setup

```typescript
import { DomainsService } from "@membership/domains";

const flowDomains = new DomainsService();
```

### Get domain info

Resolves any Flow domain (either FlowNS or Find) and returns a `FlowAbstractNameInfo` object.

```typescript
await flowDomains.getNameInfo("bjartek.find");
```


### Get raw domain info

Resolves any Flow domain (either FlowNS or Find) and returns `FlowNameRawInfo` object, with full domain infos in separate objects for each domain system.

```typescript
const { find, flowns } = await flowDomains.getRawInfosByName("bjartek.find");
```

### Get address from domain

Returns a Flow account address given any Flow domain name (either FlowNS or Find).

```typescript
const address = await flowDomains.resolveNameToAddress("bjartek.find")
```
