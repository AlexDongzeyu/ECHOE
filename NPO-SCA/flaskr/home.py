from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db

bp = Blueprint('/', __name__)


@bp.route('/')
def home():
    return render_template('pages/home.html')

@bp.route('/outlet')
def outlet():
    return render_template('pages/outlet.html')

@bp.route('/read')
def read():
    return render_template('pages/read.html')

@bp.route('/about')
def about():
    return render_template('pages/about.html')

@bp.route('/contact')
def contact():
    return render_template('pages/contact.html')

@bp.route('/login')
def login():
    return render_template('pages/login.html')