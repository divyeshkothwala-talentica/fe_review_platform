output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.frontend_bucket.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.frontend_bucket.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.frontend_distribution.id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.frontend_distribution.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.frontend_distribution.domain_name
}

output "website_url" {
  description = "Website URL"
  value       = "https://${aws_cloudfront_distribution.frontend_distribution.domain_name}"
}

output "github_actions_role_arn" {
  description = "ARN of the GitHub Actions IAM role"
  value       = aws_iam_role.github_actions_role.arn
}

output "backend_api_url" {
  description = "Backend API URL for frontend configuration (direct to EC2)"
  value       = "https://44.194.207.22"
}
