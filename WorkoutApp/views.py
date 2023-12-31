from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from .forms import LoginForm, ExerciseForm
from .models import User, Exercise, Program, Workout
import json

# Create your views here.

@login_required
def client_view(request, client_name):
    if not request.user.is_superuser:
        return HttpResponseRedirect(reverse('index'))
    try:
        user = User.objects.get(username=client_name)
        exercises = Exercise.objects.all()
        context = {}
        context['client_name'] = client_name
        context['exercises'] = exercises
        return render(request, 'client.html', context)
    except:
        return render(request, 'error.html', {"error_msg": "Client does not exist"})

@login_required
def client_list(request, client_name):
    if not request.user.is_superuser:
        return HttpResponseRedirect(reverse('index'))
    clients = User.objects.filter(username__contains=client_name)[:10]
    obj = []
    for client in clients:
        obj.append(client.username)
    return HttpResponse(json.dumps(obj))

@login_required
def create_program(request):
    if not request.user.is_superuser:
        return HttpResponseRedirect(reverse('index'))
    if request.method == "POST":
        serialized_body = json.loads(request.body)
        Program.objects.create(program_name="New Program", program=serialized_body)
    context = {}
    exercises = Exercise.objects.all()
    context['exercises'] = exercises
    return render(request, 'create_program.html', context)

@login_required
def exercises_view(request):
    context = {}
    if request.method == "POST":
        form = ExerciseForm(request.POST)
        if form.is_valid():
            form = form.cleaned_data
            Exercise.objects.create(exercise_name=form['exercise_name'], description=form['description'], image=form['image'], video=form['video'])
    if request.user.is_superuser:
        form = ExerciseForm()
        context["form"] = form
    exercises = Exercise.objects.all()
    context["exercises"] = exercises 
    return render(request, "exercises.html", context)

@login_required
def index(request):
    context = {}
    if request.user.is_superuser:
        clients = User.objects.exclude(is_superuser=True)
        return render(request, "superuser.html", {"clients" : clients})
    else:
        user = request.user
        workout = None
        try:
            workout = user.Client.all()[1:][0]
            context["user"] = user
            context["workout"] = workout.workout
            context["notes"] = workout.notes
        except: 
            print("error")
        if request.method == "POST" and workout != None:
            body = json.loads(request.body)
            workout.workout = body
            workout.save()
        return render(request, "user.html", context)

def login_view(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            form = form.cleaned_data
            user = authenticate(request, username=form['username'], password=form['password'])
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse('index'))
            else:
                return HttpResponseRedirect(reverse('login_view'))
    else:
        form = LoginForm()
    return render(request, "login.html", {"form": form})

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('login_view'))

@login_required
def program_view(request, program_id):
    if not request.user.is_superuser:
        return HttpResponseRedirect(reverse('index'))
    program = Program.objects.get(id=program_id)
    if request.method == "POST":
        users = json.loads(request.body)
        for user in users:
            current = User.objects.get(username=user)
            Workout.objects.create(client=current, notes="Have a good day!", workout=program.program)
    context = {}
    context['program'] = program.program
    return render(request, 'program.html', context)

@login_required
def programs(request): 
    if not request.user.is_superuser:
        return HttpResponseRedirect(reverse('index'))
    context = {}
    programs = Program.objects.all()
    context['programs'] = programs
    return render(request, 'programs.html', context)

