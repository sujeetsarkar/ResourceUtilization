py -m venv virtualenv
pip install -r requirements.txt
flask run
pip freeze > requirements.txt
