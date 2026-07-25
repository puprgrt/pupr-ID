from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import Optional

import os

# Konfigurasi JWT Supabase
# Ambil dari dashboard Supabase: Settings -> API -> JWT Secret
SECRET_KEY = os.getenv("SUPABASE_JWT_SECRET", "simulasi_rahasia_pupr_garut")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# Fungsi validasi JWT
def verify_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_aud": False})
        username: str = payload.get("sub")
        
        # Di Supabase, role kustom biasanya disimpan di app_metadata atau user_metadata
        app_metadata = payload.get("app_metadata", {})
        role: str = app_metadata.get("role", "Guest")
        
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, role=role)
    except JWTError:
        raise credentials_exception
    return token_data

# Dependency RBAC
def get_current_user(token_data: TokenData = Depends(verify_token)):
    return token_data

def require_role(required_role: str):
    def role_checker(user: TokenData = Depends(get_current_user)):
        if user.role != required_role and user.role != "Super Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource"
            )
        return user
    return role_checker
