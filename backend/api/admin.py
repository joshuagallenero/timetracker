from django.contrib import admin

from .models import TimeRecord, Project


class TimeRecordAdmin(admin.ModelAdmin):
    pass


class ProjectAdmin(admin.ModelAdmin):
    pass


admin.site.register(TimeRecord, TimeRecordAdmin)
admin.site.register(Project, ProjectAdmin)
