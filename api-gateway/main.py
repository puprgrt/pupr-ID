from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="PUPR-ID API Gateway",
    description="API Gateway untuk Platform Identitas Digital Terpadu DPUPR Kabupaten Garut",
    version="1.0.0"
)

# Konfigurasi CORS (Sesuaikan dengan domain yang diizinkan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Sebaiknya diganti dengan origin frontend untuk produksi
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to PUPR-ID API Gateway"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "API Gateway"}

# Contoh Endpoint untuk verifikasi (Nanti akan menggunakan JWT & Keycloak validation)
@app.get("/api/v1/protected")
def protected_route():
    # TODO: Implementasi verifikasi JWT OIDC
    return {"message": "This is a protected route. You have access."}
