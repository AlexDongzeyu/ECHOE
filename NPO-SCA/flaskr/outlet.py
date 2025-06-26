from flask import (
    Blueprint, flash, g, redirect, render_template, request, url_for
)
from werkzeug.exceptions import abort

from flaskr.auth import login_required
from flaskr.db import get_db

bp = Blueprint('/', __name__)


@bp.route('/outlet')
def home():
    return render_template('pages/outlet.html')