## PostgreSQL backups

This folder is mounted into the `postgres` container at `/backups`.

Example manual backup from host:

```bash
docker exec shift-db pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -f "/backups/backup_$(date +%Y%m%d_%H%M%S).dump"
```

Example restore:

```bash
docker exec -i shift-db pg_restore -U "$DB_USER" -d "$DB_NAME" --clean < backup_YYYYMMDD_HHMMSS.dump
```

In production, schedule this command with cron or your orchestration platform.

