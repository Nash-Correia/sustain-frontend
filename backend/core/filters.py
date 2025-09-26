import django_filters as df
from django.db.models import Q
from .models import Company

class CompanyFilter(df.FilterSet):
    q = df.CharFilter(method="search")
    sector = df.CharFilter(field_name="sector__name", lookup_expr="iexact")
    industry = df.CharFilter(field_name="industry__name", lookup_expr="iexact")
    esg_sector = df.CharFilter(field_name="esg_sector__name", lookup_expr="iexact")
    min_mcap = df.NumberFilter(field_name="mcap", lookup_expr="gte")
    max_mcap = df.NumberFilter(field_name="mcap", lookup_expr="lte")
    min_esg = df.NumberFilter(field_name="esg_pillar", lookup_expr="gte")
    max_esg = df.NumberFilter(field_name="esg_pillar", lookup_expr="lte")
    positive_screen = df.CharFilter(field_name="positive_screen", lookup_expr="iexact")
    negative_screen = df.CharFilter(field_name="negative_screen", lookup_expr="iexact")
    esg_rating = df.CharFilter(field_name="esg_rating", lookup_expr="iexact")

    def search(self, queryset, name, value):
        if not value:
            return queryset
        value = value.strip()
        return queryset.filter(
            Q(name__icontains=value) |
            Q(nse_symbol__icontains=value) |
            Q(bse_symbol__icontains=value) |
            Q(isin__icontains=value)
        )

    class Meta:
        model = Company
        fields = []
