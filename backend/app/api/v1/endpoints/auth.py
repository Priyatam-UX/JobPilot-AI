from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserResponse,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    OAuthLoginRequest,
)
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """Create a new user account."""
    service = UserService(db)
    user = service.register(user_in)
    return user


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate with email/password and receive JWT tokens."""
    service = UserService(db)
    return service.login(data.email, data.password)


@router.post("/refresh", response_model=TokenResponse)
def refresh_tokens(data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Exchange a valid refresh token for a new access/refresh token pair."""
    service = UserService(db)
    return service.refresh_tokens(data.refresh_token)


@router.post("/oauth", response_model=TokenResponse)
def oauth_login(data: OAuthLoginRequest, db: Session = Depends(get_db)):
    """Authenticate via OAuth provider (Google/GitHub) using an access or ID token."""
    service = UserService(db)
    return service.oauth_login(data.provider, data.token)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user

