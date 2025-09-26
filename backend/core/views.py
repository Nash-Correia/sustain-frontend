from rest_framework import generics, permissions
from .models import Company, Report, Purchase
from .serializers import CompanySerializer
from .filters import CompanyFilter

class CompanyListView(generics.ListAPIView):
    queryset = Company.objects.select_related("sector","industry","esg_sector").all().order_by("name")
    serializer_class = CompanySerializer
    filterset_class = CompanyFilter
    permission_classes = [permissions.AllowAny]
