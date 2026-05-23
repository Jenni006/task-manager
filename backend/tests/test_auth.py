def test_register_success(client):
    response = client.post("/register", json={
        "email": "jenny@example.com",
        "username": "jenny",
        "password": "secret123",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "jenny@example.com"
    assert data["username"] == "jenny"
    assert "id" in data
    assert "password" not in data


def test_register_duplicate_email(client, registered_user):
    response = client.post("/register", json={
        "email": registered_user["email"],
        "username": "differentuser",
        "password": "password123",
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_register_duplicate_username(client, registered_user):
    response = client.post("/register", json={
        "email": "different@example.com",
        "username": registered_user["username"],
        "password": "password123",
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already taken"


def test_login_success(client, registered_user):
    response = client.post("/login", json={
        "email": registered_user["email"],
        "password": registered_user["password"],
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, registered_user):
    response = client.post("/login", json={
        "email": registered_user["email"],
        "password": "wrongpassword",
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_login_unknown_email(client):
    response = client.post("/login", json={
        "email": "ghost@example.com",
        "password": "irrelevant",
    })
    assert response.status_code == 401


def test_protected_route_without_token(client):
    response = client.get("/tasks")
    assert response.status_code == 403