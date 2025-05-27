from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.conf import settings
from tenants.models import Tenant

User = get_user_model()

class Template(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail_url = models.URLField()
    preview_url = models.URLField()
    category = models.CharField(max_length=100)
    features = models.JSONField(default=list)
    is_premium = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class WebsiteConfig(models.Model):
    DEPLOYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    domain_name = models.CharField(max_length=255, unique=True)
    logo = models.URLField(null=True, blank=True)
    color_scheme = models.CharField(max_length=50, null=True, blank=True)
    secondary_color_scheme = models.CharField(max_length=50, null=True, blank=True)
    deployment_status = models.CharField(
        max_length=20,
        choices=DEPLOYMENT_STATUS_CHOICES,
        default='pending'
    )
    deployment_url = models.URLField(null=True, blank=True)
    last_deployed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    # Analytics settings
    google_analytics_id = models.CharField(max_length=50, null=True, blank=True)
    google_tag_manager_id = models.CharField(max_length=50, null=True, blank=True)
    facebook_pixel_id = models.CharField(max_length=50, null=True, blank=True)
    custom_analytics_script = models.TextField(null=True, blank=True)

    # Cookie settings
    cookie_enabled = models.BooleanField(default=True)
    cookie_banner_text = models.TextField(default='We use cookies to enhance your experience.')
    cookie_accept_button_text = models.CharField(max_length=50, default='Accept All')
    cookie_decline_button_text = models.CharField(max_length=50, default='Decline All')
    cookie_policy_url = models.URLField(null=True, blank=True)
    cookie_duration = models.IntegerField(default=365)  # in days
    cookie_categories = models.JSONField(default=dict)

    def clean(self):
        # Validate domain name format
        if self.domain_name:
            validator = URLValidator()
            try:
                validator(f'https://{self.domain_name}')
            except ValidationError:
                raise ValidationError({'domain_name': 'Invalid domain name format'})

    def __str__(self):
        return f"{self.company_name} ({self.domain_name})"

    class Meta:
        ordering = ['-created_at']

class Website(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='websites')
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    template = models.CharField(max_length=100)
    content = models.JSONField(default=dict)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Supabase specific fields
    supabase_id = models.CharField(max_length=100, blank=True, null=True)
    supabase_url = models.URLField(blank=True, null=True)
    
    # Website settings
    settings = models.JSONField(default=dict, blank=True)
    
    # SEO settings
    meta_title = models.CharField(max_length=100, blank=True)
    meta_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=200, blank=True)
    
    # Social media
    facebook_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    
    class Meta:
        verbose_name = _('Website')
        verbose_name_plural = _('Websites')
        unique_together = ('tenant', 'slug')
        
    def __str__(self):
        return f"{self.tenant.name} - {self.name}"

class Page(models.Model):
    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name='pages')
    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class PreviewEmail(models.Model):
    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name='preview_emails')
    recipient_email = models.EmailField()
    sent_at = models.DateTimeField(auto_now_add=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    preview_url = models.URLField()

    def __str__(self):
        return f"Preview for {self.website.name} to {self.recipient_email}"

    class Meta:
        ordering = ['-sent_at']

class PreviewEmailTracker(models.Model):
    preview_email = models.ForeignKey(PreviewEmail, on_delete=models.CASCADE, related_name='trackers')
    opened_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Tracker for {self.preview_email}"

    class Meta:
        ordering = ['-opened_at']

class BulkWebsiteCreator(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    company_names = models.JSONField()  # List of company names
    domain_names = models.JSONField()   # List of domain names
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Bulk creation by {self.user.email} - {self.status}"

    class Meta:
        ordering = ['-created_at']
