from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, SubmitField, EmailField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Email, Length, Optional, EqualTo

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
                              choices=[('website', 'Check on website (you\'ll receive a reply code)'),
                                      ('anonymous-email', 'Anonymous email'),
                                      ('ai', 'AI-generated immediate response (plus human follow-up)')],
                              validators=[Optional()])
    
    anonymous_email = EmailField('Anonymous Email',
                                validators=[Optional(), Email()])
    
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
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8)])
    password2 = PasswordField('Repeat Password', 
                             validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')


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