#!/usr/bin/env python3
"""
run.py
------
Unified launcher for Prior Authorization Hierarchical RAG Platform.
Starts both the FastAPI backend and Vite frontend with a single command.

Usage:
    ./run.sh
    # or:
    python3 run.py
    # or:
    npm run dev
"""

import os
import sys
import time
import socket
import signal
import subprocess
import threading
import urllib.request
import urllib.error

# Project directory paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "priorauth-rag-portal")
VENV_PYTHON = os.path.join(BASE_DIR, "venv", "bin", "python")

# ANSI Color Codes
CYAN = "\033[36m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
RED = "\033[31m"
BLUE = "\033[34m"
BOLD = "\033[1m"
DIM = "\033[2m"
RESET = "\033[0m"

processes = []

def print_banner():
    banner = f"""
{BOLD}{BLUE}========================================================================{RESET}
{BOLD}{CYAN}      PRIOR AUTHORIZATION HIERARCHICAL RAG PORTAL{RESET}
{DIM}      Clinical Decision Support Engine • Multi-Document TOC RAG{RESET}
{BOLD}{BLUE}========================================================================{RESET}
"""
    print(banner)

def is_port_in_use(port: int) -> bool:
    """Check if a local port is already open."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex(("127.0.0.1", port)) == 0

def kill_process_on_port(port: int):
    """Free a port if occupied by a previous zombie instance."""
    try:
        out = subprocess.check_output(["lsof", "-t", f"-i:{port}"], stderr=subprocess.DEVNULL)
        pids = out.decode().strip().split()
        for pid in pids:
            if pid and int(pid) != os.getpid():
                print(f"{YELLOW}* Port {port} occupied by PID {pid}. Cleaning up...{RESET}")
                try:
                    os.kill(int(pid), signal.SIGTERM)
                    time.sleep(0.3)
                    os.kill(int(pid), signal.SIGKILL)
                except ProcessLookupError:
                    pass
    except Exception:
        # Fallback to fuser
        try:
            subprocess.run(["fuser", "-k", f"{port}/tcp"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except Exception:
            pass

def stream_logs(pipe, prefix: str, color: str):
    """Stream subprocess stdout/stderr with a colored tag prefix."""
    try:
        for line in iter(pipe.readline, ""):
            if not line:
                break
            text = line.rstrip()
            if text:
                print(f"{color}{BOLD}{prefix}{RESET} {text}")
    except Exception:
        pass

def wait_for_backend(url: str = "http://127.0.0.1:8000/api/health", timeout: int = 15) -> bool:
    """Wait for backend FastAPI server to pass healthcheck."""
    print(f"{CYAN}* Waiting for Backend API readiness at {url}...{RESET}")
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url, timeout=1) as resp:
                if resp.status == 200:
                    return True
        except (urllib.error.URLError, socket.timeout, ConnectionRefusedError):
            pass
        time.sleep(0.4)
    return False

def cleanup_and_exit(signum=None, frame=None):
    """Terminate child process groups gracefully on Ctrl+C or SIGTERM."""
    print(f"\n{YELLOW}* Shutting down PriorAuth RAG platform...{RESET}")
    for p in processes:
        if p.poll() is None:
            try:
                os.killpg(os.getpgid(p.pid), signal.SIGTERM)
            except Exception:
                try:
                    p.terminate()
                except Exception:
                    pass

    # Wait briefly for graceful shutdown
    time.sleep(0.5)

    for p in processes:
        if p.poll() is None:
            try:
                os.killpg(os.getpgid(p.pid), signal.SIGKILL)
            except Exception:
                try:
                    p.kill()
                except Exception:
                    pass

    print(f"{GREEN}* Services stopped cleanly. Goodbye!{RESET}\n")
    sys.exit(0)

def main():
    print_banner()

    # Register signal handlers for clean exit
    signal.signal(signal.SIGINT, cleanup_and_exit)
    signal.signal(signal.SIGTERM, cleanup_and_exit)

    # Resolve Python interpreter
    python_bin = VENV_PYTHON if os.path.isfile(VENV_PYTHON) and os.access(VENV_PYTHON, os.X_OK) else sys.executable
    print(f"{BLUE}* Python Interpreter :{RESET} {python_bin}")
    print(f"{BLUE}* Project Root       :{RESET} {BASE_DIR}")
    print(f"{BLUE}* Frontend Directory :{RESET} {FRONTEND_DIR}")

    # Check and free ports 8000 and 3000 if occupied
    if is_port_in_use(8000):
        kill_process_on_port(8000)
    if is_port_in_use(3000):
        kill_process_on_port(3000)

    # Check frontend dependencies
    node_modules = os.path.join(FRONTEND_DIR, "node_modules")
    if not os.path.exists(node_modules):
        print(f"{YELLOW}* Installing frontend dependencies (npm install)...{RESET}")
        subprocess.run(["npm", "install"], cwd=FRONTEND_DIR, check=True)

    # 1. Start Backend FastAPI
    print(f"\n{CYAN}{BOLD}[1/2] Launching FastAPI Backend (port 8000)...{RESET}")
    backend_cmd = [python_bin, "-m", "uvicorn", "api_server:app", "--host", "127.0.0.1", "--port", "8000"]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=BASE_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
        preexec_fn=os.setsid  # Create separate process group
    )
    processes.append(backend_proc)

    # Stream backend logs in background threads
    threading.Thread(target=stream_logs, args=(backend_proc.stdout, "[BACKEND]", CYAN), daemon=True).start()
    threading.Thread(target=stream_logs, args=(backend_proc.stderr, "[BACKEND]", CYAN), daemon=True).start()

    # Wait for backend healthcheck
    if not wait_for_backend():
        print(f"{RED}! Warning: Backend healthcheck timed out, starting frontend anyway...{RESET}")
    else:
        print(f"{GREEN}* Backend API is healthy & ready!{RESET}")

    # 2. Start Frontend Vite
    print(f"\n{GREEN}{BOLD}[2/2] Launching Vite Frontend (port 3000)...{RESET}")
    frontend_cmd = ["npm", "run", "dev"]
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=FRONTEND_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
        preexec_fn=os.setsid
    )
    processes.append(frontend_proc)

    # Stream frontend logs in background threads
    threading.Thread(target=stream_logs, args=(frontend_proc.stdout, "[FRONTEND]", GREEN), daemon=True).start()
    threading.Thread(target=stream_logs, args=(frontend_proc.stderr, "[FRONTEND]", GREEN), daemon=True).start()

    # Ready banner
    time.sleep(1.0)
    ready_card = f"""
{BOLD}{GREEN}------------------------------------------------------------------------{RESET}
{BOLD}{GREEN}  ALL SERVICES ARE RUNNING!{RESET}

  {BOLD}Frontend Portal :{RESET} {CYAN}http://localhost:3000{RESET}
  {BOLD}Backend API     :{RESET} {CYAN}http://127.0.0.1:8000{RESET}
  {BOLD}Swagger Docs    :{RESET} {CYAN}http://127.0.0.1:8000/docs{RESET}

  {DIM}Press Ctrl+C at any time to stop both servers.{RESET}
{BOLD}{GREEN}------------------------------------------------------------------------{RESET}
"""
    print(ready_card)

    # Keep main thread alive and watch child processes
    try:
        while True:
            for p in processes:
                exit_code = p.poll()
                if exit_code is not None:
                    print(f"{RED}! A service terminated unexpectedly with exit code {exit_code}. Shutting down...{RESET}")
                    cleanup_and_exit()
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup_and_exit()

if __name__ == "__main__":
    main()
