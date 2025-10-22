# Reply-to-Reply Feature Documentation

## Overview
This feature allows users to reply to volunteer responses, creating an ongoing conversation thread. Volunteers can see these replies and respond again, fostering deeper engagement and support.

## Features Implemented

### 1. **User Reply System**
- Users can reply to any volunteer response they receive
- Replies are displayed in chronological order under each volunteer response
- Users can submit multiple replies to continue the conversation

### 2. **Volunteer Panel Integration**
- Volunteers see all user replies when viewing a letter
- User replies are clearly marked with "New" badges if unread
- Replies are automatically marked as read when volunteers view them
- Previous conversation history is displayed for context

### 3. **Consistent UI Design**
All templates use the E.C.H.O.E brand colors and design patterns:
- **Deep Indigo** (`--deep-indigo`): Text and headings
- **Gentle Lavender** (`--gentle-lavender`): Volunteer responses
- **Soft Yellow** (`--soft-yellow`): User replies and call-to-action buttons
- **Warm White** (`--warm-white`): Backgrounds
- Rounded corners, soft shadows, and smooth transitions throughout

## Database Schema

### New Table: `user_reply`
```sql
CREATE TABLE user_reply (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    response_id INTEGER NOT NULL,  -- FK to response table
    letter_id INTEGER NOT NULL,    -- FK to letter table
    anon_user_id VARCHAR(64),      -- Anonymous user tracking
    is_read BOOLEAN DEFAULT 0,     -- Has volunteer read this?
    FOREIGN KEY(response_id) REFERENCES response(id),
    FOREIGN KEY(letter_id) REFERENCES letter(id)
);
```

## User Interface

### User View (response.html)
1. Original letter displayed at top
2. Volunteer responses shown below
3. For each volunteer response:
   - Response content
   - Previous user replies (if any)
   - "Reply to this response" button
   - Collapsible reply form

### Inbox View (inbox_thread.html)
- Shows complete conversation thread
- User replies appear indented below volunteer responses
- Reply count badge displayed

### Volunteer View (volunteer/respond.html)
- "Previous Conversation" section shows full history
- User replies highlighted with soft yellow background
- "New" badge on unread replies
- Replies automatically marked as read when viewed

## Routes

### User Routes
- `GET /response/<letter_id>` - View responses and reply interface
- `POST /response/<int:response_id>/reply` - Submit a user reply

### Volunteer Routes
- `GET /volunteer/letter/<letter_id>` - View letter and all replies (marks user replies as read)

## How It Works

### User Flow
1. User checks their response using their unique letter ID
2. Sees volunteer response(s)
3. Clicks "Reply to this response" button
4. Fills out reply form (5-2000 characters)
5. Submits reply
6. Reply is stored and volunteer can see it

### Volunteer Flow
1. Volunteer opens a letter to respond
2. Sees "Previous Conversation" section if replies exist
3. User replies are highlighted with "New" badge if unread
4. Volunteer reads context and crafts response
5. User replies are marked as read automatically

## Security & Privacy
- Users verified by anonymous cookie (`echoe_anon`)
- Users can only reply to responses on their own letters
- No personally identifiable information stored
- Consistent with E.C.H.O.E's privacy-first approach

## Migration Instructions

To enable this feature on your database:

```bash
# Navigate to NPO-SCA directory
cd NPO-SCA

# Run migration script
python migrate_user_replies.py
```

This will create the `user_reply` table without affecting existing data.

## Design Philosophy

### Consistency
- All reply interfaces use matching color schemes
- Typography and spacing follow existing patterns
- Icons from Font Awesome for visual consistency

### User Experience
- Progressive disclosure (reply form hidden until needed)
- Clear visual hierarchy (volunteer responses vs user replies)
- Mobile-responsive design
- Smooth animations and transitions

### Accessibility
- Proper ARIA labels on interactive elements
- Keyboard navigation support
- High contrast ratios for readability
- Form validation with clear error messages

## Future Enhancements
- Email notifications for new user replies
- Reply count in volunteer dashboard
- Search/filter by conversations with replies
- Export conversation threads

