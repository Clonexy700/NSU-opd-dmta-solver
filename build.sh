echo "Building!"

rm build.zip 2> /dev/null
mkdir build

cp index.html build
cp styles/main.css build
cp -r src build

zip -r build.zip build
rm -r build
