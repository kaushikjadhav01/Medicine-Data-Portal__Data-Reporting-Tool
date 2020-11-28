from __future__ import absolute_import

import os

from celery import Celery
from celery.schedules import crontab

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MPP_API.settings')

app = Celery('MPP_API')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

app.conf.beat_schedule = {
    'every-quarter': {
        'task': 'api.tasks.next_quarter',
        'schedule': crontab(minute=0,hour=0,day_of_month='1',month_of_year='*/3'),
        'args': (),
    }
}

# app.control.purge()

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()