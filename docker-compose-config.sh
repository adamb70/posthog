#!/bin/bash

source env/bin/activate 2> /dev/null || source venv/bin/activate 2> /dev/null # look for a virtual env
pip3 install pyyaml
echo
python3 docker-compose-config.py
