#!/usr/bin/env bash
set -euxo pipefail

################################################################################

function finish_exit() {
  LAST_EXIT_CODE=$?
  chown -R "${HOST_USER_UID}":"${HOST_USER_GID}" /app || true
  exit ${LAST_EXIT_CODE}
}

function finish_term() {
  echo "RARE EXCEPTION: TERM SIGNAL RECEIVED."
  # The exit code for the last executed command can be zero,
  # but due to TERM signal currently executed command can fail,
  # therefore we should exit with non-zero code and fail build process.

  chown -R "${HOST_USER_UID}":"${HOST_USER_GID}" /app || true
  exit 1
}

trap finish_exit EXIT
trap finish_term TERM

################################################################################

build() {
    npm install
}

################################################################################

build
