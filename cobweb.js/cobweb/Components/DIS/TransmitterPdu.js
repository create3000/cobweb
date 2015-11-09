
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Components/Grouping/X3DBoundedObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DSensorNode, 
          X3DBoundedObject, 
          X3DConstants)
{
"use strict";

	function TransmitterPdu (executionContext)
	{
		X3DSensorNode .call (this, executionContext .getBrowser (), executionContext);
		X3DBoundedObject .call (this, executionContext .getBrowser (), executionContext);

		this .addType (X3DConstants .TransmitterPdu);
	}

	TransmitterPdu .prototype = $.extend (Object .create (X3DSensorNode .prototype),new X3DBoundedObject (),
	{
		constructor: TransmitterPdu,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",                           new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",                           new Fields .SFVec3f (-1, -1, -1)),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",                         new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",                            new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",                           new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "address",                            new Fields .SFString ("localhost")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "antennaLocation",                    new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "antennaPatternLength",               new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "antennaPatternType",                 new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "applicationID",                      new Fields .SFInt32 (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "cryptoKeyID",                        new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "cryptoSystem",                       new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "entityID",                           new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "frequency",                          new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "inputSource",                        new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "lengthOfModulationParameters",       new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "modulationTypeDetail",               new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "modulationTypeMajor",                new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "modulationTypeSpreadSpectrum",       new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "modulationTypeSystem",               new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "multicastRelayHost",                 new Fields .SFString ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "multicastRelayPort",                 new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "networkMode",                        new Fields .SFString ("standAlone")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "port",                               new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "power",                              new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "radioEntityTypeCategory",            new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "radioEntityTypeCountry",             new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "radioEntityTypeDomain",              new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "radioEntityTypeKind",                new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "radioEntityTypeNomenclature",        new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "radioEntityTypeNomenclatureVersion", new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "radioID",                            new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "readInterval",                       new Fields .SFFloat (0.1)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "relativeAntennaLocation",            new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "rtpHeaderExpected",                  new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "siteID",                             new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "transmitFrequencyBandwidth",         new Fields .SFFloat ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "transmitState",                      new Fields .SFInt32 ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "whichGeometry",                      new Fields .SFInt32 (1)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "writeInterval",                      new Fields .SFFloat (1)),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isNetworkReader",                    new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isNetworkWriter",                    new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isRtpHeaderHeard",                   new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isStandAlone",                       new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "timestamp",                          new Fields .SFTime ()),
		]),
		getTypeName: function ()
		{
			return "TransmitterPdu";
		},
		getComponentName: function ()
		{
			return "DIS";
		},
		getContainerField: function ()
		{
			return "children";
		},
	});

	return TransmitterPdu;
});


