#!/usr/bin/env bash
set -euxo pipefail

#############################################################

# shellcheck disable=SC2154
export PROJECT_BRANCH="${bamboo.planRepository.branchName}"
export BUILD_ID="${bamboo.buildNumber}"
export DEPLOY_ID="${bamboo.deploy.release}"
export ARTIFACT_NAME="/tmp/artifact-${PROJECT_BRANCH}-${BUILD_ID}.tar.gz"
export MAGENTO_ENV="${bamboo.MAGENTO_ENV}"
export BAMBOO_WEBROOT="${bamboo.WEBROOT}"
export BAMBOO_MAGENTO_SETUP_UPGRADE_PARAMS="${bamboo.MAGENTO_SETUP_UPGRADE_PARAMS}"

if [ "${BAMBOO_WEBROOT}" == "beta" ]; then
  export WWW_USER="www-data"
  export WWW_GROUP="sysadmin"
  export MAGENTO_BASEPATH="/var/www/beta_public"
  export RELEASES_BASEPATH="/var/www/beta_public_releases"
  export PERSISTENT_STORAGE_BASEPATH="/var/www/beta_public_persistent"
  export SERVICE_VARNISH="varnish-beta.service"
elif [ "${BAMBOO_WEBROOT}" == "public" ]; then
  export WWW_USER="www-data"
  export WWW_GROUP="share"
  export MAGENTO_BASEPATH="/var/www/public"
  export RELEASES_BASEPATH="/var/www/public_releases"
  export PERSISTENT_STORAGE_BASEPATH="/var/www/public_persistent"
  export SERVICE_VARNISH="varnish-default.service"
else
  log_info "No environment specified!"
  exit 1
fi

export CURRENT_RELEASE="${PROJECT_BRANCH}-${BUILD_ID}-${DEPLOY_ID}"

#############################################################

check_if_artifact_exist() {
  [[ -f "${ARTIFACT_NAME}" ]] && echo "Artifact exist" || exit 1
}

unpack_artifact() {
  sudo mkdir -p "${RELEASES_BASEPATH}/${CURRENT_RELEASE}"
  if [ "${BAMBOO_WEBROOT}" == "production" ]; then
    sudo tar -xf "${ARTIFACT_NAME}" -C "${RELEASES_BASEPATH}/${CURRENT_RELEASE}" --no-same-owner
    sudo chown -R "${WWW_USER}:${WWW_GROUP}" "${RELEASES_BASEPATH}/${CURRENT_RELEASE}"
  else
    sudo tar -xf "${ARTIFACT_NAME}" -C "${RELEASES_BASEPATH}/${CURRENT_RELEASE}"
  fi
}

remove_artifact() {
  sudo rm -rf "${ARTIFACT_NAME}"
}

check_if_deployment_script_exist() {
  [[ -f "${RELEASES_BASEPATH}/${CURRENT_RELEASE}/.deployment/deploy.sh" ]] && echo "Deployment script exist" || exit 1
}

deploy() {
  # shellcheck disable=SC1090
  sudo chmod +x "${RELEASES_BASEPATH}/${CURRENT_RELEASE}/.deployment/deploy.sh"
  sudo -E "${RELEASES_BASEPATH}/${CURRENT_RELEASE}/.deployment/deploy.sh"
}

main() {
  check_if_artifact_exist
  unpack_artifact
  remove_artifact
  check_if_deployment_script_exist
  deploy
}

#############################################################

time main
