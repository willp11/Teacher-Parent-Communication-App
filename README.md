# Teacher Parent Communication App

## Demo Users

To demo the application, visit https://teacher-parent-communication-app.vercel.app/

In order to use the chat and video call functionality:

- Create a new account.
- Select teacher account type.
- Create a class.
- Add a student to the class.
- Write down the parental invite code on the student's portfolio page.
- Create another account.
- Select parent account type.
- Add a child to the account using the invite code.

Now, you can login to two separate instances of the app, either by using two different browsers or an incognito tab.
Go to the chat hub page, find the other account in the contact's list and click the chat or video call icons to go to the chat rooms.

## Technology used

### Backend

Django - Python web development framework.
Celery - Asynchronous task queue/job queue.
Redis - Message broker between Django and Celery. Store for Django Channels to implement WebSockets.

In production:
Gunicorn used for serving HTTP requests.
Daphne used for serving WebSocket connections.

(You do not need to use Gunicorn as Daphne can handle both HTTP and WS)

### Frontend

React JS
Tailwind CSS

## Running the application

### Backend

To run the backend, you must be running a postgresql database that the app can connect to.

Create a .env file inside the root directory with the following fields:

```
DB_HOST=db
DB_NAME=app
DB_USER=postgres
DB_PASS=supersecretpassword
DB_PORT=5432
POSTGRES_DB=app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=supersecretpassword
DJANGO_ALLOWED_HOSTS=0.0.0.0,localhost,127.0.0.1
DJANGO_SECRET_KEY=
DEBUG=False
```

In production, DEBUG must be False.

You can generate a django secret key using the following command:

```
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

Then, use docker-compose to create the containers.

```
docker-compose up --build
```

### Frontend

Inside the frontend directory, create a .env.local file with the following fields:

```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_WS_URL=ws://localhost:8000
```

You may need to use http://127.0.0.1 instead of localhost.

Then, install the dependencies and run the server.

```
npm install
npm start
```