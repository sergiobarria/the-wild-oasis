# The Wild Oasis Web App

> Full stack web application for a boutique hotel, where users can rent cabins in the woods.

## Table of Contents

## Stack

- **Language**: PHP
- **Framework**: Laravel
- **UI**: Inertia (React) + Blade Templates
- **Styling**: Tailwind CSS + Shadcn
- **Database**: PostgreSQL

## Running Locally

## Commands

### Prune R2 Bucket

```bash
$ aws s3 rm s3://<bucket-name> --endpoint-url https://<cloudflare-id>.r2.cloudflarestorage.com --recursive --dryrun
```

### Seed Countries and Cities data

```bash
$ php artisan db:seed --class=WorldSeeder
```
