echo "Building!"

rm fss_build.zip 2> /dev/null
mkdir fss_build

cp index.html fss_build
cp main.css fss_build
cp -r src fss_build

zip -r fss_build.zip fss_build
rm -r fss_build

