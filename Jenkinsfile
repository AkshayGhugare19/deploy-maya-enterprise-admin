pipeline {
    agent any
    options {
        skipStagesAfterUnstable()
        disableRestartFromStage()
    }
    tools {
        nodejs "nodejs"
    }
    stages {
        stage('install') {
            when {
                anyOf{
                    expression{env.BRANCH_NAME == 'deploy-qa'}
                    expression{env.BRANCH_NAME == 'deploy-prod'}
                }
            }
            steps {
                sh 'npm install --force'
            }
        }

        stage('create-env-dev') {
            when {
                branch 'deploy-qa'
            }
            environment {
                VITE_API_URL = credentials("TSL_ADMIN_QA_VITE_API_URL")
                BRANCH_NAME = '${env.BRANCH_NAME}'
            }
            steps {
                echo 'Creating Enviorment varibles : '+env.BRANCH_NAME
                sh '''#!/bin/bash
                touch .env
                echo VITE_API_URL=$VITE_API_URL >> .env
                '''
            }
        }

        stage('deploy-dev') {
            when {
                branch 'deploy-qa'
            }
            environment {
                TSL_ADMIN_QA_IP = credentials("TSL_ADMIN_QA_IP")
            }
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: "jenkins-ssl", keyFileVariable: 'sshkey')
                ]) {
                    echo 'deploying the software'
                    sh '''#!/bin/bash
                    echo "Creating .ssh"
                    mkdir -p /var/lib/jenkins/.ssh
                    echo "Starting Build"
                    npm run build
                    echo "Build Completed"
                    ssh-keyscan ${TSL_ADMIN_QA_IP} >> /var/lib/jenkins/.ssh/known_hosts
                    echo "ssh-keyscan done"
                    ssh -i $sshkey deployer@${TSL_ADMIN_QA_IP} "mkdir -p /var/repo/snuslife-admin/$BRANCH_NAME"
                    echo "directiry created"
                    rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./dist deployer@${TSL_ADMIN_QA_IP}:/var/repo/snuslife-admin/$BRANCH_NAME
                    echo "data moved"

                    '''
                }
            }
        }

        stage('create-env-prod') {
            when {
                branch 'deploy-prod'
            }
            environment {
                VITE_API_URL = credentials("TSL_ADMIN_PROD_VITE_API_URL")
                BRANCH_NAME = '${env.BRANCH_NAME}'
            }
            steps {
                echo 'Creating Enviorment varibles : '+env.BRANCH_NAME
                sh '''#!/bin/bash
                touch .env
                echo VITE_API_URL=$VITE_API_URL >> .env
                '''
            }
        }

        stage('deploy-prod') {
            when {
                branch 'deploy-prod'
            }
            environment {
                TSL_ADMIN_PROD_IP = credentials("TSL_ADMIN_PROD_IP")
            }
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: "jenkins-ssl", keyFileVariable: 'sshkey')
                ]) {
                    echo 'deploying the software'
                    sh '''#!/bin/bash
                    echo "Creating .ssh"
                    mkdir -p /var/lib/jenkins/.ssh
                    echo "Starting Build"
                    npm run build
                    echo "Build Completed"
                    ssh-keyscan ${TSL_ADMIN_PROD_IP} >> /var/lib/jenkins/.ssh/known_hosts
                    echo "ssh-keyscan done"
                    ssh -i $sshkey deployer@${TSL_ADMIN_PROD_IP} "mkdir -p /var/repo/snuslife-admin/$BRANCH_NAME"
                    echo "directiry created"
                    rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./dist deployer@${TSL_ADMIN_PROD_IP}:/var/repo/snuslife-admin/$BRANCH_NAME
                    echo "data moved"

                    '''
                }
            }
        }
    }
}