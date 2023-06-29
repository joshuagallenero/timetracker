## Technologies used

- [Django](https://www.djangoproject.com/): The web framework for perfectionists with deadlines (Django builds better web apps with less code).
- [DRF](www.django-rest-framework.org/): A powerful and flexible toolkit for building Web APIs

## Installation

- Ensure you have python globally installed on your local machine. Version used is Python 3.11.
- Create a virtual env and activate it by running the following commands:
  ```bash
      $ python3 -m venv env
      $ source env/bin/activate
  ```
- Then, install the project requirements (make sure you are in the same directory as `requirements.txt`):
  ```bash
      $ pip install -r requirements.txt
  ```
- Run migrations:
  ```bash
      $ python manage.py makemigrations
      $ python manage.py migrate
  ```
- Run the server using the following command:
  ```bash
      $ python manage.py runserver
  ```
  You can now access the api service on your browser by visiting the url
  ```
      http://localhost:8000/api/
  ```
