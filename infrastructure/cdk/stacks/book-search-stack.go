package stacks

import (
	"os"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awscertificatemanager"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsec2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsecrassets"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsecs"
	"github.com/aws/aws-cdk-go/awscdk/v2/awselasticloadbalancingv2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsiam"
	"github.com/aws/aws-cdk-go/awscdk/v2/awslogs"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

type BookSearchAppStackProps struct {
	awscdk.StackProps
}

func NewBookSearchAppStack(scope constructs.Construct, id string, props *BookSearchAppStackProps) awscdk.Stack {
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

	logGroup := awslogs.NewLogGroup(
		stack,
		jsii.String("BookSearchLogGroup"),
		&awslogs.LogGroupProps{
			Retention:     awslogs.RetentionDays_ONE_MONTH,
			RemovalPolicy: awscdk.RemovalPolicy_DESTROY,
		},
	)

	// Create a new ECS cluster
	vpc := awsec2.NewVpc(
		stack,
		jsii.String("BookSearchVpc"),
		&awsec2.VpcProps{
			MaxAzs: jsii.Number(2),
		},
	)

	cluster := awsecs.NewCluster(
		stack,
		jsii.String("BookSearchCluster"),
		&awsecs.ClusterProps{
			Vpc: vpc,
		},
	)

	ecsTaskRole := awsiam.NewRole(
		stack,
		jsii.String("BookSearchECSTaskRole"),
		&awsiam.RoleProps{
			AssumedBy: awsiam.NewServicePrincipal(
				jsii.String("ecs-tasks.amazonaws.com"),
				&awsiam.ServicePrincipalOpts{},
			),
		},
	)

	ecsTaskRole.AddManagedPolicy(
		awsiam.ManagedPolicy_FromAwsManagedPolicyName(
			jsii.String("AmazonEC2ContainerRegistryReadOnly"),
		),
	)

	// Add policy to allow the backend container to write to the log group
	ecsTaskRole.AddToPolicy(
		awsiam.NewPolicyStatement(
			&awsiam.PolicyStatementProps{
				Effect: awsiam.Effect_ALLOW,
				Actions: &[]*string{
					jsii.String("logs:CreateLogStream"),
					jsii.String("logs:PutLogEvents"),
				},
				Resources: &[]*string{
					logGroup.LogGroupArn(),
				},
			},
		),
	)

	// Define task definition for backend application container
	backendTaskDefinition := awsecs.NewFargateTaskDefinition(
		stack,
		jsii.String("BookSearchBackendTaskDefinition"),
		&awsecs.FargateTaskDefinitionProps{
			MemoryLimitMiB: jsii.Number(2048),
			Cpu:            jsii.Number(512),
			RuntimePlatform: &awsecs.RuntimePlatform{
				CpuArchitecture: awsecs.CpuArchitecture_ARM64(),
			},
			TaskRole: ecsTaskRole,
		},
	)

	// Add container to backend task definition
	backendContainer := backendTaskDefinition.AddContainer(
		jsii.String("BookSearchBackendContainer"),
		&awsecs.ContainerDefinitionOptions{
			Image: awsecs.ContainerImage_FromDockerImageAsset(backendAsset),
			Environment: &map[string]*string{
				"GOOGLE_API_KEY": jsii.String(os.Getenv("GOOGLE_API_KEY")),
				"SECRET_KEY":     jsii.String(os.Getenv("SECRET_KEY")),
			},
			PortMappings: &[]*awsecs.PortMapping{
				{
					ContainerPort: jsii.Number(80),
					Protocol:      awsecs.Protocol_TCP,
				},
			},
			Logging: awsecs.LogDriver_AwsLogs(
				&awsecs.AwsLogDriverProps{
					StreamPrefix: jsii.String("BookSearchBackendContainer"),
					LogGroup:     logGroup,
				},
			),
		},
	)

	// Create a new service for the backend application
	backendService := awsecs.NewFargateService(
		stack,
		jsii.String("BookSearchBackendService"),
		&awsecs.FargateServiceProps{
			Cluster:        cluster,
			TaskDefinition: backendTaskDefinition,
			DesiredCount:   jsii.Number(1),
		},
	)

	// Add an application load balancer to the backend service
	backendLoadBalancer := awselasticloadbalancingv2.NewApplicationLoadBalancer(
		stack,
		jsii.String("BookSearchBackendLoadBalancer"),
		&awselasticloadbalancingv2.ApplicationLoadBalancerProps{
			Vpc:                vpc,
			InternetFacing:     jsii.Bool(true),
			Http2Enabled:       jsii.Bool(true),
			DeletionProtection: jsii.Bool(false),
			LoadBalancerName:   jsii.String("BooksBackend"),
		},
	)

	// Create a new acm certificate for the backend load balancer
	backendCertificate := awscertificatemanager.NewCertificate(
		stack,
		jsii.String("BookSearchBackendCertificate"),
		&awscertificatemanager.CertificateProps{
			DomainName: jsii.String("books-backend.tj-actions.online"),
			Validation: awscertificatemanager.CertificateValidation_FromDns(nil),
		},
	)

	// Add a listener to the backend load balancer
	backendHTTPSListener := backendLoadBalancer.AddListener(
		jsii.String("BookSearchBackendHTTPSListener"),
		&awselasticloadbalancingv2.BaseApplicationListenerProps{
			Port:     jsii.Number(443),
			Protocol: awselasticloadbalancingv2.ApplicationProtocol_HTTPS,
			Certificates: &[]awselasticloadbalancingv2.IListenerCertificate{
				awselasticloadbalancingv2.ListenerCertificate_FromCertificateManager(
					backendCertificate,
				),
			},
		},
	)

	// Add a target group to the backend listener
	backendHTTPSListener.AddTargets(
		jsii.String("BookSearchBackendTargetGroup"),
		&awselasticloadbalancingv2.AddApplicationTargetsProps{
			Port: jsii.Number(80),
			Targets: &[]awselasticloadbalancingv2.IApplicationLoadBalancerTarget{
				backendService,
			},
			HealthCheck: &awselasticloadbalancingv2.HealthCheck{
				Path: jsii.String("/health"),
			},
		},
	)

	// Add an HTTP listener with a default action to redirect to HTTPS for the backend load balancer
	backendLoadBalancer.AddListener(
		jsii.String("BookSearchBackendHTTPListener"),
		&awselasticloadbalancingv2.BaseApplicationListenerProps{
			Port:     jsii.Number(80),
			Protocol: awselasticloadbalancingv2.ApplicationProtocol_HTTP,
			DefaultAction: awselasticloadbalancingv2.ListenerAction_Redirect(
				&awselasticloadbalancingv2.RedirectOptions{
					Protocol:  jsii.String("HTTPS"),
					Port:      jsii.String("443"),
					Permanent: jsii.Bool(true),
				},
			),
		},
	)

	// Define task definition for frontend application container
	frontendTaskDefinition := awsecs.NewFargateTaskDefinition(
		stack,
		jsii.String("BookSearchFrontendTaskDefinition"),
		&awsecs.FargateTaskDefinitionProps{
			MemoryLimitMiB: jsii.Number(2048),
			Cpu:            jsii.Number(512),
			RuntimePlatform: &awsecs.RuntimePlatform{
				CpuArchitecture: awsecs.CpuArchitecture_ARM64(),
			},
			TaskRole: ecsTaskRole,
		},
	)

	// Add container to frontend task definition
	frontendContainer := frontendTaskDefinition.AddContainer(
		jsii.String("BookSearchFrontendContainer"),
		&awsecs.ContainerDefinitionOptions{
			Image: awsecs.ContainerImage_FromDockerImageAsset(frontendAsset),
			Environment: &map[string]*string{
				"API_URL":         jsii.String("https://books-backend.tj-actions.online"),
				"NEXTAUTH_URL":    jsii.String("https://books.tj-actions.online/api/auth"),
				"NEXTAUTH_SECRET": jsii.String(os.Getenv("NEXTAUTH_SECRET")),
			},
			PortMappings: &[]*awsecs.PortMapping{
				{
					ContainerPort: jsii.Number(3000),
					Protocol:      awsecs.Protocol_TCP,
				},
			},
			Logging: awsecs.LogDriver_AwsLogs(
				&awsecs.AwsLogDriverProps{
					StreamPrefix: jsii.String("BookSearchFrontendContainer"),
					LogGroup:     logGroup,
				},
			),
		},
	)

	// Create a new service for the frontend application
	frontendService := awsecs.NewFargateService(
		stack,
		jsii.String("BookSearchFrontendService"),
		&awsecs.FargateServiceProps{
			Cluster:        cluster,
			TaskDefinition: frontendTaskDefinition,
			DesiredCount:   jsii.Number(1),
		},
	)

	// Add an application load balancer to the frontend service
	frontendLoadBalancer := awselasticloadbalancingv2.NewApplicationLoadBalancer(
		stack,
		jsii.String("BookSearchFrontendLoadBalancer"),
		&awselasticloadbalancingv2.ApplicationLoadBalancerProps{
			Vpc:                vpc,
			InternetFacing:     jsii.Bool(true),
			Http2Enabled:       jsii.Bool(true),
			DeletionProtection: jsii.Bool(false),
			LoadBalancerName:   jsii.String("BooksFrontend"),
		},
	)

	// Create a new acm certificate for the frontend load balancer
	frontendCertificate := awscertificatemanager.NewCertificate(
		stack,
		jsii.String("BookSearchFrontendCertificate"),
		&awscertificatemanager.CertificateProps{
			DomainName: jsii.String("books.tj-actions.online"),
			Validation: awscertificatemanager.CertificateValidation_FromDns(nil),
		},
	)

	// Add a HTTPS listener to the frontend load balancer
	frontendHTTPSListener := frontendLoadBalancer.AddListener(
		jsii.String("BookSearchFrontendHTTPSListener"),
		&awselasticloadbalancingv2.BaseApplicationListenerProps{
			Port:     jsii.Number(443),
			Protocol: awselasticloadbalancingv2.ApplicationProtocol_HTTPS,
			Certificates: &[]awselasticloadbalancingv2.IListenerCertificate{
				awselasticloadbalancingv2.ListenerCertificate_FromCertificateManager(
					frontendCertificate,
				),
			},
		},
	)

	// Add a target group to the frontend listener
	frontendHTTPSListener.AddTargets(
		jsii.String("BookSearchFrontendTargetGroup"),
		&awselasticloadbalancingv2.AddApplicationTargetsProps{
			Port:     jsii.Number(3000),
			Protocol: awselasticloadbalancingv2.ApplicationProtocol_HTTP,
			Targets: &[]awselasticloadbalancingv2.IApplicationLoadBalancerTarget{
				frontendService,
			},
			HealthCheck: &awselasticloadbalancingv2.HealthCheck{
				Path: jsii.String("/"),
				// This returns a permanent redirect to /books
				HealthyHttpCodes: jsii.String("308"),
			},
		},
	)

	// Add an HTTP listener with a default action to redirect to HTTPS for the frontend load balancer
	frontendLoadBalancer.AddListener(
		jsii.String("BookSearchFrontendHTTPListener"),
		&awselasticloadbalancingv2.BaseApplicationListenerProps{
			Port:     jsii.Number(80),
			Protocol: awselasticloadbalancingv2.ApplicationProtocol_HTTP,
			DefaultAction: awselasticloadbalancingv2.ListenerAction_Redirect(
				&awselasticloadbalancingv2.RedirectOptions{
					Protocol:  jsii.String("HTTPS"),
					Port:      jsii.String("443"),
					Permanent: jsii.Bool(true),
				},
			),
		},
	)

	awscdk.NewCfnOutput(stack, jsii.String("VpcId"), &awscdk.CfnOutputProps{
		Value: vpc.VpcId(),
	})

	awscdk.NewCfnOutput(stack, jsii.String("ClusterName"), &awscdk.CfnOutputProps{
		Value: cluster.ClusterName(),
	})

	awscdk.NewCfnOutput(stack, jsii.String("EcsTaskRoleArn"), &awscdk.CfnOutputProps{
		Value: ecsTaskRole.RoleArn(),
	})

	awscdk.NewCfnOutput(stack, jsii.String("BackendTaskDefinitionArn"), &awscdk.CfnOutputProps{
		Value: backendTaskDefinition.TaskDefinitionArn(),
	})

	awscdk.NewCfnOutput(stack, jsii.String("FrontendTaskDefinitionArn"), &awscdk.CfnOutputProps{
		Value: frontendTaskDefinition.TaskDefinitionArn(),
	})

	awscdk.NewCfnOutput(stack, jsii.String("BackendContainerName"), &awscdk.CfnOutputProps{
		Value: backendContainer.ContainerName(),
	})

	awscdk.NewCfnOutput(stack, jsii.String("FrontendContainerName"), &awscdk.CfnOutputProps{
		Value: frontendContainer.ContainerName(),
	})

	// Output the backend image URI
	awscdk.NewCfnOutput(stack, jsii.String("BackendImageUri"), &awscdk.CfnOutputProps{
		Value: backendAsset.ImageUri(),
	})

	// Output the frontend image URI
	awscdk.NewCfnOutput(stack, jsii.String("FrontendImageUri"), &awscdk.CfnOutputProps{
		Value: frontendAsset.ImageUri(),
	})

	// Output the backend load balancer DNS name
	awscdk.NewCfnOutput(stack, jsii.String("BackendLoadBalancerDnsName"), &awscdk.CfnOutputProps{
		Value: backendLoadBalancer.LoadBalancerDnsName(),
	})

	// Output the frontend load balancer DNS name
	awscdk.NewCfnOutput(stack, jsii.String("FrontendLoadBalancerDnsName"), &awscdk.CfnOutputProps{
		Value: frontendLoadBalancer.LoadBalancerDnsName(),
	})

	return stack
}
