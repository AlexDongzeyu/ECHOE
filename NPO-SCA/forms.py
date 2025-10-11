from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, SubmitField, EmailField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Email, Length, Optional, EqualTo, ValidationError
import re

# Graceful fallback if the optional 'email_validator' package isn't available
try:
    import email_validator  # noqa: F401
    _EMAIL_VALIDATOR_AVAILABLE = True
except Exception:
    _EMAIL_VALIDATOR_AVAILABLE = False


class SimpleEmail:
    """Lightweight email validator used when 'email_validator' package is absent.

    Uses a conservative regex to catch obvious invalid addresses without external deps.
    """

    _pattern = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

    def __call__(self, form, field):
        value = field.data or ''
        if value and not self._pattern.match(value):
            raise ValidationError('Invalid email address.')


_EMAIL_VALIDATORS_OPTIONAL = [Optional(), Email()] if _EMAIL_VALIDATOR_AVAILABLE else [Optional(), SimpleEmail()]
_EMAIL_VALIDATORS_REQUIRED = [DataRequired(), Email()] if _EMAIL_VALIDATOR_AVAILABLE else [DataRequired(), SimpleEmail()]

class LetterForm(FlaskForm):
    topic = SelectField('Topic (Optional)', 
                        choices=[('', 'Choose a topic...'), 
                                ('academic', 'Academic Pressure'),
                                ('work', 'Work Stress'),
                                ('relationships', 'Relationships'),
                                ('mental', 'Mental Health'),
                                ('future', 'Future Anxiety'),
                                ('other', 'Other')],
                        validators=[Optional()])
    
    content = TextAreaField('Your Letter', 
                           validators=[DataRequired(), Length(min=10, max=5000)])
    
    reply_method = SelectField('How would you like to receive a reply? (Optional)',
                              choices=[('website', 'Check in Inbox on the website'),
                                      ('anonymous-email', 'Anonymous email from the team')],
                              validators=[Optional()])
    
    anonymous_email = EmailField('Anonymous Email',
                                validators=_EMAIL_VALIDATORS_OPTIONAL)
    
    submit = SubmitField('Send Letter')


class ResponseForm(FlaskForm):
    content = TextAreaField('Your Response', 
                           validators=[DataRequired(), Length(min=10, max=5000)])
    
    response_type = SelectField('Response Type',
                               choices=[('human', 'Human Only'),
                                       ('ai-assisted', 'AI Assisted'),
                                       ('hybrid', 'Hybrid (Include AI response)')],
                               validators=[DataRequired()])
    
    submit = SubmitField('Send Response')


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')


class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=64)])
    email = EmailField('Email', validators=_EMAIL_VALIDATORS_REQUIRED)
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8)])
    password2 = PasswordField('Repeat Password', 
                             validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')

    class Meta:
        # Disable CSRF for this form to support static-hosted signup page posting to Flask
        csrf = False


class PhysicalLetterForm(FlaskForm):
    topic = SelectField('Topic (Optional)', 
                       choices=[('', 'Choose a topic...'), 
                               ('academic', 'Academic Pressure'),
                               ('work', 'Work Stress'),
                               ('relationships', 'Relationships'),
                               ('mental', 'Mental Health'),
                               ('future', 'Future Anxiety'),
                               ('other', 'Other')],
                       validators=[Optional()])
    
    content = TextAreaField('Letter Content', 
                           validators=[DataRequired()])
    
    location = StringField('Mailbox Location', validators=[DataRequired()])
    
    reply_method = SelectField('Reply Method',
                              choices=[('none', 'No Reply Requested'),
                                      ('mail', 'Physical Mail'),
                                      ('email', 'Email')],
                              validators=[DataRequired()])
    
    contact_info = StringField('Contact Information (if applicable)',
                              validators=[Optional()])
    
    submit = SubmitField('Process Letter') 