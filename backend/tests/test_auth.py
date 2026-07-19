def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "testuser@example.com",
            "password": "strongpassword123",
            "full_name": "Test User",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert data["full_name"] == "Test User"
    assert "id" in data


def test_register_existing_user_fails(client):
    user_data = {
        "email": "duplicate@example.com",
        "password": "password123",
        "full_name": "Duplicate User",
    }
    response1 = client.post("/api/v1/auth/register", json=user_data)
    assert response1.status_code == 201

    response2 = client.post("/api/v1/auth/register", json=user_data)
    assert response2.status_code == 409
    assert "already exists" in response2.json()["detail"]


def test_login_user(client):
    user_data = {
        "email": "loginuser@example.com",
        "password": "loginpassword",
        "full_name": "Login User",
    }
    client.post("/api/v1/auth/register", json=user_data)

    response = client.post(
        "/api/v1/auth/login",
        json={"email": user_data["email"], "password": user_data["password"]},
    )
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens
    assert tokens["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_get_current_user_me(client):
    user_data = {
        "email": "meuser@example.com",
        "password": "mepassword",
        "full_name": "Me User",
    }
    client.post("/api/v1/auth/register", json=user_data)

    login_resp = client.post(
        "/api/v1/auth/login",
        json={"email": user_data["email"], "password": user_data["password"]},
    )
    token = login_resp.json()["access_token"]

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["full_name"] == user_data["full_name"]


def test_oauth_login_mock(client):
    response = client.post(
        "/api/v1/auth/oauth",
        json={"provider": "google", "token": "mock-google-token"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
