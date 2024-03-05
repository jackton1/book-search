package stacks

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsecrassets"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

type BookSearchStackProps struct {
	awscdk.StackProps
}

func NewBookSearchStack(scope constructs.Construct, id string, props *BookSearchStackProps) awscdk.Stack {
	var sprops awscdk.StackProps
	if props != nil {
		sprops = props.StackProps
	}
	stack := awscdk.NewStack(scope, &id, &sprops)

	// Build and push the backend image to ECR
	backendAsset := awsecrassets.NewDockerImageAsset(
		stack,
		jsii.String("BookSearchBackendImageAsset"),
		&awsecrassets.DockerImageAssetProps{
			Directory: jsii.String("../backend"),
		},
	)
	// Build and push the frontend image to ECR
	frontendAsset := awsecrassets.NewDockerImageAsset(
		stack,
		jsii.String("BookSearchFrontendImageAsset"),
		&awsecrassets.DockerImageAssetProps{
			Directory: jsii.String("../frontend"),
		},
	)

	// Output the backend image URI
	awscdk.NewCfnOutput(stack, jsii.String("BackendImageUri"), &awscdk.CfnOutputProps{
		Value: backendAsset.ImageUri(),
	})

	// Output the frontend image URI
	awscdk.NewCfnOutput(stack, jsii.String("FrontendImageUri"), &awscdk.CfnOutputProps{
		Value: frontendAsset.ImageUri(),
	})

	return stack
}
