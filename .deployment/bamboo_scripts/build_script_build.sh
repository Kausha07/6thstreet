#!/usr/bin/env bash
set -euxo pipefail

export BAMBOO_BRANCH="${bamboo.planRepository.branchName}"
export BAMBOO_BUILD_ID="${bamboo.buildNumber}"

cd .deployment/

./build.sh
