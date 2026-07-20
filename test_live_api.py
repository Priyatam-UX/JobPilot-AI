import requests

def test_api():
    base_url = "https://jobpilot-backend-l4o2.onrender.com/api/v1"
    
    # 1. Test Health
    try:
        r = requests.get("https://jobpilot-backend-l4o2.onrender.com/health")
        print(f"Health check: {r.status_code}")
    except Exception as e:
        print(f"Health check failed: {e}")
        
    # 2. Test CORS / OPTIONS for /jobs/
    try:
        headers = {
            "Origin": "https://job-pilot-ai-priyatam-ux.vercel.app",
            "Access-Control-Request-Method": "POST"
        }
        r = requests.options(f"{base_url}/jobs/", headers=headers)
        print(f"OPTIONS /jobs/: {r.status_code}")
        print(f"CORS Headers: {r.headers.get('access-control-allow-origin')}")
    except Exception as e:
        print(f"OPTIONS /jobs/ failed: {e}")

    # 3. Test CORS / OPTIONS for /applications/auto-apply
    try:
        r = requests.options(f"{base_url}/applications/auto-apply", headers=headers)
        print(f"OPTIONS /applications/auto-apply: {r.status_code}")
        print(f"CORS Headers: {r.headers.get('access-control-allow-origin')}")
    except Exception as e:
        print(f"OPTIONS /auto-apply failed: {e}")

test_api()
