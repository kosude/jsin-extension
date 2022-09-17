# Get the "version" key from package.json
# This can be used in workflows (for releases), for displaying the version in the dashboard/popup, etc
#
# Script by DarrenN:
# https://gist.github.com/darrenn/8c6a5b969481725a4413
#

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

echo $PACKAGE_VERSION
