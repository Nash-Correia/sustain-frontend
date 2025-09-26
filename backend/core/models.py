from django.db import models
from django.conf import settings

class Sector(models.Model):
    name = models.CharField(max_length=120, unique=True)
    def __str__(self): return self.name

class Industry(models.Model):
    name = models.CharField(max_length=160, unique=True)
    def __str__(self): return self.name

class ESGSector(models.Model):
    name = models.CharField(max_length=120, unique=True)
    def __str__(self): return self.name

class Company(models.Model):
    isin = models.CharField(max_length=20, unique=True)
    bse_symbol = models.CharField(max_length=20, null=True, blank=True, db_index=True)
    nse_symbol = models.CharField(max_length=20, null=True, blank=True, db_index=True)
    name = models.CharField("Company Name", max_length=255, unique=True, db_index=True)

    sector = models.ForeignKey(Sector, null=True, blank=True, on_delete=models.SET_NULL, related_name="companies")
    industry = models.ForeignKey(Industry, null=True, blank=True, on_delete=models.SET_NULL, related_name="companies")
    esg_sector = models.ForeignKey(ESGSector, null=True, blank=True, on_delete=models.SET_NULL, related_name="companies")

    mcap = models.DecimalField(max_digits=16, decimal_places=2, null=True, blank=True)

    e_pillar = models.PositiveSmallIntegerField(null=True, blank=True)
    s_pillar = models.PositiveSmallIntegerField(null=True, blank=True)
    g_pillar = models.PositiveSmallIntegerField(null=True, blank=True)
    esg_pillar = models.PositiveSmallIntegerField(null=True, blank=True)

    positive_screen = models.CharField(max_length=120, null=True, blank=True)
    negative_screen = models.CharField(max_length=120, null=True, blank=True)
    controversy_rating = models.CharField(max_length=50, null=True, blank=True)

    rating_numeric = models.PositiveSmallIntegerField(null=True, blank=True)  # "Rating" = 66 etc.
    esg_rating = models.CharField(max_length=2, null=True, blank=True)        # "B", "A", "AA", etc.

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["sector"]),
            models.Index(fields=["industry"]),
            models.Index(fields=["esg_sector"]),
            models.Index(fields=["mcap"]),
            models.Index(fields=["e_pillar","s_pillar","g_pillar","esg_pillar"]),
        ]

    def __str__(self): return f"{self.name} ({self.isin})"

# Reports + purchase flow (same structure as earlier)
class Report(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    company = models.ForeignKey(Company, null=True, blank=True, on_delete=models.SET_NULL, related_name="reports")
    sector = models.ForeignKey(Sector, null=True, blank=True, on_delete=models.SET_NULL, related_name="reports")
    description = models.TextField(blank=True)
    file = models.FileField(upload_to="reports/")
    price_inr = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    provider = models.CharField(max_length=20, default="razorpay")
    provider_order_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, default="created")
    amount_inr = models.PositiveIntegerField(default=0)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    report = models.ForeignKey(Report, on_delete=models.PROTECT)
    price_inr = models.PositiveIntegerField(default=0)

class Purchase(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="purchases")
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name="purchases")
    acquired_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ("user", "report")
