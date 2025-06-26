#!/bin/bash
cd /home/site/wwwroot
export PYTHONPATH=/home/site/wwwroot:/home/site/wwwroot/NPO-SCA
gunicorn --bind 0.0.0.0:8000 --timeout 600 --workers 4 app:application 