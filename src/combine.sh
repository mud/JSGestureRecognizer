#! /bin/bash

cat ./_header.js > ../dist/gesturerecognizer.js
cat ./_constants.js >> ../dist/gesturerecognizer.js
cat ./_begin.js >> ../dist/gesturerecognizer.js

cat ./JSTouchRecognizer.js >> ../dist/gesturerecognizer.js
cat ./JSGestureRecognizer.js >> ../dist/gesturerecognizer.js
cat ./JSTapGestureRecognizer.js >> ../dist/gesturerecognizer.js
cat ./JSLongPressGestureRecognizer.js >> ../dist/gesturerecognizer.js
cat ./JSPanGestureRecognizer.js >> ../dist/gesturerecognizer.js
cat ./JSPinchGestureRecognizer.js >> ../dist/gesturerecognizer.js
cat ./JSRotationGestureRecognizer.js >> ../dist/gesturerecognizer.js
cat ./JSSwipeGestureRecognizer.js >> ../dist/gesturerecognizer.js
cat ./JSGestureView.js >> ../dist/gesturerecognizer.js

cat ./_end.js >> ../dist/gesturerecognizer.js