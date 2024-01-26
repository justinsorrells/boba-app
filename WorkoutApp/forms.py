from django import forms

class LoginForm(forms.Form):
    username = forms.CharField(label="Username", max_length=50, widget=forms.TextInput(attrs={'class': 'form-control'}))
    password = forms.CharField(label="Password", max_length=50, widget=forms.TextInput(attrs={'class': 'form-control', 'type': 'password'}))

class ExerciseForm(forms.Form):
    exercise_name = forms.CharField(label="Exercise Name", max_length=75, widget=forms.TextInput(attrs={'class': 'form-control'}))
    description = forms.CharField(label="Exercise Description", max_length=500, widget=forms.TextInput(attrs={'class': 'form-control'}))
    image = forms.CharField(label="Image URL", max_length=500, widget=forms.TextInput(attrs={'class': 'form-control'}))
    video = forms.CharField(label="Video URL", max_length=500, widget=forms.TextInput(attrs={'class': 'form-control'}))
