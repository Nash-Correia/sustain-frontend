from django.core.management.base import BaseCommand
from decimal import Decimal, InvalidOperation
import pandas as pd
from core.models import Sector, Industry, ESGSector, Company

def as_str(x):
    if pd.isna(x): return None
    s = str(x).strip()
    if s.endswith(".0"):  # e.g., 542772.0 from Excel
        try:
            if float(s) == int(float(s)):
                return str(int(float(s)))
        except: pass
    return s if s else None

def as_int(x):
    if pd.isna(x): return None
    try: return int(x)
    except: 
        try: return int(float(x))
        except: return None

def as_dec(x):
    if pd.isna(x): return None
    try: return Decimal(str(x))
    except InvalidOperation: return None

class Command(BaseCommand):
    help = "Import Website.xlsx (Sheet1) into Postgres Companies/Sectors/Industries"

    def add_arguments(self, parser):
        parser.add_argument("--file", required=True, help="Path to Website.xlsx")
        parser.add_argument("--sheet", default="Sheet1")

    def handle(self, *args, **opts):
        df = pd.read_excel(opts["file"], sheet_name=opts["sheet"])
        # Expected columns exist check (soft)
        required = ["ISIN","Company Name","Sector","Industry","ESG Sector"]
        missing = [c for c in required if c not in df.columns]
        if missing:
            self.stdout.write(self.style.WARNING(f"Missing columns: {missing}. Continuing with what exists."))

        created, updated = 0, 0
        for _, r in df.iterrows():
            isin = as_str(r.get("ISIN"))
            if not isin:
                # Fallback to unique name if no ISIN
                self.stdout.write(self.style.WARNING("Row without ISIN; skipping."))
                continue

            sector = None
            sname = as_str(r.get("Sector"))
            if sname: sector, _ = Sector.objects.get_or_create(name=sname)

            industry = None
            iname = as_str(r.get("Industry"))
            if iname: industry, _ = Industry.objects.get_or_create(name=iname)

            esg_sector = None
            esgname = as_str(r.get("ESG Sector"))
            if esgname: esg_sector, _ = ESGSector.objects.get_or_create(name=esgname)

            defaults = {
                "bse_symbol": as_str(r.get("BSE Symbol")),
                "nse_symbol": as_str(r.get("NSE Symbol")),
                "name": as_str(r.get("Company Name")) or isin,
                "sector": sector,
                "industry": industry,
                "esg_sector": esg_sector,
                "mcap": as_dec(r.get("Mcap")),
                "e_pillar": as_int(r.get("E Pillar")),
                "s_pillar": as_int(r.get("S Pillar")),
                "g_pillar": as_int(r.get("G Pillar")),
                "esg_pillar": as_int(r.get("ESG Pillar")),
                "positive_screen": as_str(r.get("Positive Screen")),
                "negative_screen": as_str(r.get("Negative Screen")),
                "controversy_rating": as_str(r.get("Controversy Rating")),
                "rating_numeric": as_int(r.get("Rating")),
                "esg_rating": as_str(r.get("ESG Rating")),
            }

            obj, is_created = Company.objects.update_or_create(isin=isin, defaults=defaults)
            created += int(is_created); updated += int(not is_created)

        self.stdout.write(self.style.SUCCESS(f"Done. Created {created}, updated {updated}."))
