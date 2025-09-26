from rest_framework import serializers
from .models import Company, Sector, Industry, ESGSector, Report, Purchase

class SectorSerializer(serializers.ModelSerializer):
    class Meta: model = Sector; fields = ["id","name"]

class IndustrySerializer(serializers.ModelSerializer):
    class Meta: model = Industry; fields = ["id","name"]

class ESGSectorSerializer(serializers.ModelSerializer):
    class Meta: model = ESGSector; fields = ["id","name"]

class CompanySerializer(serializers.ModelSerializer):
    sector = SectorSerializer()
    industry = IndustrySerializer()
    esg_sector = ESGSectorSerializer()
    class Meta:
        model = Company
        fields = ["id","isin","bse_symbol","nse_symbol","name","sector","industry","esg_sector",
                  "mcap","e_pillar","s_pillar","g_pillar","esg_pillar",
                  "positive_screen","negative_screen","controversy_rating",
                  "rating_numeric","esg_rating"]
