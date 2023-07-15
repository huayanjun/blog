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
                    docker.build('blog:latest')       
                }
            }
        }

        stage('Stop and Remove Container') {
            steps {
                script {
                    // Stop and remove the container if it exists
                    sh 'docker rm -f blog || true'
                    
                }
            }
        }

        stage('Run Docker Image') {
            steps {
                script {
                    // Run the Docker image
                    docker.image('blog:latest').run('-p 3000:80 --name=blog')
                    sh 'docker image prune -f'
                }
            }
        }
    }
}
