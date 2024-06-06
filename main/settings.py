from pathlib import Path
from datetime import timedelta
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-%9fjwm5fs-i8z+^f=#v=*v4jgk+*_q!p=!a^#^yt%)bloh%8)s'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['192.168.82.27','127.0.0.1','localhost','10.100.10.43']
# CORS_ALLOW_ALL_ORIGINS = Tru,,e
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", 
    "http://localhost",
]
ALLOWED_HOSTS=['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'api',
    'farmers',
    'cws',
    'transactions',
    'loan',
    'rest_framework.authtoken',
    'django.contrib.auth',
    
]
INSTALLED_APPS += [
    "azure_signin",
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware'
]

# AZURE_SIGNIN = {
#     "CLIENT_ID": "eedef855-b7e4-47b0-a212-4f8b6344834b",  # Mandatory
#     "CLIENT_SECRET": "9zl8Q~WbxGOjnXUOA4~EPgwFXgIH1QLSLVQEyasq",  # Mandatory
#     "TENANT_ID": "4b030d92-7ebd-4d2f-af2c-03b8af269059",  # Mandatory
#     "SAVE_ID_TOKEN_CLAIMS": True,  # Optional, default is False.
#     "RENAME_ATTRIBUTES": [
#         ("employeeNumber", "employee_id"),
#         ("affiliationNumber", "omk2"),
#     ],  # Optional
#     "REDIRECT_URI": "https://10.100.10.43/azure-signin/callback",  # Optional
#     "SCOPES": ["User.Read.All"],  # Optional
#     "AUTHORITY": "https://login.microsoftonline.com/" + "4b030d92-7ebd-4d2f-af2c-03b8af269059",  # Optional Or https://login.microsoftonline.com/common if multi-tenant
#     "LOGOUT_REDIRECT_URI": "https://10.100.10.43/logout",  # Optional
#     "PUBLIC_URLS": ["<public:view_name>",]  # Optional, public views accessible by non-authenticated users
# }

AZURE_SIGNIN = {
    "CLIENT_ID": "dfe46435-d6ce-4d0b-96fa-30bbced62f5e",
    "CLIENT_SECRET": "xLY8Q~vynRfqgHv82t63CtyVhG6InY-G_4.bTcWJ",
    "TENANT_ID": "4b030d92-7ebd-4d2f-af2c-03b8af269059",
    "REDIRECT_URI": "http://127.0.0.1:8000/azure-signin/callback",
    "LOGOUT_REDIRECT_URI": "https://127.0.0.1:8000/logout",
    "AUTHORITY": "https://login.microsoftonline.com/4b030d92-7ebd-4d2f-af2c-03b8af269059",
}

AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "azure_signin.backends.AzureSigninBackend",
]

LOGIN_URL = "azure_signin:login"
LOGIN_REDIRECT_URL = "/" # Or any other endpoint
LOGOUT_REDIRECT_URL = LOGIN_REDIRECT_URL

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'azure_signin': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=2),  
    'REFRESH_TOKEN_LIFETIME': timedelta(days=14),  
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=7),
    'SLIDING_TOKEN_LIFETIME': timedelta(days=14),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_EXP_CLAIM': 'exp',
    'ROTATE_REFRESH_TOKENS': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}

ROOT_URLCONF = 'main.urls'




CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_CREDENTIALS = True


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'main.wsgi.application'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'cws_transaction',
        'USER':'root',
        'PASSWORD':'pass',
        'HOST':'localhost',
        'PORT':'3306',
        'OPTIONS':{
            'charset':'utf8mb4',
            "init_command": "SET default_storage_engine=INNODB",
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}



AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/




# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'api.CustomUser'

# REACT_APP_BUILD_PATH = "cws-transactions-frontend/dist"

CSRF_TRUSTED_ORIGINS = ['http://127.0.0.1:8000']

CSRF_EXEMPT_URLS = [
    r'^/api/.*'
]

CSRF_COOKIE_SECURED = True 
CSRF_COOKIE_SAMESITE = 'Strict'  
CSRF_COOKIE_AGE = 86400

