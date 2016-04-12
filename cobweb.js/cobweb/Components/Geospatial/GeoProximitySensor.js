
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DFieldDefinition",
	"cobweb/Basic/FieldDefinitionArray",
	"cobweb/Components/EnvironmentalSensor/X3DEnvironmentalSensorNode",
	"cobweb/Components/Geospatial/X3DGeospatialObject",
	"cobweb/Bits/X3DConstants",
],
function ($,
          Fields,
          X3DFieldDefinition,
          FieldDefinitionArray,
          X3DEnvironmentalSensorNode, 
          X3DGeospatialObject, 
          X3DConstants)
{
"use strict";

	function GeoProximitySensor (executionContext)
	{
		X3DEnvironmentalSensorNode .call (this, executionContext);
		X3DGeospatialObject        .call (this, executionContext);

		this .addType (X3DConstants .GeoProximitySensor);
	}

	GeoProximitySensor .prototype = $.extend (Object .create (X3DEnvironmentalSensorNode .prototype),
		X3DGeospatialObject .prototype,
	{
		constructor: GeoProximitySensor,
		fieldDefinitions: new FieldDefinitionArray ([
			new X3DFieldDefinition (X3DConstants .inputOutput,    "metadata",                 new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoOrigin",                new Fields .SFNode ()),
			new X3DFieldDefinition (X3DConstants .initializeOnly, "geoSystem",                new Fields .MFString ("GD", "WE")),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "enabled",                  new Fields .SFBool (true)),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "size",                     new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .inputOutput,    "center",                   new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "isActive",                 new Fields .SFBool ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "enterTime",                new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "exitTime",                 new Fields .SFTime ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "geoCoord_changed",         new Fields .SFVec3d ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "position_changed",         new Fields .SFVec3f ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "orientation_changed",      new Fields .SFRotation ()),
			new X3DFieldDefinition (X3DConstants .outputOnly,     "centerOfRotation_changed", new Fields .SFVec3f ()),
		]),
		getTypeName: function ()
		{
			return "GeoProximitySensor";
		},
		getComponentName: function ()
		{
			return "Geospatial";
		},
		getContainerField: function ()
		{
			return "children";
		},
	});

	return GeoProximitySensor;
});


