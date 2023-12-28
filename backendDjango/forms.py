from django import forms
from .models import Recipe

class RecipeForm(forms.ModelForm):
    class Meta:
        model = Recipe
        fields = ['title', 'ingredients', 'instructions']
        labels = {'title': 'Title', 'ingredients': 'Ingredients', 'instructions': 'Instructions'}
        widgets = {'ingredients': forms.Textarea(attrs={'cols': 80}), 'instructions': forms.Textarea(attrs={'cols': 80})}
