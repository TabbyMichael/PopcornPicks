# pgmq

Message queue for PostgreSQL.

## Purpose

- Message queues (notifications, emails, recommendations, imports, background jobs)
- Async work distribution
- Reliable message delivery

## Usage

- `pgmq.create(queue_name)` — create a queue
- `pgmq.send(queue_name, message)` — send a message
- `pgmq.read(queue_name, vt, qty)` — read messages
- `pgmq.ack(queue_name, msg_id)` — acknowledge a message
- `pgmq.archive(queue_name, msg_id)` — archive a message
- `pgmq.delete(queue_name, msg_id)` — delete a message

## Configuration

See `configuration.sql`.

## Uninstall

See `uninstall.sql`.