#!/usr/bin/env groovy

@Library('pec-jenkins@master') _

properties([
  parameters([
        string(name: 'targets', defaultValue: 'default', description: 'Comma separated list of app names to build. "all" can be specified to build everything')
   ])
])

def pathsChangedSinceLastSuccess(build) {
    def paths = [];

    build.changeSets.each { changeSet ->
        changeSet.each { change ->
            paths.addAll(change.getAffectedPaths())
        }
    }

    def previousBuild = build.getPreviousBuild()

    if ((previousBuild != null) && (previousBuild.result != 'SUCCESS')) {
        paths.addAll(pathsChangedSinceLastSuccess(previousBuild))
    }

    return paths;
}

def pathsChangedForPullRequest() {
    git branch: CHANGE_TARGET, credentialsId: '2cee36d1-e910-4a13-b857-ff6c7ccd951a', url: 'git@bitbucket.org:pecteam/aion-ui-mono.git'
    def paths = sh(returnStdout: true, script: "git diff --name-only origin/${CHANGE_TARGET} origin/${CHANGE_BRANCH}").split()
    git branch: CHANGE_BRANCH, credentialsId: '2cee36d1-e910-4a13-b857-ff6c7ccd951a', url: 'git@bitbucket.org:pecteam/aion-ui-mono.git'
    return paths;
}

def changedApplications(String customTargets) {
    def apps = [];
    def applicationNames = sh(returnStdout: true, script: 'ls -1 applications/ | grep aion').split()

    if (customTargets != 'default') {
      apps = (customTargets == 'all') ? applicationNames : customTargets.split(',');
    } else {
        def changedPaths = GIT_BRANCH.startsWith('PR-') ? pathsChangedForPullRequest() : pathsChangedSinceLastSuccess(currentBuild);

        apps = applicationNames.findAll { applicationName ->
            changedPaths.any { path ->
                path.contains(applicationName)
            }
        }
    }

    return apps;
}

def hasApplicationChanges(String customTargets) {
    if (customTargets != 'default') {
        return true;
    }

    return changedApplications(customTargets) ? true : false;
}

def generateStage(applicationName) {
    return {
        stage("stage: ${applicationName}") {
            dir("./applications/${applicationName}") {
                publishToCdn()
                publishToEcr()
            }

            deployToRancher "aion/${applicationName}"
        }
    }
}

pipeline {
    agent {
        label 'master'
    }
    environment {
        CI = true
    }
    stages {
        stage('publish packages') {
            agent {
                docker {
                    image 'node:erbium'
                    args '-u root'
                    reuseNode true
                }
            }
            when {
                allOf {
                    branch 'development'
                    changelog '^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\\([a-z ]+\\))?: .+$'
                }
            }
            steps {
                sh "rm -rf .git"

                checkout([
                  $class: 'GitSCM',
                  branches: [[name: 'origin/development']],
                  extensions: [[$class: 'LocalBranch', localBranch: '**']],
                  userRemoteConfigs: [[credentialsId: '2cee36d1-e910-4a13-b857-ff6c7ccd951a', url: 'git@bitbucket.org:pecteam/aion-ui-mono.git']]
                ])

                sshagent(credentials: ['2cee36d1-e910-4a13-b857-ff6c7ccd951a']) {
                    sh '''
                        git config core.sshCommand "ssh -o StrictHostKeyChecking=no"
                        npm config set unsafe-perm true
                        yarn install
                        node_modules/.bin/lerna publish --yes
                    '''
                }
            }
        }
        stage('runs all tests and builds apps') {
            agent {
                docker {
                    image 'node:erbium'
                    args '-u root'
                    reuseNode true
                }
            }
            when {
                not {
                    allOf {
                        branch 'development'
                        changelog '^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\\([a-z ]+\\))?: .+$'
                    }
                }
                expression { return hasApplicationChanges(params.targets) }
            }
            steps {
                sh '''
                    yarn install
                    yarn test
                    yarn build:packages
                '''

                script {
                    def applicationNames = changedApplications(params.targets).join(",")
                    sh "yarn build:ci --apps=${applicationNames}"
                }
            }
        }
        stage('publish to aws') {
            when {
                not {
                    allOf {
                        branch 'development'
                        changelog '^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\\([a-z ]+\\))?: .+$'
                    }
                }
                expression { return hasApplicationChanges(params.targets) }
            }
            steps {
                script {
                    parallel changedApplications(params.targets).collectEntries {
                        ["${it}": generateStage(it)]
                    }
                }
            }
        }
    }
    post {
        unstable {
            sendNotifications 'UNSTABLE'
        }
        failure {
            sendNotifications 'FAILED'
        }
    }
}
