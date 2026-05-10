import os
from typing import Any, Dict, List, Optional

import httpx
from dotenv import load_dotenv

load_dotenv()


class TigerGraphService:
    def __init__(self):
        self.base_url = os.getenv("TIGERGRAPH_URL", "").rstrip("/")
        self.graph_name = os.getenv("GRAPH_NAME", "intelgraph")
        self.api_key = os.getenv("TIGERGRAPH_API_KEY", "")
        self.username = os.getenv("TIGERGRAPH_USERNAME", "")
        self.password = os.getenv("TIGERGRAPH_PASSWORD", "")
        self.vertex_types = [
            item.strip()
            for item in os.getenv(
                "TIGERGRAPH_VERTEX_TYPES",
                "ThreatActor,Vulnerability,Malware,IP,Sector",
            ).split(",")
            if item.strip()
        ]

    def is_configured(self) -> bool:
        has_auth = bool(self.api_key or (self.username and self.password))
        return bool(self.base_url and self.graph_name and has_auth)

    def _headers(self) -> Dict[str, str]:
        headers = {"Accept": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers

    async def retrieve_context(self, query: str, limit: int = 5) -> str:
        if not self.is_configured():
            return self._fallback_context("TigerGraph is not configured.")

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                samples = await self._fetch_vertex_samples(client, limit)

            if not samples:
                return self._fallback_context("TigerGraph returned no sample vertices.")

            evidence = self._format_samples(samples)
            return (
                f"User query: {query}\n"
                f"Graph: {self.graph_name}\n"
                "TigerGraph evidence samples:\n"
                f"{evidence}"
            )
        except Exception as exc:
            return self._fallback_context(f"TigerGraph retrieval failed: {exc}")

    async def _fetch_vertex_samples(
        self,
        client: httpx.AsyncClient,
        limit: int,
    ) -> List[Dict[str, Any]]:
        samples: List[Dict[str, Any]] = []
        auth = None if self.api_key else (self.username, self.password)

        for vertex_type in self.vertex_types:
            url = f"{self.base_url}/restpp/graph/{self.graph_name}/vertices/{vertex_type}"
            response = await client.get(
                url,
                headers=self._headers(),
                auth=auth,
                params={"limit": limit},
            )
            if response.status_code >= 400:
                continue

            payload = response.json()
            vertices = self._extract_vertices(payload)
            for vertex in vertices[:limit]:
                vertex["vertex_type"] = vertex.get("v_type") or vertex_type
                samples.append(vertex)

        return samples

    def _extract_vertices(self, payload: Dict[str, Any]) -> List[Dict[str, Any]]:
        results = payload.get("results", [])
        if isinstance(results, list):
            if results and isinstance(results[0], dict) and "vertices" in results[0]:
                return results[0].get("vertices", [])
            return [item for item in results if isinstance(item, dict)]
        return []

    def _format_samples(self, samples: List[Dict[str, Any]]) -> str:
        lines = []
        for sample in samples[:15]:
            vertex_id = sample.get("v_id") or sample.get("id") or "unknown"
            vertex_type = sample.get("vertex_type") or sample.get("v_type") or "Entity"
            attrs = sample.get("attributes") or {}
            attrs_text = ", ".join(
                f"{key}={value}" for key, value in list(attrs.items())[:4]
            )
            lines.append(f"- {vertex_type}: {vertex_id}" + (f" ({attrs_text})" if attrs_text else ""))
        return "\n".join(lines)

    def _fallback_context(self, reason: Optional[str] = None) -> str:
        prefix = f"{reason}\n" if reason else ""
        return (
            prefix +
            "Graph Path: APT29-[USES]->Cobalt Strike-[EXPLOITS]->"
            "CVE-2023-23397-[TARGETS]->Healthcare"
        )


tigergraph_service = TigerGraphService()
