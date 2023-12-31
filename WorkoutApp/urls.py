from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("client/<str:client_name>", views.client_view, name="client_view"),
    path("client_search/<str:client_name>", views.client_list, name="client_list"), 
    path("create_program/", views.create_program, name="create_program_view"),
    path("exercises", views.exercises_view, name="exercises_view"),
    path("login/", views.login_view, name="login_view"),
    path("logout/", views.logout_view, name="logout_view"),
    path("program/<int:program_id>", views.program_view, name="program_view"),
    path("programs/", views.programs, name="programs"),
]