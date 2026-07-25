from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from security import verify_token, require_role, TokenData
import time

app = FastAPI(
    title="PUPR-ID API Gateway",
    description="API Gateway untuk Platform Identitas Digital Terpadu DPUPR Kabupaten Garut",
    version="1.0.0"
)

# Konfigurasi CORS (Sesuaikan dengan origin Next.js Anda)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to PUPR-ID API Gateway", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "API Gateway", "timestamp": time.time()}

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
def login_for_access_token():
    from jose import jwt
    from security import SECRET_KEY, ALGORITHM
    import datetime
    
    # Generate token palsu untuk admin
    access_token_expires = datetime.timedelta(minutes=60)
    expire = datetime.datetime.utcnow() + access_token_expires
    to_encode = {"sub": "admin_garut", "role": "Administrator", "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": encoded_jwt, "token_type": "bearer"}
