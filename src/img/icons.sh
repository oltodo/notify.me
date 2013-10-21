#!/bin/sh

# (Re)Create the icons destination folder
mkdir icons-dst

# Convert originals to white and 14px icons
find icons-src -name "*.png" -printf "%f\n" | xargs -I {} convert icons-src/{} -quality 100 -resize x14 -negate icons-dst/{}

# Create the sprite
glue-sprite icons-dst . --crop --url="../img/" --less --sprite-namespace="icon.icon" --namespace=""

# Remove the icons destination folder
rm -rf icons-dst

# Change image file name
sed -i 's/icons-dst/icons/' icons-dst.less

mv icons-dst.png icons.png
mv icons-dst.less ../less/icons.less