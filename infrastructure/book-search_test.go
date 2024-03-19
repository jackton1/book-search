package main

import (
	"testing"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/assertions"
	"github.com/aws/jsii-runtime-go"
	"github.com/jackton1/book-search/infrastructure/cdk/stacks"
)

func TestBookSearchStack(t *testing.T) {
	// GIVEN
	app := awscdk.NewApp(nil)

	// WHEN
	stack := stacks.NewBookSearchAppStack(app, "TestBookSearchAppStack", nil)

	// THEN
	template := assertions.Template_FromStack(stack, nil)

	// Test Log Group creation with correct retention policy
	template.HasResourceProperties(jsii.String("AWS::Logs::LogGroup"), map[string]interface{}{
		"RetentionInDays": assertions.Match(jsii.Number(30)),
	})

	// Test VPC exists
	template.ResourceCountIs(jsii.String("AWS::EC2::VPC"), jsii.Number(1))

	// Test ECS Cluster exists
	template.ResourceCountIs(jsii.String("AWS::ECS::Cluster"), jsii.Number(1))

	// Test ECS Task Role has correct AssumeRolePolicyDocument
	template.HasResourceProperties(jsii.String("AWS::IAM::Role"), map[string]interface{}{
		"AssumeRolePolicyDocument": map[string]interface{}{
			"Statement": []interface{}{
				map[string]interface{}{
					"Action": "sts:AssumeRole",
					"Effect": "Allow",
					"Principal": map[string]interface{}{
						"Service": "ecs-tasks.amazonaws.com",
					},
				},
			},
			"Version": "2012-10-17",
		},
	})
}
