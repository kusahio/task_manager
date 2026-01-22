# tests/test_user.py
def test_create_user(client):

    response = client.post(
        '/api/v1/users/',
        json={
            'email': 'test@example.com',
            'name': 'Test User',
            'password': 'password123'
        }
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data['email'] == 'test@example.com'
    assert data['name'] == 'Test User'
    assert 'id' in data
    # Verificar que no devuelve el password
    assert 'password' not in data
    assert 'hashed_password' not in data

def test_create_user_missing_fields(client):
    '''
    Test para verificar que falla si faltan campos requeridos
    '''
    response = client.post(
        '/api/v1/users/',
        json={
            'email': 'test@example.com'
            # Falta name y password
        }
    )
    
    assert response.status_code == 422  # Unprocessable Entity

def test_create_user_invalid_email(client):
    '''
    Test para verificar validación de email
    '''
    response = client.post(
        '/api/v1/users/',
        json={
            'email': 'not-an-email',
            'name': 'Test User',
            'password': 'password123'
        }
    )
    
    # Pydantic valida el formato del email automáticamente
    assert response.status_code == 422

def test_login_success(client):
    client.post(
        '/api/v1/users/',
        json={
            'email' : 'login@example.com',
            'name': 'Login User',
            'password': 'mypassword123'
        }
    )

    response = client.post(
        '/api/v1/users/login',
        json={
            'email': 'login@example.com',
            'password': 'mypassword123'
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert 'access_token' in data
    assert data['token_type'] == 'bearer'

    # assert data['message'] == 'Inicio de sesion exitoso'
    # assert data['user']['email'] == 'login@example.com'
    # assert data['user']['name'] == 'Login User'

def test_login_wrong_password(client):
    # 1. Crear usuario
    client.post(
        '/api/v1/users/',
        json={
            'email' : 'user@example.com',
            'name': 'User',
            'password': 'correctpassword'
        }
    )

    # 2. Intentar login con password incorrecto
    response = client.post(
        '/api/v1/users/login',
        json={
            'email' : 'user@example.com',
            'password' : 'incorrectpassword'
        }
    )

    assert response.status_code == 401
    assert response.json()['detail'] == 'Email o Contraseña incorrectos'

def test_login_nonexistent_user(client):
    response = client.post(
        '/api/v1/users/login',
        json={
            'email' : 'noexiste@example.com',
            'password' : 'somepassword'
        }
    )

    assert response.status_code == 401
    assert response.json()['detail'] == 'Email o Contraseña incorrectos'

def test_prevent_duplicate_email(client):
    email = 'duplicate@example.com'

    response1= client.post(
        '/api/v1/users/',
        json={
            'email' : email,
            'name' : 'First User',
            'password' : 'password123'
        }
    )

    assert response1.status_code == 201

    response2 = client.post(
        '/api/v1/users/',
        json={
            'email' : email,
            'name' : 'Second User',
            'password' : 'password456'
        }
    )

    assert response2.status_code == 400
    assert response2.json()['detail'] == 'El email ya existe'