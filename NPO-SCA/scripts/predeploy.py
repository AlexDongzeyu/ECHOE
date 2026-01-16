import os
import sqlite3
from contextlib import closing

from sqlalchemy import text

# NOTE:
# This script is used by Render's `preDeployCommand` (see `render.yaml`).
# It applies migrations (or falls back to `create_all`) and optionally migrates
# an old SQLite DB into Postgres on first boot.

from app import app, db  # type: ignore
from models import (  # type: ignore
    Event,
    Letter,
    PhysicalMailbox,
    Post,
    Response,
    User,
    UserRole,
)


def ensure_sqlite_dirs() -> None:
    uri = app.config.get("SQLALCHEMY_DATABASE_URI", "")
    if uri.startswith("sqlite:///"):
        path = uri.replace("sqlite:///", "")
        d = os.path.dirname(path)
        if d and not os.path.exists(d):
            os.makedirs(d, exist_ok=True)


def _row_to_dict(cursor, row):
    return {description[0]: row[idx] for idx, description in enumerate(cursor.description)}


def migrate_sqlite_to_postgres_if_needed() -> None:
    target_uri = app.config.get("SQLALCHEMY_DATABASE_URI", "")
    if not target_uri.startswith("postgres"):
        return  # Only migrate when target is Postgres

    # If target already has data, skip
    try:
        has_users = db.session.query(User.id).limit(1).first() is not None
        has_letters = db.session.query(Letter.id).limit(1).first() is not None
        if has_users or has_letters:
            print("Postgres already has data; skipping SQLite migration.")
            return
    except Exception as check_e:
        print(f"Could not check existing data, continuing cautiously: {check_e}")

    sqlite_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "instance", "database.db"))
    if not os.path.exists(sqlite_path):
        print("No SQLite database found; skipping migration.")
        return

    print(f"Starting one-time migration from SQLite -> Postgres using {sqlite_path}")
    with closing(sqlite3.connect(sqlite_path)) as conn:
        conn.row_factory = _row_to_dict
        cur = conn.cursor()

        def table_exists(name: str) -> bool:
            cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?", (name,))
            return cur.fetchone() is not None

        def read_all(name: str):
            cur.execute(f"SELECT * FROM {name}")
            return cur.fetchall()

        # Users
        users_table = "user" if table_exists("user") else ("users" if table_exists("users") else None)
        if users_table:
            for r in read_all(users_table):
                try:
                    role_value = r.get("role")
                    role_enum = UserRole(role_value) if role_value else UserRole.USER
                    db.session.add(
                        User(
                            id=r.get("id"),
                            username=r.get("username"),
                            email=r.get("email"),
                            password_hash=r.get("password_hash"),
                            role=role_enum,
                            is_volunteer=bool(r.get("is_volunteer")) if r.get("is_volunteer") is not None else False,
                            is_admin=bool(r.get("is_admin")) if r.get("is_admin") is not None else False,
                            created_at=r.get("created_at"),
                        )
                    )
                except Exception as e:
                    print(f"User row skipped due to error: {e}")

        # Posts
        posts_table = "post" if table_exists("post") else ("posts" if table_exists("posts") else None)
        if posts_table:
            for r in read_all(posts_table):
                try:
                    db.session.add(
                        Post(
                            id=r.get("id"),
                            title=r.get("title"),
                            body=r.get("body"),
                            created_at=r.get("created_at"),
                            author_id=r.get("author_id"),
                        )
                    )
                except Exception as e:
                    print(f"Post row skipped due to error: {e}")

        # Events
        events_table = "event" if table_exists("event") else ("events" if table_exists("events") else None)
        if events_table:
            for r in read_all(events_table):
                try:
                    db.session.add(
                        Event(
                            id=r.get("id"),
                            title=r.get("title"),
                            objective=r.get("objective"),
                            event_date=r.get("event_date"),
                            location=r.get("location"),
                            structure=r.get("structure"),
                            registration_link=r.get("registration_link"),
                        )
                    )
                except Exception as e:
                    print(f"Event row skipped due to error: {e}")

        # Physical mailboxes
        pm_table = (
            "physical_mailbox"
            if table_exists("physical_mailbox")
            else ("physical_mailboxes" if table_exists("physical_mailboxes") else None)
        )
        if pm_table:
            for r in read_all(pm_table):
                try:
                    db.session.add(
                        PhysicalMailbox(
                            id=r.get("id"),
                            name=r.get("name"),
                            address=r.get("address"),
                            city=r.get("city"),
                            province=r.get("province"),
                            postal_code=r.get("postal_code"),
                            description=r.get("description"),
                            operating_hours=r.get("operating_hours"),
                            status=r.get("status"),
                            created_at=r.get("created_at"),
                        )
                    )
                except Exception as e:
                    print(f"PhysicalMailbox row skipped due to error: {e}")

        # Letters
        letters_table = "letter" if table_exists("letter") else ("letters" if table_exists("letters") else None)
        if letters_table:
            for r in read_all(letters_table):
                try:
                    db.session.add(
                        Letter(
                            id=r.get("id"),
                            unique_id=r.get("unique_id"),
                            title=r.get("title"),
                            topic=r.get("topic"),
                            content=r.get("content"),
                            anonymous_email=r.get("anonymous_email"),
                            reply_method=r.get("reply_method"),
                            anon_user_id=r.get("anon_user_id"),
                            has_unread=bool(r.get("has_unread")) if r.get("has_unread") is not None else False,
                            is_flagged=bool(r.get("is_flagged")) if r.get("is_flagged") is not None else False,
                            is_processed=bool(r.get("is_processed")) if r.get("is_processed") is not None else False,
                            created_at=r.get("created_at"),
                            updated_at=r.get("updated_at"),
                            source=r.get("source"),
                            location=r.get("location"),
                            responder_id=r.get("responder_id"),
                        )
                    )
                except Exception as e:
                    print(f"Letter row skipped due to error: {e}")

        # Responses
        responses_table = "response" if table_exists("response") else ("responses" if table_exists("responses") else None)
        if responses_table:
            for r in read_all(responses_table):
                try:
                    db.session.add(
                        Response(
                            id=r.get("id"),
                            content=r.get("content"),
                            created_at=r.get("created_at"),
                            response_type=r.get("response_type"),
                            letter_id=r.get("letter_id"),
                            ai_model=r.get("ai_model"),
                            moderation_score=r.get("moderation_score"),
                        )
                    )
                except Exception as e:
                    print(f"Response row skipped due to error: {e}")

        db.session.commit()

        def bump_sequence(table: str):
            try:
                db.session.execute(
                    text(
                        "SELECT setval(pg_get_serial_sequence(:t, 'id'), COALESCE((SELECT MAX(id) FROM "
                        "'' || :t || ''), 1))"
                    ),
                    {"t": table},
                )
            except Exception:
                try:
                    db.session.execute(
                        text(
                            f"SELECT setval(pg_get_serial_sequence('\"{table}\"','id'), COALESCE((SELECT MAX(id) FROM \"{table}\"), 1))"
                        )
                    )
                except Exception as ee:
                    print(f"Sequence bump failed for {table}: {ee}")

        for tbl in ["user", "post", "event", "physical_mailbox", "letter", "response"]:
            bump_sequence(tbl)

        db.session.commit()
        print("SQLite -> Postgres migration complete.")


def run():
    ensure_sqlite_dirs()
    with app.app_context():
        try:
            from flask_migrate import upgrade

            upgrade()
            print("Applied database migrations (alembic upgrade head).")
        except Exception as e:
            print(f"No migrations or upgrade failed: {e}. Falling back to create_all.")
            db.create_all()
            print("Ensured tables via create_all().")

        try:
            migrate_sqlite_to_postgres_if_needed()
        except Exception as mig_e:
            print(f"Data migration step encountered an error: {mig_e}")


if __name__ == "__main__":
    run()


