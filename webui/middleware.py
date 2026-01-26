from django.utils import translation

class UserLanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            lang = getattr(request.user.profile, "language", None)
            if lang:
                translation.activate(lang)
                request.session['django_language'] = lang

        response = self.get_response(request)
        return response
