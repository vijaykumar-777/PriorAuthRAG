#!/usr/bin/env python3
"""
api_server.py
-------------
Production FastAPI Backend for Prior Authorization Hierarchical RAG Portal.
Endpoints:
- POST /api/query: Execute 4-stage hierarchical RAG retrieval and synthesis
- GET /api/policies: List registered policies with TOC metrics
- GET /api/toc: Get TOC nodes for a specific policy
- GET /api/history: Get latest query execution results
- GET /api/health: Healthcheck and system status
"""

import os
import sys
import json
import time
import glob
from datetime import datetime
from typing import Optional, Dict, Any, List

# Setup workspace paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
HP_DIR = os.path.join(BASE_DIR, "hierarchical-processing")
if HP_DIR not in sys.path:
    sys.path.append(HP_DIR)
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

os.chdir(BASE_DIR)

from fastapi import FastAPI, HTTPException, Query as FastQuery
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import hierarchical RAG pipeline
import importlib.util
spec = importlib.util.spec_from_file_location("rh", os.path.join(BASE_DIR, "retrieval-hierarchical.py"))
rh = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rh)

app = FastAPI(
    title="Prior Authorization Hierarchical RAG API",
    description="4-Stage Multi-Document TOC-Guided Clinical RAG Engine",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    success: bool
    query: str
    elapsed_seconds: float
    data: Dict[str, Any]
    metadata: Dict[str, Any]

@app.get("/api/health")
def healthcheck():
    """System health check and connected service status."""
    return {
        "status": "online",
        "timestamp": datetime.now().isoformat(),
        "registered_policies_count": len(rh.registry.documents),
        "groq_model": rh.GEN_MODEL,
        "ollama_host": rh.OLLAMA_HOST,
        "embedding_model": getattr(rh, "OLLAMA_MODEL", "hf.co/unsloth/embeddinggemma-300m-GGUF:Q8_0")
    }

@app.post("/api/query", response_model=QueryResponse)
def execute_query(req: QueryRequest):
    """Execute end-to-end 4-stage clinical retrieval and structured synthesis."""
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    t0 = time.time()
    try:
        # Run live production hierarchical RAG pipeline
        structured_json = rh.run_rag_pipeline(query)
        elapsed = round(time.time() - t0, 2)

        pa_status = structured_json.get("Prior auth required", "Yes")
        policy_name = structured_json.get("Policy Name", "None")

        return QueryResponse(
            success=True,
            query=query,
            elapsed_seconds=elapsed,
            data=structured_json,
            metadata={
                "timestamp": datetime.now().isoformat(),
                "engine": f"groq:{rh.GEN_MODEL}",
                "embedding_engine": f"ollama:{getattr(rh, 'OLLAMA_MODEL', 'hf.co/unsloth/embeddinggemma-300m-GGUF:Q8_0')}",
                "elapsed_seconds": elapsed,
                "prior_auth_status": pa_status,
                "policy_name": policy_name
            }
        )
    except Exception as e:
        elapsed = round(time.time() - t0, 2)
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")

@app.get("/api/policies")
def list_policies():
    """Return all registered medical coverage policies in the registry."""
    policies = []
    for doc_key, doc_data in rh.registry.documents.items():
        toc_path = rh.registry._resolve_path(doc_data.get("toc_file", ""))
        node_count = 0
        if toc_path.exists():
            try:
                with open(toc_path, "r", encoding="utf-8") as f:
                    tdata = json.load(f)
                    node_count = len(tdata) if isinstance(tdata, list) else len(tdata.get("sections", []))
            except Exception:
                pass

        meta_path = rh.registry._resolve_path(doc_data.get("metadata_file", ""))
        chunk_count = 0
        if meta_path.exists():
            try:
                with open(meta_path, "r", encoding="utf-8") as f:
                    mdata = json.load(f)
                    chunk_count = len(mdata) if isinstance(mdata, list) else len(mdata.get("chunks", []))
            except Exception:
                pass

        policies.append({
            "doc_key": doc_key,
            "display_name": doc_data.get("display_name", doc_key),
            "toc_nodes": node_count,
            "chunks": chunk_count,
            "status": "Active Index"
        })
    return {"policies": policies}

@app.get("/api/toc")
def get_toc(doc_key: str = FastQuery("Cigna_ACDF")):
    """Get the TOC tree structure for a registered policy."""
    if doc_key not in rh.registry.documents:
        raise HTTPException(status_code=404, detail=f"Policy '{doc_key}' not found.")

    doc_data = rh.registry.documents[doc_key]
    toc_path = rh.registry._resolve_path(doc_data.get("toc_file", ""))
    if not toc_path.exists():
        raise HTTPException(status_code=404, detail=f"TOC file for '{doc_key}' not found at {toc_path}.")

    with open(toc_path, "r", encoding="utf-8") as f:
        toc_content = json.load(f)

    toc_tree = []
    if isinstance(toc_content, dict):
        toc_tree = toc_content.get("toc_tree", [])
    elif isinstance(toc_content, list):
        toc_tree = toc_content

    return {
        "doc_key": doc_key,
        "display_name": doc_data.get("display_name", doc_key),
        "toc": toc_content,
        "toc_tree": toc_tree,
        "total_pages": toc_content.get("total_pages") if isinstance(toc_content, dict) else None
    }

@app.get("/api/history")
def get_history(limit: int = 10):
    """Retrieve recently saved clinical evaluation reports."""
    results_dir = os.path.join(BASE_DIR, "data", "results_new")
    if not os.path.exists(results_dir):
        return {"history": []}

    files = sorted(glob.glob(os.path.join(results_dir, "*.json")), key=os.path.getmtime, reverse=True)
    history = []
    for fpath in files[:limit]:
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)
            fname = os.path.basename(fpath)
            history.append({
                "filename": fname,
                "timestamp": fname.split("_")[0] if "_" in fname else "",
                "policy_name": data.get("Policy Name", ""),
                "prior_auth_required": data.get("Prior auth required", ""),
                "data": data
            })
        except Exception:
            continue

    return {"history": history}

if __name__ == "__main__":
    import uvicorn
    print("=" * 70)
    print("Starting Prior Authorization Hierarchical RAG API Server...")
    print("API docs will be available at: http://localhost:8000/docs")
    print("=" * 70)
    uvicorn.run(app, host="0.0.0.0", port=8000)
