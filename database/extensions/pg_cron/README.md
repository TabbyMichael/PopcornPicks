# pg_cron

Scheduled job scheduler for PostgreSQL.

## Purpose

- Scheduled jobs (materialized view refresh, cleanup, TMDB sync, analytics refresh)
- Cron-style scheduling
- Background maintenance

## Usage

- `cron.schedule(job_name, schedule, command)`
- `cron.unschedule(job_name)`
- `cron.job` table for job metadata

## Configuration

See `configuration.sql`.

## Uninstall

See `uninstall.sql`.