pipeline{
    agent any

    environment {
        DOCKER_DEV_NAMESPACE = "4everhosting";
        DOCKER_PROD_NAMESPACE = "4everland";
        DOCKER_IMAGE_NAME = '';
        KUBECTL_URL = '';
    }
    stages{
        stage("operate docker"){
            parallel{
                stage("DEV"){
                    when{
                        environment name:"APPLICATION_ENV",value:"DEV";
                    }
                    stages{
                        stage("build and push docker image"){
                            steps{
                                script{
                                    def customImages = docker.build "${DOCKER_DEV_NAMESPACE}/${MODULE}" , "." ;
                                    echo customImages.id;
                                    docker.withRegistry(env.DOCKER_HUB_DEV_VPC_URL , env.DOCKER_HUB_DEV_CREDENTIAL){
                                        customImages.push(env.GIT_COMMIT.substring(0,6));
                                    }
                                    KUBECTL_URL = env.KUBECTL_DEV_URL
                                    DOCKER_IMAGE_NAME = env.DOCKER_HUB_DEV_VPC_URL.replaceAll("https://","").replaceAll("http://","")+customImages.id+":"+env.GIT_COMMIT.substring(0,6)
                                    sh '''
                                        docker images \n
                                        docker rmi '''+customImages.id+''' \n
                                        docker rmi '''+DOCKER_IMAGE_NAME+''' \n
                                    '''
                                }
                            }
                        }
                    }
                }

                stage("PROD"){
                    when{
                        environment name:"APPLICATION_ENV",value:"PROD";
                    }
                    stages{
                        stage("build and push docker image"){
                            steps{
                                script{
                                    def customImages = docker.build "${DOCKER_PROD_NAMESPACE}/${MODULE}" , "." ;
                                    echo customImages.id;
                                    docker.withRegistry(env.DOCKER_HUB_PROD_URL , env.DOCKER_HUB_PROD_CREDENTIAL){
                                        customImages.push(env.GIT_COMMIT.substring(0,6));
                                    }
                                    KUBECTL_URL = env.KUBECTL_PROD_URL
                                    DOCKER_IMAGE_NAME = env.DOCKER_HUB_PROD_VPC_URL.replaceAll("https://","").replaceAll("http://","")+customImages.id+":"+env.GIT_COMMIT.substring(0,6)
                                    def DOCKER_IMAGE_LOCAL_NAME = env.DOCKER_HUB_PROD_URL.replaceAll("https://","").replaceAll("http://","")+customImages.id+":"+env.GIT_COMMIT.substring(0,6)
                                    sh '''
                                        docker images \n
                                        docker rmi '''+customImages.id+''' \n
                                        docker rmi '''+DOCKER_IMAGE_LOCAL_NAME+''' \n
                                    '''
                                }
                            }
                        }
                    }
                }
            }
        }

        stage("deploy"){
            steps{
                script{
                    def body = '''
                        {
                            "spec": {
                                "template": {
                                    "spec": {
                                        "containers": [
                                            {
                                                "name": "'''+env.KUBECTL_NAME+'''",
                                                "image": "'''+DOCKER_IMAGE_NAME+'''"
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ''';
                    def url = "${KUBECTL_URL}apis/apps/v1/namespaces/default/deployments/${KUBECTL_NAME}";
                    if (env.APPLICATION_ENV == "DEV") {
                        response = httpRequest consoleLogResponseBody: true, contentType: 'NOT_SET',
                                        httpMode: 'PATCH', requestBody: body, url: url, validResponseCodes: '200',
                                        customHeaders: [[name: 'Content-Type', value: "application/strategic-merge-patch+json"]]
                    } else if(env.APPLICATION_ENV == "PROD") {
                        response = httpRequest authentication: env.KUBECTL_PROD_CREDENTIAL,consoleLogResponseBody: true,
                                        contentType: 'NOT_SET',httpMode: 'PATCH',
                                        requestBody: body, url: url, validResponseCodes: '200',
                                        customHeaders: [[name: 'Content-Type', value: "application/strategic-merge-patch+json"]]
                    }else{
                        echo 'Something failed, unknown APPLICATION_ENV: ' + env.APPLICATION_ENV
                    }

                }
            }
        }
    }
}