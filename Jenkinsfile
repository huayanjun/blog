pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                Checkout scm
            }
        }
        
        stage('Build with Node.js') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Build Docker image') {
            steps {
                script {
                    def tagName=new date()
                    docker.build('blog:$tagName')       
                }
            }
        }

        stage('Stop and Remove Container') {
            steps {
                script {
                    // Stop and remove the container if it exists
                    sh 'docker stop blog || true'
                    sh 'docker rm blog || true'
                    sh 'docker rmi blog:previous || true'
                }
            }
        }

        stage('Run Docker Image') {
            steps {
                script {
                    // Run the Docker image
                    docker.image('blog:latest').run('-p 3000:80')
                }
            }
        }
    }
}
