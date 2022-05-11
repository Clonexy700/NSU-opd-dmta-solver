echo "Building!"

rm dmta_mlita_project_version_2.zip 2> /dev/null
mkdir dmta_mlita_project_version_2

cp index.html dmta_mlita_project_version_2
cp main.css dmta_mlita_project_version_2
cp -r src dmta_mlita_project_version_2

zip -r dmta_mlita_project_version_2.zip dmta_mlita_project_version_2
rm -r dmta_mlita_project_version_2

