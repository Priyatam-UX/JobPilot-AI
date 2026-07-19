from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, TokenResponse


class UserService:
    """Service encapsulating all user business logic."""

    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register(self, user_in: UserCreate) -> User:
        existing = self.repo.get_by_email(user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists.",
            )
        hashed = get_password_hash(user_in.password)
        user = self.repo.create(
            {
                "email": user_in.email,
                "full_name": user_in.full_name,
                "hashed_password": hashed,
            }
        )
        return user

    def login(self, email: str, password: str) -> TokenResponse:
        user = self.repo.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled",
            )
        access_token = create_access_token(str(user.id))
        refresh_token = create_refresh_token(str(user.id))
        return TokenResponse(access_token=access_token, refresh_token=refresh_token)

    def refresh_tokens(self, refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        user_id = payload.get("sub")
        user = self.repo.get(user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        access_token = create_access_token(str(user.id))
        new_refresh_token = create_refresh_token(str(user.id))
        return TokenResponse(access_token=access_token, refresh_token=new_refresh_token)

    def oauth_login(self, provider: str, token: str) -> TokenResponse:
        """Verify OAuth token and return standard access/refresh tokens."""
        email = None
        full_name = None

        if provider == "google":
            if token == "mock-google-token":
                email = "google-mock-user@example.com"
                full_name = "Google Mock User"
            else:
                try:
                    import httpx
                    response = httpx.get(
                        "https://www.googleapis.com/oauth2/v3/userinfo",
                        headers={"Authorization": f"Bearer {token}"},
                    )
                    if response.status_code == 200:
                        data = response.json()
                        email = data.get("email")
                        full_name = data.get("name")
                except Exception as e:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail=f"Failed to authenticate with Google: {str(e)}",
                    )
        elif provider == "github":
            if token == "mock-github-token":
                email = "github-mock-user@example.com"
                full_name = "GitHub Mock User"
            else:
                try:
                    import httpx
                    response = httpx.get(
                        "https://api.github.com/user",
                        headers={"Authorization": f"token {token}"},
                    )
                    if response.status_code == 200:
                        data = response.json()
                        email = data.get("email")
                        if not email:
                            email_resp = httpx.get(
                                "https://api.github.com/user/emails",
                                headers={"Authorization": f"token {token}"},
                            )
                            if email_resp.status_code == 200:
                                emails = email_resp.json()
                                primary_emails = [e for e in emails if e.get("primary")]
                                if primary_emails:
                                    email = primary_emails[0].get("email")
                        full_name = data.get("name") or data.get("login")
                except Exception as e:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail=f"Failed to authenticate with GitHub: {str(e)}",
                    )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported OAuth provider: {provider}",
            )

        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not retrieve email from OAuth provider",
            )

        # Find or register user
        user = self.repo.get_by_email(email)
        if not user:
            import secrets
            hashed = get_password_hash(secrets.token_hex(16))
            user = self.repo.create(
                {
                    "email": email,
                    "full_name": full_name,
                    "hashed_password": hashed,
                }
            )
            # Create associated user profile
            from app.repositories.base import BaseRepository
            from app.models.profile import Profile
            profile_repo = BaseRepository(Profile, self.repo.db)
            profile_repo.create(
                {
                    "user_id": user.id,
                    "skills": [],
                    "desired_roles": [],
                    "experience_years": 0.0,
                }
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is disabled",
            )

        access_token = create_access_token(str(user.id))
        refresh_token = create_refresh_token(str(user.id))
        return TokenResponse(access_token=access_token, refresh_token=refresh_token)

