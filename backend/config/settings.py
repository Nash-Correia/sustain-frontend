INSTALLED_APPS = [
  # ...
  "corsheaders","rest_framework", "django_filters", "core",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",              # must be first
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",       # optional, if serving static files
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOW_ALL_ORIGINS = True  # or lock to your frontend origin(s)

DATABASES = {
  "default": {
    "ENGINE": "django.db.backends.postgresql",
    "NAME": "yourdb",
    "USER": "youruser",
    "PASSWORD": "yourpass",
    "HOST": "localhost",
    "PORT": "5432",
  }
}

REST_FRAMEWORK = {
  'DEFAULT_AUTHENTICATION_CLASSES': [
      'rest_framework.authentication.SessionAuthentication',
      'rest_framework.authentication.TokenAuthentication',
  ],
  "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
  "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
  "PAGE_SIZE": 25,
}
