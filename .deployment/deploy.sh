#!/usr/bin/env bash
set -euxo pipefail

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

execute-from-www-user() {
  sudo -u ${WWW_USER} $@
}

execute-magento-command() {
  execute-from-www-user /usr/bin/php "${MAGENTO_BASEPATH}/bin/magento" --no-ansi --no-interaction -vvv $@
}

enable-maintenence-mode() {
  log_info "Enabling Magento maintenance mode"
  # File is created as magento maintenance command would fail and wouldn't set the flag
  execute-from-www-user touch "${RELEASES_BASEPATH}/${CURRENT_RELEASE}/var/.maintenance.flag"
}

mount-release-dir() {
  chown -R "${WWW_USER}":"${WWW_GROUP}" "${RELEASES_BASEPATH}/${CURRENT_RELEASE}"
  sudo rm -rf "${MAGENTO_BASEPATH}"
  ln -snf "${RELEASES_BASEPATH}/${CURRENT_RELEASE}" "${MAGENTO_BASEPATH}"
}

clean-old-releases() {
  log_info "Cleaning up old releases"
  find "${RELEASES_BASEPATH}" -maxdepth 1 ! -path "${RELEASES_BASEPATH}" ! -path "${RELEASES_BASEPATH}/${CURRENT_RELEASE}" -type d -exec rm -rf {} +
}

main() {
  log_info "Deployment has been started"

  mount-release-dir

  clean-old-releases

  log_info "Deployment has been finished"
}

#############################################################

time main
