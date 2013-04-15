#=============================================================================
UUID=netctl@tjaart.tjaart.co.za
FILES=metadata.json *.js
#=============================================================================
default_target: zip
.PHONY: clean dev-zip zip

clean:
	rm -f $(UUID).zip

zip:
	zip -rq $(UUID).zip $(FILES:%=$(UUID)/%)

dev-zip:
	(cd $(UUID); \
	zip -rq ../$(UUID).zip $(FILES))
