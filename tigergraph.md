# TigerGraph Schema Notes

This project uses TigerGraph as the graph store for the GraphRAG pipeline. The backend reads vertex samples through REST++ and uses them as graph context for `/graphrag-query`.

## Environment

Set these values in `intelgraph-backend/.env`:

```env
TIGERGRAPH_URL=https://tgcloud.io
TIGERGRAPH_API_KEY=your_tigergraph_api_key
GRAPH_NAME=intelgraph
TIGERGRAPH_VERTEX_TYPES=ThreatActor,Vulnerability,Malware,IP,Sector
```

`TIGERGRAPH_URL` should be the TigerGraph REST++ base URL without a trailing slash. The backend calls:

```text
{TIGERGRAPH_URL}/restpp/graph/{GRAPH_NAME}/vertices/{VertexType}
```

## Required Vertices

These are the default vertex types expected by `intelgraph-backend/app/services/tigergraph_service.py`.

### ThreatActor

Represents an adversary group or named actor.

Suggested attributes:

| Attribute | Type | Example |
| --- | --- | --- |
| `name` | `STRING` | `APT29` |
| `aliases` | `STRING` | `Cozy Bear, NOBELIUM` |
| `origin` | `STRING` | `Russia` |
| `motivation` | `STRING` | `Espionage` |
| `severity` | `STRING` | `Critical` |

Example IDs:

```text
TA0029
TA0028
TA0010
```

### Vulnerability

Represents a CVE or exploitable weakness.

Suggested attributes:

| Attribute | Type | Example |
| --- | --- | --- |
| `cve_id` | `STRING` | `CVE-2023-23397` |
| `name` | `STRING` | `Microsoft Outlook EoP` |
| `cvss` | `FLOAT` | `9.8` |
| `status` | `STRING` | `Exploited in wild` |
| `description` | `STRING` | `Allows NTLM credential theft` |

Example IDs:

```text
CVE-2023-23397
CVE-2021-44228
CVE-2024-21412
```

### Malware

Represents malware families, implants, loaders, or offensive frameworks.

Suggested attributes:

| Attribute | Type | Example |
| --- | --- | --- |
| `name` | `STRING` | `Cobalt Strike` |
| `type` | `STRING` | `Command and Control` |
| `platform` | `STRING` | `Windows` |
| `description` | `STRING` | `Beacon payload used for C2` |
| `severity` | `STRING` | `High` |

Example IDs:

```text
S0154
S0552
S0606
```

### IP

Represents an observed infrastructure IP address or target IP.

Suggested attributes:

| Attribute | Type | Example |
| --- | --- | --- |
| `address` | `STRING` | `192.168.1.45` |
| `role` | `STRING` | `Target` |
| `asn` | `STRING` | `AS13335` |
| `country` | `STRING` | `US` |
| `first_seen` | `DATETIME` | `2026-05-10 09:00:00` |

Example IDs:

```text
192.168.1.45
10.10.4.8
203.0.113.42
```

### Sector

Represents target industries or affected sectors.

Suggested attributes:

| Attribute | Type | Example |
| --- | --- | --- |
| `name` | `STRING` | `Healthcare` |
| `criticality` | `STRING` | `High` |
| `region` | `STRING` | `Global` |
| `description` | `STRING` | `Hospitals, insurers, clinical networks` |

Example IDs:

```text
Healthcare
Government
Financial
Defense
Energy
```

## Recommended Edges

Use directed edges so attack chains can be traversed naturally.

| Edge | From | To | Meaning |
| --- | --- | --- | --- |
| `USES` | `ThreatActor` | `Malware` | Actor uses a malware/tool |
| `EXPLOITS` | `ThreatActor` | `Vulnerability` | Actor exploits a CVE |
| `DELIVERS` | `Malware` | `Vulnerability` | Malware is delivered through a vulnerability |
| `TARGETS_IP` | `ThreatActor` | `IP` | Actor targets infrastructure |
| `AFFECTS_SECTOR` | `Vulnerability` | `Sector` | CVE affects a sector |
| `TARGETS_SECTOR` | `ThreatActor` | `Sector` | Actor targets a sector |
| `INFECTS` | `Malware` | `IP` | Malware observed on an IP |
| `BELONGS_TO` | `IP` | `Sector` | Infrastructure belongs to a sector |

The demo attack path used by the UI is:

```text
APT29 -[USES]-> Cobalt Strike -[EXPLOITS]-> CVE-2023-23397 -[TARGETS]-> Healthcare
```

## Starter GSQL

Use this as a starting point and adjust attributes for your dataset.

```gsql
CREATE VERTEX ThreatActor (
  PRIMARY_ID id STRING,
  name STRING,
  aliases STRING,
  origin STRING,
  motivation STRING,
  severity STRING
) WITH primary_id_as_attribute="true";

CREATE VERTEX Vulnerability (
  PRIMARY_ID id STRING,
  cve_id STRING,
  name STRING,
  cvss FLOAT,
  status STRING,
  description STRING
) WITH primary_id_as_attribute="true";

CREATE VERTEX Malware (
  PRIMARY_ID id STRING,
  name STRING,
  type STRING,
  platform STRING,
  description STRING,
  severity STRING
) WITH primary_id_as_attribute="true";

CREATE VERTEX IP (
  PRIMARY_ID id STRING,
  address STRING,
  role STRING,
  asn STRING,
  country STRING,
  first_seen DATETIME
) WITH primary_id_as_attribute="true";

CREATE VERTEX Sector (
  PRIMARY_ID id STRING,
  name STRING,
  criticality STRING,
  region STRING,
  description STRING
) WITH primary_id_as_attribute="true";

CREATE DIRECTED EDGE USES (FROM ThreatActor, TO Malware);
CREATE DIRECTED EDGE EXPLOITS (FROM ThreatActor, TO Vulnerability);
CREATE DIRECTED EDGE DELIVERS (FROM Malware, TO Vulnerability);
CREATE DIRECTED EDGE TARGETS_IP (FROM ThreatActor, TO IP);
CREATE DIRECTED EDGE AFFECTS_SECTOR (FROM Vulnerability, TO Sector);
CREATE DIRECTED EDGE TARGETS_SECTOR (FROM ThreatActor, TO Sector);
CREATE DIRECTED EDGE INFECTS (FROM Malware, TO IP);
CREATE DIRECTED EDGE BELONGS_TO (FROM IP, TO Sector);

CREATE GRAPH intelgraph (
  ThreatActor,
  Vulnerability,
  Malware,
  IP,
  Sector,
  USES,
  EXPLOITS,
  DELIVERS,
  TARGETS_IP,
  AFFECTS_SECTOR,
  TARGETS_SECTOR,
  INFECTS,
  BELONGS_TO
);
```

## Seed Example

Minimal records to match the current frontend demo:

```text
ThreatActor: TA0029, name=APT29, aliases=Cozy Bear, NOBELIUM, origin=Russia, severity=Critical
Malware: S0154, name=Cobalt Strike, type=Command and Control, platform=Windows
Vulnerability: CVE-2023-23397, name=Microsoft Outlook EoP, cvss=9.8, status=Exploited in wild
IP: 192.168.1.45, address=192.168.1.45, role=Target
Sector: Healthcare, name=Healthcare, criticality=High

TA0029 -USES-> S0154
TA0029 -EXPLOITS-> CVE-2023-23397
S0154 -INFECTS-> 192.168.1.45
192.168.1.45 -BELONGS_TO-> Healthcare
CVE-2023-23397 -AFFECTS_SECTOR-> Healthcare
```

## Backend Behavior

The backend currently fetches sample vertices for each type listed in `TIGERGRAPH_VERTEX_TYPES`. If TigerGraph is not configured, not reachable, or returns no vertices, the backend falls back to a demo graph path so the dashboard keeps working.

## How To Use In The App

1. Confirm `intelgraph-backend/.env` contains your TigerGraph values:
```env
TIGERGRAPH_URL=https://your-restpp-host
TIGERGRAPH_API_KEY=your_tigergraph_api_key
GRAPH_NAME=intelgraph
TIGERGRAPH_VERTEX_TYPES=ThreatActor,Vulnerability,Malware,IP,Sector
```

2. Restart the backend after changing TigerGraph env values.

3. Open the Investigation Console at `http://localhost:3000/investigation` and ask a graph-shaped question, for example:
```text
Explain the attack chain involving APT29, Cobalt Strike, and CVE-2023-23397.
```

4. Check the **AI Synthesis** and **Metrics** tabs. The GraphRAG pipeline calls TigerGraph through:
```text
{TIGERGRAPH_URL}/restpp/graph/{GRAPH_NAME}/vertices/{VertexType}
```

If TigerGraph is unavailable, the response still works with the demo fallback path. To confirm live TigerGraph data is being used, call `POST /graphrag-query` from `http://localhost:8000/docs` and verify the generated answer reflects your seeded vertex attributes.

After the graph is populated, restart the FastAPI backend:

```bash
cd "/Applications/Development/IntelGraph AI/intelgraph-backend"
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```
