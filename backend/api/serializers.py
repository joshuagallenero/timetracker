from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Project, TimeRecord


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]


class RegisterUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate_email(self, value):
        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return lower_email

    def create(self, validated_data):
        email = validated_data.get("email")
        last_name = validated_data.get("last_name")
        first_name = validated_data.get("first_name")

        user = User(
            email=email,
            username=email,
            last_name=last_name,
            first_name=first_name,
        )
        user.set_password(validated_data["password"])
        user.save()

        return user


class TimeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeRecord
        fields = [
            "id",
            "description",
            "project",
            "time_started",
            "time_ended",
            "duration",
        ]
        extra_kwargs = {"duration": {"read_only": True}}

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user
        validated_data["user"] = user
        return super().create(validated_data)


class ProjectSerializer(serializers.ModelSerializer):
    records = serializers.SerializerMethodField()

    def get_records(self, obj):
        user = self.context["request"].user

        records = TimeRecord.objects.filter(user=user).order_by("-id")
        return TimeRecordSerializer(records, many=True, context={"user": user}).data

    class Meta:
        model = Project
        fields = ["id", "name", "records"]
        extra_kwargs = {"users": {"read_only": True}}
