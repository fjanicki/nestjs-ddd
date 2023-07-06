#!/bin/bash

echo "-------------------------------------Script-01"

echo "##### Creating Profile #####"

aws configure set aws_access_key_id default_access_key --profile=localstack
aws configure set aws_secret_access_key default_secret_key --profile=localstack
aws configure set region us-east-1 --profile=localstack

echo "########### Listing profile ###########"
aws configure list --profile=localstack

echo "-------------------------------------Script-03"

echo "########### Creating SQS Queues ###########"
aws sqs create-queue \
  --profile localstack \
  --endpoint-url http://localhost:4566 \
  --queue-name consumer

aws sqs create-queue \
  --profile localstack \
  --endpoint-url http://localhost:4566 \
  --queue-name producer
