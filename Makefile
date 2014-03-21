ANT=CLASSPATH=jar:./tools/ant-flaka-1.02.02.jar ant -f build.ant


default:
	${ANT}
deploy:
	${ANT} deploy
