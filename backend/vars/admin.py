# vars/admin.py
from django.contrib import admin
from .models import EnvironmentVariable, VariableVersion

@admin.register(EnvironmentVariable)
class EnvironmentVariableAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'latest_version', 'created_by', 'created_at', 'updated_at')
    list_filter = ('created_by', 'created_at', 'updated_at')
    list_display_links = ['name']  # Make the `name` field clickable
    search_fields = ('name', 'description')
    readonly_fields = ('latest_version', 'created_at', 'updated_at', 'created_by')

    # Organize fields in sections
    fieldsets = (
        ("Variable Information", {
            'fields': ('name', 'description', 'latest_version')
        }),
        ("Metadata", {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
    )

    # Display related VariableVersions inline
    class VariableVersionInline(admin.TabularInline):
        model = VariableVersion
        extra = 0  # No extra empty rows
        fields = ('version', 'value', 'created_at', 'created_by')
        readonly_fields = ('version', 'value', 'created_at', 'created_by')
        can_delete = False

    inlines = [VariableVersionInline]

    # Save the created_by as the current user
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.save()

@admin.register(VariableVersion)
class VariableVersionAdmin(admin.ModelAdmin):
    list_display = ('id', 'variable', 'version', 'value', 'created_at', 'created_by')
    list_filter = ('created_by', 'created_at')
    search_fields = ('variable__name', 'version', 'value')
    readonly_fields = ('variable', 'version', 'created_by', 'created_at')
    
    # Organize fields in sections
    fieldsets = (
        ("Version Information", {
            'fields': ('variable', 'version', 'value')
        }),
        ("Metadata", {
            'fields': ('created_by', 'created_at')
        }),
    )
    
    # Set created_by automatically when saving a new version
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.save()
