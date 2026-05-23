def test_create_task(client, auth_headers):
    response = client.post("/tasks", json={
        "title": "Buy groceries",
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Buy groceries"
    assert data["completed"] is False
    assert "id" in data


def test_create_task_with_description(client, auth_headers):
    response = client.post("/tasks", json={
        "title": "Read a book",
        "description": "Finish the last chapter",
    }, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["description"] == "Finish the last chapter"


def test_get_tasks_empty(client, auth_headers):
    response = client.get("/tasks", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["tasks"] == []
    assert data["total"] == 0


def test_get_tasks_returns_own_tasks(client, auth_headers):
    client.post("/tasks", json={"title": "Task A"}, headers=auth_headers)
    client.post("/tasks", json={"title": "Task B"}, headers=auth_headers)

    response = client.get("/tasks", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["tasks"]) == 2


def test_get_tasks_filter_completed(client, auth_headers):
    r1 = client.post("/tasks", json={"title": "Task A"}, headers=auth_headers)
    client.post("/tasks", json={"title": "Task B"}, headers=auth_headers)

    task_id = r1.json()["id"]
    client.put(f"/tasks/{task_id}", json={"completed": True}, headers=auth_headers)

    completed = client.get("/tasks?completed=true", headers=auth_headers)
    assert completed.json()["total"] == 1

    active = client.get("/tasks?completed=false", headers=auth_headers)
    assert active.json()["total"] == 1


def test_get_tasks_pagination(client, auth_headers):
    for i in range(12):
        client.post("/tasks", json={"title": f"Task {i}"}, headers=auth_headers)

    page1 = client.get("/tasks?page=1&limit=10", headers=auth_headers)
    assert len(page1.json()["tasks"]) == 10

    page2 = client.get("/tasks?page=2&limit=10", headers=auth_headers)
    assert len(page2.json()["tasks"]) == 2


def test_get_single_task(client, auth_headers):
    created = client.post("/tasks", json={"title": "Single task"}, headers=auth_headers)
    task_id = created.json()["id"]

    response = client.get(f"/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Single task"


def test_get_task_not_found(client, auth_headers):
    response = client.get("/tasks/9999", headers=auth_headers)
    assert response.status_code == 404


def test_update_task_completed(client, auth_headers):
    created = client.post("/tasks", json={"title": "Finish report"}, headers=auth_headers)
    task_id = created.json()["id"]

    response = client.put(f"/tasks/{task_id}", json={"completed": True}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["completed"] is True


def test_update_task_title(client, auth_headers):
    created = client.post("/tasks", json={"title": "Old title"}, headers=auth_headers)
    task_id = created.json()["id"]

    response = client.put(f"/tasks/{task_id}", json={"title": "New title"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "New title"


def test_delete_task(client, auth_headers):
    created = client.post("/tasks", json={"title": "To be deleted"}, headers=auth_headers)
    task_id = created.json()["id"]

    delete_response = client.delete(f"/tasks/{task_id}", headers=auth_headers)
    assert delete_response.status_code == 204

    get_response = client.get(f"/tasks/{task_id}", headers=auth_headers)
    assert get_response.status_code == 404


def test_cannot_access_other_users_task(client):
    client.post("/register", json={
        "email": "user1@example.com",
        "username": "user1",
        "password": "pass1234",
    })
    client.post("/register", json={
        "email": "user2@example.com",
        "username": "user2",
        "password": "pass1234",
    })

    login1 = client.post("/login", json={"email": "user1@example.com", "password": "pass1234"})
    headers1 = {"Authorization": f"Bearer {login1.json()['access_token']}"}

    login2 = client.post("/login", json={"email": "user2@example.com", "password": "pass1234"})
    headers2 = {"Authorization": f"Bearer {login2.json()['access_token']}"}

    created = client.post("/tasks", json={"title": "User1 private task"}, headers=headers1)
    task_id = created.json()["id"]

    response = client.get(f"/tasks/{task_id}", headers=headers2)
    assert response.status_code == 404