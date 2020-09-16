#!/usr/bin/env bash
set -euxo pipefail

#############################################################

PROJECT_BRANCH="${BAMBOO_BRANCH:-undefined}"
BUILD_ID="${BAMBOO_BUILD_ID:-undefined}"
COMPOSER_AUTH="${BAMBOO_COMPOSER_AUTH}"
MAGENTO_MODE="${BAMBOO_MAGENTO_MODE}"
ARTIFACT_NAME="artifact-${PROJECT_BRANCH}-${BUILD_ID}.tar.gz"

#############################################################

log_error() {
  log "ERROR" "$*"
  exit 1
}

log_info() {
  log "INFO" "$*"
}

log() {
  local severity="${1}"
  shift

  echo "${severity}: $(date +"%Y.%m.%d %H:%M:%S"): $*"
}

#############################################################

create_tmp_directory() {
  mkdir -p "$(pwd)/../.tmp"
}

build() {
  local DOCKER_NAME
  local DOCKER_IMAGE

  command -v docker >/dev/null || log_error "Docker is not installed. Aborting."

  # Name docker container with unique name to avoid conflicts during concurrent builds
  DOCKER_NAME="asset-builder-${RANDOM}${RANDOM}"
  DOCKER_IMAGE="scandiweb/${DOCKER_NAME}"

  log_info "Building docker container..."
  docker build -t "${DOCKER_IMAGE}" .

  log_info "Executing 'entrypoint.sh' inside docker container..."
  docker run --rm \
    -v "$(pwd)/../:/app" \
    --name "${DOCKER_NAME}" \
    -e HOST_USER_UID="$(id -u)" \
    -e HOST_USER_GID="$(id -g)" \
    -e COMPOSER_AUTH="${COMPOSER_AUTH}" \
    -e MAGENTO_MODE="${MAGENTO_MODE}" \
    "${DOCKER_IMAGE}"

  log_info "Finished execution of 'entrypoint.sh'."

  log_info "Stopping container and removing container and image."
  docker stop "${DOCKER_NAME}" >/dev/null 2>&1 || :
  docker rm "${DOCKER_NAME}" >/dev/null 2>&1 || :

  # Yes, next time it will take longer to build a container (2 minutes), but we are cleaning all images nightly anyway.
  docker rmi "${DOCKER_IMAGE}" >/dev/null 2>&1 || :
}

archive() {
  log_info "Archiving deployment and application source code"

  # For macOS - environment variable COPYFILE_DISABLE is used
  # https://stackoverflow.com/questions/27491606/how-to-create-a-linux-compatible-zip-archive-of-a-directory-on-a-mac
  COPYFILE_DISABLE=1 tar -C "$(pwd)/../" --exclude ".tmp" --exclude ".git" -czf "$(pwd)/../.tmp/${ARTIFACT_NAME}" .
}

main() {
  create_tmp_directory
  build
  archive
}

#############################################################

time main
