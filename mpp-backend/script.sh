pytest --ignore=./dev --ignore=./proc --ignore=./usr --ignore=./sys --html=pytest_report.html --junitxml=pytest_junit.xml
cp pytest_report.xml ../
cp pytest_report.xml ~/
