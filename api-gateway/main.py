import os
import time
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from security import verify_token, require_role, TokenData, limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

app = FastAPI(
    title="PUPR-ID API Gateway",
    description="API Gateway untuk Platform Identitas Digital Terpadu DPUPR Kabupaten Garut",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Konfigurasi CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to PUPR-ID API Gateway", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "API Gateway", "timestamp": time.time()}

# -----------------
# OIDC DISCOVERY / REALM ENDPOINT
# -----------------
@app.get("/realms/{realm}/.well-known/openid-configuration")
def get_openid_configuration(realm: str, request: Request):
    """ Endpoint OIDC Discovery standar untuk Realm SSO PUPR-ID """
    base_url = str(request.base_url).rstrip("/")
    realm_url = f"{base_url}/realms/{realm}"
    
    return {
        "issuer": realm_url,
        "authorization_endpoint": f"{realm_url}/protocol/openid-connect/auth",
        "token_endpoint": f"{realm_url}/protocol/openid-connect/token",
        "userinfo_endpoint": f"{base_url}/api/v1/userinfo",
        "jwks_uri": f"{realm_url}/protocol/openid-connect/certs",
        "response_types_supported": ["code", "token", "id_token", "code id_token"],
        "subject_types_supported": ["public"],
        "id_token_signing_alg_values_supported": ["RS256"],
        "scopes_supported": ["openid", "profile", "email", "roles"],
        "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
        "claims_supported": ["sub", "iss", "auth_time", "name", "preferred_username", "email", "role"]
    }


# -----------------
# PROTECTED ROUTES
# -----------------

@app.get("/api/v1/userinfo")
def get_user_info(current_user: TokenData = Depends(verify_token)):
    """ Endpoint untuk mengambil data profil pengguna aktif """
    # Simulasi data dari Database / Keycloak
    return {
        "username": current_user.username,
        "role": current_user.role,
        "department": "DPUPR Kab. Garut",
        "email": f"{current_user.username}@garutkab.go.id",
        "status": "Active"
    }

@app.get("/api/v1/dashboard/stats")
def get_dashboard_stats(current_user: TokenData = Depends(require_role("Administrator"))):
    """ Endpoint khusus Admin untuk mendapatkan statistik SSO """
    # Simulasi agregasi data
    return {
        "total_users": 12548,
        "online_users": 1243,
        "offline_users": 11305,
        "logins_today": 4210,
        "failed_logins": 72,
        "locked_accounts": 5,
        "expired_passwords": 18
    }

@app.get("/api/v1/applications")
def get_applications(current_user: TokenData = Depends(verify_token)):
    """ Mengambil daftar aplikasi yang dapat diakses oleh user berdasarkan role """
    # Simulasi daftar aplikasi SSO
    apps = [
        {"id": 1, "name": "SIMBG", "url": "https://simbg.pupr.go.id", "icon": "building"},
        {"id": 2, "name": "LAIKA", "url": "https://laika.garutkab.go.id", "icon": "file-text"},
        {"id": 3, "name": "SIJENANG", "url": "https://sijenang.garutkab.go.id", "icon": "map"},
        {"id": 4, "name": "GIS Dashboard", "url": "https://gis.garutkab.go.id", "icon": "globe"}
    ]
    return {"data": apps}

# Simulasi Token Generator (Hanya untuk testing lokal tanpa Keycloak)
@app.post("/token")
@limiter.limit("5/minute")
def login_for_access_token(request: Request):
    from jose import jwt
    from security import SECRET_KEY, ALGORITHM
    import datetime
    
    # Generate token palsu untuk admin
    access_token_expires = datetime.timedelta(minutes=60)
    expire = datetime.datetime.utcnow() + access_token_expires
    to_encode = {"sub": "admin_garut", "role": "Administrator", "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": encoded_jwt, "token_type": "bearer"}
