#!/usr/bin/env python3
"""Call sfkey OpenAI-compatible chat API. Secrets loaded from O/api-config/.env"""
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

env_path = Path(__file__).resolve().parents[1] / "api-config" / ".env"
if not env_path.exists():
    sys.exit(f"Missing secrets file: {env_path}")

for line in env_path.read_text().splitlines():
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    k, v = line.split("=", 1)
    os.environ.setdefault(k.strip(), v.strip())

prompt = " ".join(sys.argv[1:]) or "你好"
payload = {
    "model": os.environ.get("SFKEY_MODEL", "glm-5"),
    "messages": [{"role": "user", "content": prompt}],
    "max_tokens": 800,
}
req = urllib.request.Request(
    os.environ["SFKEY_BASE_URL"].rstrip("/") + "/chat/completions",
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Authorization": "Bearer " + os.environ["SFKEY_API_KEY"],
        "Content-Type": "application/json",
    },
    method="POST",
)

try:
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.load(resp)
except urllib.error.HTTPError as e:
    body = e.read().decode("utf-8", errors="replace")
    print(f"HTTP {e.code}\n{body}", file=sys.stderr)
    sys.exit(1)

print(json.dumps(data, ensure_ascii=False, indent=2))
choice = (data.get("choices") or [{}])[0]
content = (choice.get("message") or {}).get("content")
if content:
    print("\n--- reply ---\n" + content)
