
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/Grouping/X3DGroupingNode",
	"cobweb/Components/Core/X3DSensorNode",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DGroupingNode, 
          X3DSensorNode, 
          X3DConstants)
{
	with (Fields)
	{
		function EspduTransform (executionContext)
		{
			X3DGroupingNode .call (this, executionContext .getBrowser (), executionContext);
			X3DSensorNode .call (this, executionContext .getBrowser (), executionContext);

			this .addType (X3DConstants .EspduTransform);
		}

		EspduTransform .prototype = $.extend (Object .create (X3DGroupingNode .prototype),new X3DSensorNode (),
		{
			constructor: EspduTransform,
			fieldDefinitions: new FieldDefinitionArray ([
				new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",                                   new SFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",                                    new SFBool (true)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxSize",                                   new SFVec3f (-1, -1, -1)),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "bboxCenter",                                 new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "addChildren",                                new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "removeChildren",                             new MFNode ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "children",                                   new MFNode ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",                                   new SFBool ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_articulationParameterValue0",            new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_articulationParameterValue1",            new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_articulationParameterValue2",            new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_articulationParameterValue3",            new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_articulationParameterValue4",            new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_articulationParameterValue5",            new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_articulationParameterValue6",            new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOnly,      "set_articulationParameterValue7",            new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "address",                                    new SFString ("localhost")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "applicationID",                              new SFInt32 (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "articulationParameterCount",                 new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "articulationParameterDesignatorArray",       new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "articulationParameterChangeIndicatorArray",  new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "articulationParameterIdPartAttachedToArray", new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "articulationParameterTypeArray",             new MFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "articulationParameterArray",                 new MFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "center",                                     new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "collisionType",                              new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "deadReckoning",                              new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "detonationLocation",                         new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "detonationRelativeLocation",                 new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "detonationResult",                           new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "entityCategory",                             new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "entityCountry",                              new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "entityDomain",                               new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "entityExtra",                                new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "entityID",                                   new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "entityKind",                                 new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "entitySpecific",                             new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "entitySubCategory",                          new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "eventApplicationID",                         new SFInt32 (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "eventEntityID",                              new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "eventNumber",                                new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "eventSiteID",                                new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fired1",                                     new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fired2",                                     new SFBool (false)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fireMissionIndex",                           new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "firingRange",                                new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "firingRate",                                 new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "forceID",                                    new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "fuse",                                       new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "linearVelocity",                             new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "linearAcceleration",                         new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "marking",                                    new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "multicastRelayHost",                         new SFString ("")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "multicastRelayPort",                         new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "munitionApplicationID",                      new SFInt32 (1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "munitionEndPoint",                           new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "munitionEntityID",                           new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "munitionQuantity",                           new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "munitionSiteID",                             new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "munitionStartPoint",                         new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "networkMode",                                new SFString ("standAlone")),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "port",                                       new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "readInterval",                               new SFTime (0.1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "rotation",                                   new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "scale",                                      new SFVec3f (1, 1, 1)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "scaleOrientation",                           new SFRotation (0, 0, 1, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "siteID",                                     new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "translation",                                new SFVec3f (0, 0, 0)),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "warhead",                                    new SFInt32 ()),
				new X3DFieldDefinition (X3DConstants .inputOutput,    "writeInterval",                              new SFTime (1)),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "articulationParameterValue0_changed",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "articulationParameterValue1_changed",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "articulationParameterValue2_changed",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "articulationParameterValue3_changed",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "articulationParameterValue4_changed",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "articulationParameterValue5_changed",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "articulationParameterValue6_changed",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "articulationParameterValue7_changed",        new SFFloat ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "collideTime",                                new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "detonateTime",                               new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "firedTime",                                  new SFTime ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isCollided",                                 new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isDetonated",                                new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isNetworkReader",                            new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isNetworkWriter",                            new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isRtpHeaderHeard",                           new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "isStandAlone",                               new SFBool ()),
				new X3DFieldDefinition (X3DConstants .outputOnly,     "timestamp",                                  new SFTime ()),
				new X3DFieldDefinition (X3DConstants .initializeOnly, "rtpHeaderExpected",                          new SFBool (false)),
			]),
			getTypeName: function ()
			{
				return "EspduTransform";
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

		return EspduTransform;
	}
});

