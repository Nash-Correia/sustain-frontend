# core/admin.py
from django.contrib import admin
from .models import Sector, Company, Report, Order, OrderItem, Purchase
admin.site.register([Sector, Company, Report, Order, OrderItem, Purchase])
