from django.contrib import admin
from django import forms
from .models import EnvironmentVariable, VariableVersion


# Inline for VariableVersion
class VariableVersionInline(admin.TabularInline):
    model = VariableVersion
    extra = 0  # No extra empty rows
    fields = ('version', 'value', 'created_at', 'created_by')
    readonly_fields = ('created_at',)

    def get_formset_kwargs(self, request, obj=None, **kwargs):
        # Pass the request object to the formset so we can use it in the form initialization
        kwargs = super().get_formset_kwargs(request, obj, **kwargs)
        kwargs['request'] = request
        return kwargs

@admin.register(EnvironmentVariable)
class EnvironmentVariableAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'latest_version', 'created_by', 'created_at', 'updated_at')
    list_filter = ('created_by', 'created_at', 'updated_at')
    list_display_links = ['name']  # Make the `name` field clickable
    search_fields = ('name', 'description')
    readonly_fields = ('latest_version', 'created_at', 'updated_at')

    # Organize fields in sections
    fieldsets = (
        ("Variable Information", {
            'fields': ('name', 'description', 'latest_version')
        }),
        ("Metadata", {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
    )

    inlines = [VariableVersionInline]

    # Save the created_by as the current user when creating the EnvironmentVariable
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user  # Set created_by to the current user when creating EnvironmentVariable
        obj.save()

@admin.register(VariableVersion)
class VariableVersionAdmin(admin.ModelAdmin):
    list_display = ('id', 'variable', 'version', 'value', 'created_at', 'created_by')
    list_filter = ('created_by', 'created_at')
    search_fields = ('variable__name', 'version', 'value')
    readonly_fields = ('variable', 'version', 'created_at', 'created_by')

    # Organize fields in sections
    fieldsets = (
        ("Version Information", {
            'fields': ('variable', 'version', 'value')
        }),
        ("Metadata", {
            'fields': ('created_by', 'created_at')
        }),
    )

    # Save the created_by as the current user when creating a new version
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = obj.variable.created_by  # Set created_by to the created_by of the related EnvironmentVariable
        obj.save()
