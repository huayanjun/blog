import java.text.SimpleDateFormat
import java.util.Date

pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
                    def timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date())
                    docker.build('blog:${timestamp}')       
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
                    docker.image('blog:latest').run('-p 3000:80 --name=blog')
                }
            }
        }
    }
}
