# Yandex Cloud Lead Ingest

Production contract:

1. Validate request.
2. Reject honeypot spam without storing PII.
3. Insert lead into YDB `leads`.
4. Send MAX notification.
5. Send email notification, or record the configured external email channel.
6. Update delivery statuses in YDB.
7. Return `saved=true` if YDB saved the lead, even when notifications fail.

Required function runtime:

- Node.js 22
- entrypoint: `index.handler`
- service account with access to the YDB database

Required environment variables:

```text
YDB_CONNECTION_STRING=grpcs://ydb.serverless.yandexcloud.net:2135/ru-central1/.../...
YDB_TABLE_NAME=leads
MAX_USER_ID=...
MAX_BOT_TOKEN=... # supplied from Yandex Lockbox, never a plain environment value
EMAIL_DELIVERY_MODE=google-client # keep while Google Apps Script remains the email sender
MAIL_TO=Olegt68@mail.ru # required only for SMTP mode
SMTP_HOST=smtp.mail.ru
SMTP_PORT=465
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM=...
MAX_NOTIFICATION_ATTEMPTS=10
MAIL_NOTIFICATION_ATTEMPTS=10
```

Optional test-only failure simulation:

```text
TEST_FAILURE_SECRET=...
```

When set, a direct POST with header `X-Test-Failure-Secret` and body field
`_simulate.max_failure` or `_simulate.mail_failure` can safely force channel
failure while keeping YDB persistence active. Do not send these fields from the
frontend.

MAX recipient discovery:

1. Oleg opens `https://max.ru/id890500046570_2_bot`.
2. Oleg sends `Тест` to the bot.
3. Call `GET https://platform-api2.max.ru/updates` with `Authorization:
   <MAX_BOT_TOKEN>` from a secure server-side environment.
4. Save the resulting user or chat id as `MAX_USER_ID` or `MAX_CHAT_ID`.

Timer retry:

Create one Yandex Cloud Timer Trigger that invokes this same function every
five minutes. Non-HTTP invocations run `retryFailedNotifications()` and only
retry notification states `pending`, `failed`, or `skipped`. The external
Google email state is `external` and is not retried by the function.
