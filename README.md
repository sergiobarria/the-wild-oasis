<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://sbdevelops.work/the-wild-oasis-assets/logo.png" width="300" alt="The Wild Oasis Logo"></a></p>

## Table of Contents

## Stack

## Commands

### Prune Bucket

For this command to work, the AWS CLI should already be authenticated with R2.

```bash
$ aws s3 rm s3://<bucket-name> --endpoint-url https://<cloudflare-id>.r2.cloudflarestorage.com --recursive --dryrun --profile r2
```
